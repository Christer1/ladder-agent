// "We found your details" success banner at the top of the details screen.
export function FoundBanner() {
  return (
    <div role="status" className="flex gap-3 rounded-card bg-surface-success px-4 py-3.5">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="11" className="fill-success" />
        <path
          d="m7.5 12.3 3 3 6-6.3"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-[15px] leading-6 text-text-body">
        <p className="font-semibold text-text-strong">We found your details</p>
        <p>Your information has been retrieved</p>
        <p>Please review your details below</p>
      </div>
    </div>
  );
}
