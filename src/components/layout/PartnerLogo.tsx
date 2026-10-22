// Partner logo from config/partner.ts (public/brand/partner-logo.svg).
import { PARTNER } from '@/config/partner';
import { cn } from '@/lib/utils/cn';

export function PartnerLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- small local SVG, nothing to optimise
    <img
      src={PARTNER.logoSrc}
      alt={PARTNER.name}
      width={52}
      height={62}
      className={cn('h-[62px] w-auto self-start', className)}
    />
  );
}
