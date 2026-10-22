// Opens a help chat: the backend creates it, the browser signs in to Firebase with the token it
// returns and reads helpChats/{chatId} live. Loaded with import() (it pulls in the Firebase SDK).
// The caller starts the backend request so it runs while this module downloads.
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase/client';
import type {
  HelpChatConnection,
  HelpChatMessage,
  HelpChatSender,
  HelpChatSnapshot,
  StartHelpChatResponse,
} from '../types/help-chat.types';
import { sendHelpChatMessage } from './help-chat.api';

const COLLECTION = 'helpChats';

/** Sets Firebase up ahead of time, so opening the chat only waits on the network. */
export function prepareHelpChat(): void {
  getFirebase();
}

export async function openHelpChat(
  started: Promise<StartHelpChatResponse>,
): Promise<HelpChatConnection> {
  const { auth, db } = getFirebase();
  const { chatId, firebaseToken } = await started;
  await signInWithCustomToken(auth, firebaseToken);
  const chatRef = doc(db, COLLECTION, chatId);

  return {
    chatId,

    watch(onChange, onError) {
      const snapshot: HelpChatSnapshot = { messages: [], isTyping: false, agentName: null };
      const stopChat = onSnapshot(
        chatRef,
        (chat) => {
          snapshot.isTyping = chat.get('aiTyping') === true;
          snapshot.agentName =
            chat.get('mode') === 'agent' ? String(chat.get('agentName') ?? 'Ladder Support') : null;
          onChange({ ...snapshot });
        },
        onError,
      );
      const stopMessages = onSnapshot(
        query(collection(chatRef, 'messages'), orderBy('createdAt', 'asc')),
        (result) => {
          snapshot.messages = result.docs.map((message): HelpChatMessage => ({
            id: message.id,
            sender: message.get('sender') as HelpChatSender,
            text: String(message.get('text') ?? ''),
            agentName: (message.get('agentName') as string | undefined) ?? null,
          }));
          onChange({ ...snapshot });
        },
        onError,
      );
      return () => {
        stopChat();
        stopMessages();
      };
    },

    async send(text) {
      const idToken = await auth.currentUser?.getIdToken();
      await sendHelpChatMessage(chatId, text, idToken ?? '');
    },

    close: () => signOut(auth),
  };
}
