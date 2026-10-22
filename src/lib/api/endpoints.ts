// Every backend URL, grouped by feature. No URL strings anywhere else.
// These paths are a proposal (README → API contract): confirm with ladder-backend.
export const ENDPOINTS = {
  identify: {
    bvn: '/assistance/identify/bvn',
    nin: '/assistance/identify/nin',
    bvnAndNin: '/assistance/identify/bvn-and-nin',
    ladderId: '/assistance/identify/ladder-id',
  },
  liveness: '/assistance/liveness',
  session: {
    status: '/assistance/status',
    end: '/assistance/session/end',
  },
  details: {
    me: '/assistance/details',
    confirm: '/assistance/confirm',
  },
  helpChat: {
    start: '/assistance/help-chat',
    messages: (chatId: string) => `/assistance/help-chat/${encodeURIComponent(chatId)}/messages`,
  },
} as const;
