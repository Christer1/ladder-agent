// Renders a chat message: *single asterisks* are bold (the AI writes WhatsApp-style formatting).
// Everything else is plain text, so nothing a message contains can become HTML.
import { Fragment } from 'react';

// The asterisks must not touch letters, digits, # or another *, so USSD codes such as *565*0#
// and *346# are shown exactly as typed.
const BOLD = /(?<![\p{L}\d*])\*([^*\n]+)\*(?![\p{L}\d#*])/gu;

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
