/** Browser storage keys that are saved to the signed-in account. Theme stays per device. */
export const SYNCED_KEYS = ["learn:v1", "learn:drafts:v1", "playground:v1", "tutor:v1", "interview:v1", "editor:v1"] as const;

export type SyncedKey = (typeof SYNCED_KEYS)[number];

export function isSyncedKey(key: string): key is SyncedKey {
  return (SYNCED_KEYS as readonly string[]).includes(key);
}

/** Largest JSON value accepted for one key, in bytes. Playground projects are the biggest. */
export const MAX_VALUE_BYTES = 1_000_000;
