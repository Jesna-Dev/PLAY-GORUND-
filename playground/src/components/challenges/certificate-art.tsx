import { forwardRef } from "react";
import type { Difficulty } from "@/lib/challenges/levels";

// Certificates are paper: fixed light colors in every theme, and literal values
// because the PNG export renders the SVG without the page's CSS.
const ACCENTS: Record<Difficulty, string> = {
  beginner: "#0f766e",
  intermediate: "#1d4ed8",
  advanced: "#6d28d9",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

export type CertificateDetails = {
  level: Difficulty;
  levelTitle: string;
  name: string;
  count: number;
  languages: string[];
  titles: string[];
  date: string;
};

function joinWords(words: string[]) {
  return words.length < 2 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
}

export const CertificateArt = forwardRef<SVGSVGElement, CertificateDetails>(function CertificateArt(
  { level, levelTitle, name, count, languages, titles, date },
  ref,
) {
  const accent = ACCENTS[level];
  const displayName = name.trim() || "Your name";
  // Shrink long names so they stay inside the border.
  const nameSize = Math.min(54, Math.floor(1500 / Math.max(displayName.length, 1)));

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1123 794"
      role="img"
      aria-label={`${levelTitle} coding challenges certificate for ${displayName}`}
      className="block h-auto w-full"
    >
      <rect width="1123" height="794" fill="#fffdf7" />
      <rect x="28" y="28" width="1067" height="738" rx="6" fill="none" stroke={accent} strokeWidth="4" />
      <rect x="42" y="42" width="1039" height="710" rx="4" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1.5" />

      <rect x="539.5" y="72" width="44" height="44" rx="10" fill={accent} />
      <text x="561.5" y="101" textAnchor="middle" fill="#ffffff" fontFamily="ui-monospace, Menlo, monospace" fontSize="17" fontWeight="700">
        {"{ }"}
      </text>
      <text x="561.5" y="146" textAnchor="middle" fill="#1f2937" fontFamily={SANS} fontSize="20" fontWeight="600">
        Codly
      </text>

      <text x="561.5" y="214" textAnchor="middle" fill="#111827" fontFamily={SERIF} fontSize="40">
        Certificate of Achievement
      </text>
      <text x="561.5" y="252" textAnchor="middle" fill={accent} fontFamily={SANS} fontSize="15" fontWeight="600" letterSpacing="3">
        {levelTitle.toUpperCase()} CODING CHALLENGES
      </text>

      <text x="561.5" y="318" textAnchor="middle" fill="#4b5563" fontFamily={SERIF} fontSize="20" fontStyle="italic">
        This certifies that
      </text>
      <text
        x="561.5"
        y="392"
        textAnchor="middle"
        fill={name.trim() ? "#111827" : "#9ca3af"}
        fontFamily={SERIF}
        fontSize={nameSize}
      >
        {displayName}
      </text>
      <line x1="261" y1="418" x2="862" y2="418" stroke="#d1d5db" strokeWidth="1.5" />

      <text x="561.5" y="466" textAnchor="middle" fill="#374151" fontFamily={SANS} fontSize="19">
        has solved all {count} {levelTitle.toLowerCase()} coding challenges on Codly
      </text>
      <text x="561.5" y="496" textAnchor="middle" fill="#374151" fontFamily={SANS} fontSize="19">
        {languages.length ? `using ${joinWords(languages)}.` : ""}
      </text>
      <text x="561.5" y="538" textAnchor="middle" fill="#6b7280" fontFamily={SANS} fontSize="14">
        {titles.join("  ·  ")}
      </text>

      <text x="240" y="662" textAnchor="middle" fill="#111827" fontFamily={SERIF} fontSize="20">
        {date}
      </text>
      <line x1="130" y1="676" x2="350" y2="676" stroke="#9ca3af" strokeWidth="1" />
      <text x="240" y="700" textAnchor="middle" fill="#6b7280" fontFamily={SANS} fontSize="13">
        Date completed
      </text>

      <circle cx="561.5" cy="664" r="58" fill={accent} />
      <circle cx="561.5" cy="664" r="49" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />
      <text x="561.5" y="662" textAnchor="middle" fill="#ffffff" fontFamily={SANS} fontSize="14" fontWeight="700" letterSpacing="1.5">
        {levelTitle.toUpperCase()}
      </text>
      <text x="561.5" y="682" textAnchor="middle" fill="#ffffff" fillOpacity="0.85" fontFamily={SANS} fontSize="11" letterSpacing="2">
        LEVEL
      </text>

      <text x="883" y="662" textAnchor="middle" fill="#111827" fontFamily={SERIF} fontSize="20">
        Codly
      </text>
      <line x1="773" y1="676" x2="993" y2="676" stroke="#9ca3af" strokeWidth="1" />
      <text x="883" y="700" textAnchor="middle" fill="#6b7280" fontFamily={SANS} fontSize="13">
        Issued by
      </text>
    </svg>
  );
});
