"use client";

import { useSyncExternalStore } from "react";

export const EDITOR_FONT_SIZES = [13, 14, 16, 18] as const;

export type EditorSettings = {
  fontSize: (typeof EDITOR_FONT_SIZES)[number];
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
};

const KEY = "editor:v1";
const DEFAULTS: EditorSettings = { fontSize: 14, wordWrap: false, lineNumbers: true, minimap: false };

let cached: { raw: string | null; value: EditorSettings } | null = null;
let memoryOnly: EditorSettings | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): EditorSettings {
  try {
    const data = JSON.parse(raw ?? "{}");
    return {
      fontSize: EDITOR_FONT_SIZES.includes(data.fontSize) ? data.fontSize : DEFAULTS.fontSize,
      wordWrap: typeof data.wordWrap === "boolean" ? data.wordWrap : DEFAULTS.wordWrap,
      lineNumbers: typeof data.lineNumbers === "boolean" ? data.lineNumbers : DEFAULTS.lineNumbers,
      minimap: typeof data.minimap === "boolean" ? data.minimap : DEFAULTS.minimap,
    };
  } catch {
    return DEFAULTS;
  }
}

function read(): EditorSettings {
  if (memoryOnly) return memoryOnly;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Storage blocked: settings live in memory for this visit.
  }
  if (cached?.raw !== raw) cached = { raw, value: parse(raw) };
  return cached.value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useEditorSettings() {
  return useSyncExternalStore(subscribe, read, () => DEFAULTS);
}

export function updateEditorSettings(change: Partial<EditorSettings>) {
  const next = { ...read(), ...change };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    memoryOnly = next;
  }
  for (const listener of listeners) listener();
}
