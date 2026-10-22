// Keeps users on their next step of the assistance session.
//
// No session: GET /assistance/status answers 401 and lib/api/client redirects to /.
// Session but step not reached yet: replace() to the first incomplete step.
// Children always stay mounted (hidden until allowed) so Next.js can still prerender and
// validate the segment for instant navigation. Copied from ladder-web and adapted.
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Spinner } from '@/components/ui';
import { getNextRoute, isRouteAllowed, useAssistanceStatus } from '@/features/session';
import { useAssistanceStore } from '@/store/assistance.store';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isConfirmed = useAssistanceStore((state) => state.isConfirmed);
  const { data: status, isError, error, refetch, isRefetching } = useAssistanceStatus();
  const isAllowed = status ? isRouteAllowed(pathname, status, isConfirmed) : false;

  useEffect(() => {
    if (status && !isAllowed) router.replace(getNextRoute(status, isConfirmed));
  }, [status, isAllowed, isConfirmed, router]);

  // A 401 is already being redirected by the API client.
  const hasBlockingError = isError && error.status !== 401;

  return (
    <>
      {!isAllowed && (
        <div className="flex min-h-dvh items-center justify-center bg-surface px-6">
          {hasBlockingError ? (
            <div className="flex max-w-sm flex-col items-center gap-4 text-center" role="alert">
              <p className="text-[15px] text-text-body">{error.message}</p>
              <Button
                variant="secondary"
                onClick={() => void refetch()}
                isLoading={isRefetching}
                className="w-auto"
              >
                Try again
              </Button>
            </div>
          ) : (
            <Spinner label="Loading your progress" className="text-primary-600" />
          )}
        </div>
      )}
      <div hidden={!isAllowed}>{children}</div>
    </>
  );
}
