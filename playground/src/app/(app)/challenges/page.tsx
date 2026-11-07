import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeStatusIcon, LevelProgress } from "@/components/challenges/challenge-status";
import { DailyChallengeHero } from "@/components/challenges/daily-challenge";
import { PageContainer } from "@/components/layout/page-container";
import { getChallengeSummaries } from "@/lib/challenges/content";
import { levels } from "@/lib/challenges/levels";

export const metadata: Metadata = { title: "Challenges" };

export default function ChallengesPage() {
  const challenges = getChallengeSummaries();

  return (
    <PageContainer>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Challenges</h1>
        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
          Problems to solve in JavaScript or Python, checked against real test cases. Solve every challenge in a
          level to earn its certificate.
        </p>

        <div className="mt-6">
          <DailyChallengeHero challenges={challenges} />
        </div>

        {levels.map((level) => {
          const inLevel = challenges.filter((c) => c.difficulty === level.id);
          return (
            <section key={level.id} aria-labelledby={`level-${level.id}`} className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 id={`level-${level.id}`} className="text-lg font-semibold tracking-tight">
                    {level.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{level.description}</p>
                </div>
                <LevelProgress level={level.id} title={level.title} slugs={inLevel.map((c) => c.slug)} />
              </div>
              <ol className="mt-4 divide-y overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                {inLevel.map((challenge) => (
                  <li key={challenge.slug}>
                    <Link
                      href={challenge.href}
                      className="flex items-center gap-3 px-4 py-3.5 outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
                    >
                      <ChallengeStatusIcon slug={challenge.slug} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{challenge.title}</span>
                        <span className="block text-sm text-muted-foreground">{challenge.topics.join(" · ")}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{challenge.minutes} min</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}
