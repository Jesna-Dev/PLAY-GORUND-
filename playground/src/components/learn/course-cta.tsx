"use client";

import { ArrowRight } from "lucide-react";
import { useLearnProgress } from "@/lib/learn/progress";
import { ButtonLink } from "@/components/shared/button-link";

export function CourseCta({
  lessons,
}: {
  lessons: { key: string; href: string; title: string }[];
}) {
  const { completed } = useLearnProgress();
  const next = lessons.find((l) => !completed[l.key]);
  const started = lessons.some((l) => completed[l.key]);

  const label = !next
    ? "Review the course"
    : started
      ? `Continue: ${next.title}`
      : "Start the course";
  const href = (next ?? lessons[0]).href;

  return (
    <ButtonLink size="lg" href={href} className="max-w-full">
      <span className="truncate">{label}</span>
      <ArrowRight aria-hidden="true" />
    </ButtonLink>
  );
}
