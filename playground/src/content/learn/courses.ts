import type { LanguageId } from "@/lib/languages";

export type CourseMeta = {
  id: LanguageId;
  title: string;
  tagline: string;
  description: string;
  audience: string;
  category: "programming" | "design";
  outcomes: string[];
  /** Lesson files are `<id>/<slug>.md`, in this order. */
  modules: { title: string; lessons: string[] }[];
};

export const courseIndex: CourseMeta[] = [
  {
    id: "html",
    title: "HTML Fundamentals",
    tagline: "Build the structure of a web page.",
    description:
      "Learn how web pages are put together: headings, paragraphs, links, images, lists, and the landmarks that make a page easy to navigate.",
    audience: "No experience needed",
    category: "programming",
    outcomes: [
      "Write elements and nest them correctly",
      "Add links, and images with useful alt text",
      "Organize content with lists",
      "Structure a page with header, main and footer",
    ],
    modules: [
      { title: "Your first page", lessons: ["what-is-html", "links-and-images"] },
      { title: "Structure and meaning", lessons: ["lists", "page-structure"] },
    ],
  },
  {
    id: "css",
    title: "CSS Fundamentals",
    tagline: "Style pages with color, spacing and layout.",
    description:
      "Learn how CSS picks elements and styles them, how spacing works, and how to build layouts that adapt from phones to wide screens.",
    audience: "Best after HTML Fundamentals",
    category: "programming",
    outcomes: [
      "Write rules with element and class selectors",
      "Control spacing with the box model",
      "Lay out items with flexbox",
      "Build responsive grids with media queries",
    ],
    modules: [
      { title: "Styling basics", lessons: ["selectors", "box-model"] },
      { title: "Layout", lessons: ["flexbox", "responsive-design"] },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript Fundamentals",
    tagline: "Write programs that store, decide and repeat.",
    description:
      "Learn the core of programming with JavaScript: variables, functions, decisions and loops, with exercises that check your code as you go.",
    audience: "No experience needed",
    category: "programming",
    outcomes: [
      "Store values in variables and build strings",
      "Write functions that return results",
      "Make decisions with if and else",
      "Work through lists with arrays and loops",
    ],
    modules: [
      { title: "Values and functions", lessons: ["variables", "functions"] },
      { title: "Decisions and data", lessons: ["conditionals", "arrays-and-loops"] },
    ],
  },
  {
    id: "python",
    title: "Python Fundamentals",
    tagline: "Write clear programs in Python 3.",
    description:
      "Learn Python from the first print statement to lists and dictionaries. Your code runs right in the page, and each exercise checks your answer.",
    audience: "No experience needed",
    category: "programming",
    outcomes: [
      "Print output and use f-strings",
      "Make decisions with if, elif and else",
      "Loop over lists and ranges",
      "Count and look up values with dictionaries",
    ],
    modules: [
      { title: "Getting started", lessons: ["print-and-variables", "conditionals"] },
      { title: "Working with data", lessons: ["lists-and-loops", "dictionaries"] },
    ],
  },
  {
    id: "react",
    title: "React Fundamentals",
    tagline: "Build interfaces from components.",
    description:
      "Learn how React apps are built from components, how data flows through props, and how state makes an interface interactive.",
    audience: "Best after JavaScript Fundamentals",
    category: "programming",
    outcomes: [
      "Write components with JSX",
      "Pass data into components with props",
      "Make components interactive with state",
    ],
    modules: [
      { title: "Thinking in components", lessons: ["components-and-jsx", "props"] },
      { title: "Interactivity", lessons: ["state"] },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript Fundamentals",
    tagline: "Catch mistakes before your code runs.",
    description:
      "Learn how TypeScript adds types to JavaScript, how to describe objects, and how unions and narrowing make code safer.",
    audience: "Best after JavaScript Fundamentals",
    category: "programming",
    outcomes: [
      "Annotate variables and functions",
      "Describe objects with types and interfaces",
      "Use unions, and narrow them safely",
    ],
    modules: [
      { title: "Type basics", lessons: ["type-annotations", "object-types"] },
      { title: "Safer code", lessons: ["unions-and-narrowing"] },
    ],
  },
  {
    id: "uiux",
    title: "UI/UX Fundamentals",
    tagline: "Design interfaces that are clear, usable and accessible.",
    description:
      "Learn the principles behind interfaces people enjoy using: hierarchy, spacing, typography, color and contrast, forms and interaction states, and how to test designs with real people. Exercises put each idea into practice with HTML and CSS.",
    audience: "Best after HTML and CSS Fundamentals",
    category: "design",
    outcomes: [
      "Build clear visual hierarchy",
      "Group content with spacing and alignment",
      "Set type that's comfortable to read",
      "Choose colors that meet WCAG contrast",
      "Design forms people can finish",
      "Plan research and usability tests",
    ],
    modules: [
      { title: "Design foundations", lessons: ["visual-hierarchy", "spacing-and-grouping", "typography"] },
      { title: "Accessible by default", lessons: ["color-and-contrast", "usable-forms", "interaction-states"] },
      { title: "Designing with people", lessons: ["user-research"] },
    ],
  },
];
