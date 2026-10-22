// Read-only label/value card on the details screen. Rendered inside a <dl>.
export function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-surface px-5 py-3">
      <dt className="text-[15px] leading-6 text-text-muted">{label}</dt>
      <dd className="mt-1 text-base leading-6 break-words text-text-strong">{value}</dd>
    </div>
  );
}
