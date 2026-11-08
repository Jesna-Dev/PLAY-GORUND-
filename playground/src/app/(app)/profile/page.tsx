import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { ProfileLoader } from "@/components/profile/profile-loader";
import { getChallengeSummaries } from "@/lib/challenges/content";
import { getDashboardData } from "@/lib/data/dashboard";
import { getCourseSummaries } from "@/lib/learn/content";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { user } = await getDashboardData();

  return (
    <PageContainer className="lg:pt-6">
      <div className="mx-auto max-w-7xl">
        <ProfileLoader user={user} courses={getCourseSummaries()} challenges={getChallengeSummaries()} />
      </div>
    </PageContainer>
  );
}
