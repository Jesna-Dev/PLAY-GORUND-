"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/lib/auth-client";
import { pullAndMerge, setSyncEnabled } from "@/lib/sync/client";

/** Turns on saving to the account while someone is signed in, and fetches their latest data once per visit. */
export function SyncProvider() {
  const user = useCurrentUser();
  // A string, so the effect runs when who's signed in changes, not on every render.
  const who = user === undefined ? "loading" : (user?.id ?? "signed-out");

  useEffect(() => {
    if (who === "loading") return;
    const signedIn = who !== "signed-out";
    setSyncEnabled(signedIn);
    if (signedIn) void pullAndMerge().catch(() => {});
  }, [who]);

  return null;
}
