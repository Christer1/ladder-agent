// Request/response types for POST /assistance/liveness.
import type { StepStatus } from '@/features/session';

export type SubmitLivenessRequest = {
  /** One JPEG frame from the camera. Never stored or passed to another route (rules.md §10). */
  selfie: Blob;
};

export type SubmitLivenessResponse = { status: StepStatus };
