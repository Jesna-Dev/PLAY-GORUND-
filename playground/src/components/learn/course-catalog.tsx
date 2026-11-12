"use client";

import Link from "next/link";
import { ArrowRight, Clock, Code2, Layers, Palette } from "lucide-react";
import { languages, type LanguageId } from "@/lib/languages";
import { useLearnProgress } from "@/lib/learn/progress";
import { cn } from "@/lib/utils";

export type CatalogCourse = {
  id: LanguageId;
  title: string;
  tagline: string;
  description: string;
  category: "programming" | "design";
  minutes: number;
  hasExercises: boolean;
  levels: { title: string; lessons: { key: string; title: string; href: string }[] }[];
};

type Status = "new" | "started" | "done";

const STATUS_TEXT: Record<Status, string> = { new: "Not started", started: "In progress", done: "Completed" };
const STATUS_DOT: Record<Status, string> = { new: "bg-muted-foreground/50", started: "bg-chart-3", done: "bg-primary" };

function summarize(course: CatalogCourse, completed: Record<string, unknown>) {
  const levels = course.levels.map((level) => ({
    title: level.title,
    total: level.lessons.length,
    done: level.lessons.filter((l) => completed[l.key]).length,
  }));
  const lessons = course.levels.flatMap((l) => l.lessons);
  const done = lessons.filter((l) => completed[l.key]).length;
  const next = lessons.find((l) => !completed[l.key]) ?? null;
  const status: Status = done === 0 ? "new" : done === lessons.length ? "done" : "started";
  return { levels, total: lessons.length, done, next, status };
}

type Summary = ReturnType<typeof summarize>;

/** Decorative course artwork in the language's colour. The title is always written beside it. */
function CourseArt({ language, className }: { language: LanguageId; className?: string }) {
  const { monogram, color } = languages[language];
  return (
    <span
      aria-hidden="true"
      style={{ "--lang": color } as React.CSSProperties}
      className={cn(
        "relative isolate flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color-mix(in_oklch,var(--lang)_22%,var(--card))] font-mono font-semibold text-foreground ring-1 ring-[color-mix(in_oklch,var(--lang)_35%,transparent)] ring-inset",
        className,
      )}
    >
      <span className="absolute -right-[30%] -bottom-[35%] -z-10 size-[95%] rounded-[38%] bg-[color-mix(in_oklch,var(--lang)_60%,transparent)]" />
      <span className="absolute -bottom-[45%] -left-[25%] -z-10 size-[85%] rounded-[38%] bg-[color-mix(in_oklch,var(--lang)_35%,transparent)]" />
      {monogram}
    </span>
  );
}

function StatusLabel({ status }: { status: Status }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span aria-hidden="true" className={cn("size-2 rounded-full", STATUS_DOT[status])} />
      {STATUS_TEXT[status]}
    </span>
  );
}

