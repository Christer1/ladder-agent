// MSW handler for the liveness upload. Fails with FACE_MISMATCH for the face-mismatch test values.
import { delay, http } from 'msw';
import type { SubmitLivenessResponse } from '@/features/liveness/types/liveness.types';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { mockDb } from '../db';
import { fail, ok, requireSession, url } from './http';

export const livenessHandlers = [
  http.post(url(ENDPOINTS.liveness), async () => {
    await delay(1500);
    const unauthorized = requireSession();
    if (unauthorized) return unauthorized;

    if (mockDb.get().scenario === 'face-mismatch') {
      mockDb.updateStatus({ liveness: 'failed' });
      return fail(422, {
        message: 'Your face didn’t match our records. Try again in good light.',
        code: 'FACE_MISMATCH',
      });
    }

    mockDb.updateStatus({ liveness: 'verified' });
    return ok<SubmitLivenessResponse>({ status: 'verified' }, 'Liveness verified');
  }),
];
