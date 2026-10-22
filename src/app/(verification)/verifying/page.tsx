// Route "/verifying" → Verifying your details. Renders features/details/components/VerifyingDetails.
import type { Metadata } from 'next';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { VerifyingDetails } from '@/features/details';

export const metadata: Metadata = { title: 'Verifying your details' };

export default function VerifyingPage() {
  return (
    <ScreenShell>
      <VerifyingDetails />
    </ScreenShell>
  );
}
