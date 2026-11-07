"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Keeps the solution out of sight until the learner asks for it. */
export function SolutionReveal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (open) return <div>{children}</div>;
  return (
    <div className="rounded-xl border border-dashed p-4 text-sm">
      <p className="text-muted-foreground">
        Try the problem first. You learn the most from working it out, even when you get stuck.
      </p>
      <Button variant="outline" size="sm" className="mt-3" onClick={() => setOpen(true)}>
        <Eye aria-hidden="true" />
        Show the solution
      </Button>
    </div>
  );
}
