// Desktop-only partner panel shown beside every screen (ScreenShell, ≥ lg).
import { PARTNER } from '@/config/partner';
import { cn } from '@/lib/utils/cn';
import { LadderMark } from './LadderMark';
import { PartnerLogo } from './PartnerLogo';

export function BrandPanel({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'sticky top-0 h-dvh flex-col overflow-hidden border-r border-border bg-primary-50 px-12 py-10 xl:px-16',
        className,
      )}
    >
      <PartnerLogo />

      <div className="flex-1" aria-hidden="true" />

      <p className="text-4xl leading-[1.25] font-bold tracking-[-0.01em] text-text-strong xl:text-[44px]">
        Open your {PARTNER.name} account
        <span className="block text-primary-600">in minutes.</span>
      </p>

      <div className="relative mt-5 flex flex-[1.5] flex-col">
        {/* Faded skyline rising from the bottom edge of the panel to roughly the middle of the
            subtext, with a small gutter either side. Stretched vertically to fill that space. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative local SVG */}
        <img
          src={PARTNER.skylineSrc}
          alt=""
          width={300}
          height={80}
          className="pointer-events-none absolute -bottom-10 -left-6 h-[calc(100%+0.75rem)] w-[calc(100%+3rem)] max-w-none opacity-60 xl:-left-10 xl:w-[calc(100%+5rem)]"
        />

        <p className="relative max-w-md text-base leading-7 text-text-body">
          Use your BVN, NIN or Ladder ID. We find your verified details, you confirm it’s you, and
          you’re done.
        </p>

        <p className="relative mt-auto flex items-center gap-2 text-sm text-text-muted">
          <LadderMark />
          Powered by Ladder
        </p>
      </div>
    </aside>
  );
}
