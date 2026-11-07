"use client";

import { useSyncExternalStore } from "react";
import type { ChallengeLanguage } from "./types";

const KEY = "challenges:language";
const listeners = new Set<() => void>();
let memory: ChallengeLanguage | null = null;

function read(): ChallengeLanguage {
  if (memory) return memory;
  try {
    return localStorage.getItem(KEY) === "python" ? "python" : "javascript";
  } catch {
    return "javascript";
  }
}

/** The language picked for challenges, shared by the examples and the editor. */
export function useChallengeLanguage() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    read,
    () => "javascript" as const,
  );
}

export function setChallengeLanguage(language: ChallengeLanguage) {
  try {
    localStorage.setItem(KEY, language);
  } catch {
    memory = language;
  }
  for (const listener of listeners) listener();
}
