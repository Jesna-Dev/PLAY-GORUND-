"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// The playground reads saved code from browser storage, so it renders on the client only.
export const PlaygroundLoader = dynamic(
  () => import("./playground").then((m) => m.Playground),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100svh-3.5rem)] flex-col lg:h-svh" aria-busy="true" aria-label="Loading playground">
        <div className="flex h-12 items-center gap-2 border-b px-4">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="ml-auto h-8 w-40" />
        </div>
        <div className="grid flex-1 gap-px lg:grid-cols-[55fr_45fr]">
          <Skeleton className="rounded-none" />
          <Skeleton className="rounded-none opacity-60" />
        </div>
      </div>
    ),
  },
);
