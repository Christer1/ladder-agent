// Responsive page frame. All breakpoint-specific framing lives here (rules.md §5):
//   < md      full-screen, pixel-matched to the mobile designs
//   md – lg   full-width page, content in a centred column (max 480px)
//   ≥ lg      partner BrandPanel on the left, content column on the right
import { cn } from '@/lib/utils/cn';
import { BrandPanel } from './BrandPanel';

type ScreenShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScreenShell({ children, className }: ScreenShellProps) {
  return (
    <div className="flex min-h-dvh w-full bg-surface">
      <BrandPanel className="hidden lg:flex lg:w-[44%] xl:w-1/2" />
      <main className="flex min-h-dvh flex-1 flex-col">
        <div
          className={cn(
            'mx-auto flex w-full max-w-[480px] flex-1 flex-col md:pt-10 lg:pt-0',
            className,
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
