// Renders a chat message: *single asterisks* are bold (the AI writes WhatsApp-style formatting).
// Everything else is plain text, so nothing a message contains can become HTML.
import { Fragment } from 'react';

const BOLD = /\*([^*\n]+)\*/g;

export function formatMessage(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(BOLD)) {
    parts.push(text.slice(last, match.index));
    parts.push(
      <strong key={match.index} className="font-semibold">
        {match[1]}
      </strong>,
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}
