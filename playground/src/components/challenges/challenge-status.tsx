"use client";

import Link from "next/link";
import { Award, Circle, CircleCheck, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Difficulty } from "@/lib/challenges/levels";
import { useLearnProgress } from "@/lib/learn/progress";
import { cn } from "@/lib/utils";

export function ChallengeStatusIcon({ slug, className }: { slug: string; className?: string }) {
  const solved = useLearnProgress().challenges[slug];
  return solved ? (
    <CircleCheck aria-label="Solved" className={cn("size-4 shrink-0 text-primary-text", className)} />
  ) : (
    <Circle aria-label="Not solved" className={cn("size-4 shrink-0 text-muted-foreground/60", className)} />
  );
}

export function LevelProgress({ level, title, slugs }: { level: Difficulty; title: string; slugs: string[] }) {
  const { challenges } = useLearnProgress();
  const solved = slugs.filter((s) => challenges[s]).length;
  const earned = solved === slugs.length;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="w-40">
        <Progress value={solved} max={slugs.length} aria-label={`${title} challenges solved`} />
        <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
          {solved} of {slugs.length} solved
        </p>
      </div>
      <Link
        href={`/challenges/certificates/${level}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50",
          earned ? "font-medium text-primary-text" : "text-muted-foreground",
        )}
      >
        {earned ? <Award aria-hidden="true" className="size-4" /> : <Lock aria-hidden="true" className="size-3.5" />}
        {earned ? "View your certificate" : "Certificate"}
      </Link>
    </div>
  );
}
