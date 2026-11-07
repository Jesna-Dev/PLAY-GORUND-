---
title: Selectors and properties
minutes: 9
summary: Write CSS rules that pick elements and change how they look.
---

CSS (Cascading Style Sheets) controls how HTML looks. A CSS **rule** picks some elements with a **selector**, then sets **properties** on them:

```css
p {
  color: #1d4ed8;
  font-size: 18px;
}
```

This rule selects every `<p>` and makes its text blue and 18 pixels tall. Each line inside the braces is a **declaration**: a property, a colon, a value and a semicolon.

## Selecting by class

To style only some elements, give them a `class` in HTML:

```html
<p class="warning">Mind the step.</p>
```

Then select that class with a dot:

```css
.warning {
  background-color: #fde68a;
  font-weight: bold;
}
```

An element can have several classes, separated by spaces: `class="warning large"`.

## Colors

CSS accepts colors as names (`red`), hex codes (`#1d4ed8`) or functions like `rgb(29 78 216)`. Hex codes are the most common in real projects.

## When rules conflict

If two rules set the same property, the more **specific** selector wins: a class beats an element selector. If they're equally specific, the rule that comes later wins. That's the "cascading" in CSS.

<!-- exercise -->

The HTML for this page is already written. Write CSS so that:

1. All paragraphs have the text color `#1d4ed8`.
2. Elements with the class `highlight` have the background color `#fde68a`.

```html fixture
<h1>Planet notes</h1>
<p>Mercury is the closest planet to the Sun.</p>
<p class="highlight">Venus is the hottest planet.</p>
<p>Mars has the tallest volcano we know of.</p>
```

```css starter
/* Write your CSS here */

```

```css solution
p {
  color: #1d4ed8;
}

.highlight {
  background-color: #fde68a;
}
```

```js tests
check("Every paragraph's text is #1d4ed8", () => $$("p").every((p) => color(p) === "#1d4ed8"));
check("The .highlight paragraph's background is #fde68a", () => equal(color(".highlight", "backgroundColor"), "#fde68a"));
check("Other paragraphs have no background", () => equal(color("p:not(.highlight)", "backgroundColor"), "transparent"));
```

```text hints
Select all paragraphs with p, and the class with .highlight.
The property for text color is color. For the background, it's background-color.
```

<!-- quiz -->

### In `p { color: red; }`, what is `p`?
- [x] The selector
- [ ] The property
- [ ] The value
> The selector picks which elements the rule applies to. `color` is the property and `red` is the value.

### How do you select elements with `class="card"`?
- [ ] `card`
- [ ] `#card`
- [x] `.card`
> A dot selects by class. A `#` selects by id.

### A paragraph has `class="note"`. The rules are `p { color: black; }` and `.note { color: green; }`. What color is it?
- [ ] Black, because element rules come first
- [x] Green, because a class selector is more specific
> A class selector is more specific than an element selector, so it wins wherever it's written.
