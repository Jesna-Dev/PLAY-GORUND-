import { CircleX, TriangleAlert } from "lucide-react";
import type { LogEntry } from "@/lib/playground/types";
import { cn } from "@/lib/utils";

function Location({
  entry,
  onReveal,
}: {
  entry: LogEntry;
  onReveal: (file: string, line: number) => void;
}) {
  if (!entry.file || !entry.line) return null;
  const { file, line } = entry;
  return (
    <button
      type="button"
      onClick={() => onReveal(file, line)}
      className="ml-auto shrink-0 self-start rounded font-sans text-xs underline decoration-current/40 underline-offset-2 outline-none hover:decoration-current focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {file}:{line}
    </button>
  );
}

export function ConsoleView({
  entries,
  empty,
  onReveal,
}: {
  entries: LogEntry[];
  empty: React.ReactNode;
  onReveal: (file: string, line: number) => void;
}) {
  if (!entries.length) {
    return <div className="p-4 text-sm text-muted-foreground">{empty}</div>;
  }

  return (
    <ol className="font-mono text-[13px] leading-relaxed">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={cn(
            "flex gap-2 border-b border-border/70 px-3 py-1.5",
            entry.level === "error" && "bg-destructive/8 text-destructive",
            entry.level === "warn" && "bg-amber-500/10 text-amber-800 dark:text-amber-200",
            entry.level === "system" && "font-sans text-xs text-muted-foreground",
          )}
        >
          {entry.level === "error" && (
            <CircleX aria-label="Error" className="mt-1 size-3.5 shrink-0" />
          )}
          {entry.level === "warn" && (
            <TriangleAlert aria-label="Warning" className="mt-1 size-3.5 shrink-0" />
          )}
          <span className="min-w-0 break-words whitespace-pre-wrap">{entry.text}</span>
          <Location entry={entry} onReveal={onReveal} />
        </li>
      ))}
    </ol>
  );
}
