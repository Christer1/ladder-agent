// Route "/complete" → Details sent (placeholder). Renders features/details/components/CompleteSummary.
import type { Metadata } from 'next';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { CompleteSummary } from '@/features/details';

export const metadata: Metadata = { title: 'Details sent' };

export default function CompletePage() {
  return (
    <ScreenShell>
      <CompleteSummary />
    </ScreenShell>
  );
}
