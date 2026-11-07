"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { InlineCode } from "@/components/learn/inline-code";
import { Button } from "@/components/ui/button";

export function ChallengeHints({ hints }: { hints: string[] }) {
  const [shown, setShown] = useState(0);
  return (
    <div>
      {shown > 0 && (
        <ol className="mb-3 space-y-2">
          {hints.slice(0, shown).map((hint, index) => (
            <li key={hint} className="flex gap-2.5 rounded-lg bg-accent px-3 py-2 text-sm">
              <span className="font-medium text-muted-foreground tabular-nums">{index + 1}.</span>
              <span>
                <InlineCode text={hint} />
              </span>
            </li>
          ))}
        </ol>
      )}
      {shown < hints.length ? (
        <Button variant="outline" size="sm" onClick={() => setShown((n) => n + 1)}>
          <Lightbulb aria-hidden="true" />
          {shown === 0 ? "Show a hint" : `Show hint ${shown + 1} of ${hints.length}`}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">That’s every hint. The solution below explains the full approach.</p>
      )}
    </div>
  );
}
