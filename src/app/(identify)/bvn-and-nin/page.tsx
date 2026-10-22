// Route "/bvn-and-nin" → BVN and NIN. Renders features/identity/components/BvnAndNinForm.
import type { Metadata } from 'next';
import { BvnAndNinForm } from '@/features/identity';

export const metadata: Metadata = { title: 'BVN and NIN' };

export default function BvnAndNinPage() {
  return <BvnAndNinForm />;
}
