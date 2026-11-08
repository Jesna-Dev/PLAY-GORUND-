import type { TutorMessage } from "./types";

// Browser storage until accounts and Supabase land in Phase 7.
const KEY = "tutor:v1";

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
  } catch {
    // Storage blocked or full: the chat still works for this visit.
  }
}
