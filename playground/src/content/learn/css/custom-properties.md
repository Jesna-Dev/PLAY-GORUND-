---
title: Custom properties and themes
minutes: 16
summary: Store design values in CSS variables, and switch whole themes by changing a few of them.
---

A **custom property**, often called a CSS variable, stores a value you can reuse. Its name starts with two dashes, and you read it with `var()`:

```css
:root {
  --brand: #2563eb;
}

.button {
  background: var(--brand);
}
```

`:root` is the `<html>` element, so anything set there is available everywhere. Change `--brand` once and every use updates.

## Fallbacks

`var()` takes a second value to use if the variable isn't set:

```css
color: var(--accent, black);
```

## Variables follow the cascade

Unlike variables in JavaScript, custom properties are inherited through the page. An element takes the value from its nearest ancestor that sets one. That makes themes simple:

```css
:root {
  --surface: white;
  --text: black;
}

.dark {
  --surface: #111;
  --text: white;
}

.panel {
  background: var(--surface);
  color: var(--text);
}
```

`.panel` never mentions dark mode. Put it inside `.dark` and it picks up the dark values, because the variables changed around it.

## Change them from JavaScript

Variables are live, so scripts can update them while the page runs:

```js
document.documentElement.style.setProperty("--brand", "#16a34a");
```

<!-- exercise -->

Make `.card` themeable:

1. In `:root`, set `--card-bg` to `#ffffff` and `--card-text` to `#0f172a`.
2. In `.dark`, set `--card-bg` to `#0f172a` and `--card-text` to `#f8fafc`.
3. In `.card`, use `var()` for `background` and `color`.

```html fixture
<div class="card" id="day">Daytime card</div>

<div class="dark">
  <div class="card" id="night">Nighttime card</div>
</div>
```

```css starter
.card {
  padding: 16px;
}
```

```css solution
:root {
  --card-bg: #ffffff;
  --card-text: #0f172a;
}

.dark {
  --card-bg: #0f172a;
  --card-text: #f8fafc;
}

.card {
  padding: 16px;
  background: var(--card-bg);
  color: var(--card-text);
}
```

```js tests
const card = () => rules().find((rule) => rule.selector === ".card");
check("The normal card has the light background", () => equal(color("#day", "backgroundColor"), "#ffffff"));
check("The normal card has the dark text", () => equal(color("#day"), "#0f172a"));
check("The card inside .dark has the dark background", () => equal(color("#night", "backgroundColor"), "#0f172a"));
check("The card inside .dark has the light text", () => equal(color("#night"), "#f8fafc"));
check(".card reads --card-bg with var()", () => card().style.cssText.includes("var(--card-bg)"));
check(".card reads --card-text with var()", () => card().style.cssText.includes("var(--card-text)"));
```

```text hints
You need three rules: :root, .dark and .card.
Only .card uses var(). The other two rules set the values.
```

<!-- quiz -->

### Where do you set a custom property so the whole page can use it?
- [x] `:root`
- [ ] `.global`
- [ ] Inside `var()`
> `:root` is the top element, and custom properties are inherited by everything inside it.

### What does `var(--accent, black)` do when `--accent` isn't set?
- [ ] Shows an error
- [x] Uses `black`
- [ ] Removes the element
> The second value in `var()` is a fallback.

### Why does a card change color inside `.dark` without any `.dark .card` rule?
- [x] The card inherits the nearest value of each variable
- [ ] Browsers invert colors automatically
- [ ] `.dark` is a built-in class
> Custom properties follow the cascade, so `.dark` gives everything inside it new values.
