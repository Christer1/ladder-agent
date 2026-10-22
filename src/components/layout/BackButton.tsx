// Top-left back control. "chevron" matches the BVN/NIN designs, "arrow" the Ladder ID, liveness and details designs.
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Route } from '@/config/routes';
import { cn } from '@/lib/utils/cn';

type BackButtonProps = {
  /** Where to go. Without it the button goes back in history. */
  href?: Route;
  icon?: 'arrow' | 'chevron';
  className?: string;
};

const BASE_CLASSES =
  '-ml-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-text-heading transition-colors hover:bg-text-heading/5';

function BackIcon({ icon }: { icon: 'arrow' | 'chevron' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={icon === 'arrow' ? 'M20 12H4m0 0 6.5-6.5M4 12l6.5 6.5' : 'M15 5.5 8.5 12l6.5 6.5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackButton({ href, icon = 'arrow', className }: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link href={href} aria-label="Go back" className={cn(BASE_CLASSES, className)}>
        <BackIcon icon={icon} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className={cn(BASE_CLASSES, className)}
    >
      <BackIcon icon={icon} />
    </button>
  );
}
