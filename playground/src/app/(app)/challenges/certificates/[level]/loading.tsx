import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CertificateLoading() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading certificate">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-4 mb-6 h-9 w-72" />
        <Skeleton className="aspect-[1123/794] w-full max-w-3xl rounded-xl" />
      </div>
    </PageContainer>
  );
}
