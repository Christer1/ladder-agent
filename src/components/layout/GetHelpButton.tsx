// "Get Help" link to the partner's WhatsApp support (config/partner.ts). No personal data in the link.
//   button  full-width pill (e.g. under Try again)
//   inline  compact link placed beside the error it helps with
import { PARTNER } from '@/config/partner';
import { buttonClasses } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
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

type GetHelpButtonProps = {
  variant?: 'button' | 'inline';
  className?: string;
};

export function GetHelpButton({ variant = 'button', className }: GetHelpButtonProps) {
  const isInline = variant === 'inline';

  return (
    <a
      href={PARTNER.supportWhatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        isInline
          ? cn(
              'inline-flex min-h-6 items-center gap-1 rounded-pill text-xs font-semibold text-primary-600 underline-offset-2 hover:underline',
              className,
            )
          : buttonClasses('primary', className)
      }
    >
      {isInline ? 'Get help' : 'Get Help'}
      <WhatsAppIcon size={isInline ? 16 : 24} />
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  );
}
