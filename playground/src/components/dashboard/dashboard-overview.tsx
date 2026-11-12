"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CircleCheck,
  MessageCircleQuestion,
  Sparkles,
  SquareCheckBig,
  SquareTerminal,
  Target,
} from "lucide-react";
import { useDailyChallenge } from "@/components/challenges/daily-challenge";
import { ButtonLink } from "@/components/shared/button-link";
import { useCurrentUser } from "@/lib/auth-client";
import { LanguageMark } from "@/components/shared/language-mark";
import { Progress } from "@/components/ui/progress";
import { levelTitle } from "@/lib/challenges/levels";
import type { ChallengeSummary } from "@/lib/challenges/types";
import { findNextLesson } from "@/lib/learn/next-lesson";
import { type LearnProgress, useLearnProgress } from "@/lib/learn/progress";
import type { CourseSummary } from "@/lib/learn/types";
import { cn } from "@/lib/utils";

const card = "rounded-2xl bg-card ring-1 ring-foreground/10";

const SHORTCUTS = [
  { title: "Interview practice", detail: "Questions with answers", href: "/interview", icon: BriefcaseBusiness },
  { title: "AI Tutor", detail: "Ask anything you’re stuck on", href: "/tutor", icon: Sparkles },
  { title: "Playground", detail: "Try code freely", href: "/playground", icon: SquareTerminal },
];

function stats(courses: CourseSummary[], challenges: ChallengeSummary[], state: LearnProgress) {
  const lessons = courses.flatMap((c) => c.lessons);
  const exercises = lessons.filter((l) => l.hasExercise);
  const questions = lessons.flatMap((l) => l.quiz.map((q) => ({ ...q, chosen: state.answers[l.key]?.[q.id] })));
  const answered = questions.filter((q) => q.chosen !== undefined);
  return {
    lessons: lessons.length,
    done: lessons.filter((l) => state.completed[l.key]).length,
    exercises: exercises.length,
    solvedExercises: exercises.filter((l) => state.passed[l.key]).length,
    solvedChallenges: challenges.filter((c) => state.challenges[c.slug]).length,
    answered: answered.length,
    correct: answered.filter((q) => q.chosen === q.answer).length,
    perCourse: courses.map((course) => ({
      course,
      finished: course.lessons.filter((l) => state.completed[l.key]).length,
      total: course.lessons.length,
    })),
  };
}

/** One number, one bar, one plain sentence. */
function Stat({
  label,
  icon: Icon,
  href,
  value,
  max,
  display,
  caption,
}: {
  label: string;
  icon: typeof BookOpen;
  href: string;
  value: number;
  max: number;
  display: React.ReactNode;
  caption: string;
}) {
  return (
    <Link
      href={href}
      className={cn(card, "flex flex-col p-4 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50")}
    >
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon aria-hidden="true" className="size-4" />
        {label}
      </span>
      <span className="mt-2 text-2xl font-medium tracking-tight tabular-nums">{display}</span>
      <Progress className="mt-3" value={value} max={Math.max(1, max)} aria-label={label} />
      <span className="mt-2 text-xs text-muted-foreground">{caption}</span>
    </Link>
  );
}

function Of({ value, total }: { value: number; total: number }) {
  return (
    <>
      {value}
      <span className="ml-1 text-sm font-normal tracking-normal text-muted-foreground">/ {total}</span>
    </>
  );
}

