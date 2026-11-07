import { type LanguageId, languages } from "@/lib/languages";
import { cn } from "@/lib/utils";

/** Decorative tile: every use sits next to the language's written name. */
export function LanguageMark({
  language,
  className,
}: {
  language: LanguageId;
  className?: string;
}) {
  const { monogram, color } = languages[language];
  return (
    <span
      aria-hidden="true"
      style={{ "--lang": color } as React.CSSProperties}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--lang)_18%,transparent)] font-mono text-xs font-semibold text-foreground ring-1 ring-[color-mix(in_oklch,var(--lang)_40%,transparent)] ring-inset",
        className,
      )}
    >
      {monogram}
    </span>
  );
}
