// Route "/bvn-or-nin" → BVN or NIN. Renders features/identity/components/BvnOrNinForm.
import type { Metadata } from 'next';
import { BvnOrNinForm } from '@/features/identity';

export const metadata: Metadata = { title: 'BVN or NIN' };

export default function BvnOrNinPage() {
  return <BvnOrNinForm />;
}
