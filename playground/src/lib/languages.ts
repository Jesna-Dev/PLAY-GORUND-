export const languages = {
  html: { name: "HTML", monogram: "<>", color: "var(--lang-html)" },
  css: { name: "CSS", monogram: "#", color: "var(--lang-css)" },
  javascript: { name: "JavaScript", monogram: "JS", color: "var(--lang-javascript)" },
  python: { name: "Python", monogram: "Py", color: "var(--lang-python)" },
  react: { name: "React", monogram: "Re", color: "var(--lang-react)" },
  typescript: { name: "TypeScript", monogram: "TS", color: "var(--lang-typescript)" },
  uiux: { name: "UI/UX", monogram: "UX", color: "var(--lang-uiux)" },
} as const;

export type LanguageId = keyof typeof languages;
