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

/** ladder: the AI or a fixed Ladder message. agent: a person from Ladder's support team. */
export type HelpChatSender = 'customer' | 'ladder' | 'agent';

export type HelpChatMessage = {
  id: string;
  sender: HelpChatSender;
  text: string;
  /** Set on agent messages. */
  agentName: string | null;
};

export type HelpChatSnapshot = {
  messages: HelpChatMessage[];
  /** Ladder's AI is writing a reply. */
  isTyping: boolean;
  /** The support agent who has taken the chat over from the AI, if any. */
  agentName: string | null;
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
