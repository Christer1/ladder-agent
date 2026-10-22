// MSW handlers for the identify endpoints (delayed ~1.8s to exercise the button spinner).
//
// Test values:
//   BVN/NIN 00000000000             → BVN_NOT_FOUND / NIN_NOT_FOUND
//   BVN/NIN 11111111111             → INFORMATION_MISMATCH
//   NIN 22222222222 (BVN and NIN)   → BVN_NIN_MISMATCH
//   BVN/NIN 44444444444             → identify OK, liveness then fails (FACE_MISMATCH)
//   Ladder ID LID-2222-2222         → LADDER_ID_NOT_FOUND
//   Ladder ID LID-3333-3333         → LADDER_ID_NOT_FOUND (backend: exists but not verified)
//   Ladder ID LID-4444-4444         → identify OK, liveness then fails (FACE_MISMATCH)
//   Ladder ID LID-5555-5555         → details come back without a residential address
//   anything else valid             → success
import { delay, http } from 'msw';
import type { IdentityMethod } from '@/features/session';
import type {
  IdentifyBvnAndNinRequest,
  IdentifyBvnRequest,
  IdentifyLadderIdRequest,
  IdentifyNinRequest,
  IdentifyResponse,
} from '@/features/identity/types/identity.types';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { mockDb, type MockScenario } from '../db';
import { fail, ok, url } from './http';

const LOOKUP_DELAY_MS = 1800;

const notFound = (kind: 'BVN' | 'NIN') => {
  const field = kind.toLowerCase();
  const message = `We couldn’t find that ${kind}. Check the number and try again.`;
  return fail(422, { message, code: `${kind}_NOT_FOUND`, errors: { [field]: [message] } });
};

const mismatch = () =>
  fail(422, {
    message: 'The details you entered don’t match our records.',
    code: 'INFORMATION_MISMATCH',
  });

function succeed(method: IdentityMethod, scenario: MockScenario = 'default') {
  mockDb.startSession(method, scenario);
  return ok<IdentifyResponse>({ status: 'verified' }, 'Identity found');
}

/** Shared checks for one BVN or NIN number. Returns an error response or the scenario. */
function checkNumber(kind: 'BVN' | 'NIN', value: string): Response | MockScenario {
  if (value === '00000000000') return notFound(kind);
  if (value === '11111111111') return mismatch();
  return value === '44444444444' ? 'face-mismatch' : 'default';
}

export const identityHandlers = [
  http.post<never, IdentifyBvnRequest>(url(ENDPOINTS.identify.bvn), async ({ request }) => {
    await delay(LOOKUP_DELAY_MS);
    const { bvn } = await request.json();
    const result = checkNumber('BVN', bvn);
    return result instanceof Response ? result : succeed('bvn', result);
  }),

  http.post<never, IdentifyNinRequest>(url(ENDPOINTS.identify.nin), async ({ request }) => {
    await delay(LOOKUP_DELAY_MS);
    const { nin } = await request.json();
    const result = checkNumber('NIN', nin);
    return result instanceof Response ? result : succeed('nin', result);
  }),

  http.post<never, IdentifyBvnAndNinRequest>(
    url(ENDPOINTS.identify.bvnAndNin),
    async ({ request }) => {
      await delay(LOOKUP_DELAY_MS);
      const { bvn, nin } = await request.json();
      const bvnResult = checkNumber('BVN', bvn);
      if (bvnResult instanceof Response) return bvnResult;
      const ninResult = checkNumber('NIN', nin);
      if (ninResult instanceof Response) return ninResult;
      if (nin === '22222222222') {
        const message = 'This BVN and NIN belong to different people.';
        return fail(422, { message, code: 'BVN_NIN_MISMATCH', errors: { nin: [message] } });
      }
      const isFaceMismatch = bvnResult === 'face-mismatch' || ninResult === 'face-mismatch';
      return succeed('bvn-and-nin', isFaceMismatch ? 'face-mismatch' : 'default');
    },
  ),

  http.post<never, IdentifyLadderIdRequest>(
    url(ENDPOINTS.identify.ladderId),
    async ({ request }) => {
      await delay(LOOKUP_DELAY_MS);
      const { ladderId } = await request.json();
      if (ladderId === 'LID-2222-2222' || ladderId === 'LID-3333-3333') {
        // One message for "not found" and "not verified" so IDs can't be probed (rules.md §10).
        const message = 'We couldn’t verify this Ladder ID. Check it and try again.';
        return fail(422, {
          message,
          code: 'LADDER_ID_NOT_FOUND',
          errors: { ladderId: [message] },
        });
      }
      if (ladderId === 'LID-4444-4444') return succeed('ladder-id', 'face-mismatch');
      if (ladderId === 'LID-5555-5555') return succeed('ladder-id', 'no-address');
      return succeed('ladder-id');
    },
  ),
];
