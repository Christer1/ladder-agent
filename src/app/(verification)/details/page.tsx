// Route "/details" → Your details. Renders features/details/components/DetailsReview.
import type { Metadata } from 'next';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { DetailsReview } from '@/features/details';

export const metadata: Metadata = { title: 'Your details' };

export default function DetailsPage() {
  return (
    <ScreenShell>
      <DetailsReview />
    </ScreenShell>
  );
}
