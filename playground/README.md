# Playground

An AI-powered coding playground: learn a language, write and run real code, and get help from a tutor that can see your code and errors.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, also enforces Cache Components rules
npm run lint
```

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Project setup and design system | Done |
| 2 | Landing page and dashboard | Dashboard done, landing page still the starter |
| 3 | Monaco playground | Done |
| 4 | Code execution and live preview | Done in the browser: live web preview, JavaScript and Python. A server-side runner such as Judge0 is only needed for languages that can't run in a browser |
| 5 | AI assistant | Not started |
| 6 | Learning hub and challenges | Done. Learning hub: 7 courses (6 programming, plus UI/UX Fundamentals), 29 lessons, 22 checked exercises. Challenges: 11 problems in JavaScript or Python, a daily challenge, and a certificate for each of 3 levels. AI hints wait for Phase 5 |
| 7 | Auth and database | Not started |
| 8 | Testing, optimization, deployment | Not started |

Until Phase 7, learning progress, solved challenges, the certificate name, drafts and playground code are saved in the browser's local storage. Certificates can't be verified online until then. The dashboard's streak and recent playgrounds are sample data. Routes for later phases render a placeholder that says what's coming.

## Structure

```
src/
  app/
    (marketing)/     Public pages. landing.css is scoped to the starter landing page
    (app)/           Everything inside the sidebar shell
      layout.tsx     Sidebar, top bar, skip link
      error.tsx      Error boundary for the whole shell
      dashboard/     Dashboard page and its loading skeleton
      learn/         Hub, [course] and [course]/[lesson], all prerendered
      challenges/    Hub, [slug], and certificates/[level]
    globals.css      Design tokens for both themes, lesson prose styles
    layout.tsx       Fonts, theme script, tooltip provider
  components/
    ui/              shadcn/ui primitives (owned code, edit freely)
    layout/          App shell: sidebar nav, mobile nav, top bar, theme toggle
    dashboard/       One component per dashboard card
    learn/           Lesson Markdown, exercise workspace, quiz, progress pieces
    challenges/      Challenge workspace, examples, hints, certificate art and view
    playground/      Editor, toolbar, output panes. playground.tsx holds the state
    shared/          Used across features, including ButtonLink
  content/learn/     Lesson files and courses.ts, see "Writing lessons"
  content/challenges/ Challenge files and index.ts, see "Writing challenges"
  config/            Navigation
  hooks/             useCodeRunner (talks to the runner), media query, theme
  lib/
    data/            Data access. Components depend on these types, not on the source
    learn/           Lesson parser, check harnesses, progress store, highlighting
    challenges/      Challenge parser, generated starters and tests, daily pick, levels
    playground/      Starter code, local saving, preview document builder
    languages.ts     Language names, monograms and colors
    theme.ts         Theme persistence
public/
  runner.html        Sandboxed page that runs JavaScript and Python in a Web Worker
