"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Which courses are featured depends on progress saved in this browser, so render on the client only.
export const CourseCatalogLoader = dynamic(() => import("./course-catalog").then((m) => m.CourseCatalog), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" aria-label="Loading courses">
      <Skeleton className="mt-6 h-5 w-32" />
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl max-lg:hidden" />
      </div>
      <Skeleton className="mt-8 h-5 w-28" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  ),
});
