import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChallengeLoading() {
  return (
    <PageContainer className="lg:pt-6">
      <div
        className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
        aria-busy="true"
        aria-label="Loading challenge"
      >
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-6 h-32 rounded-xl" />
        </div>
        <Skeleton className="h-[34rem] rounded-xl" />
      </div>
    </PageContainer>
  );
}
