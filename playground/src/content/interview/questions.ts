import type { CourseLevel } from "@/content/learn/courses";
import type { LanguageId } from "@/lib/languages";

export type InterviewQuestion = {
  topic: LanguageId;
  level: CourseLevel;
  question: string;
  answer: string;
};

export const interviewQuestions: InterviewQuestion[] = [
  // HTML
  {
    topic: "html",
    level: "Babies",
    question: "What is HTML used for?",
    answer:
      "HTML (HyperText Markup Language) describes the structure and meaning of a web page's content, such as headings, paragraphs, links and images. CSS handles how it looks, and JavaScript handles behavior.",
  },
  {
    topic: "html",
    level: "Babies",
    question: "What's the difference between a tag and an element?",
    answer:
      "A tag is the markup itself, like `<p>` or `</p>`. An element is the whole thing: the opening tag, the content and the closing tag.",
  },
  {
    topic: "html",
    level: "Intermediate",
    question: "Why use semantic elements like `<nav>` and `<main>` instead of `<div>`?",
    answer:
      "They describe what the content is. Screen readers can use them to jump around the page, search engines understand the page better, and the code is easier to read. A `<div>` carries no meaning.",
  },
  {
    topic: "html",
    level: "Intermediate",
    question: "What's the difference between block and inline elements?",
    answer:
      "Block elements like `<div>` and `<p>` start on a new line and take the full width available. Inline elements like `<a>` and `<span>` sit within a line of text and are only as wide as their content.",
  },
  {
    topic: "html",
    level: "Experienced",
    question: "What do `defer` and `async` do on a `<script>` tag?",
    answer:
      "Both download the script without blocking HTML parsing. `defer` runs scripts after parsing finishes, in document order. `async` runs each script as soon as it arrives, so order isn't guaranteed. Use `defer` for scripts that depend on the page or each other.",
  },
  {
    topic: "html",
    level: "Experienced",
    question: "Why does every form field need a connected label?",
    answer:
      "A `<label>` linked with `for` and `id` gives the field an accessible name for screen readers and makes the text clickable, which gives a larger target. Placeholder text can't replace it because it disappears as soon as someone types.",
  },
  {
    topic: "html",
    level: "Pro",
    question: "When should you use ARIA, and when should you avoid it?",
    answer:
      "Use a native element whenever one exists, because it comes with focus, keyboard and announcements built in. ARIA only changes what assistive technology is told, so reserve it for naming things and for custom widgets that have no native equivalent, and build the keyboard behavior yourself.",
  },
  {
    topic: "html",
    level: "Pro",
    question: "How can HTML alone improve image performance?",
    answer:
      "Use `srcset` and `sizes` so the browser picks a suitable file, `loading=\"lazy\"` for images below the fold, and `width` and `height` attributes so space is reserved and the layout doesn't jump. Don't lazy-load the main image at the top of the page.",
  },

  // CSS
  {
    topic: "css",
    level: "Babies",
    question: "What is the CSS box model?",
    answer:
      "Every element is a box made of content, then padding, then border, then margin. Padding is space inside the border, and margin is space outside it.",
  },
  {
    topic: "css",
    level: "Babies",
    question: "What's the difference between a class and an id selector?",
    answer:
      "A class (`.card`) can be used on many elements. An id (`#header`) should be unique on the page and has much higher specificity, which is why most styling uses classes.",
  },
  {
    topic: "css",
    level: "Intermediate",
    question: "How does CSS specificity work?",
    answer:
      "When rules conflict, the more specific selector wins. Ids beat classes, attributes and pseudo-classes, which beat element selectors. If specificity ties, the later rule wins. Inline styles and `!important` override normal rules.",
  },
  {
    topic: "css",
    level: "Intermediate",
    question: "What's the difference between `justify-content` and `align-items`?",
    answer:
      "`justify-content` positions flex items along the main axis, and `align-items` positions them along the cross axis. In a row, that means horizontal and vertical. In a column, the two swap.",
  },
  {
    topic: "css",
    level: "Experienced",
    question: "What's the difference between `relative`, `absolute`, `fixed` and `sticky` positioning?",
    answer:
      "`relative` offsets an element from its normal spot and keeps its space. `absolute` removes it from the flow and positions it against the nearest positioned ancestor. `fixed` positions it against the viewport. `sticky` acts normally until a scroll threshold, then sticks.",
  },
  {
    topic: "css",
    level: "Experienced",
    question: "What is a stacking context, and why can `z-index` seem not to work?",
    answer:
      "A stacking context is a group whose children are layered only among themselves. Properties like `transform`, `opacity` below 1, or a positioned element with a `z-index` create one. A child's huge `z-index` can't escape a parent context that sits lower.",
  },
  {
    topic: "css",
    level: "Pro",
    question: "How do CSS custom properties differ from preprocessor variables?",
    answer:
      "Preprocessor variables are replaced at build time and are gone in the browser. Custom properties exist at runtime, inherit through the page and can be changed by a selector or JavaScript, which makes theming possible without new CSS.",
  },
  {
    topic: "css",
    level: "Pro",
    question: "Which properties are cheapest to animate, and why?",
    answer:
      "`transform` and `opacity`, because browsers can usually handle them on the compositor without recalculating layout or repainting. Animating `width`, `height` or `top` forces layout work on every frame and can cause stutter.",
  },

  // JavaScript
  {
    topic: "javascript",
    level: "Babies",
    question: "What's the difference between `let`, `const` and `var`?",
    answer:
      "`let` and `const` are block-scoped. `let` can be reassigned and `const` can't, although a `const` object's contents can still change. `var` is function-scoped and hoisted, so modern code avoids it.",
  },
  {
    topic: "javascript",
    level: "Babies",
    question: "What's the difference between `==` and `===`?",
    answer:
      "`===` compares value and type with no conversion. `==` converts types first, so `0 == \"\"` is true. Prefer `===` because it's predictable.",
  },
  {
    topic: "javascript",
    level: "Intermediate",
    question: "What's the difference between `map` and `forEach`?",
    answer:
      "`map` returns a new array built from each callback's result. `forEach` returns `undefined` and is only used for side effects. Use `map` when you need the transformed list.",
  },
  {
    topic: "javascript",
    level: "Intermediate",
    question: "What's the difference between `null` and `undefined`?",
    answer:
      "`undefined` usually means a value was never set, like a missing property or argument. `null` is an empty value someone assigned on purpose.",
  },
  {
    topic: "javascript",
    level: "Experienced",
    question: "What is a closure? Give a practical use.",
    answer:
      "A closure is a function that keeps access to the variables from where it was created, even after that outer function has finished. It's useful for private state, like a counter that can only change through the function that was returned.",
  },
  {
    topic: "javascript",
    level: "Experienced",
    question: "How is the value of `this` decided?",
    answer:
      "Mostly by how a function is called. In `obj.method()`, `this` is `obj`. `call`, `apply` and `bind` set it directly, and `new` makes it the new object. Arrow functions have no `this` of their own and use the one from the surrounding code.",
  },
  {
    topic: "javascript",
    level: "Pro",
    question: "Explain the event loop, and the difference between microtasks and tasks.",
    answer:
      "JavaScript runs one call stack. When it empties, the event loop runs all queued microtasks, such as promise callbacks, and then the next task, such as a `setTimeout` callback. So a resolved promise's callback runs before a `setTimeout` of 0.",
  },
  {
    topic: "javascript",
    level: "Pro",
    question: "What's the difference between `Promise.all` and `Promise.allSettled`?",
    answer:
      "`Promise.all` resolves with every result but rejects as soon as any promise rejects. `Promise.allSettled` always waits for all of them and reports each one's status, so it suits work where partial success is fine.",
  },

  // Python
  {
    topic: "python",
    level: "Babies",
    question: "What's the difference between a list and a tuple?",
    answer:
      "Lists use square brackets and can be changed. Tuples use parentheses and can't be changed after they're created, which suits fixed groups of values like coordinates.",
  },
  {
    topic: "python",
    level: "Babies",
    question: "Why does indentation matter in Python?",
    answer:
      "Python uses indentation to mark blocks of code, where other languages use braces. The lines indented under an `if` or a `def` belong to it, and inconsistent indentation causes an error.",
  },
  {
    topic: "python",
    level: "Intermediate",
    question: "What's the difference between `==` and `is`?",
    answer:
      "`==` checks whether two values are equal. `is` checks whether two names refer to the same object. Use `is` mainly for `None`, as in `if value is None`.",
  },
  {
    topic: "python",
    level: "Intermediate",
    question: "Why can't a list be a dictionary key?",
    answer:
      "Dictionary keys must be hashable, meaning their hash never changes. Lists can be changed, so they aren't hashable. Strings, numbers and tuples of hashable values are fine.",
  },
  {
    topic: "python",
    level: "Experienced",
    question: "What's the danger of a mutable default argument?",
    answer:
      "Default values are created once, when the function is defined, so a default list is shared across calls and keeps its changes. Use `None` as the default and create the list inside the function.",
  },
  {
    topic: "python",
    level: "Experienced",
    question: "What do `*args` and `**kwargs` do?",
    answer:
      "`*args` collects extra positional arguments into a tuple. `**kwargs` collects extra keyword arguments into a dictionary. The same symbols can also unpack values when calling a function.",
  },
  {
    topic: "python",
    level: "Pro",
    question: "What is a decorator?",
    answer:
      "A decorator is a function that takes a function and returns a replacement, usually wrapping it to add behavior like logging or caching. `@my_decorator` above a `def` is shorthand for `name = my_decorator(name)`.",
  },
  {
    topic: "python",
    level: "Pro",
    question: "When would you use a generator instead of a list?",
    answer:
      "A generator uses `yield` to produce values one at a time, so it holds little memory and can represent very long or endless sequences. Use a list when you need to index the items or loop over them more than once.",
  },

  // React
  {
    topic: "react",
    level: "Babies",
    question: "What is JSX?",
    answer:
      "JSX is a syntax that lets you write HTML-like markup in JavaScript. A build tool turns it into ordinary function calls that describe the UI.",
  },
  {
    topic: "react",
    level: "Babies",
    question: "What's the difference between props and state?",
    answer:
      "Props are passed into a component by its parent and are read-only inside it. State is data a component owns and can update, and updating it makes React render the component again.",
  },
  {
    topic: "react",
    level: "Intermediate",
    question: "Why do list items need a `key`?",
    answer:
      "Keys let React match items between renders, so it can keep each item's state and DOM node when the list changes. Use a stable id. An array index causes bugs when items are reordered, added or removed.",
  },
  {
    topic: "react",
    level: "Intermediate",
    question: "What is a controlled input?",
    answer:
      "It's an input whose value comes from React state, with `onChange` updating that state. React is the single source of truth, which makes validation and formatting simple.",
  },
  {
    topic: "react",
    level: "Experienced",
    question: "What is the dependency array in `useEffect` for?",
    answer:
      "It tells React when to run the effect again: after the first render and whenever a listed value changes. List every prop and state value the effect uses, and return a cleanup function for things like timers and subscriptions.",
  },
  {
    topic: "react",
    level: "Experienced",
    question: "What causes a component to render again?",
    answer:
      "Its state changes, its parent renders, or a context it reads changes. A render only recalculates what the UI should be. React then updates just the parts of the DOM that differ.",
  },
  {
    topic: "react",
    level: "Pro",
    question: "When are `useMemo` and `useCallback` worth using?",
    answer:
      "When a calculation is measurably slow, or when a stable reference matters, such as a prop for a `memo` component or an effect dependency. Elsewhere they add complexity with no benefit, so measure first.",
  },
  {
    topic: "react",
    level: "Pro",
    question: "What are the performance trade-offs of context?",
    answer:
      "Every component that reads a context renders again when its value changes, even if it only uses part of it. Keep values stable, split contexts by how often they change, and keep frequently changing state close to where it's used.",
  },

  // TypeScript
  {
    topic: "typescript",
    level: "Babies",
    question: "What does TypeScript add to JavaScript?",
    answer:
      "Static types, which catch many mistakes while you write the code. Types are removed at build time, so what runs is plain JavaScript with no type checks of its own.",
  },
  {
    topic: "typescript",
    level: "Babies",
    question: "What is type inference?",
    answer:
      "TypeScript works out a type from the code, so `let age = 36` is already a `number` with no annotation. You mainly add types to function parameters and shared data shapes.",
  },
  {
    topic: "typescript",
    level: "Intermediate",
    question: "What's the difference between `any` and `unknown`?",
    answer:
      "`any` turns off type checking for that value. `unknown` also accepts any value, but you have to narrow it before using it, so it's the safe choice for data you can't predict.",
  },
  {
    topic: "typescript",
    level: "Intermediate",
    question: "What's the difference between `type` and `interface`?",
    answer:
      "Both can describe object shapes. Interfaces can be extended and merged across declarations. Type aliases can also describe unions, tuples and other computed types. Most teams pick a convention and stick with it.",
  },
  {
    topic: "typescript",
    level: "Experienced",
    question: "Why use generics?",
    answer:
      "Generics let one function or type work with many types while keeping the link between them. `first<T>(items: T[]): T | undefined` returns the array's real item type, where `any` would lose it.",
  },
  {
    topic: "typescript",
    level: "Experienced",
    question: "What is type narrowing?",
    answer:
      "Narrowing is how TypeScript refines a broad type to a specific one inside a branch, using checks like `typeof`, `in`, `instanceof` or a comparison on a shared field.",
  },
  {
    topic: "typescript",
    level: "Pro",
    question: "What is a discriminated union, and how do you check every case is handled?",
    answer:
      "It's a union whose members share a literal field like `kind`, so a `switch` can narrow them. Assigning the value to a `never` variable in the `default` branch makes compilation fail if a case is missed.",
  },
  {
    topic: "typescript",
    level: "Pro",
    question: "What does it mean that TypeScript is structurally typed?",
    answer:
      "Compatibility depends on shape, not name. Any value with the required properties fits a type, even if it was never declared as that type. To tell apart identical shapes, such as two kinds of id, teams use branded types.",
  },

  // UI/UX
  {
    topic: "uiux",
    level: "Babies",
    question: "What's the difference between UI and UX?",
    answer:
      "UI is what people see and interact with, such as layouts, colors and buttons. UX is the whole experience of using the product, including whether it solves their problem easily.",
  },
  {
    topic: "uiux",
    level: "Babies",
    question: "What is visual hierarchy?",
    answer:
      "It's arranging things so the most important one gets noticed first, using size, weight, color, spacing and position.",
  },
  {
    topic: "uiux",
    level: "Intermediate",
    question: "What contrast ratios does WCAG AA require for text?",
    answer:
      "At least 4.5:1 for normal text and 3:1 for large text, which means about 24px, or about 18.7px if bold.",
  },
  {
    topic: "uiux",
    level: "Intermediate",
    question: "Why isn't placeholder text a good replacement for a label?",
    answer:
      "It disappears when someone types, so they can't check what the field wanted. It's also often low in contrast and may not be treated as the field's name by assistive technology.",
  },
  {
    topic: "uiux",
    level: "Experienced",
    question: "How would you run a usability test?",
    answer:
      "Decide what you need to learn, recruit about five people who match your users, and give them realistic tasks. Ask them to think aloud, avoid leading them, then look for patterns in where they struggled.",
  },
  {
    topic: "uiux",
    level: "Experienced",
    question: "What's the difference between qualitative and quantitative research?",
    answer:
      "Qualitative research, like interviews, explains why people behave as they do. Quantitative research, like analytics, measures what happens and how much. They work best together.",
  },
  {
    topic: "uiux",
    level: "Pro",
    question: "When is a design system worth the investment?",
    answer:
      "When several teams or products keep rebuilding the same patterns and inconsistency is costing time. It needs ongoing owners and real adoption, so a small team with one product may only need a shared component library.",
  },
  {
    topic: "uiux",
    level: "Pro",
    question: "How would you measure whether a redesign worked?",
    answer:
      "Set a goal and a baseline before launching. Then compare measures tied to the goal, such as task success, time on task, conversion or support requests, and use research to explain why the numbers moved.",
  },
];
