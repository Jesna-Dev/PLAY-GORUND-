"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { CircleCheck, CircleX, Play, RotateCcw } from "lucide-react";
import { CodeEditor } from "@/components/playground/code-editor";
import { ConsoleView } from "@/components/playground/console-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCodeRunner, type RunnerEvent } from "@/hooks/use-code-runner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fileNames, languageNames, starterCode, testCode } from "@/lib/challenges/code";
import { setChallengeLanguage, useChallengeLanguage } from "@/lib/challenges/language";
import type { ChallengeLanguage, ChallengeRunData } from "@/lib/challenges/types";
import { evaluate, type Evaluation, isMarker, javascriptHarness, pythonHarness } from "@/lib/learn/harness";
import { loadDraft, progress, saveDraft, useLearnProgress } from "@/lib/learn/progress";
import type { LogEntry } from "@/lib/playground/types";
import { cn } from "@/lib/utils";

type Mode = "run" | "submit";

export function ChallengeWorkspace({ challenge }: { challenge: ChallengeRunData }) {
  const { slug, tests } = challenge;
  const language = useChallengeLanguage();

  const [code, setCode] = useState<Record<ChallengeLanguage, string>>(() => ({
    javascript: loadDraft(`challenge/${slug}/javascript`) ?? starterCode(challenge, "javascript"),
    python: loadDraft(`challenge/${slug}/python`) ?? starterCode(challenge, "python"),
  }));
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState<Mode | null>(null);
  const [outcome, setOutcome] = useState<{ mode: Mode; evaluation: Evaluation } | null>(null);

  const solved = useLearnProgress().challenges[slug];
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const logsRef = useRef<LogEntry[]>([]);
  const logId = useRef(0);
  const runIdRef = useRef(0);
  const modeRef = useRef<Mode | null>(null);
  const languageRef = useRef(language);

  const addLog = useCallback((entry: Omit<LogEntry, "id">) => {
    if (logsRef.current.length >= 500) return;
    logsRef.current = [...logsRef.current, { ...entry, id: ++logId.current }];
    setLogs(logsRef.current);
  }, []);

  const finish = useCallback(
    (evaluation: Evaluation) => {
      const mode = modeRef.current ?? "run";
      modeRef.current = null;
      setBusy(null);
      setOutcome({ mode, evaluation });
      if (mode === "submit" && evaluation.status === "passed") {
        progress.setChallengeSolved(slug, languageRef.current);
      }
    },
    [slug],
  );

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
        finish(evaluate({}, logsRef.current));
        break;
      case "timeout":
        addLog({
          level: "error",
          text: `Stopped after ${event.seconds} seconds. Check for a loop that never ends, or a much slower approach than needed.`,
        });
        finish({ status: "crashed" });
        break;
    }
  });

  useEffect(() => {
    if (language === "python") runner.warm("python");
  }, [language, runner]);

  const execute = (mode: Mode) => {
    if (busy) return;
    const cases = mode === "run" ? tests.filter((t) => t.example) : tests;
    const checks = testCode(challenge, language, cases);
    const harness = language === "python" ? pythonHarness(checks) : javascriptHarness(checks);
    logsRef.current = [];
    setLogs([]);
    setOutcome(null);
    modeRef.current = mode;
    languageRef.current = language;
    setBusy(mode);
    runIdRef.current = runner.run(language, code[language] + harness);
  };

  const updateCode = (value: string) => setCode((current) => ({ ...current, [language]: value }));

  const reset = () => {
    const instance = editorRef.current;
    const model = instance?.getModel();
    const starter = starterCode(challenge, language);
    if (instance && model) {
      // An edit rather than setValue, so Ctrl/Cmd+Z brings the old code back.
      instance.pushUndoStop();
      instance.executeEdits("reset", [{ range: model.getFullModelRange(), text: starter }]);
      instance.pushUndoStop();
    }
    updateCode(starter);
    setOutcome(null);
  };

  // Drafts: save shortly after typing stops, and straight away when leaving.
  const latest = useRef(code);
  const persist = useCallback(() => {
    for (const lang of ["javascript", "python"] as const) {
      const value = latest.current[lang];
      saveDraft(`challenge/${challenge.slug}/${lang}`, value === starterCode(challenge, lang) ? null : value);
    }
  }, [challenge]);
  useEffect(() => {
    latest.current = code;
    const timer = setTimeout(persist, 400);
    return () => clearTimeout(timer);
  }, [code, persist]);
  useEffect(() => {
    window.addEventListener("pagehide", persist);
    return () => {
      window.removeEventListener("pagehide", persist);
      persist();
    };
  }, [persist]);

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
    monaco.editor.setModelMarkers(model, "challenge", markers);
  }, [logs]);

  const reveal = (_file: string, line: number) => {
    const instance = editorRef.current;
    if (!instance) return;
    instance.revealLineInCenter(line);
    instance.setPosition({ lineNumber: line, column: 1 });
    instance.focus();
  };

  const visibleLogs = logs.filter((entry) => !isMarker(entry));

  return (
    <div className="flex h-full min-h-[34rem] flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <Select
          items={languageNames}
          value={language}
          onValueChange={(value) => value && setChallengeLanguage(value as ChallengeLanguage)}
        >
          <SelectTrigger size="sm" className="w-32" aria-label="Language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
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
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="secondary" size="sm" disabled={busy !== null} onClick={() => execute("run")} />
              }
            >
              <Play aria-hidden="true" className="fill-current" />
              Run
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Run the examples ({isMac ? "⌘" : "Ctrl"} Enter)
            </TooltipContent>
          </Tooltip>
          <Button size="sm" disabled={busy !== null} onClick={() => execute("submit")}>
            {busy === "submit" ? "Testing…" : "Submit"}
          </Button>
        </div>
      </div>

      <div className="min-h-72 flex-1">
        <CodeEditor
          path={`file:///challenges/${slug}/${fileNames[language]}`}
          language={language}
          defaultValue={code[language]}
          label={`Solution editor, ${languageNames[language]}`}
          compact={!isDesktop}
          onChange={updateCode}
          onReady={(instance, monaco) => {
            editorRef.current = instance;
            monacoRef.current = monaco;
          }}
          onRun={() => execute("run")}
          onSave={persist}
        />
      </div>

      <div className="max-h-[45%] min-h-24 shrink-0 overflow-auto border-t">
        <Outcome busy={busy} outcome={outcome} total={tests.length} />
        <p className="px-3 pt-2 text-xs font-medium text-muted-foreground">Console</p>
        <ConsoleView
          entries={visibleLogs}
          empty={busy ? "Running…" : "Run prints your output here and tests the examples. Submit runs every test."}
          onReveal={reveal}
        />
      </div>

      <iframe {...runner.frameProps} />
    </div>
  );
}

