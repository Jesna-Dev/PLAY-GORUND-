"use client";

import { ArrowUp, Bug, FileCode2, GraduationCap, type LucideIcon, MessageCircleQuestion, Plus, Sparkles, Square, Wand2 } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useLearnProgress } from "@/lib/learn/progress";
import type { CourseSummary } from "@/lib/learn/types";
import { loadWorkspace } from "@/lib/playground/storage";
import { loadConversation, saveConversation } from "@/lib/tutor/storage";
import type { TutorContext, TutorMessage } from "@/lib/tutor/types";
import { cn } from "@/lib/utils";

const PROJECT_NAMES = { web: "HTML & CSS", javascript: "JavaScript", python: "Python" } as const;

type Starter = { icon: LucideIcon; label: string; prompt: string; send: boolean };

const Reply = memo(function Reply({ content }: { content: string }) {
  return (
    <div className="lesson-prose min-w-0 text-[15px]">
      <Markdown
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
});

function ContextToggle({
  icon: Icon,
  label,
  active,
  onToggle,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        "flex max-w-full items-center gap-1.5 rounded-lg px-2 py-1 text-xs outline-none transition-colors ring-1 focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "bg-primary/12 font-medium text-primary-text ring-primary/30 hover:bg-primary/20"
          : "text-muted-foreground ring-foreground/10 hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

export function TutorChat({ courses }: { courses: CourseSummary[] }) {
  const [messages, setMessages] = useState<TutorMessage[]>(loadConversation);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspace] = useState(loadWorkspace);
  const [shareCode, setShareCode] = useState(true);
  const [shareLesson, setShareLesson] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);

  const { last } = useLearnProgress();
  const course = courses.find((c) => c.lessons.some((l) => l.key === last));
  const lesson = course?.lessons.find((l) => l.key === last);

  const hasCode = workspace.hasSaved[workspace.kind];
  const codeOn = hasCode && shareCode;
  const lessonOn = Boolean(lesson) && shareLesson;

  useEffect(() => {
    if (!streaming) saveConversation(messages);
  }, [messages, streaming]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller && followRef.current) scroller.scrollTop = scroller.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function buildContext(): TutorContext {
    return {
      lesson: lessonOn && lesson && course ? { course: course.title, title: lesson.title } : undefined,
      // Read when sending, so edits made in another tab are included.
      files: codeOn
        ? loadWorkspace().projects[workspace.kind].files.map(({ name, language, content }) => ({ name, language, content }))
        : undefined,
    };
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;

    const history: TutorMessage[] = [...messages, { role: "user", content: question }];
    const controller = new AbortController();
    abortRef.current = controller;
    followRef.current = true;
    setError(null);
    setDraft("");
    setStreaming(true);
    setMessages([...history, { role: "assistant", content: "" }]);

    let reply = "";
    const showReply = () => setMessages([...history, { role: "assistant", content: reply }]);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context: buildContext() }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "The tutor couldn't answer just now. Please try again.");
        // Nothing was answered, so put the question back to retry.
        setMessages(messages);
        setDraft(question);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        showReply();
      }
    } catch {
      if (!controller.signal.aborted) setError("The connection dropped before the tutor finished. Please try again.");
      if (!reply) {
        setMessages(messages);
        setDraft(question);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function newChat() {
    setMessages([]);
    setError(null);
    setDraft("");
    inputRef.current?.focus();
  }

  function pickStarter({ prompt, send: sendNow }: Starter) {
    if (sendNow) {
      void send(prompt);
    } else {
      setDraft(prompt);
      inputRef.current?.focus();
    }
  }

  const starters: Starter[] = [
    codeOn
      ? { icon: MessageCircleQuestion, label: "Explain my code", prompt: "Explain my code step by step.", send: true }
      : { icon: MessageCircleQuestion, label: "Explain a concept", prompt: "Explain this concept to a beginner: ", send: false },
    codeOn
      ? { icon: Bug, label: "Find the bug", prompt: "Find the bug in my code and help me fix it.", send: true }
      : { icon: Bug, label: "Debug an error", prompt: "Here is my code and the error I get:\n\n", send: false },
    { icon: Wand2, label: "Write some code", prompt: "Write code that ", send: false },
    lessonOn && lesson
      ? { icon: GraduationCap, label: "Quiz me on this lesson", prompt: `Quiz me on ${lesson.title}.`, send: true }
      : { icon: GraduationCap, label: "Quiz me", prompt: "Quiz me on ", send: false },
  ];

  const waiting = streaming && messages[messages.length - 1]?.content === "";
  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100svh-3.5rem)] flex-col lg:h-svh">
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
        <h1 className="flex items-center gap-2 text-sm font-medium">
          <Sparkles aria-hidden="true" className="size-4 text-primary-text" />
          AI Tutor
        </h1>
        {!empty && (
          <Button variant="ghost" size="sm" onClick={newChat} disabled={streaming}>
            <Plus aria-hidden="true" />
            New chat
          </Button>
        )}
      </header>

      <div
        ref={scrollerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          followRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {empty ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col justify-center px-4 py-8">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">What are you working on?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask about a concept, paste an error, or get a hint without the answer.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {starters.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  onClick={() => pickStarter(starter)}
                  className="flex items-center gap-2.5 rounded-xl bg-card p-3 text-left text-sm ring-1 ring-foreground/10 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <starter.icon aria-hidden="true" className="size-4 shrink-0 text-primary-text" />
                  {starter.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div role="log" aria-label="Conversation" className="mx-auto max-w-3xl space-y-6 px-4 py-6">
            {messages.map((message, i) =>
              message.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl bg-secondary px-4 py-2.5 text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              ) : message.content ? (
                <Reply key={i} content={message.content} />
              ) : null,
            )}
            {waiting && (
              <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
                <span aria-hidden="true" className="size-2 rounded-full bg-primary motion-safe:animate-pulse" />
                Thinking…
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4">
        {error && (
          <p role="alert" className="mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(draft);
          }}
          className="rounded-2xl bg-card p-3 ring-1 ring-foreground/10 focus-within:ring-foreground/25"
        >
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send(draft);
              }
            }}
            rows={1}
            aria-label="Ask the tutor"
            placeholder="Ask the tutor anything…"
            className="field-sizing-content max-h-48 min-h-10 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {hasCode && (
                <ContextToggle
                  icon={FileCode2}
                  label={`${PROJECT_NAMES[workspace.kind]} code`}
                  active={codeOn}
                  onToggle={() => setShareCode((on) => !on)}
                />
              )}
              {lesson && (
                <ContextToggle
                  icon={GraduationCap}
                  label={lesson.title}
                  active={lessonOn}
                  onToggle={() => setShareLesson((on) => !on)}
                />
              )}
            </div>
            {streaming ? (
              <Button type="button" size="icon" variant="secondary" aria-label="Stop" onClick={() => abortRef.current?.abort()}>
                <Square aria-hidden="true" className="fill-current" />
              </Button>
            ) : (
              <Button type="submit" size="icon" aria-label="Send" disabled={!draft.trim()}>
                <ArrowUp aria-hidden="true" />
              </Button>
            )}
          </div>
        </form>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Your question and highlighted items are sent to Claude. Check important answers.
        </p>
      </div>
    </div>
  );
}
