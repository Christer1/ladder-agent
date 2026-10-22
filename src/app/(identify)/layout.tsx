// Identify group layout: public screens, wrapped in components/layout/ScreenShell.
import { ScreenShell } from '@/components/layout/ScreenShell';

export default function IdentifyLayout({ children }: { children: React.ReactNode }) {
  return <ScreenShell>{children}</ScreenShell>;
}
