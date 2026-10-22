// "Get Help" pill that opens the partner's WhatsApp support (config/partner.ts). No personal data in the link.
import { PARTNER } from '@/config/partner';
import { buttonClasses } from '@/components/ui';

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" className="fill-white" />
      <path
        d="M12 4.2a7.8 7.8 0 0 0-6.7 11.8L4.2 19.8l3.9-1a7.8 7.8 0 1 0 3.9-14.6Z"
        className="fill-whatsapp"
      />
      <path
        d="M9.3 8.1c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.2.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3 .6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.3-1.6-.8c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.8Z"
        className="fill-white"
      />
    </svg>
  );
}

export function GetHelpButton({ className }: { className?: string }) {
  return (
    <a
      href={PARTNER.supportWhatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses('primary', className)}
    >
      Get Help
      <WhatsAppIcon />
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  );
}
