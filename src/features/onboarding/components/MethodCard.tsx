// One registration option on "/": icon circle, title, description, chevron. The whole card is a link.
import Link from 'next/link';
import type { Route } from '@/config/routes';

type MethodCardProps = {
  href: Route;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function MethodCard({ href, title, description, icon }: MethodCardProps) {
  return (
    <Link
      href={href}
      className="flex min-h-[108px] items-center gap-4 rounded-card border border-border bg-surface py-4 pr-4 pl-3.5 transition-colors hover:border-primary-200 hover:bg-primary-50/40"
    >
      <span className="flex size-[54px] shrink-0 items-center justify-center self-start rounded-full bg-surface-subtle text-text-heading">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-base font-semibold text-text-strong">{title}</span>
        <span className="text-[15px] leading-[22px] text-text-body">{description}</span>
      </span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m9 5.5 6.5 6.5L9 18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-strong"
        />
      </svg>
    </Link>
  );
}
