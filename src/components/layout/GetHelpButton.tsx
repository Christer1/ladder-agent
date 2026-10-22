// "Get Help" link to the partner's WhatsApp support (config/partner.ts). No personal data in the link.
// Rendered as a full-width card with a WhatsApp badge so it reads as a separate action, not part
// of the error text it sits under.
import { PARTNER } from '@/config/partner';
import { cn } from '@/lib/utils/cn';

function WhatsAppGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4.2a7.8 7.8 0 0 0-6.7 11.8L4.2 19.8l3.9-1a7.8 7.8 0 1 0 3.9-14.6Z"
        className="fill-white"
      />
      <path
        d="M9.3 8.1c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.2.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3 .6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.3-1.6-.8c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.8Z"
        className="fill-whatsapp"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m7.5 5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type GetHelpButtonProps = {
  className?: string;
};

export function GetHelpButton({ className }: GetHelpButtonProps) {
  return (
    <a
      href={PARTNER.supportWhatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex w-full items-center gap-3 rounded-card border border-whatsapp-200 bg-whatsapp-50 p-3 text-left transition-colors hover:border-whatsapp hover:bg-whatsapp-100',
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp">
        <WhatsAppGlyph />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold text-text-strong">Need help?</span>
        <span className="text-sm text-text-body">Chat with us on WhatsApp</span>
      </span>
      <span className="shrink-0 text-text-muted">
        <ChevronRight />
      </span>
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  );
}
