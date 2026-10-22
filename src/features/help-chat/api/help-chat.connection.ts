// Opens a help chat: the backend creates it, the browser signs in to Firebase with the token it
// returns and reads helpChats/{chatId} live. Loaded with import() (it pulls in the Firebase SDK).
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase/client';
import type {
  HelpChatConnection,
  HelpChatMessage,
  HelpChatSender,
  HelpChatSnapshot,
} from '../types/help-chat.types';
import { sendHelpChatMessage, startHelpChat } from './help-chat.api';

const COLLECTION = 'helpChats';

export async function openHelpChat(reference: string | null): Promise<HelpChatConnection> {
  const { chatId, firebaseToken } = await startHelpChat(reference ? { reference } : {});
  const { auth, db } = getFirebase();
  await signInWithCustomToken(auth, firebaseToken);
  const chatRef = doc(db, COLLECTION, chatId);

  return {
    chatId,

    watch(onChange, onError) {
      const snapshot: HelpChatSnapshot = { messages: [], isTyping: false };
      const stopChat = onSnapshot(
        chatRef,
        (chat) => {
          snapshot.isTyping = chat.get('aiTyping') === true;
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
