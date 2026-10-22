// The help chat. Opens only from a Get Help button (store/help-chat.store), as a card in the
// bottom-right corner on larger screens and full screen on phones. Mounted once in Providers.
'use client';

import { useEffect, useRef } from 'react';
import { LadderMark } from '@/components/layout/LadderMark';
import { Button, Spinner } from '@/components/ui';
import { useHelpChatStore } from '@/store/help-chat.store';
import { useHelpChat } from '../hooks/useHelpChat';
import { ChatBubble } from './ChatBubble';
import { ChatComposer } from './ChatComposer';
import { TypingIndicator } from './TypingIndicator';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HelpChatWidget() {
  const isOpen = useHelpChatStore((state) => state.isOpen);
  const reference = useHelpChatStore((state) => state.reference);
  if (!isOpen) return null;
  // Keyed so a new help reference starts from a clean chat view.
  return <HelpChatPanel key={reference ?? 'no-reference'} reference={reference} />;
}

function HelpChatPanel({ reference }: { reference: string | null }) {
  const close = useHelpChatStore((state) => state.close);
  const { status, error, messages, pending, isTyping, send, resend, retry } =
    useHelpChat(reference);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Give focus back to the Get Help button (or whatever opened the chat) when it closes.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => opener?.focus();
  }, []);

  useEffect(() => {
    if (status === 'ready') inputRef.current?.focus();
  }, [status]);

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, pending, isTyping]);

  return (
    <section
      role="dialog"
      aria-labelledby="help-chat-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-surface-muted transition duration-200 ease-out starting:translate-y-4 starting:opacity-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(600px,calc(100dvh-3rem))] sm:w-[380px] sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl motion-reduce:transition-none"
    >
      <header className="flex items-center gap-3 bg-ladder-900 px-4 py-3.5 text-white">
        <span className="flex size-10 items-center justify-center rounded-full bg-white">
          <LadderMark />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="help-chat-title" className="text-base font-semibold">
            Ladder Support
          </h2>
          <p className="text-sm text-ladder-100">We reply in seconds</p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close chat"
          className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <CloseIcon />
        </button>
      </header>

      {status === 'connecting' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-text-muted">
          <Spinner className="text-primary-600" />
          <p className="text-sm">Connecting you to Ladder…</p>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center"
        >
          <p className="text-[15px] text-text-body">{error}</p>
          <Button variant="secondary" onClick={retry} className="h-12 w-auto text-base">
            Try again
          </Button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Messages"
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
          >
            {messages.map((message) => (
              <ChatBubble key={message.id} sender={message.sender} text={message.text} />
            ))}
            {pending.map((message) => (
              <ChatBubble
                key={message.id}
                sender="customer"
                text={message.text}
                isPending
                onRetry={message.failed ? () => void resend(message) : undefined}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
          <p className="bg-surface px-4 pt-2 text-xs text-text-muted">
            Never share your BVN, NIN, PIN or OTP in this chat.
          </p>
          <ChatComposer ref={inputRef} onSend={(text) => void send(text)} />
        </>
      )}
    </section>
  );
}
