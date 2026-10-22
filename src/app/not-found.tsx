// 404 page.
import Link from 'next/link';
import { PartnerLogo } from '@/components/layout/PartnerLogo';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { buttonClasses } from '@/components/ui';
import { ROUTES } from '@/config/routes';

export default function NotFound() {
  return (
    <ScreenShell>
      <div className="flex flex-1 flex-col px-6 pt-12 pb-8 lg:justify-center lg:py-16">
        <PartnerLogo className="lg:hidden" />
        <h1 className="mt-10 text-[28px] leading-9 font-bold text-text-strong lg:mt-0">
          Page not found
        </h1>
        <p className="mt-2 text-base text-text-body">
          The page you’re looking for doesn’t exist or isn’t available yet.
        </p>
        <Link href={ROUTES.WELCOME} className={buttonClasses('primary', 'mt-8')}>
          Back to start
        </Link>
      </div>
    </ScreenShell>
  );
}
