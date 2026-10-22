// Ladder logo mark (same shapes as ladder-web's Logo), used for "Create account using Ladder ID".
import { cn } from '@/lib/utils/cn';

export function LadderMark({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 34 42"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <rect x="12" y="0" width="22" height="42" rx="2" className="fill-ladder-500" />
      <rect x="0" y="22" width="16" height="20" rx="2" className="fill-ladder-900" />
      <rect
        x="11"
        y="13"
        width="13"
        height="17"
        rx="3.5"
        transform="rotate(-18 17.5 21.5)"
        className="fill-ladder-100"
      />
    </svg>
  );
}
