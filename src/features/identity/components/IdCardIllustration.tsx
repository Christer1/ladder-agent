// ID card illustration on the Ladder ID screen (pale tile, outlined card, person + lines).
import { cn } from '@/lib/utils/cn';

export function IdCardIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-[166px] w-[242px] items-center justify-center rounded-tile bg-primary-100',
        className,
      )}
      aria-hidden="true"
    >
      <svg width="206" height="132" viewBox="0 0 206 132" fill="none">
        <rect
          x="2"
          y="2"
          width="202"
          height="128"
          rx="12"
          className="fill-primary-100 stroke-primary-600"
          strokeWidth="3"
        />
        <circle cx="45" cy="52" r="13" className="fill-primary-600" />
        <path d="M21 88a24 20 0 0 1 48 0v4H21v-4Z" className="fill-primary-600" />
        <rect x="21" y="96" width="42" height="5" rx="2.5" className="fill-primary-200" />
        <rect x="90" y="44" width="92" height="7" rx="3.5" className="fill-primary-600" />
        <rect x="90" y="64" width="92" height="7" rx="3.5" className="fill-primary-600" />
        <rect x="90" y="84" width="60" height="7" rx="3.5" className="fill-primary-600" />
      </svg>
    </div>
  );
}
