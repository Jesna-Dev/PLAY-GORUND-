import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock } from "lucide-react";
import { ChallengeExamples } from "@/components/challenges/challenge-examples";
import { ChallengeHints } from "@/components/challenges/challenge-hints";
import { ChallengeLoader } from "@/components/challenges/challenge-loader";
import { SolutionReveal } from "@/components/challenges/solution-reveal";
import { PageContainer } from "@/components/layout/page-container";
import { LessonMarkdown } from "@/components/learn/lesson-markdown";
import { Badge } from "@/components/ui/badge";
import { getChallenge, getChallenges } from "@/lib/challenges/content";
import { levelTitle } from "@/lib/challenges/levels";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getChallenges().map((challenge) => ({ slug: challenge.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const challenge = getChallenge((await params).slug);
  return challenge ? { title: `${challenge.title} · Challenges` } : {};
}

export default async function ChallengePage({ params }: Params) {
  const challenge = getChallenge((await params).slug);
  if (!challenge) notFound();

  const examples = challenge.tests.filter((t) => t.example);
  const hidden = challenge.tests.length - examples.length;

  return (
    <PageContainer className="lg:pt-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/challenges" className="hover:text-foreground">
              Challenges
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5" />
            <span>{levelTitle(challenge.difficulty)}</span>
          </nav>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{challenge.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{levelTitle(challenge.difficulty)}</Badge>
            {challenge.topics.map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
            <span className="ml-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock aria-hidden="true" className="size-3.5" />
              {challenge.minutes} min
            </span>
          </div>

          <LessonMarkdown source={challenge.description} className="mt-6" />

          <section aria-labelledby="examples" className="mt-8">
            <h2 id="examples" className="mb-3 text-base font-semibold">
              Examples
            </h2>
            <ChallengeExamples signatures={challenge.signatures} examples={examples} />
            <p className="mt-3 text-sm text-muted-foreground">
              Submit also runs {hidden} more test{hidden === 1 ? "" : "s"}, covering edge cases.
            </p>
          </section>

          <section aria-labelledby="hints" className="mt-8">
            <h2 id="hints" className="mb-3 text-base font-semibold">
              Hints
            </h2>
            <ChallengeHints hints={challenge.hints} />
          </section>

          <section aria-labelledby="solution" className="mt-8">
            <h2 id="solution" className="mb-3 text-base font-semibold">
              Solution and explanation
            </h2>
            <SolutionReveal>
              <LessonMarkdown source={challenge.solution} />
            </SolutionReveal>
          </section>
        </article>

        <div className="min-w-0 lg:sticky lg:top-6 lg:h-[calc(100svh-3rem)]">
          <ChallengeLoader
            challenge={{ slug: challenge.slug, signatures: challenge.signatures, tests: challenge.tests }}
          />
        </div>
      </div>
    </PageContainer>
  );
}
