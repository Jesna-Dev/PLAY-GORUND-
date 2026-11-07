"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { CircleCheck, CircleX, Play, RotateCcw } from "lucide-react";
import { CodeEditor } from "@/components/playground/code-editor";
import { ConsoleView } from "@/components/playground/console-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCodeRunner, type RunnerEvent } from "@/hooks/use-code-runner";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  evaluate,
  type Evaluation,
  isMarker,
  javascriptHarness,
  pythonHarness,
  RESULTS_MARKER,
  webHarness,
} from "@/lib/learn/harness";
import { loadDraft, progress, saveDraft, useLearnProgress } from "@/lib/learn/progress";
import type { Exercise } from "@/lib/learn/types";
import { buildPreviewDocument } from "@/lib/playground/preview";
import type { LogEntry, LogLevel } from "@/lib/playground/types";
import { cn } from "@/lib/utils";

export type ExerciseData = Omit<Exercise, "prompt">;

const FILE_NAMES = { html: "index.html", css: "style.css", javascript: "main.js", python: "main.py" };
const LOG_LEVELS: LogLevel[] = ["log", "info", "warn", "error", "system"];
const WEB_CHECK_TIMEOUT_MS = 4000;

export function ExerciseWorkspace({ lessonKey, exercise }: { lessonKey: string; exercise: ExerciseData }) {
  const { language } = exercise;
  const isWeb = language === "html" || language === "css";
  const fileName = FILE_NAMES[language];

  const [code, setCode] = useState(() => loadDraft(lessonKey) ?? exercise.starter);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState<null | "run" | "check">(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [preview, setPreview] = useState<{ html: string; key: number } | null>(null);

  const solved = Boolean(useLearnProgress().passed[lessonKey]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const previewRef = useRef<HTMLIFrameElement | null>(null);
  const logsRef = useRef<LogEntry[]>([]);
  const logId = useRef(0);
  const runIdRef = useRef(0);
  const modeRef = useRef<null | "run" | "check">(null);
  const webTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const resetLogs = () => {
    logsRef.current = [];
    setLogs([]);
  };

  const addLog = useCallback((entry: Omit<LogEntry, "id">) => {
    if (logsRef.current.length >= 500) return;
    logsRef.current = [...logsRef.current, { ...entry, id: ++logId.current }];
    setLogs(logsRef.current);
  }, []);

  const finishCheck = useCallback(
    (result: Evaluation) => {
      clearTimeout(webTimer.current);
      modeRef.current = null;
      setBusy(null);
      setEvaluation(result);
      if (result.status === "passed") progress.setPassed(lessonKey);
    },
    [lessonKey],
  );

  // ---- web exercises: the page renders in a sandboxed preview -------------

  const buildWebDocument = useCallback(
    (source: string, withChecks: boolean) => {
      const html = language === "html" ? source : (exercise.fixture.html ?? "");
      const css = language === "css" ? source : (exercise.fixture.css ?? "");
      const doc = buildPreviewDocument(html, css, "").html;
      if (!withChecks) return doc;
      const at = doc.toLowerCase().lastIndexOf("</body>");
      const script = `<script>${webHarness(exercise.tests)}</script>`;
      return at === -1 ? doc + script : doc.slice(0, at) + script + doc.slice(at);
    },
    [language, exercise.fixture, exercise.tests],
  );

  useEffect(() => {
    if (!isWeb) return;
    const timer = setTimeout(
      () => setPreview((p) => ({ html: buildWebDocument(code, false), key: (p?.key ?? 0) + 1 })),
      preview ? 400 : 0,
    );
    return () => clearTimeout(timer);
    // `preview` only picks the first delay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isWeb, buildWebDocument]);

  const onPreviewMessage = useEffectEvent((data: { level?: string; text?: unknown }) => {
    const text = String(data.text ?? "");
    const level = LOG_LEVELS.includes(data.level as LogLevel) ? (data.level as LogLevel) : "log";
    addLog({ level, text });
    if (modeRef.current === "check" && text.startsWith(RESULTS_MARKER)) {
      finishCheck(evaluate(exercise, logsRef.current));
    }
  });
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!previewRef.current || event.source !== previewRef.current.contentWindow) return;
      if (event.data?.source === "pg-preview") onPreviewMessage(event.data);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // ---- JavaScript and Python: the sandboxed runner ------------------------

  const runner = useCodeRunner((event: RunnerEvent) => {
    if (event.runId !== runIdRef.current) return;
    switch (event.type) {
      case "log":
        addLog({ level: event.level, text: event.text, file: event.file, line: event.line });
        break;
      case "status":
        addLog({ level: "system", text: event.text });
        break;
      case "done":
        if (modeRef.current === "check") finishCheck(evaluate(exercise, logsRef.current));
        else {
          modeRef.current = null;
          setBusy(null);
        }
        break;
      case "timeout":
        addLog({ level: "error", text: `Stopped after ${event.seconds} seconds. Check for a loop that never ends.` });
        if (modeRef.current === "check") finishCheck({ status: "crashed" });
        else {
          modeRef.current = null;
          setBusy(null);
        }
        break;
    }
  });

  useEffect(() => {
    if (language === "python") runner.warm("python");
  }, [language, runner]);

  // ---- actions ------------------------------------------------------------

  const execute = (mode: "run" | "check") => {
    if (busy) return;
    resetLogs();
    modeRef.current = mode;
    setBusy(mode);
    if (mode === "check") setAttempts((n) => n + 1);

    if (isWeb) {
      setPreview((p) => ({ html: buildWebDocument(code, mode === "check"), key: (p?.key ?? 0) + 1 }));
      clearTimeout(webTimer.current);
      webTimer.current = setTimeout(() => {
        if (modeRef.current === "check") finishCheck({ status: "crashed" });
      }, WEB_CHECK_TIMEOUT_MS);
      return;
    }

    const lang = language === "python" ? "python" : "javascript";
    const harness = lang === "python" ? pythonHarness(exercise.tests) : javascriptHarness(exercise.tests);
    runIdRef.current = runner.run(lang, mode === "check" ? code + harness : code);
  };

  const reset = () => {
    const instance = editorRef.current;
    const model = instance?.getModel();
    if (instance && model) {
      // An edit, not setValue, so Ctrl/Cmd+Z can bring the old code back.
      instance.pushUndoStop();
      instance.executeEdits("reset", [{ range: model.getFullModelRange(), text: exercise.starter }]);
      instance.pushUndoStop();
    }
    setCode(exercise.starter);
    setEvaluation(null);
    resetLogs();
  };

  const reveal = (_file: string, line: number) => {
    const instance = editorRef.current;
    if (!instance) return;
    instance.revealLineInCenter(line);
    instance.setPosition({ lineNumber: line, column: 1 });
    instance.focus();
  };

  // Save the draft shortly after typing stops, and straight away when leaving.
  const latestCode = useRef(code);
  const persistDraft = useEffectEvent(() =>
    saveDraft(lessonKey, latestCode.current === exercise.starter ? null : latestCode.current),
  );
  useEffect(() => {
    latestCode.current = code;
    const timer = setTimeout(persistDraft, 400);
    return () => clearTimeout(timer);
  }, [code]);
  useEffect(() => {
    window.addEventListener("pagehide", persistDraft);
    return () => {
      window.removeEventListener("pagehide", persistDraft);
      persistDraft();
    };
  }, []);

  // Underline error lines.
  useEffect(() => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model) return;
    const markers = logs
      .filter((e) => e.level === "error" && e.line && e.line <= model.getLineCount())
      .map((e) => ({
        startLineNumber: e.line!,
        endLineNumber: e.line!,
        startColumn: model.getLineFirstNonWhitespaceColumn(e.line!) || 1,
        endColumn: model.getLineMaxColumn(e.line!),
        message: e.text,
        severity: monaco.MarkerSeverity.Error,
      }));
    monaco.editor.setModelMarkers(model, "exercise", markers);
  }, [logs]);

  const visibleLogs = logs.filter((entry) => !isMarker(entry));
  const runKey = `${isMac ? "⌘" : "Ctrl"} Enter`;

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="flex h-11 items-center gap-2 border-b pr-2 pl-4">
          <span className="font-mono text-[13px]">{fileName}</span>
          {solved && (
            <Badge variant="secondary" className="gap-1">
              <CircleCheck aria-hidden="true" className="size-3 text-primary-text" />
              Solved
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Reset to starter code" onClick={reset} />}
              >
                <RotateCcw aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Reset to starter code</TooltipContent>
            </Tooltip>
            {!isWeb && (
              <Button variant="secondary" size="sm" disabled={busy !== null} onClick={() => execute("run")}>
                <Play aria-hidden="true" className="fill-current" />
                Run
              </Button>
            )}
            <Button size="sm" disabled={busy !== null} onClick={() => execute("check")}>
              {busy === "check" ? "Checking…" : "Check answer"}
            </Button>
          </div>
        </div>

        <div className={cn(isWeb && "md:grid md:grid-cols-2")}>
          <div className="h-72 md:h-80">
            <CodeEditor
              path={`file:///lessons/${lessonKey}/${fileName}`}
              language={language}
              defaultValue={code}
              label={`Exercise editor, ${fileName}`}
              compact={!isDesktop}
              onChange={setCode}
              onReady={(instance, monaco) => {
                editorRef.current = instance;
                monacoRef.current = monaco;
              }}
              onRun={() => execute(isWeb ? "check" : "run")}
              onSave={() => saveDraft(lessonKey, code)}
            />
          </div>
          {isWeb && (
            <div className="h-64 border-t bg-white md:h-80 md:border-t-0 md:border-l">
              {preview && (
                <iframe
                  key={preview.key}
                  ref={previewRef}
                  title="Preview of your page"
                  sandbox="allow-scripts"
                  srcDoc={preview.html}
                  className="block size-full"
                />
              )}
            </div>
          )}
        </div>

        {(!isWeb || visibleLogs.length > 0) && (
          <div className="max-h-56 overflow-auto border-t">
            <ConsoleView
              entries={visibleLogs}
              empty={
                busy ? (
                  "Running…"
                ) : (
                  <>
                    Press <strong className="font-medium text-foreground">Run</strong> to see what your code prints, or{" "}
                    <kbd className="rounded bg-muted px-1 font-sans text-xs">{runKey}</kbd>.
                  </>
                )
              }
              onReveal={reveal}
            />
          </div>
        )}

        <Results evaluation={evaluation} busy={busy === "check"} isWeb={isWeb} />
      </div>

      {!isWeb && <iframe {...runner.frameProps} />}

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {exercise.hints.length > 0 && (
          <details className="group max-w-full">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Need a hint?</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {exercise.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </details>
        )}
        {(attempts > 0 || solved) && (
          <details className="w-full">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Show a solution</summary>
            <p className="mt-2 text-muted-foreground">There’s usually more than one right answer. Here’s one:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border bg-card p-4 font-mono text-[13px] leading-relaxed">
              {exercise.solution}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

function Results({ evaluation, busy, isWeb }: { evaluation: Evaluation | null; busy: boolean; isWeb: boolean }) {
  if (busy) {
    return (
      <p role="status" className="border-t px-4 py-3 text-sm text-muted-foreground">
        Checking your answer…
      </p>
    );
  }
  if (!evaluation) return <p role="status" className="sr-only" />;

  if (evaluation.status === "crashed") {
    return (
      <div role="status" className="border-t bg-destructive/6 px-4 py-3 text-sm">
        <p className="font-medium text-destructive">The checks couldn’t run.</p>
        <p className="mt-1 text-muted-foreground">
          {isWeb
            ? "Something in the page stopped them. Look for unclosed tags, then check again."
            : "Your code stopped with an error first. Fix the error shown above, then check again."}
        </p>
      </div>
    );
  }

  const passed = evaluation.results.filter((r) => r.pass).length;
  const total = evaluation.results.length;
  const allPassed = evaluation.status === "passed";

  return (
    <div role="status" className={cn("border-t px-4 py-3 text-sm", allPassed ? "bg-primary/8" : "bg-muted/40")}>
      <p className={cn("font-medium", allPassed && "text-primary-text")}>
        {allPassed ? "All checks passed. Nice work!" : `${passed} of ${total} checks passed. Keep going.`}
      </p>
      <ul className="mt-2 space-y-1.5">
        {evaluation.results.map((result) => (
          <li key={result.name} className="flex gap-2">
            {result.pass ? (
              <CircleCheck aria-label="Passed" className="mt-0.5 size-4 shrink-0 text-primary-text" />
            ) : (
              <CircleX aria-label="Failed" className="mt-0.5 size-4 shrink-0 text-destructive" />
            )}
            <span className="min-w-0">
              {result.name}
              {!result.pass && result.message && (
                <span className="mt-0.5 block font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                  {result.message}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
