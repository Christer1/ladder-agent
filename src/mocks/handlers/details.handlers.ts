// MSW handlers for the details endpoints. Details only after liveness (rules.md §10).
// The sample person matches the Your Details design.
import { delay, http } from 'msw';
import type {
  AssistanceDetails,
  ConfirmDetailsRequest,
} from '@/features/details/types/details.types';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { mockDb } from '../db';
import { fail, ok, requireSession, url } from './http';

const SAMPLE_DETAILS: AssistanceDetails = {
  fullName: 'Victor Awojobi',
  dateOfBirth: '2000-04-12',
  phoneNumber: '08123456789',
  email: 'victor@gmail.com',
  residentialAddress: '14 Admiralty Way, Lekki Phase 1, Lagos',
};

const requireLiveness = () =>
  mockDb.get().status.liveness === 'verified'
    ? null
    : fail(403, { message: 'Complete the liveness check first.', code: 'LIVENESS_REQUIRED' });

export const detailsHandlers = [
  http.get(url(ENDPOINTS.details.me), async () => {
    await delay(2000);
    const blocked = requireSession() ?? requireLiveness();
    if (blocked) return blocked;

    const isAddressMissing = mockDb.get().scenario === 'no-address';
    return ok<AssistanceDetails>({
      ...SAMPLE_DETAILS,
      residentialAddress: isAddressMissing ? null : SAMPLE_DETAILS.residentialAddress,
    });
  }),

  http.post<never, ConfirmDetailsRequest>(url(ENDPOINTS.details.confirm), async ({ request }) => {
    await delay(1000);
    const blocked = requireSession() ?? requireLiveness();
    if (blocked) return blocked;

    const { residentialAddress } = await request.json();
    if (mockDb.get().scenario === 'no-address' && !residentialAddress?.trim()) {
      const message = 'Enter your residential address';
      return fail(400, {
        message,
        code: 'VALIDATION_ERROR',
        errors: { residentialAddress: [message] },
      });
    }

    mockDb.confirm();
    return ok({}, 'Details sent');
  }),
];
