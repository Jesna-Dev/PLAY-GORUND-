import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <PageContainer className="lg:pt-6">
      <div className="mx-auto max-w-7xl" aria-busy="true" aria-label="Loading dashboard">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-80 rounded-full" />
          <Skeleton className="h-10 w-72 rounded-full" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-3">
            <Skeleton className="h-64 rounded-2xl" />
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
          <Skeleton className="h-[34rem] rounded-2xl" />
        </div>
      </div>
    </PageContainer>
  );
}
