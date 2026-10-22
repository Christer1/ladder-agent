// Screen 6 "/verifying": spinner while GET /assistance/details loads, then replace() to /details.
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GetHelpButton } from '@/components/layout/GetHelpButton';
import { PartnerLogo } from '@/components/layout/PartnerLogo';
import { Button } from '@/components/ui';
import { ROUTES } from '@/config/routes';
import { useAssistanceDetails } from '../hooks/useAssistanceDetails';

function RingSpinner() {
  return (
    <svg
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle cx="31" cy="31" r="27" className="stroke-border" strokeWidth="3.5" />
      <path
        d="M31 4a27 27 0 0 0-19.1 46.1"
        className="stroke-primary-600"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VerifyingDetails() {
  const router = useRouter();
  const { isSuccess, isError, error, refetch, isRefetching } = useAssistanceDetails();

  useEffect(() => {
    if (isSuccess) router.replace(ROUTES.DETAILS);
  }, [isSuccess, router]);

  const isFailed = isError && !isRefetching;

  return (
    <div className="flex flex-1 flex-col px-6 pt-12 pb-8 lg:justify-center lg:py-16">
      <PartnerLogo className="h-[52px] lg:hidden" />

      <div aria-live="polite" className="mt-32 flex flex-col items-center text-center lg:mt-0">
        {isFailed ? (
          <div role="alert" className="flex flex-col items-center">
            <h1 className="text-[22px] leading-8 font-semibold text-text-strong">
              We couldn’t load your details
            </h1>
            <p className="mt-2 text-base text-text-body">{error.message}</p>
          </div>
        ) : (
          <>
            <RingSpinner />
            <h1 className="mt-8 text-[22px] leading-8 font-semibold text-text-strong">
              Verifying your details...
            </h1>
            <p className="mt-3 text-base text-text-body">This will only take a moment.</p>
          </>
        )}
      </div>

      {isFailed && (
        <div className="mt-auto flex flex-col gap-3 pt-10 md:mt-10">
          <Button onClick={() => void refetch()}>Try again</Button>
          <GetHelpButton />
        </div>
      )}
    </div>
  );
}
