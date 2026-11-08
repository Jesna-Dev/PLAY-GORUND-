import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { CourseCta } from "@/components/learn/course-cta";
import { LessonStatusIcon } from "@/components/learn/lesson-status";
import { LanguageMark } from "@/components/shared/language-mark";
import { courseIndex } from "@/content/learn/courses";
import { allLessons, getCourse, lessonHref } from "@/lib/learn/content";

type Params = { params: Promise<{ course: string }> };

export function generateStaticParams() {
  return courseIndex.map((course) => ({ course: course.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const course = getCourse((await params).course);
  return course ? { title: course.title, description: course.description } : {};
}

export default async function CoursePage({ params }: Params) {
  const course = getCourse((await params).course);
  if (!course) notFound();

  const lessons = allLessons(course);
  const minutes = lessons.reduce((sum, l) => sum + l.lesson.minutes, 0);
  const hasExercises = lessons.some((l) => l.lesson.exercise);
  // Lesson numbers run on across modules.
  const firstNumber = course.modules.map((_, i) =>
    course.modules.slice(0, i).reduce((sum, m) => sum + m.lessons.length, 1),
  );

  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/learn" className="hover:text-foreground">
            Learn
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <span aria-current="page" className="text-foreground">
            {course.title}
          </span>
        </nav>

        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
          <LanguageMark language={course.id} className="size-14 rounded-xl text-base" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{course.title}</h1>
            <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">{course.description}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {lessons.length} lessons · about {minutes} min · {course.audience}
            </p>
            <div className="mt-5">
              <CourseCta
                lessons={lessons.map(({ lesson }) => ({
                  key: lesson.key,
                  href: lessonHref(course.id, lesson.slug),
                  title: lesson.title,
                }))}
              />
            </div>
          </div>
        </header>

        <section aria-labelledby="outcomes" className="mt-10">
          <h2 id="outcomes" className="text-base font-medium">
            What you’ll learn
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2.5 text-sm">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary-text" />
                {outcome}
              </li>
            ))}
          </ul>
          {!hasExercises && (
            <p className="mt-4 text-sm text-muted-foreground">
              This course has reading and quizzes for now. Coding exercises for it are coming later.
            </p>
          )}
        </section>

        {course.modules.map((module, moduleIndex) => (
          <section key={module.title} aria-labelledby={`module-${moduleIndex}`} className="mt-10">
            <h2 id={`module-${moduleIndex}`} className="text-base font-medium">
              <span className="text-muted-foreground">Level {moduleIndex + 1}:</span> {module.title}
            </h2>
            <ol className="mt-3 divide-y overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
              {module.lessons.map((lesson, lessonIndex) => {
                const number = firstNumber[moduleIndex] + lessonIndex;
                return (
                  <li key={lesson.key}>
                    <Link
                      href={lessonHref(course.id, lesson.slug)}
                      className="flex items-start gap-3 px-4 py-3.5 outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
                    >
                      <LessonStatusIcon lessonKey={lesson.key} className="mt-0.5" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">
                          {number}. {lesson.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-pretty text-muted-foreground">{lesson.summary}</span>
                      </span>
                      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                        {lesson.minutes} min{lesson.exercise ? " · Exercise" : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
