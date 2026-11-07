import "server-only";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// The "default" GitHub themes meet 4.5:1 contrast on our card colors; the classic ones don't.
export const codeThemes = { light: "github-light-default", dark: "github-dark-default" } as const;

let highlighter: Promise<HighlighterCore> | null = null;

/** Highlighting runs at build time, so lesson pages ship no highlighter code. */
export function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import("@shikijs/themes/github-light-default"), import("@shikijs/themes/github-dark-default")],
    langs: [
      import("@shikijs/langs/html"),
      import("@shikijs/langs/css"),
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/jsx"),
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/python"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}
