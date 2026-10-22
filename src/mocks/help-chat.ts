// In-memory help chat for NEXT_PUBLIC_USE_MOCKS=true (MSW can't fake Firestore). Same script as
// ladder-backend without Groq: preset message, language question, then a fixed explanation.
import { PARTNER } from '@/config/partner';
import type {
  HelpChatConnection,
  HelpChatMessage,
  HelpChatSnapshot,
} from '@/features/help-chat/types/help-chat.types';

const REPLY_DELAY_MS = 1500;

export async function openHelpChat(reference: string | null): Promise<HelpChatConnection> {
  let nextId = 1;
  const message = (sender: HelpChatMessage['sender'], text: string): HelpChatMessage => ({
    id: `mock-${nextId++}`,
    sender,
    text,
  });

  const state: HelpChatSnapshot = {
    messages: [
      message(
        'customer',
        reference
          ? `Hi Ladder, I need help with my account opening. Ref: ${reference}`
          : 'Hi Ladder, I need help. My details are not loading on the account opening screen.',
      ),
      message(
        'ladder',
        `Hello! I’m Ladder, here to help you with your recent ${PARTNER.name} Bank account application. Which language would you like us to use? English, Nigerian Pidgin, Yoruba, Hausa, Igbo, or another?`,
      ),
    ],
    isTyping: false,
  };
  const listeners = new Set<(snapshot: HelpChatSnapshot) => void>();
  const emit = () => listeners.forEach((listener) => listener({ ...state }));

  return {
    chatId: reference ?? 'web-mock',

    watch(onChange) {
      listeners.add(onChange);
      onChange({ ...state });
      return () => listeners.delete(onChange);
    },

    async send(text) {
      state.messages = [...state.messages, message('customer', text)];
      state.isTyping = true;
      emit();
      setTimeout(() => {
        state.messages = [
          ...state.messages,
          message(
            'ladder',
            reference
              ? `(Mock reply) *What went wrong:* The details entered don’t match the record for ${reference}.\n\n*How to fix it:*\n1. Check the number and your date of birth.\n2. Go back to the account opening screen and try again.`
              : '(Mock reply) Your check passed, but we couldn’t load your details. Tap *Try again*, or start again in a few minutes.',
          ),
        ];
        state.isTyping = false;
        emit();
      }, REPLY_DELAY_MS);
    },

    close: async () => listeners.clear(),
  };
}
