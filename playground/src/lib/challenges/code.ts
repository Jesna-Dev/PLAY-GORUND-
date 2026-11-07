import type { ChallengeLanguage, ChallengeRunData, Signature, TestCase } from "./types";

export const languageNames: Record<ChallengeLanguage, string> = { javascript: "JavaScript", python: "Python" };
export const fileNames: Record<ChallengeLanguage, string> = { javascript: "solution.js", python: "solution.py" };

/** Shows a value the way the chosen language writes it. */
export function formatValue(value: unknown, language: ChallengeLanguage): string {
  if (language === "python") {
    if (value === true) return "True";
    if (value === false) return "False";
    if (value === null) return "None";
  }
  if (Array.isArray(value)) return `[${value.map((v) => formatValue(v, language)).join(", ")}]`;
  return JSON.stringify(value);
}

export function formatCall(signature: Signature, args: unknown[], language: ChallengeLanguage) {
  return `${signature.name}(${args.map((a) => formatValue(a, language)).join(", ")})`;
}

export function starterCode(challenge: ChallengeRunData, language: ChallengeLanguage) {
  const signature = challenge.signatures[language];
  const example = challenge.tests.find((t) => t.example) ?? challenge.tests[0];
  const call = formatCall(signature, example.args, language);
  const params = signature.params.join(", ");
  return language === "javascript"
    ? `function ${signature.name}(${params}) {\n  // Write your solution here\n}\n\nconsole.log(${call});\n`
    : `def ${signature.name}(${params}):\n    # Write your solution here\n    pass\n\n\nprint(${call})\n`;
}

/**
 * Test code for the shared harness in lib/learn/harness.ts. Arguments are
 * parsed from JSON on every case, so a solution that changes its input can't
 * affect the next test.
 */
export function testCode(challenge: ChallengeRunData, language: ChallengeLanguage, cases: TestCase[]) {
  const signature = challenge.signatures[language];
  return cases
    .map((testCase) => {
      const name = `${formatCall(signature, testCase.args, language)} returns ${formatValue(testCase.expected, language)}`;
      const args = JSON.stringify(JSON.stringify(testCase.args));
      const expected = JSON.stringify(JSON.stringify(testCase.expected));
      return language === "javascript"
        ? `check(${JSON.stringify(name)}, () => equal(${signature.name}(...JSON.parse(${args})), JSON.parse(${expected})));`
        : `check(${JSON.stringify(name)}, lambda: equal(${signature.name}(*__import__("json").loads(${args})), __import__("json").loads(${expected})))`;
    })
    .join("\n");
}
