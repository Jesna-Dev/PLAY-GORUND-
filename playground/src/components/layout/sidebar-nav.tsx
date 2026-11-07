"use client";

import { primaryNav, secondaryNav } from "@/config/navigation";
import { NavLinks } from "./nav-links";

/** The nav contents shared by the desktop sidebar and the mobile sheet. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col justify-between gap-6">
      <NavLinks items={primaryNav} onNavigate={onNavigate} />
      <NavLinks items={secondaryNav} onNavigate={onNavigate} />
    </nav>
  );
}
