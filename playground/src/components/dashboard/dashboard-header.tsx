"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { Search, Settings } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SearchItem = { title: string; href: string; kind: "Lesson" | "Challenge"; detail: string };

const tabs = [
  { label: "Overview", href: "/dashboard" },
  { label: "Learn", href: "/learn" },
  { label: "Challenges", href: "/challenges" },
  { label: "Playground", href: "/playground" },
];

function DashboardSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  const needle = query.trim().toLowerCase();
  const results = needle
    ? items
        .filter((item) => item.title.toLowerCase().includes(needle) || item.detail.toLowerCase().includes(needle))
        .slice(0, 6)
    : [];

  return (
    <div
      ref={container}
      role="search"
      className="relative min-w-0 flex-1 sm:max-w-sm"
      onBlur={(event) => {
        if (!container.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search lessons and challenges
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id={id}
        type="search"
        value={query}
        autoComplete="off"
        placeholder="Search lessons and challenges"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results[0]) router.push(results[0].href);
          if (event.key === "Escape") setQuery("");
        }}
        className="h-10 w-full rounded-full bg-card pr-4 pl-10 text-sm ring-1 ring-foreground/10 outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <p role="status" className="sr-only">
        {needle ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
      </p>
      {open && needle && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-xl bg-popover p-1 shadow-lg ring-1 ring-foreground/10">
          {results.length ? (
            <ul>
              {results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
                  >
                    <span className="truncate">{item.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.kind} · {item.detail}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">No lessons or challenges match “{query.trim()}”.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function DashboardHeader({
  items,
}: {
  items: SearchItem[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <nav
        aria-label="Sections"
        className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-card p-1 ring-1 ring-foreground/10"
      >
        {tabs.map((tab) => {
          const active = tab.href === "/dashboard";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <DashboardSearch items={items} />
      {/* Phones get these from the top bar. */}
      <div className="ml-auto hidden items-center gap-1.5 lg:flex">
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href="/settings"
                aria-label="Settings"
                className="flex size-10 items-center justify-center rounded-xl bg-card ring-1 ring-foreground/10 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            }
          >
            <Settings aria-hidden="true" className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="bottom">Settings</TooltipContent>
        </Tooltip>
        <UserMenu />
      </div>
    </div>
  );
}
