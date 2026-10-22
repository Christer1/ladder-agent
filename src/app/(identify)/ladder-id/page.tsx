// Route "/ladder-id" → Verify your Ladder ID. Renders features/identity/components/LadderIdForm.
import type { Metadata } from 'next';
import { LadderIdForm } from '@/features/identity';

export const metadata: Metadata = { title: 'Verify your Ladder ID' };

export default function LadderIdPage() {
  return <LadderIdForm />;
}
