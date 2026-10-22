// Desktop-only partner panel shown beside every screen (ScreenShell, ≥ lg).
import { PARTNER } from '@/config/partner';
import { cn } from '@/lib/utils/cn';
import { LadderMark } from './LadderMark';
import { PartnerLogo } from './PartnerLogo';
import { SkylineFooter } from './SkylineFooter';

export function BrandPanel({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'sticky top-0 h-dvh flex-col overflow-hidden border-r border-border bg-primary-50 px-12 py-10 xl:px-16',
        className,
      )}
    >
      <PartnerLogo />

      <div className="my-auto flex flex-col py-10">
        <p className="text-4xl leading-[1.25] font-bold tracking-[-0.01em] text-text-strong xl:text-[44px]">
          Open your {PARTNER.name} account
          <span className="block text-primary-600">in minutes.</span>
        </p>
        <p className="mt-5 max-w-md text-base leading-7 text-text-body">
          Use your BVN, NIN or Ladder ID. We find your verified details, you confirm it’s you, and
          you’re done.
        </p>
        <SkylineFooter className="mt-14 max-w-[420px] self-center [&_img]:max-w-[420px]" />
      </div>

      <p className="flex items-center gap-2 text-sm text-text-muted">
        <LadderMark />
        Powered by Ladder
      </p>
    </aside>
  );
}
