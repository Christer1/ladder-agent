// One message in the help chat: the customer's on the right, Ladder's on the left.
import { cn } from '@/lib/utils/cn';
import type { HelpChatSender } from '../types/help-chat.types';
import { formatMessage } from '../utils/format-message';

type ChatBubbleProps = {
  sender: HelpChatSender;
  text: string;
  /** Shown above an agent's message. */
  agentName?: string | null;
  /** Sent but not in the chat yet. */
  isPending?: boolean;
  /** Shown under a message that failed to send. */
  onRetry?: () => void;
};

const SPEAKER: Record<HelpChatSender, string> = {
  customer: 'You said:',
  ladder: 'Ladder said:',
  agent: 'Ladder agent said:',
};

export function ChatBubble({
  sender,
  text,
  agentName,
  isPending = false,
  onRetry,
}: ChatBubbleProps) {
  const isCustomer = sender === 'customer';

  return (
    <div className={cn('flex flex-col', isCustomer ? 'items-end' : 'items-start')}>
      <p className="sr-only">{SPEAKER[sender]}</p>
      {sender === 'agent' && (
        <p aria-hidden="true" className="mb-1 ml-1 text-xs font-medium text-ladder-900">
          {agentName ?? 'Ladder Support'} · Support agent
        </p>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-[22px] break-words whitespace-pre-wrap',
          isCustomer
            ? 'rounded-br-md bg-primary-600 text-white'
            : sender === 'agent'
              ? 'rounded-bl-md border border-ladder-300 bg-ladder-100/50 text-text-strong'
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
