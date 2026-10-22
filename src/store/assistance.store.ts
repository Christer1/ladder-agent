// Zustand store: flow flags only. Never BVN, NIN, date of birth, Ladder ID or details.
// Not persisted: a hard refresh falls back to the server status.
import { create } from 'zustand';

type AssistanceState = {
  /** Set after POST /assistance/confirm so /complete can be shown. */
  isConfirmed: boolean;
};

type AssistanceActions = {
  markConfirmed: () => void;
  reset: () => void;
};

const initialState: AssistanceState = {
  isConfirmed: false,
};

export const useAssistanceStore = create<AssistanceState & AssistanceActions>()((set) => ({
  ...initialState,
  markConfirmed: () => set({ isConfirmed: true }),
  reset: () => set(initialState),
}));
