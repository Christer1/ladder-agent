// Zustand store for the help chat widget: whether it is open and which help reference it is about.
// Messages live in Firestore (features/help-chat), never here.
import { create } from 'zustand';

type HelpChatState = {
  isOpen: boolean;
  /** LDR-XXXXXX from a failed identify; null for the "couldn't load your details" chat. */
  reference: string | null;
};

type HelpChatActions = {
  open: (reference: string | null) => void;
  close: () => void;
};

export const useHelpChatStore = create<HelpChatState & HelpChatActions>()((set) => ({
  isOpen: false,
  reference: null,
  open: (reference) => set({ isOpen: true, reference }),
  close: () => set({ isOpen: false }),
}));
