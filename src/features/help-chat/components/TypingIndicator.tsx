// "Ladder is typing": three bouncing dots in a Ladder bubble.
export function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div
        role="status"
        className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3.5"
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            className="size-1.5 animate-bounce rounded-full bg-text-muted motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
        <span className="sr-only">Ladder is typing</span>
      </div>
    </div>
  );
}
