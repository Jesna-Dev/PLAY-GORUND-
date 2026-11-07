import { cn } from "@/lib/utils";

/** A progress bar: a #C5DA00 fill over tick marks that show what's left. */
export function TickBar({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  label: string;
  className?: string;
}) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max}`}
      className={cn(
        "relative h-7 overflow-hidden rounded-md bg-[repeating-linear-gradient(90deg,var(--tick)_0_1px,transparent_1px_5px)]",
        className,
      )}
    >
      {percent > 0 && (
        <div
          className="absolute inset-y-0 left-0 rounded-md bg-[linear-gradient(90deg,color-mix(in_oklch,var(--progress)_14%,var(--card)),color-mix(in_oklch,var(--progress)_78%,var(--card)))]"
          style={{ width: `${percent}%` }}
        >
          <span className="absolute inset-y-0 right-0 w-1.5 rounded-sm bg-progress" />
        </div>
      )}
    </div>
  );
}
