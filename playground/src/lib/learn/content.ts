import "server-only";
import fs from "node:fs";
import path from "node:path";
import { courseIndex } from "@/content/learn/courses";
import type { Course, CourseSummary, Exercise, ExerciseLanguage, Lesson, QuizQuestion } from "./types";

const ROOT = path.join(process.cwd(), "src/content/learn");
const FENCE = /```(\w+) (starter|solution|tests|fixture|expected|hints)\n([\s\S]*?)\n?```/g;
const LANGUAGES: Record<string, ExerciseLanguage> = {
  html: "html",
  css: "css",
  js: "javascript",
  javascript: "javascript",
  python: "python",
};

export const lessonKey = (courseId: string, slug: string) => `${courseId}/${slug}`;
export const lessonHref = (courseId: string, slug: string) => `/learn/${courseId}/${slug}`;

function fail(file: string, message: string): never {
  throw new Error(`Lesson ${file}: ${message}`);
}

function parseExercise(file: string, section: string): Exercise {
  const blocks: Partial<Record<string, { lang: string; code: string }>> = {};
  const prompt = section
    .replace(FENCE, (_, lang: string, role: string, code: string) => {
      blocks[role] = { lang, code };
      return "";
    })
    .trim();

  const { starter, solution, tests, fixture, expected, hints } = blocks;
  if (!starter || !solution || !tests) fail(file, "an exercise needs starter, solution and tests blocks");
  const language = LANGUAGES[starter.lang];
  if (!language) fail(file, `unsupported exercise language "${starter.lang}"`);

  return {
    prompt,
    language,
    starter: starter.code.replace(/\s*$/, "\n"),
    solution: solution.code.replace(/\s*$/, "\n"),
    tests: tests.code,
    fixture: fixture ? { [fixture.lang]: fixture.code } : {},
    expectedOutput: expected?.code.split("\n"),
    hints: hints?.code.split("\n").filter(Boolean) ?? [],
  };
}

function parseQuiz(file: string, section: string): QuizQuestion[] {
  return section
    .split(/^### /m)
    .slice(1)
    .map((chunk, index) => {
      const [prompt, ...lines] = chunk.trim().split("\n");
      const options: string[] = [];
      let answer = -1;
      const explanation: string[] = [];
      for (const line of lines) {
        const option = /^- \[( |x)\] (.+)$/.exec(line);
        if (option) {
          if (option[1] === "x") answer = options.length;
          options.push(option[2]);
        } else if (line.startsWith("> ")) {
          explanation.push(line.slice(2));
        }
      }
      if (options.length < 2 || answer < 0) {
        fail(file, `quiz question ${index + 1} needs at least two options and one marked [x]`);
      }
      return { id: `q${index + 1}`, prompt: prompt.trim(), options, answer, explanation: explanation.join(" ") };
    });
}

function parseLesson(courseId: Course["id"], slug: string): Lesson {
  const file = `${courseId}/${slug}.md`;
  const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
  const front = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  if (!front) fail(file, "missing front matter");
  const meta = Object.fromEntries(
    front[1].split("\n").map((line) => {
      const at = line.indexOf(":");
      return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }),
  );
  if (!meta.title || !meta.minutes || !meta.summary) fail(file, "front matter needs title, minutes and summary");

  const rest = raw.slice(front[0].length);
  const [beforeQuiz, quizSection] = rest.split("<!-- quiz -->");
  if (quizSection === undefined) fail(file, "missing <!-- quiz --> section");
  const [body, exerciseSection] = beforeQuiz.split("<!-- exercise -->");

  return {
    courseId,
    slug,
    key: lessonKey(courseId, slug),
    title: meta.title,
    minutes: Number(meta.minutes),
    summary: meta.summary,
    body: body.trim(),
    exercise: exerciseSection ? parseExercise(file, exerciseSection) : undefined,
    quiz: parseQuiz(file, quizSection),
  };
}

let cache: Course[] | null = null;

export function getCourses(): Course[] {
  // Reparse on every request in development, so edits to lesson files show up.
  if (process.env.NODE_ENV !== "production") cache = null;
  cache ??= courseIndex.map((meta) => ({
    ...meta,
    modules: meta.modules.map((m) => ({
      title: m.title,
      lessons: m.lessons.map((slug) => parseLesson(meta.id, slug)),
    })),
  }));
  return cache;
}

export function getCourse(id: string) {
  return getCourses().find((c) => c.id === id);
}

export function allLessons(course: Course) {
  return course.modules.flatMap((m, moduleIndex) =>
    m.lessons.map((lesson) => ({ lesson, moduleTitle: m.title, moduleIndex })),
  );
}

export function getLessonContext(courseId: string, slug: string) {
  const course = getCourse(courseId);
  if (!course) return null;
  const lessons = allLessons(course);
  const index = lessons.findIndex((l) => l.lesson.slug === slug);
  if (index === -1) return null;
  const link = (i: number) =>
    lessons[i]
      ? { href: lessonHref(courseId, lessons[i].lesson.slug), title: lessons[i].lesson.title }
      : null;
  return {
    course,
    ...lessons[index],
    number: index + 1,
    total: lessons.length,
    prev: link(index - 1),
    next: link(index + 1),
  };
}

export function getCourseSummaries(): CourseSummary[] {
  return getCourses().map((course) => ({
    id: course.id,
    title: course.title,
    href: `/learn/${course.id}`,
    lessons: allLessons(course).map(({ lesson, moduleTitle }, index) => ({
      key: lesson.key,
      courseId: course.id,
      href: lessonHref(course.id, lesson.slug),
      title: lesson.title,
      minutes: lesson.minutes,
      number: index + 1,
      moduleTitle,
      hasExercise: Boolean(lesson.exercise),
      quiz: lesson.quiz.map(({ id, answer }) => ({ id, answer })),
    })),
  }));
}
