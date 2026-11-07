"use client";

import { CircleCheck, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLearnProgress } from "@/lib/learn/progress";
import { cn } from "@/lib/utils";

export function LessonStatusIcon({ lessonKey, className }: { lessonKey: string; className?: string }) {
  const { completed } = useLearnProgress();
  return completed[lessonKey] ? (
    <CircleCheck aria-label="Completed" className={cn("size-4 shrink-0 text-primary-text", className)} />
  ) : (
    <Circle aria-label="Not completed" className={cn("size-4 shrink-0 text-muted-foreground/60", className)} />
  );
}

export function CourseProgressMeter({ lessonKeys, label }: { lessonKeys: string[]; label: string }) {
  const { completed } = useLearnProgress();
  const done = lessonKeys.filter((k) => completed[k]).length;
  const total = lessonKeys.length;
  return (
    <div>
      <Progress value={done} max={total} aria-label={`${label} progress`} />
      <p className="mt-2 text-xs text-muted-foreground tabular-nums">
        {done === 0 ? `${total} lessons` : done === total ? "Completed" : `${done} of ${total} lessons done`}
      </p>
    </div>
  );
}
