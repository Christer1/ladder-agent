// Route "/liveness" → Liveness check. Renders features/liveness/components/LivenessCamera.
import type { Metadata } from 'next';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { LivenessCamera } from '@/features/liveness';

export const metadata: Metadata = { title: 'Liveness check' };

export default function LivenessPage() {
  return (
    <ScreenShell>
      <LivenessCamera />
    </ScreenShell>
  );
}
