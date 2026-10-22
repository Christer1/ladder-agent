// City skyline + partner tagline ("— Banking for a brighter future —").
// inline: centred illustration with the tagline under it (desktop BrandPanel).
// backdrop: edge-to-edge, taller and faded, with the tagline over it (bottom of the welcome screen).
import { PARTNER } from '@/config/partner';
import { cn } from '@/lib/utils/cn';

type SkylineFooterProps = {
  variant?: 'inline' | 'backdrop';
  className?: string;
};

function Tagline({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-center gap-8 text-[13px] text-text-strong', className)}>
      <span className="h-px w-3 bg-primary-600" aria-hidden="true" />
      {PARTNER.tagline}
      <span className="h-px w-3 bg-primary-600" aria-hidden="true" />
    </p>
  );
}

export function SkylineFooter({ variant = 'inline', className }: SkylineFooterProps) {
  if (variant === 'backdrop') {
    return (
      <div className={cn('relative flex h-[150px] items-end justify-center', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative local SVG */}
        <img
          src={PARTNER.skylineSrc}
          alt=""
          width={300}
          height={80}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[130px] w-full object-cover object-bottom opacity-70"
        />
        <Tagline className="relative mb-4 rounded-pill bg-surface/85 px-3 py-1" />
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative local SVG */}
      <img
        src={PARTNER.skylineSrc}
        alt=""
        width={300}
        height={80}
        className="w-full max-w-[300px]"
      />
      <Tagline className="mt-4" />
    </div>
  );
}
