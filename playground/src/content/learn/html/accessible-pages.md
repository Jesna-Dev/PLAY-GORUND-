---
title: Accessible pages
minutes: 16
summary: Make pages work for everyone with real controls, clear headings and ARIA used carefully.
---

Some people navigate with a keyboard, a screen reader or voice control. Good HTML gives those tools what they need, and most of the work is choosing the right element.

## Use real controls

A `<div>` with a click handler looks like a button but can't be reached with Tab and isn't announced as a button. A real `<button>` gets all of that for free:

```html
<div class="save" onclick="save()">Save</div> <!-- avoid -->
<button class="save" onclick="save()">Save</button> <!-- use -->
```

Use `<a>` when something goes to another page, and `<button>` when it does something on this page.

## Headings are the outline

Screen reader users often jump from heading to heading. Use one `<h1>` for the page, then go down one level at a time. Choose the level for its place in the outline, and change its size with CSS.

## Name things that have no text

An icon-only button has nothing to announce, so give it a name with `aria-label`:

```html
<button aria-label="Close dialog">✕</button>
```

Pages with more than one `<nav>` should label each one, such as `aria-label="Main"` and `aria-label="Footer"`.

## Describe images by their purpose

Informative images need alt text that says what they show. Purely decorative images should have an empty `alt=""`, which tells screen readers to skip them. Leaving out `alt` altogether can make some read out the file name.

## ARIA comes last

ARIA attributes change what assistive technology is told, and nothing else. `role="button"` doesn't make a `<div>` focusable or clickable by keyboard. The first rule of ARIA is to use a native element if one exists.

<!-- exercise -->

This panel has four accessibility problems. Fix them all:

1. Change the `<div class="close">` into a `<button class="close">`, and name it with `aria-label="Close"`.
2. Change the `<h4>` into an `<h2>`, since it comes straight after the `<h1>`.
3. Give the decorative image an empty `alt=""`.
4. Name the navigation with `aria-label="Main"`.

```html starter
<nav>
  <a href="/">Home</a>
</nav>

<h1>Your settings</h1>

<h4>Notifications</h4>
<img src="divider.png" />

<div class="close">✕</div>
```

```html solution
<nav aria-label="Main">
  <a href="/">Home</a>
</nav>

<h1>Your settings</h1>

<h2>Notifications</h2>
<img src="divider.png" alt="" />

<button class="close" aria-label="Close">✕</button>
```

```js tests
check("The close control is a real button", () => equal($(".close")?.tagName, "BUTTON"));
check('The button is named "Close"', () => equal($(".close")?.getAttribute("aria-label"), "Close"));
check("The section heading is an <h2>", () => equal(text("h2"), "Notifications"));
check("The <h4> is gone", () => equal($("h4"), null));
check("The decorative image has an empty alt", () => equal($("img")?.getAttribute("alt"), ""));
check('The navigation is named "Main"', () => equal($("nav")?.getAttribute("aria-label"), "Main"));
```

```text hints
Remember to change both the opening and closing tags of the div and the heading.
alt="" has to be present and empty. Leaving out alt doesn't count.
```

<!-- quiz -->

### What does `role="button"` on a `<div>` give you?
- [ ] Keyboard focus and Enter key support
- [x] Only an announcement that it's a button
- [ ] Everything a real `<button>` has
> ARIA changes what's announced. You would still have to build focus and keyboard behavior by hand.

### How should a purely decorative image be marked up?
- [x] With `alt=""`
- [ ] With no `alt` attribute
- [ ] With `alt="decorative image"`
> An empty `alt` tells screen readers to skip the image.

### You want a smaller-looking heading right after an `<h1>`. What should you do?
- [ ] Use `<h5>` because it's small
- [x] Use `<h2>` and change its size with CSS
- [ ] Use a bold `<p>`
> Heading levels describe the outline. CSS controls how they look.
