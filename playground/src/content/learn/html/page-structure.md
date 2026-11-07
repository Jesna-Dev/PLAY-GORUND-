---
title: Page structure
minutes: 9
summary: Use header, nav, main and footer to give a page a clear, accessible layout.
---

Most pages share the same parts: a header at the top, navigation, the main content and a footer. HTML has an element for each, so browsers, search engines and screen readers can understand the layout.

```html
<header>
  <h1>Riverside Bakery</h1>
  <nav>
    <a href="#menu">Menu</a>
    <a href="#visit">Visit us</a>
  </nav>
</header>

<main>
  <h2 id="menu">Today's menu</h2>
  <p>Sourdough, rye and cinnamon buns.</p>
</main>

<footer>
  <p id="visit">Open every day from 7am.</p>
</footer>
```

- `<header>` holds the introduction, often a logo or title.
- `<nav>` wraps the main navigation links.
- `<main>` holds the page's main content. Use it once per page.
- `<footer>` holds closing details like contact information.

## Why not just use `<div>`?

`<div>` is a box with no meaning. A page built only from `<div>`s can look the same, but a screen reader user can't jump straight to the main content or the navigation. These **semantic** elements give them landmarks to move between.

> **Tip:** Links that start with `#` jump to the element with that `id` on the same page.

<!-- exercise -->

This bakery page uses `<div>`s for everything. Replace them with semantic elements:

1. Wrap the title in a `<header>`.
2. Put the section about bread in `<main>`.
3. Put the opening hours in a `<footer>`.

```html starter
<div>
  <h1>Riverside Bakery</h1>
</div>

<div>
  <h2>Today's bread</h2>
  <p>Sourdough, rye and seeded loaves.</p>
</div>

<div>
  <p>Open every day from 7am.</p>
</div>
```

```html solution
<header>
  <h1>Riverside Bakery</h1>
</header>

<main>
  <h2>Today's bread</h2>
  <p>Sourdough, rye and seeded loaves.</p>
</main>

<footer>
  <p>Open every day from 7am.</p>
</footer>
```

```js tests
check("The <h1> is inside a <header>", () => $("header h1") !== null);
check("The <h2> is inside <main>", () => $("main h2") !== null);
check("There is a <footer>", () => $("footer") !== null);
check("The opening hours are in the footer", () => (text("footer") ?? "").includes("7am"));
check("There is exactly one <main>", () => equal($$("main").length, 1));
```

```text hints
Swap each <div> and its matching </div> for the new element.
The opening hours paragraph goes inside <footer> ... </footer>.
```

<!-- quiz -->

### Which element holds a page's main content?
- [ ] `<body>`
- [x] `<main>`
- [ ] `<section>`
- [ ] `<div>`
> `<main>` marks the main content, once per page. `<body>` holds everything, including the header and footer.

### Why use `<nav>` instead of a `<div>` for navigation?
- [ ] It makes links blue
- [x] It tells browsers and screen readers that these are the main navigation links
- [ ] A `<div>` can't contain links
> Semantic elements don't change the look on their own. They add meaning that assistive technology uses.
