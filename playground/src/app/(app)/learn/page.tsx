import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { CourseProgressMeter } from "@/components/learn/lesson-status";
import { LanguageMark } from "@/components/shared/language-mark";
import { allLessons, getCourses } from "@/lib/learn/content";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  const groups = [
    { id: "programming", title: "Web and programming" },
    { id: "design", title: "Design" },
  ].map((group) => ({
    ...group,
    courses: getCourses().filter((c) => c.category === group.id),
  }));

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Learn
        </h1>
        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
          Short lessons where you write real code, check it, and see straight
          away what you got right.
        </p>

        {groups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`group-${group.id}`}
            className="mt-8"
          >
            <h2 id={`group-${group.id}`} className="text-base font-medium">
              {group.title}
            </h2>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.courses.map((course) => {
                const lessons = allLessons(course);
                const minutes = lessons.reduce(
                  (sum, l) => sum + l.lesson.minutes,
                  0,
                );
                const hasExercises = lessons.some((l) => l.lesson.exercise);
                return (
                  <li key={course.id}>
                    <Link
                      href={`/learn/${course.id}`}
                      className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 outline-none transition-[background-color,box-shadow] hover:bg-accent hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <div className="flex items-start gap-3">
                        <LanguageMark
                          language={course.id}
                          className="size-10"
                        />
                        <div className="min-w-0">
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
                            {course.tagline}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground">
                        About {minutes} min ·{" "}
                        {hasExercises
                          ? "Coding exercises and quizzes"
                          : "Reading and quizzes"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {course.audience}
                      </p>
                      <div className="mt-auto pt-4">
                        <CourseProgressMeter
                          lessonKeys={lessons.map((l) => l.lesson.key)}
                          label={course.title}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
