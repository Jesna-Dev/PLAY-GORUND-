"use client";

import { formatCall, formatValue } from "@/lib/challenges/code";
import { useChallengeLanguage } from "@/lib/challenges/language";
import type { ChallengeLanguage, Signature, TestCase } from "@/lib/challenges/types";

export function ChallengeExamples({
  signatures,
  examples,
}: {
  signatures: Record<ChallengeLanguage, Signature>;
  examples: TestCase[];
}) {
  const language = useChallengeLanguage();
  return (
    <div className="space-y-3">
      {examples.map((example, index) => (
        <div key={index} className="rounded-lg bg-card p-3 text-sm ring-1 ring-foreground/10">
          <p className="text-xs font-medium text-muted-foreground">Example {index + 1}</p>
          <dl className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1">
            <dt className="text-muted-foreground">Call</dt>
            <dd className="font-mono text-[13px] break-words">{formatCall(signatures[language], example.args, language)}</dd>
            <dt className="text-muted-foreground">Returns</dt>
            <dd className="font-mono text-[13px] break-words">{formatValue(example.expected, language)}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
}