export function DashboardOverview({
  courses,
  challenges,
}: {
  courses: CourseSummary[];
  challenges: ChallengeSummary[];
}) {
  const state = useLearnProgress();
  const user = useCurrentUser();
  const s = stats(courses, challenges, state);
  const next = findNextLesson(courses, state);
  const daily = useDailyChallenge(challenges);
  const accuracy = s.answered ? Math.round((s.correct / s.answered) * 100) : null;

  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="@container grid min-w-0 content-start gap-3">
        {/* Welcome: where you are and the one thing to do next. */}
        <section
          aria-label="Welcome"
          className={cn(
            card,
            "bg-[radial-gradient(ellipse_50%_120%_at_100%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)] p-5 sm:p-6",
          )}
        >
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{user ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome to Codly"}</h1>
          <p className="mt-1.5 max-w-xl text-pretty text-muted-foreground">
            {s.done === 0
              ? "You haven’t started a lesson yet. The first one takes just a few minutes."
              : `You’ve completed ${s.done} of ${s.lessons} lessons. Keep going.`}
          </p>
          {next ? (
            <div className="mt-5 flex flex-col gap-3 @lg:flex-row @lg:items-center">
              <ButtonLink href={next.lesson.href} size="lg" className="self-start">
                {s.done > 0 ? "Continue learning" : "Start your first lesson"}
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <p className="text-sm text-muted-foreground">
                Next: <span className="text-foreground">{next.lesson.title}</span> · {next.course.title} · {next.lesson.minutes} min
              </p>
            </div>
          ) : (
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-primary-text">
              <CircleCheck aria-hidden="true" className="size-4" /> You’ve finished every lesson.
            </p>
          )}
        </section>

        {/* Your numbers */}
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
          <Stat
            label="Lessons"
            icon={BookOpen}
            href="/learn"
            value={s.done}
            max={s.lessons}
            display={<Of value={s.done} total={s.lessons} />}
            caption={`${s.lessons - s.done} left to learn`}
          />
          <Stat
            label="Exercises"
            icon={SquareCheckBig}
            href="/learn"
            value={s.solvedExercises}
            max={s.exercises}
            display={<Of value={s.solvedExercises} total={s.exercises} />}
            caption="Coding tasks in lessons"
          />
          <Stat
            label="Challenges"
            icon={Target}
            href="/challenges"
            value={s.solvedChallenges}
            max={challenges.length}
            display={<Of value={s.solvedChallenges} total={challenges.length} />}
            caption="Practice problems solved"
          />
          <Stat
            label="Quiz score"
            icon={MessageCircleQuestion}
            href="/learn"
            value={accuracy ?? 0}
            max={100}
            display={accuracy === null ? "–" : `${accuracy}%`}
            caption={s.answered ? `${s.correct} of ${s.answered} answers right` : "No quiz answers yet"}
          />
        </div>

        {/* Other places to practise */}
        <ul className="grid gap-3 @xl:grid-cols-3">
          {SHORTCUTS.map(({ title, detail, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(card, "flex h-full items-center gap-3 p-4 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50")}
              >
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary-text">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{title}</span>
                  <span className="block text-xs text-muted-foreground">{detail}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Up next and course progress */}
      <section aria-labelledby="up-next" className={cn(card, "flex flex-col p-4 sm:p-5 lg:row-span-2")}>
        <h2 id="up-next" className="text-sm font-medium">
          Today
        </h2>
        <ul className="mt-3 space-y-2">
          {next && (
            <li>
              <Link
                href={next.lesson.href}
                className="-mx-2 flex items-center gap-3 rounded-xl p-2 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <LanguageMark language={next.course.id} className="size-9" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{next.lesson.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    Lesson · {next.lesson.minutes} min
                  </span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          )}
          {daily && (
            <li>
              <Link
                href={daily.href}
                className="-mx-2 flex items-center gap-3 rounded-xl p-2 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Target className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{daily.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    Daily challenge · {levelTitle(daily.difficulty)} · {daily.minutes} min
                  </span>
                </span>
                {state.challenges[daily.slug] ? (
                  <CircleCheck aria-label="Solved" className="size-4 shrink-0 text-primary-text" />
                ) : (
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                )}
              </Link>
            </li>
          )}
        </ul>

        <div className="mt-5 flex items-baseline justify-between border-t pt-5">
          <h2 className="text-sm font-medium">Your courses</h2>
          <Link href="/learn" className="rounded-sm text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
            See all
          </Link>
        </div>
        <ul className="mt-3 space-y-3.5">
          {s.perCourse.map(({ course, finished, total }) => (
            <li key={course.id}>
              <Link href={course.href} className="group block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <span className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate group-hover:underline">{course.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {finished === total ? "Done" : `${finished}/${total}`}
                  </span>
                </span>
                <Progress className="mt-1.5" value={finished} max={total} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
