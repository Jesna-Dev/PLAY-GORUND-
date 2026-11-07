"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCodeRunner, type RunnerEvent } from "@/hooks/use-code-runner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { buildPreviewDocument, type PreviewDocument, toScriptLine } from "@/lib/playground/preview";
import { loadWorkspace, saveLastKind, saveProject, type Workspace } from "@/lib/playground/storage";
import { starterProject } from "@/lib/playground/templates";
import type { LogEntry, LogLevel, Project, ProjectKind } from "@/lib/playground/types";
import { CodeEditor, modelPath } from "./code-editor";
import { OutputPane, type OutputTab, type Viewport } from "./output-pane";
import { PlaygroundToolbar, type SaveState } from "./playground-toolbar";

const MAX_LOGS = 1000;
const LOG_LEVELS: LogLevel[] = ["log", "info", "warn", "error", "system"];

const snapshot = (project: Project) => JSON.stringify(project.files.map((f) => f.content));

function fileContent(project: Project, name: string) {
  return project.files.find((f) => f.name === name)?.content ?? "";
}

export function Playground() {
  const [workspace, setWorkspace] = useState<Workspace>(loadWorkspace);
  const [saved, setSaved] = useState(() =>
    Object.fromEntries(Object.entries(workspace.projects).map(([k, p]) => [k, snapshot(p)])),
  );
  const [saveFailed, setSaveFailed] = useState(false);
  const [activeFile, setActiveFile] = useState<Record<ProjectKind, string>>({
    web: "index.html",
    javascript: "main.js",
    python: "main.py",
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<OutputTab>(workspace.kind === "web" ? "preview" : "console");
  const [preview, setPreview] = useState<PreviewDocument | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [viewport, setViewport] = useState<Viewport>("full");

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const previewRef = useRef<HTMLIFrameElement | null>(null);
  const runIdRef = useRef(0);
  const logId = useRef(0);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
  const modKey = isMac ? "⌘" : "Ctrl";

  const { kind } = workspace;
  const project = workspace.projects[kind];
  const file = project.files.find((f) => f.name === activeFile[kind]) ?? project.files[0];
  const dirty = snapshot(project) !== saved[kind];
  const saveState: SaveState = saveFailed
    ? "error"
    : dirty
      ? "unsaved"
      : workspace.hasSaved[kind]
        ? "saved"
        : "starter";

  const addLog = useCallback((entry: Omit<LogEntry, "id">) => {
    setLogs((current) =>
      current.length >= MAX_LOGS ? current : [...current, { ...entry, id: ++logId.current }],
    );
  }, []);

  // ---- running code -------------------------------------------------------

  const onRunnerEvent = useCallback(
    (event: RunnerEvent) => {
      if (event.runId !== runIdRef.current) return;
      switch (event.type) {
        case "log":
          addLog({ level: event.level, text: event.text, file: event.file, line: event.line });
          break;
        case "status":
          addLog({ level: "system", text: event.text });
          break;
        case "done":
          setRunning(false);
          addLog({ level: "system", text: `Finished in ${Math.max(1, Math.round(event.ms))} ms` });
          break;
        case "timeout":
          setRunning(false);
          addLog({
            level: "error",
            text: `Stopped after ${event.seconds} seconds. Check for a loop that never ends.`,
          });
          break;
        case "stopped":
          setRunning(false);
          addLog({ level: "system", text: "Stopped." });
          break;
      }
    },
    [addLog],
  );

  const runner = useCodeRunner(onRunnerEvent);

  const refreshPreview = useCallback((target: Project) => {
    const doc = buildPreviewDocument(
      fileContent(target, "index.html"),
      fileContent(target, "style.css"),
      fileContent(target, "script.js"),
    );
    setLogs([]);
    setPreview(doc);
    setPreviewKey((key) => key + 1);
  }, []);

  const run = () => {
    if (kind === "web") {
      refreshPreview(project);
      setTab("preview");
      return;
    }
    setLogs([]);
    setRunning(true);
    setTab("console");
    runIdRef.current = runner.run(kind, project.files[0].content);
  };

  const stop = () => {
    if (kind !== "web") runner.stop(kind, runIdRef.current);
  };

  // Live preview: rebuild shortly after typing stops.
  const webProject = workspace.projects.web;
  useEffect(() => {
    if (kind !== "web") return;
    const timer = setTimeout(() => refreshPreview(webProject), preview ? 500 : 0);
    return () => clearTimeout(timer);
    // `preview` only picks the first delay; it mustn't retrigger the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, webProject, refreshPreview]);

  // Console output and errors from the preview iframe.
  const onPreviewMessage = useEffectEvent((data: { level?: string; text?: unknown; line?: number }) => {
    const level = LOG_LEVELS.includes(data.level as LogLevel) ? (data.level as LogLevel) : "log";
    const line = preview ? toScriptLine(preview, data.line) : undefined;
    addLog({ level, text: String(data.text ?? ""), file: line ? "script.js" : undefined, line });
  });
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!previewRef.current || event.source !== previewRef.current.contentWindow) return;
      if (event.data?.source === "pg-preview") onPreviewMessage(event.data);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Python takes a few seconds to load, so start as soon as it's picked.
  useEffect(() => {
    if (kind === "python") runner.warm("python");
  }, [kind, runner]);

  // Underline error lines in the editor.
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    for (const f of project.files) {
      const model = monaco.editor.getModel(monaco.Uri.parse(modelPath(kind, f.name)));
      if (!model) continue;
      const markers = logs
        .filter((e) => e.level === "error" && e.file === f.name && e.line && e.line <= model.getLineCount())
        .map((e) => ({
          startLineNumber: e.line!,
          endLineNumber: e.line!,
          startColumn: model.getLineFirstNonWhitespaceColumn(e.line!) || 1,
          endColumn: model.getLineMaxColumn(e.line!),
          message: e.text,
          severity: monaco.MarkerSeverity.Error,
        }));
      monaco.editor.setModelMarkers(model, "playground", markers);
    }
  }, [logs, kind, project.files, file.name]);

  // ---- editing and saving -------------------------------------------------

  const updateFile = (name: string, content: string) => {
    setSaveFailed(false);
    setWorkspace((ws) => {
      const current = ws.projects[ws.kind];
      if (fileContent(current, name) === content) return ws;
      return {
        ...ws,
        projects: {
          ...ws.projects,
          [ws.kind]: {
            ...current,
            files: current.files.map((f) => (f.name === name ? { ...f, content } : f)),
          },
        },
      };
    });
  };

  const save = () => {
    if (!saveProject(project)) {
      setSaveFailed(true);
      return;
    }
    setSaveFailed(false);
    setSaved((s) => ({ ...s, [kind]: snapshot(project) }));
    setWorkspace((ws) => ({ ...ws, hasSaved: { ...ws.hasSaved, [kind]: true } }));
  };

  const reset = () => {
    const starter = starterProject(kind);
    const monaco = monacoRef.current;
    for (const f of starter.files) {
      monaco?.editor.getModel(monaco.Uri.parse(modelPath(kind, f.name)))?.setValue(f.content);
    }
    setWorkspace((ws) => ({ ...ws, projects: { ...ws.projects, [kind]: starter } }));
    setLogs([]);
  };

  const changeKind = (next: ProjectKind) => {
    if (next === kind) return;
    if (running) stop();
    setRunning(false);
    setLogs([]);
    setTab(next === "web" ? "preview" : "console");
    setWorkspace((ws) => ({ ...ws, kind: next }));
    saveLastKind(next);
  };

  const reveal = (fileName: string, line: number) => {
    setActiveFile((a) => ({ ...a, [kind]: fileName }));
    // Wait for the editor to switch models.
    setTimeout(() => {
      const ed = editorRef.current;
      if (!ed) return;
      ed.revealLineInCenter(line);
      ed.setPosition({ lineNumber: line, column: 1 });
      ed.focus();
    }, 50);
  };

  // Shortcuts that work when focus is outside the editor.
  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || !(event.metaKey || event.ctrlKey)) return;
    if (event.key === "Enter") {
      event.preventDefault();
      if (!running) run();
    } else if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      save();
    }
  });
  useEffect(() => {
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  // Warn before leaving with unsaved work.
  const anyDirty = Object.values(workspace.projects).some((p) => snapshot(p) !== saved[p.kind]);
  useEffect(() => {
    if (!anyDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  // ---- layout -------------------------------------------------------------

  return (
    <div className="flex h-[calc(100svh-3.5rem)] flex-col lg:h-svh">
      <h1 className="sr-only">Playground</h1>
      <PlaygroundToolbar
        kind={kind}
        onKindChange={changeKind}
        saveState={saveState}
        running={running}
        canFormat={file.language !== "python"}
        modKey={modKey}
        onRun={run}
        onStop={stop}
        onSave={save}
        onFormat={() => editorRef.current?.getAction("editor.action.formatDocument")?.run()}
        onReset={reset}
      />

      <ResizablePanelGroup
        key={isDesktop ? "horizontal" : "vertical"}
        orientation={isDesktop ? "horizontal" : "vertical"}
        className="min-h-0 flex-1"
      >
        <ResizablePanel defaultSize="55" minSize="25" className="flex flex-col bg-card">
          <Tabs
            value={file.name}
            onValueChange={(name) => setActiveFile((a) => ({ ...a, [kind]: name as string }))}
            className="h-10 shrink-0 justify-center gap-0 border-b px-2"
          >
            <TabsList variant="line" aria-label="Files">
              {project.files.map((f) => (
                <TabsTrigger key={f.name} value={f.name} className="font-mono text-[13px]">
                  {f.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="min-h-0 flex-1">
            <CodeEditor
              path={modelPath(kind, file.name)}
              language={file.language}
              defaultValue={file.content}
              label={`Code editor, ${file.name}`}
              compact={!isDesktop}
              onChange={(value) => updateFile(file.name, value)}
              onReady={(instance, monaco) => {
                editorRef.current = instance;
                monacoRef.current = monaco;
              }}
              onRun={() => {
                if (!running) run();
              }}
              onSave={save}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="45" minSize="20">
          <OutputPane
            kind={kind}
            tab={tab}
            onTabChange={setTab}
            logs={logs}
            running={running}
            runShortcut={`${modKey} Enter`}
            preview={kind === "web" && preview ? preview.html : null}
            previewKey={previewKey}
            previewRef={previewRef}
            viewport={viewport}
            onViewportChange={setViewport}
            onRefreshPreview={() => refreshPreview(project)}
            onClear={() => setLogs([])}
            onReveal={reveal}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <iframe {...runner.frameProps} />
    </div>
  );
}
