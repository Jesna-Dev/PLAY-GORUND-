"use client";

import { Check, ChevronRight, Circle, CircleCheck, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { InlineCode } from "@/components/learn/inline-code";
import { LanguageMark } from "@/components/shared/language-mark";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type InterviewQuestion, interviewQuestions } from "@/content/interview/questions";
import type { CourseLevel } from "@/content/learn/courses";
import { loadStatuses, type InterviewStatuses, type QuestionStatus, saveStatuses } from "@/lib/interview/storage";
import { type LanguageId, languages } from "@/lib/languages";
import { cn } from "@/lib/utils";

const LEVELS: CourseLevel[] = ["Babies", "Intermediate", "Experienced", "Pro"];
const TOPICS: LanguageId[] = ["html", "css", "javascript", "python", "react", "typescript", "uiux"];

type StatusFilter = "all" | "practice" | "known";
const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "practice", label: "To practice" },
  { id: "known", label: "Known" },
];

const questionId = (q: InterviewQuestion) =>
  `${q.topic}:${q.question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1 text-sm outline-none ring-1 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "bg-primary font-medium text-primary-foreground ring-primary"
          : "text-muted-foreground ring-foreground/10 hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {children}
    </div>
  );
}

function StatusIcon({ status }: { status?: QuestionStatus }) {
  if (status === "known") return <CircleCheck aria-label="Known" className="mt-0.5 size-4 shrink-0 text-primary-text" />;
  if (status === "review") return <RotateCcw aria-label="Review again" className="mt-0.5 size-4 shrink-0 text-streak" />;
  return <Circle aria-label="Not practiced" className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />;
}

export function InterviewBank() {
  const [statuses, setStatuses] = useState<InterviewStatuses>(loadStatuses);
  const [topic, setTopic] = useState<LanguageId | "all">("all");
  const [level, setLevel] = useState<CourseLevel | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => saveStatuses(statuses), [statuses]);

  function mark(id: string, status: QuestionStatus) {
    setStatuses((current) => {
      const next = { ...current };
      // Pressing the active choice again clears it.
      if (next[id] === status) delete next[id];
      else next[id] = status;
      return next;
    });
  }

  const inTopic = interviewQuestions.filter((q) => topic === "all" || q.topic === topic);
  const knownCount = inTopic.filter((q) => statuses[questionId(q)] === "known").length;

  const visible = inTopic.filter((q) => {
    const known = statuses[questionId(q)] === "known";
    return (
      (level === "all" || q.level === level) &&
      (statusFilter === "all" || (statusFilter === "known" ? known : !known))
    );
  });

  return (
    <>
      <div className="mt-6 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <p className="text-sm tabular-nums">
          <span className="font-medium">{knownCount}</span>{" "}
          <span className="text-muted-foreground">
            of {inTopic.length} {topic === "all" ? "questions" : `${languages[topic].name} questions`} known
          </span>
        </p>
        <Progress className="mt-3" value={knownCount} max={inTopic.length} aria-label="Questions known" />
      </div>

      <div className="mt-4 space-y-2">
        <FilterRow label="Filter by topic">
          <Chip active={topic === "all"} onClick={() => setTopic("all")}>
            All topics
          </Chip>
          {TOPICS.map((id) => (
            <Chip key={id} active={topic === id} onClick={() => setTopic(id)}>
              {languages[id].name}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Filter by level">
          <Chip active={level === "all"} onClick={() => setLevel("all")}>
            All levels
          </Chip>
          {LEVELS.map((id) => (
            <Chip key={id} active={level === id} onClick={() => setLevel(id)}>
              {id}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Filter by progress">
          {STATUS_FILTERS.map(({ id, label }) => (
            <Chip key={id} active={statusFilter === id} onClick={() => setStatusFilter(id)}>
              {label}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {visible.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No questions match these filters.</p>
      )}

      {LEVELS.map((levelName, levelIndex) => {
        const questions = visible.filter((q) => q.level === levelName);
        if (questions.length === 0) return null;
        return (
          <section key={levelName} aria-labelledby={`level-${levelName}`} className="mt-8">
            <h2 id={`level-${levelName}`} className="text-base font-medium">
              <span className="text-muted-foreground">Level {levelIndex + 1}:</span> {levelName}
            </h2>
            <ul className="mt-3 divide-y overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
              {questions.map((q) => {
                const id = questionId(q);
                const status = statuses[id];
                return (
                  <li key={id}>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3.5 outline-none transition-colors hover:bg-accent focus-visible:bg-accent [&::-webkit-details-marker]:hidden">
                        <StatusIcon status={status} />
                        <span className="min-w-0 flex-1 font-medium">
                          <InlineCode text={q.question} />
                        </span>
                        <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                          <LanguageMark language={q.topic} className="size-6 rounded-md text-[10px]" />
                          <span className="hidden sm:inline">{languages[q.topic].name}</span>
                          <ChevronRight aria-hidden="true" className="size-4 transition-transform group-open:rotate-90" />
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pl-11">
                        <p className="max-w-prose text-sm leading-relaxed text-pretty text-muted-foreground">
                          <InlineCode text={q.answer} />
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant={status === "known" ? "default" : "outline"}
                            aria-pressed={status === "known"}
                            onClick={() => mark(id, "known")}
                          >
                            <Check aria-hidden="true" />I knew this
                          </Button>
                          <Button
                            size="sm"
                            variant={status === "review" ? "secondary" : "outline"}
                            aria-pressed={status === "review"}
                            onClick={() => mark(id, "review")}
                          >
                            <RotateCcw aria-hidden="true" />
                            Review again
                          </Button>
                        </div>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
