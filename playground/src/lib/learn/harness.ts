import type { LogEntry } from "@/lib/playground/types";
import type { Exercise } from "./types";

/**
 * Exercise checks run after the learner's code, in the same sandbox, and
 * report results by printing a marker line. Tests are wrapped in a function
 * that receives the helpers, so learner code can't clash with their names.
 */
export const BEGIN_MARKER = "__PG_BEGIN__";
export const RESULTS_MARKER = "__PG_RESULTS__";

export type CheckResult = { name: string; pass: boolean; message?: string };

export function javascriptHarness(tests: string) {
  return `
;console.log(${JSON.stringify(BEGIN_MARKER)});
{
  const __pgResults = [];
  ((check, equal) => {
${tests}
  })(
    (name, fn) => {
      try {
        if (fn() === false) throw new Error("Not quite yet.");
        __pgResults.push({ name, pass: true });
      } catch (error) {
        __pgResults.push({ name, pass: false, message: error && error.message ? error.message : String(error) });
      }
    },
    (actual, expected) => {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) throw new Error("Expected " + b + ", but got " + (a === undefined ? "undefined" : a) + ".");
    },
  );
  console.log(${JSON.stringify(RESULTS_MARKER)} + JSON.stringify(__pgResults));
}
`;
}

export function pythonHarness(tests: string) {
  const indented = tests
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");
  return `

print(${JSON.stringify(BEGIN_MARKER)})


def __pg_run_checks():
    import json
    results = []

    def check(name, fn):
        try:
            if fn() is False:
                raise AssertionError("Not quite yet.")
            results.append({"name": name, "pass": True})
        except AssertionError as error:
            results.append({"name": name, "pass": False, "message": str(error)})
        except Exception as error:
            results.append({"name": name, "pass": False, "message": f"{type(error).__name__}: {error}"})

    def equal(actual, expected):
        if actual != expected:
            raise AssertionError(f"Expected {expected!r}, but got {actual!r}.")

${indented}
    print(${JSON.stringify(RESULTS_MARKER)} + json.dumps(results))


__pg_run_checks()
`;
}

/** Runs in the preview iframe after the page has loaded its HTML and CSS. */
export function webHarness(tests: string) {
  return `(() => {
  const results = [];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const text = (selector) => $(selector)?.textContent.trim();
  const el = (target) => (typeof target === "string" ? $(target) : target);
  const css = (target, property) => {
    const node = el(target);
    return node ? getComputedStyle(node)[property] : undefined;
  };
  // Backslashes are doubled because this is inside a TypeScript template string.
  const parseRgb = (value) => {
    const m = /rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/.exec(value || "");
    return m && { rgb: [Number(m[1]), Number(m[2]), Number(m[3])], alpha: m[4] === undefined ? 1 : Number(m[4]) };
  };
  const color = (target, property = "color") => {
    const value = css(target, property);
    const parsed = parseRgb(value);
    if (!parsed) return value;
    if (parsed.alpha === 0) return "transparent";
    return "#" + parsed.rgb.map((n) => n.toString(16).padStart(2, "0")).join("");
  };
  const luminance = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  // WCAG contrast of an element's text against the nearest opaque background.
  const contrast = (target) => {
    const node = el(target);
    if (!node) return 0;
    const text = parseRgb(getComputedStyle(node).color);
    let background = [255, 255, 255];
    for (let n = node; n; n = n.parentElement) {
      const bg = parseRgb(getComputedStyle(n).backgroundColor);
      if (bg && bg.alpha > 0) {
        background = bg.rgb;
        break;
      }
    }
    const a = luminance(text.rgb);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const rules = () => {
    const out = [];
    const walk = (list, media) => {
      for (const rule of list) {
        if (rule.conditionText !== undefined && rule.cssRules) walk(rule.cssRules, rule.conditionText);
        else if (rule.selectorText) out.push({ selector: rule.selectorText, style: rule.style, media });
      }
    };
    for (const sheet of document.styleSheets) {
      try { walk(sheet.cssRules); } catch {}
    }
    return out;
  };
  const check = (name, fn) => {
    try {
      if (fn() === false) throw new Error("Not quite yet.");
      results.push({ name, pass: true });
    } catch (error) {
      results.push({ name, pass: false, message: error && error.message ? error.message : String(error) });
    }
  };
  const equal = (actual, expected) => {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error("Expected " + b + ", but got " + (a === undefined ? "nothing" : a) + ".");
  };
  try {
${tests}
  } catch (error) {
    results.push({ name: "Run the checks", pass: false, message: error.message });
  }
  console.log(${JSON.stringify(RESULTS_MARKER)} + JSON.stringify(results));
})();`;
}

export type Evaluation =
  | { status: "passed" | "failed"; results: CheckResult[] }
  | { status: "crashed" };

/** Turns the run's console output into check results. */
export function evaluate(exercise: Pick<Exercise, "expectedOutput">, logs: LogEntry[]): Evaluation {
  const resultLine = logs.find((l) => l.text.startsWith(RESULTS_MARKER));
  if (!resultLine) return { status: "crashed" };

  let results: CheckResult[];
  try {
    results = JSON.parse(resultLine.text.slice(RESULTS_MARKER.length));
  } catch {
    return { status: "crashed" };
  }

  if (exercise.expectedOutput) {
    const begin = logs.findIndex((l) => l.text === BEGIN_MARKER);
    const printed = logs
      .slice(0, begin === -1 ? undefined : begin)
      .filter((l) => l.level === "log" || l.level === "info")
      .flatMap((l) => l.text.split("\n"))
      .map((line) => line.trimEnd());
    const expected = exercise.expectedOutput;
    const pass = printed.length === expected.length && printed.every((line, i) => line === expected[i]);
    results.unshift({
      name: "Prints the expected output",
      pass,
      message: pass
        ? undefined
        : `Expected:\n${expected.join("\n")}\n\nYour program printed:\n${printed.join("\n") || "(nothing)"}`,
    });
  }

  return { status: results.every((r) => r.pass) ? "passed" : "failed", results };
}

/** Hides marker lines from the console the learner sees. */
export const isMarker = (entry: LogEntry) =>
  entry.text === BEGIN_MARKER || entry.text.startsWith(RESULTS_MARKER);
