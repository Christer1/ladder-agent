// Client providers: TanStack QueryClientProvider, MSW start when NEXT_PUBLIC_USE_MOCKS=true, and the
// help chat widget (shown only after Get Help is tapped).
'use client';

import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelpChatWidget } from '@/features/help-chat';
import { makeQueryClient } from '@/lib/api/query-client';
import { startMocks } from '@/mocks/start';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  // Start the worker early; apiClient also awaits it, so no request can beat it.
  useEffect(() => {
    void startMocks();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <HelpChatWidget />
    </QueryClientProvider>
  );
}
