import type { Metadata } from "next";
import { DashboardHeader, type SearchItem } from "@/components/dashboard/dashboard-header";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PageContainer } from "@/components/layout/page-container";
import { getChallengeSummaries } from "@/lib/challenges/content";
import { levelTitle } from "@/lib/challenges/levels";
import { getDashboardData } from "@/lib/data/dashboard";
import { getCourseSummaries } from "@/lib/learn/content";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { user } = await getDashboardData();
  const courses = getCourseSummaries();
  const challenges = getChallengeSummaries();

  const searchItems: SearchItem[] = [
    ...courses.flatMap((course) =>
      course.lessons.map((lesson) => ({
        title: lesson.title,
        href: lesson.href,
        kind: "Lesson" as const,
        detail: course.title,
      })),
    ),
    ...challenges.map((challenge) => ({
      title: challenge.title,
      href: challenge.href,
      kind: "Challenge" as const,
      detail: levelTitle(challenge.difficulty),
    })),
  ];

  return (
    <PageContainer className="lg:pt-6">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader items={searchItems} user={user} />
        <DashboardOverview name={user.name} courses={courses} challenges={challenges} />
      </div>
    </PageContainer>
  );
}
