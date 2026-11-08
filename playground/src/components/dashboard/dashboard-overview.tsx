"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CircleCheck,
  ListChecks,
  MessageCircleQuestion,
  SquareCheckBig,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useDailyChallenge } from "@/components/challenges/daily-challenge";
import { LanguageMark } from "@/components/shared/language-mark";
import { levelTitle } from "@/lib/challenges/levels";
import type { ChallengeSummary } from "@/lib/challenges/types";
import { findNextLesson } from "@/lib/learn/next-lesson";
import { type LearnProgress, useLearnProgress } from "@/lib/learn/progress";
import type { CourseSummary } from "@/lib/learn/types";
import { cn } from "@/lib/utils";
import { Gauge } from "./gauge";
import { TickBar } from "./tick-bar";

const noop = () => () => {};

function percent(value: number, max: number) {
  return max > 0 ? (value / max) * 100 : 0;
}

function BigNumber({ value, suffix = "%", label }: { value: number | null; suffix?: string; label?: string }) {
  const text =
    value === null
      ? "–"
      : new Intl.NumberFormat(undefined, { maximumFractionDigits: 1, minimumFractionDigits: Number.isInteger(value) ? 0 : 1 }).format(value);
  return (
    <p className="text-2xl font-medium tracking-tight tabular-nums" aria-label={label}>
      {text}
      {value !== null && <span className="ml-0.5 text-xs font-normal text-muted-foreground">{suffix}</span>}
    </p>
  );
}

