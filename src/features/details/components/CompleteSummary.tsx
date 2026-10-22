// Screen 8 "/complete" (placeholder, not designed): success message and Done, which ends the session.
'use client';

import { Button } from '@/components/ui';
import { PARTNER } from '@/config/partner';
import { ROUTES } from '@/config/routes';
import { useEndSession } from '@/features/session';

export function CompleteSummary() {
  const endSession = useEndSession();

  // A full page load (not router.replace) also drops pages that cacheComponents keeps mounted,
  // so no retrieved details stay in memory (rules.md §10).
  const finish = () =>
    endSession.mutate(undefined, { onSettled: () => window.location.replace(ROUTES.WELCOME) });

  return (
    <div className="flex flex-1 flex-col px-6 pt-12 pb-8 lg:justify-center lg:py-16">
      <div className="mt-24 flex flex-col items-center text-center lg:mt-0">
        <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
          <circle cx="36" cy="36" r="36" className="fill-surface-success" />
          <circle cx="36" cy="36" r="24" className="fill-success" />
          <path
            d="m26 36.5 7 7 13-14"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="mt-8 text-[22px] leading-8 font-semibold text-text-strong">
          Your details have been sent to {PARTNER.name}
        </h1>
        <p className="mt-3 max-w-[320px] text-base text-text-body">
          {PARTNER.name} will contact you to finish opening your account.
        </p>
      </div>

      <div className="mt-auto pt-10 md:mt-12 md:pt-0">
        <Button onClick={finish} isLoading={endSession.isPending}>
          Done
        </Button>
      </div>
    </div>
  );
}
