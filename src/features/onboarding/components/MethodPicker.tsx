// Screen 1 "/": choose BVN or NIN, BVN and NIN, or Ladder ID.
import Link from 'next/link';
import { LadderMark } from '@/components/layout/LadderMark';
import { PartnerLogo } from '@/components/layout/PartnerLogo';
import { SkylineFooter } from '@/components/layout/SkylineFooter';
import { PARTNER } from '@/config/partner';
import { ROUTES } from '@/config/routes';
import { MethodCard } from './MethodCard';

function PersonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 20.5c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MethodPicker() {
  return (
    <div className="flex flex-1 flex-col px-6 pt-12 pb-0 lg:justify-center lg:py-16">
      <PartnerLogo className="lg:hidden" />

      <h1 className="mt-6 text-[28px] leading-[38px] font-bold text-text-strong lg:mt-0 lg:text-[32px] lg:leading-[42px]">
        Open a new account with {PARTNER.name}
      </h1>
      <p className="mt-4 text-[17px] text-text-body">Choose how you’d like to register.</p>

      <nav aria-label="Registration options" className="mt-6 flex flex-col gap-4">
        <MethodCard
          href={ROUTES.BVN_OR_NIN}
          title="BVN or NIN"
          description="Register using either your BVN or your NIN."
          icon={<PersonIcon />}
        />
        <MethodCard
          href={ROUTES.BVN_AND_NIN}
          title="BVN and NIN"
          description="Register using both identifiers."
          icon={<LinkIcon />}
        />

        <div className="my-1 flex items-center gap-3 text-[13px] font-medium text-text-muted">
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
          OR
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>

        <Link
          href={ROUTES.LADDER_ID}
          className="flex min-h-[108px] items-center justify-center gap-3 rounded-card border border-border bg-surface px-3.5 py-4 transition-colors hover:border-primary-200 hover:bg-primary-50/40"
        >
          <span className="flex size-[54px] shrink-0 items-center justify-center rounded-full bg-surface-subtle">
            <LadderMark className="h-[26px] w-[21px]" />
          </span>
          <span className="text-[15px] font-semibold text-text-strong min-[360px]:whitespace-nowrap">
            Create account using Ladder ID
          </span>
        </Link>
      </nav>

      <SkylineFooter variant="backdrop" className="-mx-6 mt-auto pt-4 md:mt-12 lg:hidden" />
    </div>
  );
}
