"use client";

import { useSyncExternalStore } from "react";
import { CalendarDays, CircleCheck, Clock } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { dailyIndex } from "@/lib/challenges/daily";
import { levelTitle } from "@/lib/challenges/levels";
import type { ChallengeSummary } from "@/lib/challenges/types";
import { useLearnProgress } from "@/lib/learn/progress";

const noop = () => () => {};

/** Today's pick depends on the visitor's date, so it's chosen in the browser. */
export function useDailyChallenge(challenges: ChallengeSummary[]) {
  const index = useSyncExternalStore(noop, () => dailyIndex(challenges.length), () => null);
  return index === null ? null : challenges[index];
}

export function DailyChallengeHero({ challenges }: { challenges: ChallengeSummary[] }) {
  const challenge = useDailyChallenge(challenges);
  const solved = useLearnProgress().challenges;

  if (!challenge) return <Skeleton className="h-40 rounded-xl" />;
  const done = Boolean(solved[challenge.slug]);

  return (
    <div className="rounded-xl bg-[radial-gradient(ellipse_70%_90%_at_100%_0%,color-mix(in_oklch,var(--primary)_11%,transparent),transparent)] p-5 ring-1 ring-foreground/10 sm:p-6">
      <p className="flex items-center gap-2 text-sm font-medium">
        <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
        Today’s challenge
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">{challenge.title}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{levelTitle(challenge.difficulty)}</Badge>
        {challenge.topics.map((topic) => (
          <Badge key={topic} variant="outline">
            {topic}
          </Badge>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <ButtonLink href={challenge.href}>{done ? "Solve it again" : "Solve today’s challenge"}</ButtonLink>
        {done ? (
          <span className="flex items-center gap-1.5 text-sm text-primary-text">
            <CircleCheck aria-hidden="true" className="size-4" />
            Solved
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock aria-hidden="true" className="size-3.5" />
            About {challenge.minutes} min
          </span>
        )}
      </div>
    </div>
  );
}
