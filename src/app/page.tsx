// Route "/" → Open a new account. Renders features/onboarding/components/MethodPicker.
import { ScreenShell } from '@/components/layout/ScreenShell';
import { MethodPicker } from '@/features/onboarding';

export default function WelcomePage() {
  return (
    <ScreenShell>
      <MethodPicker />
    </ScreenShell>
  );
}
