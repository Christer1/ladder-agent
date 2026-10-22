// Connects the open widget to its chat: opens it on the backend, then follows its messages live.
// The connection outlives the widget closing, so Get Help reopens the same chat instantly.
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMockingEnabled } from '@/mocks/start';
import { normalizeError } from '@/lib/api/errors';
import type { HelpChatConnection, HelpChatMessage } from '../types/help-chat.types';

export type HelpChatStatus = 'connecting' | 'ready' | 'error';

/** A message the customer sent that isn't in the chat yet (or failed to send). */
export type PendingMessage = {
  id: string;
  text: string;
  failed: boolean;
  /** How many customer messages had this text when it was sent: one more means it arrived. */
  copiesBefore: number;
};

const copiesOf = (messages: HelpChatMessage[], text: string) =>
  messages.filter((m) => m.sender === 'customer' && m.text === text).length;

const CONNECT_ERROR = 'We couldn’t open the chat. Check your connection and try again.';

// One chat per page: a newer help reference replaces it.
let current: { reference: string | null; connection: Promise<HelpChatConnection> } | null = null;

function connect(reference: string | null): Promise<HelpChatConnection> {
  if (current?.reference === reference) return current.connection;
  void current?.connection.then((old) => old.close()).catch(() => undefined);

  const load = isMockingEnabled
    ? import('@/mocks/help-chat')
    : import('../api/help-chat.connection');
  const connection = load.then(({ openHelpChat }) => openHelpChat(reference));
  current = { reference, connection };
  // A failed open is retried from scratch next time.
  connection.catch(() => {
    if (current?.connection === connection) current = null;
  });
  return connection;
}

export function useHelpChat(reference: string | null) {
  const [status, setStatus] = useState<HelpChatStatus>('connecting');
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<HelpChatConnection | null>(null);
  const [messages, setMessages] = useState<HelpChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [attempt, setAttempt] = useState(0);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    let isActive = true;
    let stopWatching: (() => void) | undefined;

    connect(reference)
      .then((opened) => {
        if (!isActive) return;
        setConnection(opened);
        stopWatching = opened.watch(
          (snapshot) => {
            setMessages(snapshot.messages);
            setIsTyping(snapshot.isTyping);
            setAgentName(snapshot.agentName);
            setStatus('ready');
          },
          () => {
            setError(CONNECT_ERROR);
            setStatus('error');
          },
        );
      })
      .catch((cause: unknown) => {
        if (!isActive) return;
        const apiError = normalizeError(cause);
        setError(apiError.code === 'UNKNOWN' ? CONNECT_ERROR : apiError.message);
        setStatus('error');
      });

    return () => {
      isActive = false;
      stopWatching?.();
    };
  }, [reference, attempt]);

  // The widget remounts per reference, so only a retry needs to reset the state.
  const retry = useCallback(() => {
    if (current?.reference === reference) current = null;
    setStatus('connecting');
    setError(null);
    setAttempt((n) => n + 1);
  }, [reference]);

  const sendText = useCallback(
    async (id: string, text: string) => {
      if (!connection) return;
      const copiesBefore = copiesOf(messagesRef.current, text);
      setPending((list) => [
        ...list.filter((p) => p.id !== id),
        { id, text, failed: false, copiesBefore },
      ]);
      try {
        await connection.send(text);
        // The backend stores the message before answering, so it's already in the chat.
        setPending((list) => list.filter((p) => p.id !== id));
      } catch (cause) {
        const apiError = normalizeError(cause);
        if (apiError.code === 'HELP_CHAT_SESSION_INVALID') {
          setPending((list) => list.filter((p) => p.id !== id));
          setError(apiError.message);
          setStatus('error');
          return;
        }
        setPending((list) => list.map((p) => (p.id === id ? { ...p, failed: true } : p)));
      }
    },
    [connection],
  );

  const send = useCallback((text: string) => sendText(crypto.randomUUID(), text), [sendText]);
  const resend = useCallback(
    (message: PendingMessage) => sendText(message.id, message.text),
    [sendText],
  );

  // Hidden once Firestore shows the message, even if the send request hasn't returned yet.
  const unsent = pending.filter((p) => copiesOf(messages, p.text) <= p.copiesBefore);

  return {
    status,
    error,
    messages,
    pending: unsent,
    agentName,
    // Show "typing" from the moment a message is sent, before the backend flags it. An agent
    // answers in their own time, so there is no typing indicator while one has the chat.
    isTyping: !agentName && (isTyping || unsent.some((p) => !p.failed)),
    send,
    resend,
    retry,
  };
}
