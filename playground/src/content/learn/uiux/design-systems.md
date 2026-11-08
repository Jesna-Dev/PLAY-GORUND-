---
title: Design systems
minutes: 18
summary: Scale a product's design with tokens, component variants and clear shared rules.
---

As a product grows, small differences creep in: six shades of blue, four button heights. A **design system** is the shared set of decisions, components and guidance that keeps everything consistent, so teams spend their time on new problems.

## Design tokens

**Tokens** are named design decisions. They're the smallest building blocks of a system:

```css
:root {
  --color-primary: #1d4ed8;
  --color-on-primary: #ffffff;
  --space-2: 8px;
  --space-4: 16px;
  --radius-md: 8px;
}
```

Name a token for its purpose, not its appearance. `--color-danger` still makes sense after a rebrand, but `--red` doesn't.

## Components and variants

A component is built once from tokens and offered in a small number of **variants**:

```css
.btn {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
```

The shared class holds what never changes, and each variant holds only what differs. Keep the list of variants short, because every one is something to design, build, test and maintain.

## Every state counts

A component isn't finished until each state is designed: default, hover, focus, active, disabled, loading and error. Accessibility belongs in the component too, so every screen that uses it benefits.

## Document the why

A good system explains when to use something and when not to:

> Use one primary button per view, for the most important action. Use a secondary button for everything else.

## Treat it like a product

A design system has users: your designers and developers. Listen to what they need, version your changes, and announce anything that breaks. If the system is harder to use than working around it, people will work around it.

<!-- exercise -->

Build a small button system from tokens:

1. In `:root`, add `--color-primary: #1d4ed8`, `--color-on-primary: #ffffff` and `--space: 12px`.
2. Give `.btn` a `padding` of `var(--space)`.
3. Give `.btn-primary` a `background` and `color` that use the two color tokens.

```html fixture
<button class="btn btn-primary">Save</button>
<button class="btn btn-ghost">Cancel</button>
```

```css starter
.btn {
  border: 0;
  border-radius: 8px;
  font: inherit;
}

.btn-ghost {
  background: transparent;
  color: #1d4ed8;
}
```

```css solution
:root {
  --color-primary: #1d4ed8;
  --color-on-primary: #ffffff;
  --space: 12px;
}

.btn {
  border: 0;
  border-radius: 8px;
  font: inherit;
  padding: var(--space);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.btn-ghost {
  background: transparent;
  color: #1d4ed8;
}
```

```js tests
const rule = (selector) => rules().find((r) => r.selector === selector);
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
check("--color-primary is set", () => equal(token("--color-primary"), "#1d4ed8"));
check("--color-on-primary is set", () => equal(token("--color-on-primary"), "#ffffff"));
check("--space is set", () => equal(token("--space"), "12px"));
check(".btn uses the spacing token", () => rule(".btn").style.cssText.includes("var(--space)"));
check("The ghost button gets the same padding", () => equal(css(".btn-ghost", "paddingTop"), "12px"));
check(".btn-primary uses the background token", () => rule(".btn-primary").style.cssText.includes("var(--color-primary)"));
check(".btn-primary uses the text token", () => rule(".btn-primary").style.cssText.includes("var(--color-on-primary)"));
check("The primary button's text has at least 4.5:1 contrast", () => contrast(".btn-primary") >= 4.5);
```

```text hints
Tokens are set once in :root and read everywhere else with var().
Padding goes on .btn, which both variants share. Colors go on .btn-primary.
```

<!-- quiz -->

### Which is the better token name?
- [x] `--color-danger`
- [ ] `--red-500-new`
- [ ] `--button-color-2`
> A name based on purpose stays true even when the actual color changes.

### What belongs in the base `.btn` class?
- [x] What every variant has in common
- [ ] Only the primary button's colors
- [ ] Nothing, each variant repeats all its styles
> Shared rules live once in the base, and variants only hold what differs.

### When is a component finished?
- [ ] When the default state looks right
- [x] When every state, including focus, disabled and error, is designed and accessible
- [ ] When it has at least ten variants
> People run into every state, so each one needs to be designed.
