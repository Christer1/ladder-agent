// Verification group layout: RouteGuard (requires an assistance session).
// Each page renders its own ScreenShell so the guard's loading state stays full-screen.
import { RouteGuard } from '@/components/layout/RouteGuard';

export default function VerificationLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard>{children}</RouteGuard>;
}
