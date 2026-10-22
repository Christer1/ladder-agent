// Message box: Enter sends, Shift+Enter adds a line. Grows up to about four lines.
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

// Same limit as ladder-backend (WEB_CHAT_MESSAGE_MAX_LENGTH).
const MAX_LENGTH = 1000;

type ChatComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
};

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 12h11M20 12 5.6 4.6a.6.6 0 0 0-.85.72L7 12l-2.25 6.68a.6.6 0 0 0 .85.72L20 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatComposer({ onSend, disabled = false, ref }: ChatComposerProps) {
  const [text, setText] = useState('');
  const canSend = !disabled && text.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form
      className="flex items-end gap-2 border-t border-border bg-surface p-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor="help-chat-message" className="sr-only">
        Message
      </label>
      <textarea
        ref={ref}
        id="help-chat-message"
        rows={1}
        value={text}
        maxLength={MAX_LENGTH}
        disabled={disabled}
        placeholder="Type a message"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
        className="field-sizing-content max-h-28 min-h-11 flex-1 resize-none rounded-input border border-border bg-surface px-3 py-2.5 text-[15px] leading-[22px] text-text-strong placeholder:text-text-muted focus:border-primary-600 focus:outline-none disabled:bg-surface-muted"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700',
          'disabled:cursor-not-allowed disabled:bg-primary-100',
        )}
      >
        <SendIcon />
      </button>
    </form>
  );
}
