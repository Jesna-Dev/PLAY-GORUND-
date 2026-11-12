import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import type { CatalogCourse } from "@/components/learn/course-catalog";
import { CourseCatalogLoader } from "@/components/learn/course-catalog-loader";
import { getCourses, lessonHref } from "@/lib/learn/content";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  const courses: CatalogCourse[] = getCourses().map((course) => {
    const lessons = course.modules.flatMap((m) => m.lessons);
    return {
      id: course.id,
      title: course.title,
      tagline: course.tagline,
      description: course.description,
      category: course.category,
      minutes: lessons.reduce((sum, l) => sum + l.minutes, 0),
      hasExercises: lessons.some((l) => l.exercise),
      levels: course.modules.map((m) => ({
        title: m.title,
        lessons: m.lessons.map((l) => ({ key: l.key, title: l.title, href: lessonHref(course.id, l.slug) })),
      })),
    };
  });

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Learn</h1>
        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
          Short lessons where you write real code, check it, and see straight away what you got right.
        </p>
        <CourseCatalogLoader courses={courses} />
      </div>
    </PageContainer>
  );
}
