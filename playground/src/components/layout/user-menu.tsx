"use client";

import Link from "next/link";
import { Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({
  name,
  initials,
  placement = "header",
}: {
  name: string;
  initials: string;
  placement?: "header" | "sidebar";
}) {
  const inSidebar = placement === "sidebar";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          inSidebar ? (
            <Button variant="ghost" className="h-9 gap-2.5 px-2" aria-label="Account menu" />
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu" />
          )
        }
      >
        <Avatar className="size-7">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        {inSidebar && <span className="text-sm font-medium">{name}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={inSidebar ? "top" : "bottom"}
        align={inSidebar ? "start" : "end"}
        className="w-44"
      >
        <DropdownMenuItem render={<Link href="/profile" />}>
          <User aria-hidden="true" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings aria-hidden="true" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
