import type { LanguageId } from "@/lib/languages";

export type CourseLevel = "Babies" | "Intermediate" | "Experienced" | "Pro";

export type CourseMeta = {
  id: LanguageId;
  title: string;
  tagline: string;
  description: string;
  audience: string;
  category: "programming" | "design";
  outcomes: string[];
  /** Lesson files are `<id>/<slug>.md`, in this order. */
  modules: { title: CourseLevel; lessons: string[] }[];
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
      "Collect information with forms and validation",
      "Make pages work for everyone",
    ],
    modules: [
      { title: "Babies", lessons: ["what-is-html", "links-and-images"] },
      { title: "Intermediate", lessons: ["lists", "page-structure"] },
      { title: "Experienced", lessons: ["forms-and-inputs"] },
      { title: "Pro", lessons: ["accessible-pages"] },
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
      "Build layouts with CSS Grid",
      "Create themes with custom properties",
    ],
    modules: [
      { title: "Babies", lessons: ["selectors", "box-model"] },
      { title: "Intermediate", lessons: ["flexbox", "responsive-design"] },
      { title: "Experienced", lessons: ["css-grid"] },
      { title: "Pro", lessons: ["custom-properties"] },
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
      "Transform data with array methods",
      "Use closures and higher-order functions",
    ],
    modules: [
      { title: "Babies", lessons: ["variables", "functions"] },
      { title: "Intermediate", lessons: ["conditionals", "arrays-and-loops"] },
      { title: "Experienced", lessons: ["array-methods"] },
      { title: "Pro", lessons: ["closures"] },
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
      "Write comprehensions and flexible functions",
      "Model data with classes and handle errors",
    ],
    modules: [
      { title: "Babies", lessons: ["print-and-variables", "conditionals"] },
      { title: "Intermediate", lessons: ["lists-and-loops", "dictionaries"] },
      { title: "Experienced", lessons: ["functions-and-comprehensions"] },
      { title: "Pro", lessons: ["classes"] },
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
      "Sync with the outside world using effects",
      "Share logic and data with hooks and context",
    ],
    modules: [
      { title: "Babies", lessons: ["components-and-jsx", "props"] },
      { title: "Intermediate", lessons: ["state"] },
      { title: "Experienced", lessons: ["effects"] },
      { title: "Pro", lessons: ["custom-hooks-and-context"] },
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
      "Write reusable code with generics",
      "Derive types and check every case",
    ],
    modules: [
      { title: "Babies", lessons: ["type-annotations", "object-types"] },
      { title: "Intermediate", lessons: ["unions-and-narrowing"] },
      { title: "Experienced", lessons: ["generics"] },
      { title: "Pro", lessons: ["utility-and-mapped-types"] },
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
      "Scale a product with a design system",
    ],
    modules: [
      { title: "Babies", lessons: ["visual-hierarchy", "spacing-and-grouping", "typography"] },
      { title: "Intermediate", lessons: ["color-and-contrast", "usable-forms", "interaction-states"] },
      { title: "Experienced", lessons: ["user-research"] },
      { title: "Pro", lessons: ["design-systems"] },
    ],
  },
];
