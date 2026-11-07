"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Editor, { type BeforeMount, loader, type Monaco, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useIsDark } from "@/hooks/use-is-dark";
import type { FileLanguage } from "@/lib/playground/types";

const MONACO_VERSION = "0.57.0";
loader.config({
  paths: { vs: `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs` },
});

// Monaco needs hex colors. These match the card and syntax tokens in globals.css.
const defineThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("playground-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "9399a0", fontStyle: "italic" },
      { token: "keyword", foreground: "c5da00" },
      { token: "string", foreground: "f2b966" },
      { token: "number", foreground: "ffa08f" },
      { token: "tag", foreground: "c5da00" },
      { token: "attribute.name", foreground: "8cc3fc" },
      { token: "attribute.value", foreground: "f2b966" },
    ],
    colors: {
      "editor.background": "#111111",
      "editor.foreground": "#f5f5f5",
      "editor.lineHighlightBackground": "#1a1a1a",
      "editor.lineHighlightBorder": "#1a1a1a",
      "editor.selectionBackground": "#3d4400",
      "editor.inactiveSelectionBackground": "#2a2f00",
      "editorCursor.foreground": "#c5da00",
      "editorLineNumber.foreground": "#8a8a8a",
      "editorLineNumber.activeForeground": "#e5e5e5",
      "editorIndentGuide.background1": "#262626",
      "editorWidget.background": "#161616",
      "editorSuggestWidget.background": "#161616",
      "editorSuggestWidget.selectedBackground": "#2a2f00",
      "editorUnnecessaryCode.opacity": "#000000c0",
    },
  });
  monaco.editor.defineTheme("playground-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "555c63", fontStyle: "italic" },
      { token: "keyword", foreground: "566000" },
      { token: "string", foreground: "9d5300" },
      { token: "number", foreground: "af3e30" },
      { token: "tag", foreground: "566000" },
      { token: "attribute.name", foreground: "2f60b2" },
      { token: "attribute.value", foreground: "9d5300" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#0a0a0a",
      "editor.lineHighlightBackground": "#f4f4f1",
      "editor.lineHighlightBorder": "#f4f4f1",
      "editor.selectionBackground": "#e6efa3",
      "editorCursor.foreground": "#566000",
      "editorLineNumber.foreground": "#6b6b6b",
      "editorLineNumber.activeForeground": "#1a1a1a",
      "editorIndentGuide.background1": "#ececea",
      "editorSuggestWidget.selectedBackground": "#f0f3dc",
      // Monaco fades unused code to about 3:1 contrast by default; keep the hint readable.
      "editorUnnecessaryCode.opacity": "#000000c0",
    },
  });
};

export function modelPath(kind: string, fileName: string) {
  return `file:///${kind}/${fileName}`;
}

export function CodeEditor({
  path,
  language,
  defaultValue,
  label,
  compact,
  onChange,
  onReady,
  onRun,
  onSave,
}: {
  path: string;
  language: FileLanguage;
  defaultValue: string;
  label: string;
  compact: boolean;
  onChange: (value: string) => void;
  onReady: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
  onRun: () => void;
  onSave: () => void;
}) {
  const isDark = useIsDark();
  const [failed, setFailed] = useState(false);
  const actions = useRef({ onRun, onSave });
  useLayoutEffect(() => {
    actions.current = { onRun, onSave };
  });

  useEffect(() => {
    const init = loader.init();
    init.catch((error: { type?: string }) => {
      if (error?.type !== "cancelation") setFailed(true);
    });
    return () => init.cancel();
  }, []);

  const handleMount: OnMount = (instance, monaco) => {
    // Ctrl/Cmd+Enter would otherwise insert a line.
    instance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => actions.current.onRun());
    instance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => actions.current.onSave());
    // Measure again once the web font has loaded, so the cursor lines up.
    document.fonts?.ready.then(() => monaco.editor.remeasureFonts());
    onReady(instance, monaco);
  };

  if (failed) {
    return (
      <div role="alert" className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        The editor couldn’t load. Check your internet connection, then refresh the page.
      </div>
    );
  }

  const fontFamily =
    typeof window === "undefined"
      ? "monospace"
      : getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono") || "monospace";

  return (
    <Editor
      path={path}
      language={language}
      defaultValue={defaultValue}
      theme={isDark ? "playground-dark" : "playground-light"}
      beforeMount={defineThemes}
      onMount={handleMount}
      onChange={(value) => onChange(value ?? "")}
      keepCurrentModel
      loading={<p className="p-4 text-sm text-muted-foreground">Loading editor…</p>}
      options={{
        ariaLabel: label,
        fontFamily,
        fontSize: compact ? 13 : 14,
        lineHeight: compact ? 20 : 22,
        tabSize: language === "python" ? 4 : 2,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        lineNumbersMinChars: 3,
        fixedOverflowWidgets: true,
        stickyScroll: { enabled: false },
        bracketPairColorization: { enabled: true },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      }}
    />
  );
}
