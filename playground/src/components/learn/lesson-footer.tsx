"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { progress, useLearnProgress } from "@/lib/learn/progress";

type LessonLink = { href: string; title: string } | null;

export function LessonFooter({
  lessonKey,
  prev,
  next,
  course,
}: {
  lessonKey: string;
  prev: LessonLink;
  next: LessonLink;
  course: { href: string; title: string };
}) {
  const router = useRouter();
  const done = Boolean(useLearnProgress().completed[lessonKey]);

  // Remember where the learner is, for "Continue learning".
  useEffect(() => progress.setLast(lessonKey), [lessonKey]);

  return (
    <div className="mt-12 border-t pt-6">
      {done ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="flex items-center gap-2 font-medium text-primary-text">
            <CircleCheck aria-hidden="true" className="size-5" />
            Lesson complete
          </p>
          <button
            type="button"
            onClick={() => progress.setCompleted(lessonKey, false)}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Mark as not complete
          </button>
        </div>
      ) : (
        <Button
          size="lg"
          onClick={() => {
            progress.setCompleted(lessonKey, true);
            if (next) router.push(next.href);
          }}
        >
          {next ? "Complete and continue" : "Complete the course"}
          {next && <ArrowRight aria-hidden="true" />}
        </Button>
      )}

      <nav aria-label="Lessons" className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={prev.href} className="group rounded-xl p-4 ring-1 ring-foreground/10 transition-colors hover:bg-accent">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft aria-hidden="true" className="size-3" /> Previous
            </span>
            <span className="mt-1 block font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={next?.href ?? course.href}
          className="rounded-xl p-4 text-right ring-1 ring-foreground/10 transition-colors hover:bg-accent"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            {next ? "Next" : "Back to"} <ArrowRight aria-hidden="true" className="size-3" />
          </span>
          <span className="mt-1 block font-medium">{next ? next.title : course.title}</span>
        </Link>
      </nav>
    </div>
  );
}
