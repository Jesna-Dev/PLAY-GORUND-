"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn, LogOut, Settings, User } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ACCOUNT_TYPE_INFO } from "@/lib/account-types";
import { authClient, useCurrentUser } from "@/lib/auth-client";
import { clearLocalData, flushUploads } from "@/lib/sync/client";

async function signOut() {
  await flushUploads();
  await authClient.signOut();
  clearLocalData();
  // A full reload, so no store keeps the previous person's data in memory.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/sign-in");
}

export function UserMenu({ placement = "header" }: { placement?: "header" | "sidebar" }) {
  const user = useCurrentUser();
  const [signingOut, setSigningOut] = useState(false);
  const inSidebar = placement === "sidebar";

  if (user === undefined) {
    return inSidebar ? <Skeleton className="h-9 w-32 rounded-lg" /> : <Skeleton className="size-9 rounded-full" />;
  }

  if (user === null) {
    return (
      <ButtonLink href="/sign-in" variant={inSidebar ? "ghost" : "outline"} size={inSidebar ? "default" : "sm"} className={inSidebar ? "h-9 gap-2 px-2" : undefined}>
        <LogIn aria-hidden="true" />
        Sign in
      </ButtonLink>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          inSidebar ? (
            <Button variant="ghost" className="h-9 min-w-0 gap-2.5 px-2" aria-label="Account menu" />
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu" />
          )
        }
      >
        <Avatar className="size-7">
          <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
        </Avatar>
        {inSidebar && <span className="max-w-32 truncate text-sm font-medium">{user.name}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent side={inSidebar ? "top" : "bottom"} align={inSidebar ? "start" : "end"} className="w-56">
        <div className="px-1.5 py-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs font-medium text-primary-text">{ACCOUNT_TYPE_INFO[user.accountType].label}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>
          <User aria-hidden="true" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings aria-hidden="true" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut().catch(() => setSigningOut(false));
          }}
        >
          <LogOut aria-hidden="true" />
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
