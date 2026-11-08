// Browser storage until accounts and Supabase land in Phase 7.
const KEY = "interview:v1";

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
  } catch {
    // Storage blocked or full: marks still work for this visit.
  }
}
