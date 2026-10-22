// Shared frame for the BVN or NIN and BVN and NIN screens: back, title, subtitle, form.
// Get Help sits beside the mismatch error inside the form, not pinned to the bottom.
import { BackButton } from '@/components/layout/BackButton';
import { ROUTES } from '@/config/routes';

type IdentityScreenProps = {
  title: string;
  children: React.ReactNode;
};

export function IdentityScreen({ title, children }: IdentityScreenProps) {
  return (
    <div className="flex flex-1 flex-col px-6 pt-5 pb-8 lg:justify-center lg:py-16">
      <BackButton href={ROUTES.WELCOME} icon="chevron" />

      <h1 className="mt-6 text-[28px] leading-9 font-bold text-text-strong lg:mt-4">{title}</h1>
      <p className="mt-3 text-base text-text-body">Enter your details to continue.</p>

      <div className="mt-6">{children}</div>
    </div>
  );
}
