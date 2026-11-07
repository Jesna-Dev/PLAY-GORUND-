import type { LanguageId } from "@/lib/languages";

export type ExerciseLanguage = "html" | "css" | "javascript" | "python";

export type Exercise = {
  /** Markdown shown above the editor. */
  prompt: string;
  language: ExerciseLanguage;
  starter: string;
  solution: string;
  /** Check code: JavaScript for web and JavaScript exercises, Python for Python. */
  tests: string;
  /** Fixed files for web exercises, like the HTML that a CSS exercise styles. */
  fixture: { html?: string; css?: string };
  /** Lines the program must print, in order. */
  expectedOutput?: string[];
  hints: string[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  courseId: LanguageId;
  slug: string;
  key: string;
  title: string;
  minutes: number;
  summary: string;
  body: string;
  exercise?: Exercise;
  quiz: QuizQuestion[];
};

export type Course = {
  id: LanguageId;
  title: string;
  tagline: string;
  description: string;
  audience: string;
  category: "programming" | "design";
  outcomes: string[];
  modules: { title: string; lessons: Lesson[] }[];
};

/** What client components need about a lesson: no bodies, exercises or answers. */
export type LessonSummary = {
  key: string;
  courseId: LanguageId;
  href: string;
  title: string;
  minutes: number;
  number: number;
  moduleTitle: string;
  hasExercise: boolean;
  /** Quiz answer keys, for accuracy stats. Already visible on lesson pages. */
  quiz: { id: string; answer: number }[];
};

export type CourseSummary = {
  id: LanguageId;
  title: string;
  href: string;
  lessons: LessonSummary[];
};
