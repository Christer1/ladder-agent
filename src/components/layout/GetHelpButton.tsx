// "Get Help" card. NEXT_PUBLIC_HELP_CHANNEL=web (default) opens the help chat widget about this
// failure; whatsapp opens the partner's WhatsApp support link (config/partner.ts) instead.
// Rendered as a full-width card so it reads as a separate action, not part of the error text.
'use client';

import { useEffect } from 'react';
import { env } from '@/config/env';
import { PARTNER } from '@/config/partner';
import { preloadHelpChat } from '@/features/help-chat';
import { cn } from '@/lib/utils/cn';
import { useHelpChatStore } from '@/store/help-chat.store';

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

function ChatGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 11.5c0 4.14-3.58 7.5-8 7.5-1.13 0-2.2-.22-3.18-.62L4 20l1.37-3.65A7.1 7.1 0 0 1 4 11.5C4 7.36 7.58 4 12 4s8 3.36 8 7.5Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
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
  /** Help reference from the failed request (LDR-XXXXXX). The chat opens about it. */
  reference?: string | null;
  className?: string;
};

const CARD = 'flex w-full items-center gap-3 rounded-card border p-3 text-left transition-colors';

function CardText({ subtitle }: { subtitle: string }) {
  return (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold text-text-strong">Need help?</span>
        <span className="text-sm text-text-body">{subtitle}</span>
      </span>
      <span className="shrink-0 text-text-muted">
        <ChevronRight />
      </span>
    </>
  );
}

export function GetHelpButton({ reference = null, className }: GetHelpButtonProps) {
  const openChat = useHelpChatStore((state) => state.open);

  useEffect(() => {
    if (env.helpChannel === 'web') preloadHelpChat();
  }, []);

  if (env.helpChannel === 'whatsapp') {
    return (
      <a
        href={PARTNER.supportWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          CARD,
          'border-whatsapp-200 bg-whatsapp-50 hover:border-whatsapp hover:bg-whatsapp-100',
          className,
        )}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp">
          <WhatsAppGlyph />
        </span>
        <CardText subtitle="Chat with us on WhatsApp" />
        <span className="sr-only">(opens WhatsApp in a new tab)</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openChat(reference)}
      aria-haspopup="dialog"
      className={cn(
        CARD,
        'border-ladder-100 bg-ladder-100/40 hover:border-ladder-500 hover:bg-ladder-100/70',
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ladder-500">
        <ChatGlyph />
      </span>
      <CardText subtitle="Chat with us now" />
    </button>
  );
}