/** Four steps joined by a line: filled when a level is finished, outlined while it's in progress. */
function LevelSteps({ levels }: { levels: Summary["levels"] }) {
  const current = levels.findIndex((l) => l.done < l.total);
  return (
    <ol className="flex items-center">
      {levels.map((level, i) => {
        const finished = level.done === level.total;
        const isCurrent = i === current;
        return (
          <li key={level.title} className="flex items-center not-last:flex-1">
            <span
              title={`${level.title}: ${level.done} of ${level.total}`}
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium tabular-nums",
                finished
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "bg-card text-foreground ring-2 ring-primary"
                    : "bg-muted text-muted-foreground",
              )}
            >
              <span aria-hidden="true">{level.title[0]}</span>
              <span className="sr-only">
                {level.title}: {level.done} of {level.total} lessons
              </span>
            </span>
            {i < levels.length - 1 && (
              <span aria-hidden="true" className={cn("mx-1 h-0.5 flex-1 rounded-full", finished ? "bg-primary" : "bg-muted")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** One short bar per level, so you can see which level you're up to at a glance. */
function LevelBars({ levels, label }: { levels: Summary["levels"]; label: string }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${label}: ${levels.map((l) => `${l.title} ${l.done} of ${l.total}`).join(", ")}`}>
      {levels.map((level) => (
        <span key={level.title} className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-primary"
            style={{ width: `${level.total ? (level.done / level.total) * 100 : 0}%` }}
          />
        </span>
      ))}
    </div>
  );
}

function Meta({ course, total }: { course: CatalogCourse; total: number }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Layers aria-hidden="true" className="size-3" />
        {total} lessons
      </span>
      <span className="flex items-center gap-1">
        <Clock aria-hidden="true" className="size-3" />
        {course.minutes} min
      </span>
    </p>
  );
}

function FeaturedCard({ course, summary }: { course: CatalogCourse; summary: Summary }) {
  return (
    <li className="flex flex-col rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
      <div className="flex gap-4">
        <CourseArt language={course.id} className="size-16 text-lg sm:size-28 sm:text-2xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Meta course={course} total={summary.total} />
            <StatusLabel status={summary.status} />
          </div>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight sm:text-xl">
            <Link href={`/learn/${course.id}`} className="rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
              {course.title}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-pretty text-muted-foreground max-sm:hidden">{course.description}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-pretty text-muted-foreground sm:hidden">{course.description}</p>

      <div className="mt-4 grid gap-4 rounded-xl bg-background/60 p-3 ring-1 ring-foreground/5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <p className="flex justify-between text-xs text-muted-foreground">
            <span>Course progress</span>
            <span className="tabular-nums">
              {summary.done} of {summary.total}
            </span>
          </p>
          <div className="mt-2">
            <LevelSteps levels={summary.levels} />
          </div>
        </div>
        {summary.next ? (
          <Link
            href={summary.next.href}
            className="group flex min-w-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 sm:max-w-56"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-normal opacity-80">{summary.status === "new" ? "Start with" : "Next lesson"}</span>
              <span className="block truncate">{summary.next.title}</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link
            href={`/learn/${course.id}`}
            className="rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-foreground/15 outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Review course
          </Link>
        )}
      </div>
    </li>
  );
}

function CourseCard({ course, summary }: { course: CatalogCourse; summary: Summary }) {
  return (
    <li>
      <Link
        href={`/learn/${course.id}`}
        className={cn(
          "flex h-full flex-col rounded-2xl bg-card p-3.5 ring-1 outline-none transition-[background-color,box-shadow] hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50",
          summary.status === "started" ? "ring-primary/30 hover:ring-primary/50" : "ring-foreground/10 hover:ring-foreground/20",
        )}
      >
        <div className="flex items-start gap-3">
          <CourseArt language={course.id} className="size-11 text-sm" />
          <div className="min-w-0">
            <Meta course={course} total={summary.total} />
            <h3 className="mt-1 truncate font-medium">{course.title}</h3>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <StatusLabel status={summary.status} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {course.category === "design" ? (
              <Palette aria-hidden="true" className="size-3.5" />
            ) : (
              <Code2 aria-hidden="true" className="size-3.5" />
            )}
            {course.category === "design" ? "Design" : "Code"}
          </span>
        </div>
        <div className="mt-3 rounded-xl bg-background/60 p-2.5 ring-1 ring-foreground/5">
          <p className="mb-2 flex justify-between text-[11px] text-muted-foreground">
            <span>Progress by level</span>
            <span className="tabular-nums">
              {summary.done}/{summary.total}
            </span>
          </p>
          <LevelBars levels={summary.levels} label={`${course.title} progress`} />
        </div>
      </Link>
    </li>
  );
}

export function CourseCatalog({ courses }: { courses: CatalogCourse[] }) {
  const { completed } = useLearnProgress();
  const items = courses.map((course) => ({ course, summary: summarize(course, completed) }));

  const started = items.filter((i) => i.summary.status === "started");
  // Courses you're partway through come first. With nothing started, suggest where to begin.
  const featured = (started.length > 0 ? started : items.filter((i) => i.summary.status === "new")).slice(0, 2);
  const featuredTitle = started.length > 0 ? "Continue learning" : "Start here";

  return (
    <>
      {featured.length > 0 && (
        <section aria-labelledby="featured-courses" className="mt-6">
          <h2 id="featured-courses" className="text-base font-medium">
            {featuredTitle}
          </h2>
          <ul className="mt-3 grid gap-3 lg:grid-cols-2">
            {featured.map((item) => (
              <FeaturedCard key={item.course.id} {...item} />
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="all-courses" className="mt-8">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <h2 id="all-courses" className="text-base font-medium">
            All courses
          </h2>
          <p className="text-xs text-pretty text-muted-foreground">Every course has Babies, Intermediate, Experienced and Pro levels</p>
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <CourseCard key={item.course.id} {...item} />
          ))}
        </ul>
      </section>
    </>
  );
}
