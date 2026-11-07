import "server-only";
import fs from "node:fs";
import path from "node:path";
import { challengeOrder } from "@/content/challenges";
import { type Difficulty, levels } from "./levels";
import type { Challenge, ChallengeSummary, Signature, TestCase } from "./types";

const ROOT = path.join(process.cwd(), "src/content/challenges");

function fail(file: string, message: string): never {
  throw new Error(`Challenge ${file}: ${message}`);
}

function parseSignature(file: string, value: string | undefined): Signature {
  const match = value && /^(\w+)\(([\w,\s]*)\)$/.exec(value);
  if (!match) fail(file, `invalid signature "${value}"`);
  return { name: match[1], params: match[2].split(",").map((p) => p.trim()).filter(Boolean) };
}

function parseChallenge(slug: string, difficulty: Difficulty): Challenge {
  const file = `${slug}.md`;
  const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
  const front = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  if (!front) fail(file, "missing front matter");
  const meta = Object.fromEntries(
    front[1].split("\n").map((line) => {
      const at = line.indexOf(":");
      return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }),
  );
  if (meta.difficulty !== difficulty) fail(file, `difficulty is "${meta.difficulty}" but it's listed under ${difficulty}`);

  const rest = raw.slice(front[0].length);
  const [description, afterTests] = rest.split("<!-- tests -->");
  const [testsSection, afterHints] = (afterTests ?? "").split("<!-- hints -->");
  const [hintsSection, solution] = (afterHints ?? "").split("<!-- solution -->");
  if (!afterTests || !afterHints || solution === undefined) {
    fail(file, "needs <!-- tests -->, <!-- hints --> and <!-- solution --> sections in that order");
  }

  const json = /```json\n([\s\S]*?)\n```/.exec(testsSection);
  if (!json) fail(file, "the tests section needs a ```json block");
  let tests: TestCase[];
  try {
    tests = JSON.parse(json[1]);
  } catch (error) {
    fail(file, `tests aren't valid JSON: ${(error as Error).message}`);
  }
  if (tests.length < 3 || !tests.some((t) => t.example)) fail(file, "needs at least 3 tests, with at least one example");

  return {
    slug,
    title: meta.title,
    difficulty,
    minutes: Number(meta.minutes),
    topics: (meta.topics ?? "").split(",").map((t: string) => t.trim()).filter(Boolean),
    description: description.trim(),
    signatures: { javascript: parseSignature(file, meta.js), python: parseSignature(file, meta.python) },
    tests,
    hints: hintsSection
      .split("\n")
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim()),
    solution: solution.trim(),
  };
}

let cache: Challenge[] | null = null;

export function getChallenges(): Challenge[] {
  cache ??= levels.flatMap((level) => challengeOrder[level.id].map((slug) => parseChallenge(slug, level.id)));
  return cache;
}

export function getChallenge(slug: string) {
  return getChallenges().find((c) => c.slug === slug);
}

export function getChallengeSummaries(): ChallengeSummary[] {
  return getChallenges().map(({ slug, title, difficulty, minutes, topics }) => ({
    slug,
    title,
    difficulty,
    minutes,
    topics,
    href: `/challenges/${slug}`,
  }));
}
