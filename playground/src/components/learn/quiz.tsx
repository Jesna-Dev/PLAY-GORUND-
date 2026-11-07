"use client";

import { Check, X } from "lucide-react";
import { progress, useLearnProgress } from "@/lib/learn/progress";
import type { QuizQuestion } from "@/lib/learn/types";
import { cn } from "@/lib/utils";
import { InlineCode } from "./inline-code";

export function Quiz({ lessonKey, questions }: { lessonKey: string; questions: QuizQuestion[] }) {
  const answers = useLearnProgress().answers[lessonKey] ?? {};
  const answered = questions.filter((q) => answers[q.id] !== undefined);
  const correct = answered.filter((q) => answers[q.id] === q.answer).length;

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const chosen = answers[question.id];
        const isAnswered = chosen !== undefined;
        const isRight = chosen === question.answer;
        return (
          <fieldset key={question.id} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
            <legend className="sr-only">Question {index + 1}</legend>
            <p className="font-medium">
              <span className="mr-2 text-muted-foreground tabular-nums">{index + 1}.</span>
              <InlineCode text={question.prompt} />
            </p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option, optionIndex) => {
                const selected = chosen === optionIndex;
                const showCorrect = isAnswered && optionIndex === question.answer;
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => progress.setAnswer(lessonKey, question.id, optionIndex)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected && !isRight && "border-destructive/60 bg-destructive/8",
                      showCorrect && "border-primary/60 bg-primary/8",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border",
                        selected && !isRight && "border-destructive bg-destructive text-white",
                        showCorrect && "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {showCorrect ? <Check className="size-3" strokeWidth={3} /> : selected ? <X className="size-3" strokeWidth={3} /> : null}
                    </span>
                    <span>
                      <InlineCode text={option} />
                    </span>
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <p role="status" className="mt-3 text-sm">
                <span className={cn("font-medium", isRight ? "text-primary-text" : "text-destructive")}>
                  {isRight ? "Correct." : "Not quite."}
                </span>{" "}
                <span className="text-muted-foreground">
                  {isRight ? <InlineCode text={question.explanation} /> : "Have another look and pick again."}
                </span>
              </p>
            )}
          </fieldset>
        );
      })}
      {answered.length === questions.length && (
        <p className="text-sm text-muted-foreground tabular-nums">
          You got {correct} of {questions.length} right.
        </p>
      )}
    </div>
  );
}
