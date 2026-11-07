import type { LearnProgress } from "./progress";
import type { CourseSummary, LessonSummary } from "./types";

export function courseProgress(course: CourseSummary, progress: LearnProgress) {
  const done = course.lessons.filter((l) => progress.completed[l.key]).length;
  return { done, total: course.lessons.length };
}

/**
 * Where to pick up: the next unfinished lesson in the course opened last,
 * then courses already started, then the first course not started.
 */
export function findNextLesson(
  courses: CourseSummary[],
  progress: LearnProgress,
): { course: CourseSummary; lesson: LessonSummary } | null {
  const started = (c: CourseSummary) => c.lessons.some((l) => progress.completed[l.key]);
  const lastCourse = courses.find((c) => c.lessons.some((l) => l.key === progress.last));
  const ordered = [
    ...(lastCourse ? [lastCourse] : []),
    ...courses.filter((c) => c !== lastCourse && started(c)),
    ...courses.filter((c) => c !== lastCourse && !started(c)),
  ];

  for (const course of ordered) {
    const from = Math.max(0, course.lessons.findIndex((l) => l.key === progress.last));
    const lesson =
      course.lessons.slice(from).find((l) => !progress.completed[l.key]) ??
      course.lessons.find((l) => !progress.completed[l.key]);
    if (lesson) return { course, lesson };
  }
  return null;
}
