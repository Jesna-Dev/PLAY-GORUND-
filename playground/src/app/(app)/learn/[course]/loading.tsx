import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLoading() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl" aria-busy="true" aria-label="Loading course">
        <Skeleton className="h-5 w-48" />
        <div className="mt-6 flex gap-5">
          <Skeleton className="size-14 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
        <Skeleton className="mt-10 h-48 rounded-xl" />
      </div>
    </PageContainer>
  );
}
