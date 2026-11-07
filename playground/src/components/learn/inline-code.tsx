/** Renders `backtick` spans in short plain strings, like quiz questions. */
export function InlineCode({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
      <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.875em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}
