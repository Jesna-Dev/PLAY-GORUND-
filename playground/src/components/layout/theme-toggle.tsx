"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Switch color theme"
            onClick={toggleTheme}
          />
        }
      >
        {/* CSS picks the icon, so the server and client markup always agree. */}
        <Sun aria-hidden="true" className="hidden dark:block" />
        <Moon aria-hidden="true" className="dark:hidden" />
      </TooltipTrigger>
      <TooltipContent>Switch theme</TooltipContent>
    </Tooltip>
  );
}
