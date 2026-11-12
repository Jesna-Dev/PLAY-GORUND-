import { queueUpload } from "@/lib/sync/client";
import type { SyncedKey } from "@/lib/sync/keys";
import type { TutorMessage } from "./types";

// Saved in this browser, and to the account while signed in.
const KEY = "tutor:v1" satisfies SyncedKey;

export function loadConversation(): TutorMessage[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is TutorMessage =>
        (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string" && m.content !== "",
    );
  } catch {
    return [];
  }
}

export function saveConversation(messages: TutorMessage[]) {
  try {
    if (messages.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(messages));
    queueUpload(KEY);
  } catch {
    // Storage blocked or full: the chat still works for this visit.
  }
}
