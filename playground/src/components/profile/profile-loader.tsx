"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Progress and saved projects live in browser storage, so this renders on the client only.
export const ProfileLoader = dynamic(() => import("./profile-overview").then((m) => m.ProfileOverview), {
  ssr: false,
  loading: () => (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]" aria-busy="true" aria-label="Loading profile">
      <div className="grid content-start gap-3">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      <Skeleton className="h-[34rem] rounded-2xl" />
    </div>
  ),
});
