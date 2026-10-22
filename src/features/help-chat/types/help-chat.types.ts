// Help chat shapes: the backend's start response and the messages read from Firestore.

export type StartHelpChatRequest = {
  /** Left out for the "couldn't load your details" chat. */
  reference?: string;
};

export type StartHelpChatResponse = {
  chatId: string;
  /** Firebase custom token: signs the browser in as the only reader of this chat. */
  firebaseToken: string;
};

export type HelpChatSender = 'customer' | 'ladder';

export type HelpChatMessage = {
  id: string;
  sender: HelpChatSender;
  text: string;
};

export type HelpChatSnapshot = {
  messages: HelpChatMessage[];
  /** Ladder's AI is writing a reply. */
  isTyping: boolean;
};

/** One open chat. Firestore-backed, or in memory when mocks are on. */
export type HelpChatConnection = {
  chatId: string;
  /** Calls onChange with every update until the returned function is called. */
  watch: (
    onChange: (snapshot: HelpChatSnapshot) => void,
    onError: (error: Error) => void,
  ) => () => void;
  send: (text: string) => Promise<void>;
  close: () => Promise<void>;
};