function SubStat({ value, label, align = "left" }: { value: React.ReactNode; label: string; align?: "left" | "right" }) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  href,
  className,
  children,
}: {
  title: string;
  icon: typeof BookOpen;
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className={cn("flex flex-col rounded-2xl bg-card p-3 ring-1 ring-foreground/10 sm:p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            aria-label={`Open ${title.toLowerCase()}`}
            className="-m-1.5 rounded-lg p-1.5 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function stats(courses: CourseSummary[], challenges: ChallengeSummary[], state: LearnProgress) {
  const lessons = courses.flatMap((c) => c.lessons);
  const done = lessons.filter((l) => state.completed[l.key]).length;
  const exercises = lessons.filter((l) => l.hasExercise);
  const solvedExercises = exercises.filter((l) => state.passed[l.key]).length;
  const solvedChallenges = challenges.filter((c) => state.challenges[c.slug]).length;
  const perCourse = courses.map((course) => {
    const finished = course.lessons.filter((l) => state.completed[l.key]).length;
    return { course, finished, total: course.lessons.length };
  });
  const questions = lessons.flatMap((l) => l.quiz.map((q) => ({ ...q, chosen: state.answers[l.key]?.[q.id] })));
  const answered = questions.filter((q) => q.chosen !== undefined);
  const correct = answered.filter((q) => q.chosen === q.answer).length;
  const perfectLessons = lessons.filter(
    (l) => l.quiz.length > 0 && l.quiz.every((q) => state.answers[l.key]?.[q.id] === q.answer),
  ).length;

  return {
    lessons: lessons.length,
    done,
    exercises: exercises.length,
    solvedExercises,
    solvedChallenges,
    perCourse,
    started: perCourse.filter((p) => p.finished > 0).length,
    finishedCourses: perCourse.filter((p) => p.finished === p.total).length,
    averageCourse: perCourse.reduce((sum, p) => sum + percent(p.finished, p.total), 0) / Math.max(1, perCourse.length),
    questions: questions.length,
    answered: answered.length,
    correct,
    perfectLessons,
  };
}

export function DashboardOverview({
  name,
  courses,
  challenges,
}: {
  name: string;
  courses: CourseSummary[];
  challenges: ChallengeSummary[];
}) {
  const state = useLearnProgress();
  const s = stats(courses, challenges, state);
  const next = findNextLesson(courses, state);
  const daily = useDailyChallenge(challenges);
  const today = useSyncExternalStore(
    noop,
    () => new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
    () => null,
  );

  const insight =
    s.done === 0 && s.solvedChallenges === 0 ? (
      next ? (
        <>
          Start with <strong>{next.lesson.title}</strong>. It takes about {next.lesson.minutes} minutes.
        </>
      ) : null
    ) : (
      <>
        So far you’ve completed <strong>{s.done} lesson{s.done === 1 ? "" : "s"}</strong> and solved{" "}
        <strong>
          {s.solvedChallenges} challenge{s.solvedChallenges === 1 ? "" : "s"}
        </strong>
        .
      </>
    );

  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid min-w-0 gap-3">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-card bg-[radial-gradient(ellipse_60%_120%_at_85%_0%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent)] p-5 ring-1 ring-foreground/10 sm:p-7">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
            <div className="flex min-w-0 flex-col">
              <p className="font-mono text-lg font-bold tracking-[0.35em] text-primary-text">CODLY</p>
              <p className="mt-auto pt-10 text-sm text-muted-foreground">— Welcome back, {name}</p>
              <h1 className="mt-1 text-3xl font-medium tracking-tight sm:text-4xl">Dashboard Overview</h1>
            </div>

            <div className="relative">
              {/* Two cards stacked behind the insight, as in a deck. */}
              <div aria-hidden="true" className="absolute inset-y-3 right-0 hidden w-[85%] translate-x-6 rounded-2xl bg-[color-mix(in_oklch,var(--primary)_14%,var(--card))] ring-1 ring-foreground/5 md:block" />
              <div aria-hidden="true" className="absolute inset-y-1.5 right-0 hidden w-[92%] translate-x-3 rounded-2xl bg-[color-mix(in_oklch,var(--primary)_26%,var(--card))] ring-1 ring-foreground/5 md:block" />
              <div className="relative rounded-2xl bg-[linear-gradient(155deg,color-mix(in_oklch,var(--primary)_35%,white),color-mix(in_oklch,var(--primary)_70%,white))] p-4 text-neutral-950 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <Zap aria-hidden="true" className="size-4" />
                    Your insight
                  </p>
                  {next && (
                    <Link
                      href={next.lesson.href}
                      aria-label={`Open ${next.lesson.title}`}
                      className="-m-1 rounded-md p-1 outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black"
                    >
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                  )}
                </div>
                <p className="mt-6 text-[15px] leading-snug">{insight ?? "You’ve finished every lesson. Time for the challenges."}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 md:justify-end">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground" aria-hidden="true">
              <CalendarDays className="size-4" />
            </span>
            <span className="rounded-xl bg-background/60 px-3 py-2 text-sm ring-1 ring-foreground/10 tabular-nums">
              {today ?? "Today"}
            </span>
            {next && (
              <Link
                href={next.lesson.href}
                className="rounded-xl bg-background/60 px-3 py-2 text-sm ring-1 ring-foreground/10 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {s.done > 0 ? "Continue" : "Start"}: {next.lesson.title}
              </Link>
            )}
          </div>
        </section>

        {/* Three stats */}
        <div className="grid gap-3 md:grid-cols-3">
          <Panel title="Lessons completed" icon={BookOpen} href="/learn">
            <div className="mt-3">
              <BigNumber value={percent(s.done, s.lessons)} label={`${Math.round(percent(s.done, s.lessons))} percent of lessons completed`} />
            </div>
            <div className="mt-auto flex items-end justify-between pt-3">
              <SubStat value={s.done} label="Completed" />
              <SubStat value={s.lessons} label="Total lessons" align="right" />
            </div>
            <TickBar className="mt-2" value={s.done} max={s.lessons} label="Lessons completed" />
          </Panel>

          <Panel title="Exercises solved" icon={SquareCheckBig} href="/learn">
            <div className="mt-3 flex items-start justify-between">
              <SubStat value={s.solvedExercises} label="Solved" />
              <SubStat value={s.exercises - s.solvedExercises} label="To go" align="right" />
            </div>
            <div className="relative mx-auto mt-1 w-full max-w-28">
              <Gauge value={s.solvedExercises} max={s.exercises} />
              <div className="absolute inset-x-0 bottom-0 text-center">
                <BigNumber value={percent(s.solvedExercises, s.exercises)} label={`${Math.round(percent(s.solvedExercises, s.exercises))} percent of exercises solved`} />
              </div>
            </div>
          </Panel>

          <Panel title="Challenges solved" icon={Target} href="/challenges">
            <div className="mt-3">
              <BigNumber value={percent(s.solvedChallenges, challenges.length)} label={`${Math.round(percent(s.solvedChallenges, challenges.length))} percent of challenges solved`} />
            </div>
            <div className="mt-auto flex items-end justify-between pt-3">
              <SubStat value={s.solvedChallenges} label="Solved" />
              <SubStat value={challenges.length} label="Total" align="right" />
            </div>
            <TickBar className="mt-2" value={s.solvedChallenges} max={challenges.length} label="Challenges solved" />
          </Panel>
        </div>

        {/* Two wide stats */}
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Course progress" icon={TrendingUp} href="/learn">
            <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <div className="space-y-2">
                <SubStat value={s.started} label="Started" />
                <SubStat value={s.finishedCourses} label="Finished" />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Average across courses</p>
                <BigNumber value={s.averageCourse} />
              </div>
              <div className="space-y-2">
                <SubStat value={s.lessons - s.done} label="Lessons left" align="right" />
                <SubStat value={courses.length} label="Courses" align="right" />
              </div>
            </div>
          </Panel>

          <Panel title="Quiz accuracy" icon={MessageCircleQuestion} href="/learn">
            <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <div className="space-y-2">
                <SubStat value={s.answered} label="Answered" />
                <SubStat value={s.correct} label="Correct" />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Answers that are right</p>
                <BigNumber value={s.answered ? percent(s.correct, s.answered) : null} />
              </div>
              <div className="space-y-2">
                <SubStat value={`${s.answered}/${s.questions}`} label="Questions" align="right" />
                <SubStat value={s.perfectLessons} label="Perfect lessons" align="right" />
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Up next: same shape as the reference's assistant panel. */}
      <Panel title="Up next" icon={ListChecks} href="/learn" className="lg:row-span-1">
        <div className="mt-4 space-y-5">
          {next ? (
            <div className="flex gap-3">
              <LanguageMark language={next.course.id} className="size-9 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium">{next.course.title}</p>
                  <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    Lesson {next.lesson.number} of {next.course.lessons.length}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {next.lesson.title} · {next.lesson.minutes} min
                </p>
                <Link
                  href={next.lesson.href}
                  className="mt-2 inline-flex rounded-lg bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary-text ring-1 ring-primary/30 outline-none hover:bg-primary/20 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {s.done > 0 ? "Resume lesson" : "Start lesson"}
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">You’ve completed every lesson.</p>
          )}

          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">
              <Target className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium">Today’s challenge</p>
                {daily && <p className="shrink-0 text-xs text-muted-foreground">{levelTitle(daily.difficulty)}</p>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{daily ? `${daily.title} · ${daily.minutes} min` : "Loading…"}</p>
              {daily &&
                (state.challenges[daily.slug] ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary-text">
                    <CircleCheck aria-hidden="true" className="size-3.5" /> Solved today’s pick
                  </p>
                ) : (
                  <Link
                    href={daily.href}
                    className="mt-2 inline-flex rounded-lg bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary-text ring-1 ring-primary/30 outline-none hover:bg-primary/20 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    Solve it
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-5">
          <p className="text-sm font-medium">Progress by course:</p>
          <ul className="mt-3 space-y-2.5">
            {s.perCourse.map(({ course, finished, total }) => (
              <li key={course.id}>
                <Link href={course.href} className="flex items-center gap-2 rounded-md text-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      next?.course.id === course.id ? "bg-progress" : "bg-muted-foreground/60",
                    )}
                  />
                  <span className="flex-1 truncate">{course.title}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {finished}/{total}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <TickBar className="mt-5" value={s.done} max={s.lessons} label="All lessons completed" />
        </div>
      </Panel>
    </div>
  );
}
