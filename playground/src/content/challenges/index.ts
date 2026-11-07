import type { Difficulty } from "@/lib/challenges/levels";

/** Challenge files are `<slug>.md`, listed here in the order they're shown. */
export const challengeOrder: Record<Difficulty, string[]> = {
  beginner: ["reverse-string", "count-vowels", "fizz-buzz", "largest-number"],
  intermediate: ["balanced-brackets", "palindrome-sentence", "most-common-word", "two-sum"],
  advanced: ["merge-intervals", "longest-unique-substring", "spiral-matrix"],
};
