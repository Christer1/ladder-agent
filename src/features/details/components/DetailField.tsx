// Read-only label/value card on the details screen. Rendered inside a <dl>.
// muted: grey card (Personal Information); plain: white card (Additional Information).
import { cn } from '@/lib/utils/cn';

type DetailFieldProps = {
  label: string;
  value: string;
  tone?: 'muted' | 'plain';
};

export function DetailField({ label, value, tone = 'plain' }: DetailFieldProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-border px-5 py-3',
        tone === 'muted' ? 'bg-surface-muted' : 'bg-surface',
      )}
    >
      <dt className="text-[15px] leading-6 text-text-muted">{label}</dt>
      <dd className="mt-1 text-base leading-6 break-words text-text-strong">{value}</dd>
    </div>
  );
}
