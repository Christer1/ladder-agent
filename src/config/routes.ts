// ROUTES constants.
export const ROUTES = {
  WELCOME: '/',
  BVN_OR_NIN: '/bvn-or-nin',
  BVN_AND_NIN: '/bvn-and-nin',
  LADDER_ID: '/ladder-id',
  LIVENESS: '/liveness',
  VERIFYING: '/verifying',
  DETAILS: '/details',
  COMPLETE: '/complete',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
