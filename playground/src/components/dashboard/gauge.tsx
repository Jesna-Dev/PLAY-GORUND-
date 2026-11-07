import { useId } from "react";

/** A half-circle meter. Decorative: the card states the same value in text. */
export function Gauge({ value, max }: { value: number; max: number }) {
  const gradientId = useId();
  const share = max > 0 ? Math.min(1, value / max) : 0;
  const angle = Math.PI * (1 - share);
  const x = 100 + 80 * Math.cos(angle);
  const y = 100 - 80 * Math.sin(angle);
  const arc = "M20 100 A80 80 0 0 1 180 100";

  return (
    <svg viewBox="0 0 200 112" aria-hidden="true" className="block w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--progress)", stopOpacity: 0.15 }} />
          <stop offset="1" style={{ stopColor: "var(--progress)" }} />
        </linearGradient>
      </defs>
      <path d={arc} fill="none" style={{ stroke: "var(--tick)" }} strokeWidth="12" strokeDasharray="1.5 4.5" />
      {share > 0 && (
        <>
          <path
            d={arc}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="12"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${share * 100} 100`}
          />
          <circle cx={x} cy={y} r="7" style={{ fill: "var(--progress)", stroke: "var(--card)" }} strokeWidth="3" />
        </>
      )}
    </svg>
  );
}