function Outcome({
  busy,
  outcome,
  total,
}: {
  busy: Mode | null;
  outcome: { mode: Mode; evaluation: Evaluation } | null;
  total: number;
}) {
  if (busy) {
    return (
      <p role="status" className="border-b px-3 py-2.5 text-sm text-muted-foreground">
        {busy === "submit" ? `Running all ${total} tests…` : "Running the examples…"}
      </p>
    );
  }
  if (!outcome) return <p role="status" className="sr-only" />;

  const { mode, evaluation } = outcome;
  if (evaluation.status === "crashed") {
    return (
      <div role="status" className="border-b bg-destructive/6 px-3 py-2.5 text-sm">
        <p className="font-medium text-destructive">The tests couldn’t run.</p>
        <p className="mt-0.5 text-muted-foreground">Your code stopped with an error first. Fix the error below, then try again.</p>
      </div>
    );
  }

  const passed = evaluation.results.filter((r) => r.pass).length;
  const accepted = mode === "submit" && evaluation.status === "passed";
  const heading =
    mode === "run"
      ? `Examples: ${passed} of ${evaluation.results.length} passed.${evaluation.status === "passed" ? " Submit to run every test." : ""}`
      : accepted
        ? `Accepted! All ${evaluation.results.length} tests passed.`
        : `${passed} of ${evaluation.results.length} tests passed.`;

  return (
    <div role="status" className={cn("border-b px-3 py-2.5 text-sm", accepted && "bg-primary/8")}>
      <p className={cn("font-medium", accepted && "text-primary-text")}>{heading}</p>
      <ul className="mt-2 space-y-1.5">
        {evaluation.results.map((result) => (
          <li key={result.name} className="flex gap-2">
            {result.pass ? (
              <CircleCheck aria-label="Passed" className="mt-0.5 size-4 shrink-0 text-primary-text" />
            ) : (
              <CircleX aria-label="Failed" className="mt-0.5 size-4 shrink-0 text-destructive" />
            )}
            <span className="min-w-0 font-mono text-xs leading-5 break-words">
              {result.name}
              {!result.pass && result.message && (
                <span className="block whitespace-pre-wrap text-muted-foreground">{result.message}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
