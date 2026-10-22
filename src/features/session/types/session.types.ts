// Assistance session status types (GET /assistance/status).
export type StepStatus = 'not_started' | 'pending' | 'verified' | 'failed';

export type IdentityMethod = 'bvn' | 'nin' | 'bvn-and-nin' | 'ladder-id';

export type AssistanceStatus = {
  method: IdentityMethod | null;
  identity: StepStatus;
  liveness: StepStatus;
};
