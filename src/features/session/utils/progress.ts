// Pure helpers that turn an AssistanceStatus into "which screen may the user see".
// Shared by RouteGuard and the liveness back button.
import { ROUTES, type Route } from '@/config/routes';
import type { AssistanceStatus, IdentityMethod } from '../types/session.types';

/** The identify screen each method came from. */
export function getMethodRoute(method: IdentityMethod | null): Route {
  switch (method) {
    case 'bvn':
    case 'nin':
      return ROUTES.BVN_OR_NIN;
    case 'bvn-and-nin':
      return ROUTES.BVN_AND_NIN;
    case 'ladder-id':
      return ROUTES.LADDER_ID;
    default:
      return ROUTES.WELCOME;
  }
}

/** The first step the user still has to complete. */
export function getNextRoute(status: AssistanceStatus, isConfirmed: boolean): Route {
  if (status.identity !== 'verified') return getMethodRoute(status.method);
  if (status.liveness !== 'verified') return ROUTES.LIVENESS;
  return isConfirmed ? ROUTES.COMPLETE : ROUTES.DETAILS;
}

/** Whether `pathname` may be shown now (rules.md §7). */
export function isRouteAllowed(
  pathname: string,
  status: AssistanceStatus,
  isConfirmed: boolean,
): boolean {
  switch (pathname) {
    case ROUTES.LIVENESS:
      return status.identity === 'verified';
    case ROUTES.VERIFYING:
    case ROUTES.DETAILS:
      return status.liveness === 'verified';
    case ROUTES.COMPLETE:
      return status.liveness === 'verified' && isConfirmed;
    default:
      return true;
  }
}
