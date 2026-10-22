// One message in the help chat: the customer's on the right, Ladder's on the left.
import { cn } from '@/lib/utils/cn';
import type { HelpChatSender } from '../types/help-chat.types';
import { formatMessage } from '../utils/format-message';

type ChatBubbleProps = {
  sender: HelpChatSender;
  text: string;
  /** Sent but not in the chat yet. */
  isPending?: boolean;
  /** Shown under a message that failed to send. */
  onRetry?: () => void;
};

export function ChatBubble({ sender, text, isPending = false, onRetry }: ChatBubbleProps) {
  const isCustomer = sender === 'customer';

  return (
    <div className={cn('flex flex-col', isCustomer ? 'items-end' : 'items-start')}>
      <p className="sr-only">{isCustomer ? 'You said:' : 'Ladder said:'}</p>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-[22px] break-words whitespace-pre-wrap',
          isCustomer
            ? 'rounded-br-md bg-primary-600 text-white'
            : 'rounded-bl-md border border-border bg-surface text-text-strong',
          isPending && !onRetry && 'opacity-70',
        )}
      >
        {formatMessage(text)}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 text-xs font-medium text-danger underline underline-offset-2"
        >
          Not sent. Tap to try again
        </button>
      )}
    </div>
  );
}
