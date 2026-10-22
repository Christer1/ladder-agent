// MSW handlers for the assistance session (status, end).
import { delay, http } from 'msw';
import type { AssistanceStatus } from '@/features/session';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { mockDb } from '../db';
import { ok, requireSession, url } from './http';

export const sessionHandlers = [
  http.get(url(ENDPOINTS.session.status), async () => {
    await delay(300);
    return requireSession() ?? ok<AssistanceStatus>(mockDb.get().status);
  }),

  http.post(url(ENDPOINTS.session.end), async () => {
    await delay(300);
    mockDb.end();
    return ok({}, 'Session ended');
  }),
];
