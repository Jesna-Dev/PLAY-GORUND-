import Link from "next/link";
import { lessonHref } from "@/lib/learn/content";
import type { Course } from "@/lib/learn/types";
import { cn } from "@/lib/utils";
import { LessonStatusIcon } from "./lesson-status";

export function CourseOutline({ course, currentKey }: { course: Course; currentKey: string }) {
  return (
    <nav aria-label={`${course.title} lessons`} className="text-sm">
      <Link href={`/learn/${course.id}`} className="font-medium hover:underline">
        {course.title}
      </Link>
      {course.modules.map((module) => (
        <div key={module.title} className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">{module.title}</p>
          <ul className="mt-1.5 space-y-0.5">
            {module.lessons.map((lesson) => {
              const current = lesson.key === currentKey;
              return (
                <li key={lesson.key}>
                  <Link
                    href={lessonHref(course.id, lesson.slug)}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent",
                      current && "bg-accent font-medium",
                    )}
                  >
                    <LessonStatusIcon lessonKey={lesson.key} className="mt-0.5" />
                    {lesson.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
