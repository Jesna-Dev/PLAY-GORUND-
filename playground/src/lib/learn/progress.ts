"use client";

import { queueUpload } from "@/lib/sync/client";
import type { SyncedKey } from "@/lib/sync/keys";
import { useSyncExternalStore } from "react";

/**
 * Learning progress, saved in this browser and to the account while signed in.
 * Keys are "<course>/<lesson>".
 */
export type LearnProgress = {
  /** Lesson key to the time it was completed. */
  completed: Record<string, number>;
  /** Lesson key to the time its exercise first passed. */
  passed: Record<string, number>;
  /** Lesson key to question id to the chosen option. */
  answers: Record<string, Record<string, number>>;
  /** The lesson opened most recently. */
  last?: string;
  /** Challenge slug to when it was first solved, and the languages it was solved in. */
  challenges: Record<string, { at: number; languages: string[] }>;
  /** The name printed on certificates. */
  name?: string;
};

const KEY = "learn:v1" satisfies SyncedKey;
const DRAFTS_KEY = "learn:drafts:v1" satisfies SyncedKey;
const EMPTY: LearnProgress = { completed: {}, passed: {}, answers: {}, challenges: {} };

let cached: { raw: string | null; value: LearnProgress } | null = null;
let memoryOnly: LearnProgress | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): LearnProgress {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw);
    return {
      completed: data.completed ?? {},
      passed: data.passed ?? {},
      answers: data.answers ?? {},
      last: typeof data.last === "string" ? data.last : undefined,
      challenges: data.challenges ?? {},
      name: typeof data.name === "string" ? data.name : undefined,
    };
  } catch {
    return EMPTY;
  }
}

function read(): LearnProgress {
  if (memoryOnly) return memoryOnly;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Storage blocked: progress lives in memory for this visit.
  }
  if (cached?.raw !== raw) cached = { raw, value: parse(raw) };
  return cached.value;
}

function update(change: (current: LearnProgress) => LearnProgress) {
  const next = change(read());
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    queueUpload(KEY);
  } catch {
    memoryOnly = next;
  }
  for (const listener of listeners) listener();
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

/** The server render shows empty progress; the browser fills it in. */
export function useLearnProgress() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const progress = {
  setCompleted(key: string, done: boolean) {
    update((p) => {
      const completed = { ...p.completed };
      if (done) completed[key] = Date.now();
      else delete completed[key];
      return { ...p, completed };
    });
  },
  setPassed(key: string) {
    update((p) => (p.passed[key] ? p : { ...p, passed: { ...p.passed, [key]: Date.now() } }));
  },
  setAnswer(key: string, questionId: string, option: number) {
    update((p) => ({
      ...p,
      answers: { ...p.answers, [key]: { ...p.answers[key], [questionId]: option } },
    }));
  },
  setChallengeSolved(slug: string, language: string) {
    update((p) => {
      const current = p.challenges[slug];
      if (current?.languages.includes(language)) return p;
      return {
        ...p,
        challenges: {
          ...p.challenges,
          [slug]: { at: current?.at ?? Date.now(), languages: [...(current?.languages ?? []), language] },
        },
      };
    });
  },
  setName(name: string) {
    update((p) => ({ ...p, name }));
  },
  setLast(key: string) {
    update((p) => (p.last === key ? p : { ...p, last: key }));
  },
};

// Drafts change on every keystroke, so they stay out of the reactive store.
function readDrafts(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function loadDraft(key: string): string | undefined {
  return readDrafts()[key];
}

export function saveDraft(key: string, code: string | null) {
  try {
    const drafts = readDrafts();
    if (code === null) delete drafts[key];
    else drafts[key] = code;
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    queueUpload(DRAFTS_KEY);
  } catch {
    // Not saved; the code is still in the editor.
  }
}
