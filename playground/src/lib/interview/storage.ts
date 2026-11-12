import { queueUpload } from "@/lib/sync/client";
import type { SyncedKey } from "@/lib/sync/keys";
// Saved in this browser, and to the account while signed in.
const KEY = "interview:v1" satisfies SyncedKey;

export type QuestionStatus = "known" | "review";
export type InterviewStatuses = Record<string, QuestionStatus>;

export function loadStatuses(): InterviewStatuses {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as InterviewStatuses) : {};
  } catch {
    return {};
  }
}

export function saveStatuses(statuses: InterviewStatuses) {
  try {
    localStorage.setItem(KEY, JSON.stringify(statuses));
    queueUpload(KEY);
  } catch {
    // Storage blocked or full: marks still work for this visit.
  }
}
