import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { CourseOutline } from "@/components/learn/course-outline";
import { ExerciseLoader } from "@/components/learn/exercise-loader";
import { LessonFooter } from "@/components/learn/lesson-footer";
import { LessonMarkdown } from "@/components/learn/lesson-markdown";
import { Quiz } from "@/components/learn/quiz";
import { allLessons, getCourses, getLessonContext } from "@/lib/learn/content";

type Params = { params: Promise<{ course: string; lesson: string }> };

export function generateStaticParams() {
  return getCourses().flatMap((course) =>
    allLessons(course).map(({ lesson }) => ({ course: course.id, lesson: lesson.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course, lesson } = await params;
  const context = getLessonContext(course, lesson);
  return context
    ? { title: `${context.lesson.title} · ${context.course.title}`, description: context.lesson.summary }
    : {};
}

export default async function LessonPage({ params }: Params) {
  const { course: courseId, lesson: slug } = await params;
  const context = getLessonContext(courseId, slug);
  if (!context) notFound();

  const { course, lesson, moduleIndex, moduleTitle, number, total, prev, next } = context;
  const { exercise } = lesson;

  return (
    <PageContainer>
      <div className="mx-auto grid max-w-6xl gap-10 xl:grid-cols-[minmax(0,1fr)_15rem]">
        <article className="min-w-0 max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link href="/learn" className="hover:text-foreground">
              Learn
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5" />
            <Link href={`/learn/${course.id}`} className="hover:text-foreground">
              {course.title}
            </Link>
          </nav>

          <header className="mt-6">
            <p className="text-sm text-muted-foreground">
              Level {moduleIndex + 1}: {moduleTitle} · Lesson {number} of {total}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{lesson.title}</h1>
            <p className="mt-2 text-pretty text-muted-foreground">{lesson.summary}</p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock aria-hidden="true" className="size-3.5" />
              {lesson.minutes} min{exercise ? " · Includes an exercise" : ""}
            </p>
          </header>

          <LessonMarkdown source={lesson.body} className="mt-8" />

          {exercise && (
            <section aria-labelledby="exercise-heading" className="mt-12">
              <h2 id="exercise-heading" className="text-xl font-semibold tracking-tight">
                Your turn
              </h2>
              <LessonMarkdown source={exercise.prompt} className="mt-3 mb-5" />
              <ExerciseLoader
                lessonKey={lesson.key}
                exercise={{
                  language: exercise.language,
                  starter: exercise.starter,
                  solution: exercise.solution,
                  tests: exercise.tests,
                  fixture: exercise.fixture,
                  expectedOutput: exercise.expectedOutput,
                  hints: exercise.hints,
                }}
              />
            </section>
          )}

          <section aria-labelledby="quiz-heading" className="mt-12">
            <h2 id="quiz-heading" className="text-xl font-semibold tracking-tight">
              Check your understanding
            </h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">Pick an answer to see if you’re right.</p>
            <Quiz lessonKey={lesson.key} questions={lesson.quiz} />
          </section>

          <LessonFooter
            lessonKey={lesson.key}
            prev={prev}
            next={next}
            course={{ href: `/learn/${course.id}`, title: course.title }}
          />
        </article>

        <aside aria-label="Course contents" className="hidden xl:block">
          <div className="sticky top-8">
            <CourseOutline course={course} currentKey={lesson.key} />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
