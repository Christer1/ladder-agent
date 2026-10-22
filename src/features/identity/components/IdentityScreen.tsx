// Shared frame for the BVN or NIN and BVN and NIN screens: back, title, subtitle, form, pinned Get Help.
import { BackButton } from '@/components/layout/BackButton';
import { GetHelpButton } from '@/components/layout/GetHelpButton';
import { ROUTES } from '@/config/routes';

type IdentityScreenProps = {
  title: string;
  isHelpVisible: boolean;
  children: React.ReactNode;
};

export function IdentityScreen({ title, isHelpVisible, children }: IdentityScreenProps) {
  return (
    <div className="flex flex-1 flex-col px-6 pt-5 pb-8 lg:justify-center lg:py-16">
      <BackButton href={ROUTES.WELCOME} icon="chevron" />

      <h1 className="mt-6 text-[28px] leading-9 font-bold text-text-strong lg:mt-4">{title}</h1>
      <p className="mt-3 text-base text-text-body">Enter your details to continue.</p>

      <div className="mt-6">{children}</div>

      {/* Pinned to the bottom on mobile (rules.md §5); shown once the user hits a mismatch. */}
      {isHelpVisible && (
        <div className="mt-auto px-4 pt-10 md:mt-10 md:px-0 md:pt-0">
          <GetHelpButton className="h-[46px] text-base" />
        </div>
      )}
    </div>
  );
}
