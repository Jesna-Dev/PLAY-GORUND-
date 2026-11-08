"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Which questions are marked lives in browser storage, so this renders on the client only.
export const InterviewLoader = dynamic(() => import("./interview-bank").then((m) => m.InterviewBank), {
  ssr: false,
  loading: () => (
    <div className="mt-6 space-y-3" aria-busy="true" aria-label="Loading questions">
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  ),
});