```

## Writing lessons

Each lesson is one Markdown file, `src/content/learn/<course>/<slug>.md`. Add its slug to a module in `src/content/learn/courses.ts` to publish it. `next build` checks every lesson and fails with the file name if one is malformed.

````md
---
title: Lists
minutes: 7
summary: One sentence shown under the title and in the course outline.
---

The lesson itself, in Markdown. Fenced code blocks (html, css, js, jsx, ts, python) are highlighted at build time.

<!-- exercise -->

Instructions for the learner. The exercise section is optional.

```html starter
<h1>How to make tea</h1>
```

```html solution
<h1>How to make tea</h1>
<ol><li>Boil the water.</li></ol>
```

```js tests
check("There is a numbered list", () => $("ol") !== null);
check("It has three items", () => equal($$("ol > li").length, 3));
```

<!-- quiz -->

### Which list fits the steps of a recipe?
- [x] `<ol>`
- [ ] `<ul>`
> The explanation shown once the learner picks the right answer.
````

- **Starter language** sets the exercise type: `html` or `css` (live preview), `js`, or `python`.
- **Tests** use `check(name, fn)`, which passes unless `fn` throws or returns `false`, and `equal(actual, expected)`.
    - Web tests also get `$`, `$$`, `text(selector)`, `css(selector, property)`, `color(selector, property)`, which returns hex, and `rules()` for stylesheet and media-query checks.
    - `contrast(selector)` returns the WCAG contrast ratio of an element's text against its nearest opaque background.
    - Layout can be checked with `getBoundingClientRect()`, as the spacing lesson does.
    - Throw an `Error` with a specific message, like "The contrast is 2.1:1", rather than returning `false`.
- **Courses** belong to a `category` in `courses.ts`, either `programming` or `design`. The Learn hub groups courses by category.
    - Python tests are `check("...", lambda: equal(...))`.
- **Optional blocks:**
    - `fixture`: the fixed HTML a CSS exercise styles.
    - `text expected`: lines the program must print exactly.
    - `text hints`: one hint per line.
- **Before shipping a lesson,** confirm the solution passes and the starter fails. The repo has no automated test suite yet; that's Phase 8.

## Writing challenges

Each challenge is `src/content/challenges/<slug>.md`. List its slug under a level in `src/content/challenges/index.ts` to publish it. The level must match the file's `difficulty`.

````md
---
title: Two sum
difficulty: intermediate
minutes: 15
topics: arrays, maps
js: twoSum(numbers, target)
python: two_sum(numbers, target)
---

The problem, in Markdown.

<!-- tests -->

```json
[
  { "args": [[2, 7, 11, 15], 9], "expected": [0, 1], "example": true },
  { "args": [[3, 3], 6], "expected": [0, 1] }
]
```

<!-- hints -->

- One hint per line, from gentle to specific.

<!-- solution -->

The explanation, with a ```js and a ```python block.
````

- **Tests are data,** so one list works for both languages.
    - `args` are spread into the function.
    - `expected` is compared with `JSON.stringify` in JavaScript and with `==` in Python.
    - Avoid object or dictionary results, because key order differs between the languages. Use lists, numbers, strings and booleans.
- **Example cases** (`"example": true`) are shown on the page and run by **Run**. **Submit** runs every case.
- **Starter code** is generated from the signatures and the first example.
- **Certificates:** a level's certificate unlocks when every challenge in it is solved, in either language. Adding a challenge to a level raises the bar for everyone, including people who had already earned that certificate.
- **Before publishing,** check the reference solutions pass every test in both languages, and the starter fails.

## Conventions

- **Next.js 16 differs from older versions.** `AGENTS.md` points at the versioned docs in `node_modules/next/dist/docs/`. Read them before using a new API. For example, error boundaries receive `retry`, not `reset`.
- **Cache Components is on.** Anything per-request, such as the user's session or the current time, needs a `<Suspense>` boundary or `"use cache"`. `next build` fails otherwise.
- **Previously visited routes stay mounted but hidden,** so their state survives navigation. Effects must clean up when hidden. This matters for Monaco and preview iframes.
- **shadcn/ui uses Base UI here, not Radix.** Compose with the `render` prop rather than `asChild`: `<Button nativeButton={false} render={<Link href="/x" />}>`.
- **Theming** uses a `dark` class on `<html>`, dark by default. An inline script applies a saved light theme before first paint. Use token classes (`bg-card`, `text-muted-foreground`), not raw colors.
- **Brand colors are #C5DA00 and pure black.**
    - Use `bg-primary` with `text-primary-foreground` (black on #C5DA00) for fills.
    - Use `text-primary-text` for colored text and icons. It's #C5DA00 in dark mode and a deep olive (`#566000`) in light mode, because #C5DA00 on white is only 1.6:1.
    - Progress bars use `--progress` (#C5DA00 in both themes) through `Progress`, `TickBar` or `Gauge`.
    - The Monaco themes in `code-editor.tsx` mirror these as hex values.
- **Language colors never stand alone.** They always sit beside the written name.
- **Navigation uses links.** Use `ButtonLink` for a link styled as a button. Base UI's `Button` with `render={<Link />}` adds `role="button"`, which tells screen readers it's a button.
- **Shiki reads the clock,** so anything that highlights code at build time needs `"use cache"`, as `LessonMarkdown` and `getLessonSnippets` do.
- **Unknown course or lesson URLs** show the 404 page with `noindex`, but return HTTP 200. The `loading.tsx` boundaries that keep navigation instant mean the page starts streaming before `notFound()` runs. `dynamicParams = false` would fix this, but it isn't allowed with Cache Components.

## Security decisions

### Code execution (built)

Learner code never runs on the app server. It runs in the learner's own browser, isolated from the app:

- **Web preview:** an iframe with `sandbox="allow-scripts allow-modals"` and without `allow-same-origin`. It gets an opaque origin, so it can't read the app's cookies, storage or DOM. A small bridge script forwards console output and errors with `postMessage`.
- **JavaScript and Python:** `public/runner.html`, loaded in an iframe with the same sandbox. It runs code in a module Web Worker created from a `data:` URL. Chrome refuses `blob:` module workers in an opaque-origin frame, and Pyodide 314 requires a module worker. The worker is terminated after 5 seconds (JavaScript) or 10 seconds (Python) of running, so an infinite loop can't freeze the page.
- **Python** is Pyodide 314.0.7 from jsDelivr, pinned in `runner.html`. It downloads once, on first use.
- **Known gap:** JavaScript inside the web preview runs on the iframe's main thread. A `while (true) {}` there can freeze the tab in browsers that don't give sandboxed frames their own process.

The browser tests check that both frames report `origin === "null"` and can't reach the parent document or cookies.

### Later phases

- **AI (Phase 5):** OpenAI is called only from server route handlers, with validated input. `OPENAI_API_KEY` must never have the `NEXT_PUBLIC_` prefix.
- **Auth and data (Phase 7):** Supabase Row Level Security enforces per-user access in the database. Route protection is a convenience on top of that, not the security boundary.
