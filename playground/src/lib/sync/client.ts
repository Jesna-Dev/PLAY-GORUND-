"use client";

import { SYNCED_KEYS, type SyncedKey } from "./keys";

/**
 * Keeps browser storage and the signed-in account in step. The stores keep
 * reading and writing browser storage as before, so the app works the same
 * signed out or offline; each save also calls queueUpload, which sends the new
 * value to the server a moment later while someone is signed in.
 */

const UPLOAD_DELAY_MS = 1000;

let enabled = false;
const pending = new Map<SyncedKey, ReturnType<typeof setTimeout>>();

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

async function upload(key: SyncedKey, keepalive = false) {
  pending.delete(key);
  const raw = readRaw(key);
  try {
    if (raw === null) {
      await fetch(`/api/data?key=${encodeURIComponent(key)}`, { method: "DELETE", keepalive });
    } else {
      await fetch(`/api/data/${encodeURIComponent(key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: raw,
        keepalive: keepalive && raw.length < 60_000, // browsers cap keepalive bodies at 64 KB
      });
    }
  } catch {
    // Offline. The value is still in this browser and goes up with the next save or sign-in.
  }
}

/** Call after a store writes to browser storage. */
export function queueUpload(key: SyncedKey) {
  if (!enabled) return;
  clearTimeout(pending.get(key));
  pending.set(key, setTimeout(() => void upload(key), UPLOAD_DELAY_MS));
}

/** Send anything still waiting, for example before signing out. */
export async function flushUploads(keepalive = false) {
  const keys = [...pending.keys()];
  for (const key of keys) clearTimeout(pending.get(key));
  await Promise.all(keys.map((key) => upload(key, keepalive)));
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => void flushUploads(true));
}

export function setSyncEnabled(on: boolean) {
  enabled = on;
}

type Learn = {
  completed?: Record<string, number>;
  passed?: Record<string, number>;
  answers?: Record<string, Record<string, number>>;
  challenges?: Record<string, { at: number; languages: string[] }>;
  last?: string;
  name?: string;
};

function earliest(a: Record<string, number> = {}, b: Record<string, number> = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in out ? Math.min(out[k], v) : v;
  return out;
}

/** Progress made on this device before signing in is added to the account, never lost. */
function mergeLearn(local: Learn, server: Learn): Learn {
  const answers: Learn["answers"] = { ...server.answers };
  for (const [lesson, chosen] of Object.entries(local.answers ?? {})) answers[lesson] = { ...answers[lesson], ...chosen };
  const challenges: Learn["challenges"] = { ...server.challenges };
  for (const [slug, solved] of Object.entries(local.challenges ?? {})) {
    const other = challenges[slug];
    challenges[slug] = other
      ? { at: Math.min(other.at, solved.at), languages: [...new Set([...other.languages, ...solved.languages])] }
      : solved;
  }
  return {
    completed: earliest(server.completed, local.completed),
    passed: earliest(server.passed, local.passed),
    answers,
    challenges,
    last: local.last ?? server.last,
    name: server.name || local.name,
  };
}

/** Postgres stores JSON with its keys reordered, so compare values with key order ignored. */
function sameValue(a: unknown, b: unknown): boolean {
  const sorted = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(sorted)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.entries(v).sort(([x], [y]) => (x < y ? -1 : 1)).map(([k, val]) => [k, sorted(val)]))
        : v;
  return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
}

/**
 * Bring this browser up to date with the account. Learning progress is merged;
 * for everything else the account's copy wins, and anything only this browser
 * has is uploaded. Returns whether browser storage changed.
 */
export async function pullAndMerge(): Promise<boolean> {
  const response = await fetch("/api/data", { cache: "no-store" });
  if (!response.ok) return false;
  const { data } = (await response.json()) as { data: Partial<Record<SyncedKey, unknown>> };

  let changed = false;
  for (const key of SYNCED_KEYS) {
    const localRaw = readRaw(key);
    const server = data[key];

    if (server === undefined) {
      if (localRaw !== null) await upload(key);
      continue;
    }

    let next = server;
    if (key === "learn:v1" && localRaw) {
      try {
        next = mergeLearn(JSON.parse(localRaw), server as Learn);
      } catch {
        // Unreadable local copy: take the account's.
      }
    }
    const nextRaw = JSON.stringify(next);
    let localValue: unknown = null;
    try {
      localValue = localRaw === null ? null : JSON.parse(localRaw);
    } catch {
      // Unreadable: replace it.
    }
    if (!sameValue(next, localValue)) {
      try {
        localStorage.setItem(key, nextRaw);
        changed = true;
        // Stores listen for this event, the same one another tab would send.
        window.dispatchEvent(new StorageEvent("storage", { key, newValue: nextRaw }));
      } catch {
        // Storage blocked: this visit keeps what it has.
      }
    }
    if (!sameValue(next, server)) await upload(key);
  }
  return changed;
}

/** Remove the account's data from this browser, so the next person starts clean. */
export function clearLocalData() {
  for (const key of SYNCED_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to remove.
    }
  }
}

/** Delete stores from the account. Does nothing when signed out. */
export async function deleteFromAccount(keys: readonly SyncedKey[]) {
  if (!enabled) return;
  for (const key of keys) clearTimeout(pending.get(key));
  const query = keys.map((k) => `key=${encodeURIComponent(k)}`).join("&");
  await fetch(`/api/data?${query}`, { method: "DELETE" }).catch(() => {});
}
