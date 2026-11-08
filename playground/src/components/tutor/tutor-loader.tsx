"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// The tutor reads the saved chat and code from browser storage, so it renders on the client only.
export const TutorLoader = dynamic(() => import("./tutor-chat").then((m) => m.TutorChat), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100svh-3.5rem)] flex-col lg:h-svh" aria-busy="true" aria-label="Loading AI Tutor">
      <div className="flex h-12 items-center border-b px-4">
        <Skeleton className="h-6 w-28" />
      </div>
      <div className="flex-1" />
      <div className="mx-auto w-full max-w-3xl p-4">
        <Skeleton className="h-28 rounded-2xl" />
      </div>
    </div>
  ),
});
