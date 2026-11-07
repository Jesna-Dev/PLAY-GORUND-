"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// The editor and saved drafts only exist in the browser.
export const ExerciseLoader = dynamic(
  () => import("./exercise-workspace").then((m) => m.ExerciseWorkspace),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[26rem] rounded-xl" aria-label="Loading exercise" />,
  },
);
