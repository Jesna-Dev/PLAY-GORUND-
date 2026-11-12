"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { type AccountType, isAccountType } from "@/lib/account-types";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({ plugins: [inferAdditionalFields<typeof auth>()] });

export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export type CurrentUser = { id: string; name: string; email: string; initials: string; accountType: AccountType };

/** The signed-in user, null when signed out, or undefined while the session is loading. */
export function useCurrentUser(): CurrentUser | null | undefined {
  const { data, isPending } = authClient.useSession();
  if (isPending) return undefined;
  if (!data) return null;
  const { id, name, email, accountType } = data.user;
  return { id, name, email, initials: initialsOf(name), accountType: isAccountType(accountType) ? accountType : "student" };
}
