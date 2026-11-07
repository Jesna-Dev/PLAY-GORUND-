import type { Difficulty } from "./levels";

export type ChallengeLanguage = "javascript" | "python";

export type Signature = { name: string; params: string[] };

export type TestCase = { args: unknown[]; expected: unknown; example?: boolean };

/** Everything the browser needs to run and check a challenge. */
export type ChallengeRunData = {
  slug: string;
  signatures: Record<ChallengeLanguage, Signature>;
  tests: TestCase[];
};

export type Challenge = ChallengeRunData & {
  title: string;
  difficulty: Difficulty;
  minutes: number;
  topics: string[];
  description: string;
  hints: string[];
  solution: string;
};

export type ChallengeSummary = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  minutes: number;
  topics: string[];
  href: string;
};
