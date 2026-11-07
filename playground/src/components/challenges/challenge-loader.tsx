"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// The editor, drafts and chosen language only exist in the browser.
export const ChallengeLoader = dynamic(
  () => import("./challenge-workspace").then((m) => m.ChallengeWorkspace),
  { ssr: false, loading: () => <Skeleton className="h-full min-h-[34rem] rounded-xl" aria-label="Loading editor" /> },
);
