// Request/response types for the identify endpoints.
import type { StepStatus } from '@/features/session';

/** Dates are ISO YYYY-MM-DD. */
export type IdentifyBvnRequest = { bvn: string; dateOfBirth: string };
export type IdentifyNinRequest = { nin: string; dateOfBirth: string };
export type IdentifyBvnAndNinRequest = { bvn: string; nin: string; dateOfBirth: string };
export type IdentifyLadderIdRequest = { ladderId: string };

/** Status only: no personal data before liveness (rules.md §10). */
export type IdentifyResponse = { status: StepStatus };
