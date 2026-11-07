import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading lesson">
        <div className="max-w-3xl space-y-3">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="mt-6 h-9 w-80 max-w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-8 h-40 rounded-xl" />
        </div>
      </div>
    </PageContainer>
  );
}
