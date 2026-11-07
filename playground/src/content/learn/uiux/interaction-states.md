---
title: Interaction states
minutes: 10
summary: Show people what they can click, where they are, and that something happened.
---

Interactive elements should tell people what they can do, and respond when they do it. Each control has several **states**:

- **Default**: at rest. It should look clickable.
- **Hover**: the pointer is over it.
- **Focus**: it's selected with the keyboard.
- **Active**: it's being pressed.
- **Disabled**: it can't be used right now.

## Never remove focus outlines

People who use a keyboard move through a page with Tab, and the focus outline is their cursor. Removing it with `outline: none`, and adding nothing back, makes the page unusable for them. Style it instead with `:focus-visible`, which browsers apply for keyboard focus:

```css
button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

## Hover is a bonus

Touchscreens have no hover. Anything people need to know must be visible without it, so use hover for extra feedback, not essential information.

## Feedback for every action

When people click, show that something happened: a pressed state, a spinner while saving, a message when it's done. Silence makes people click again, and submit the form twice.

## Disabled with care

A disabled button doesn't say why it's disabled. Where you can, keep the button enabled and explain what's missing when it's pressed.

<!-- exercise -->

This button removes its focus outline, so keyboard users can't see when it's selected. Add:

1. A `.save:hover` style that changes the background color.
2. A `.save:focus-visible` style with an outline at least `2px` wide.

Press Tab inside the preview to see your focus style.

```html fixture
<button class="save">Save changes</button>
<p>Press Tab to move focus to the button.</p>
```

```css starter
.save {
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  background: #0f766e;
  color: white;
  font: inherit;
  cursor: pointer;
  outline: none;
}
```

```css solution
.save {
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  background: #0f766e;
  color: white;
  font: inherit;
  cursor: pointer;
  outline: none;
}

.save:hover {
  background: #115e59;
}

.save:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

```js tests
const rulesFor = (state) => rules().filter((rule) => rule.selector.includes(state));
check("There's a :hover style", () => rulesFor(":hover").length > 0);
check("The hover style changes the background", () => rulesFor(":hover").some((rule) => rule.style.backgroundColor !== ""));
check("There's a :focus-visible style", () => rulesFor(":focus-visible").length > 0);
check("The focus outline is at least 2px wide", () =>
  rulesFor(":focus-visible").some(
    (rule) => parseFloat(rule.style.outlineWidth) >= 2 && rule.style.outlineStyle !== "" && rule.style.outlineStyle !== "none",
  ));
```

```text hints
States are written with a colon after the selector: .save:hover { ... }
An outline needs a width, a style and a color: outline: 3px solid #2563eb;
```

<!-- quiz -->

### Why shouldn't you remove focus outlines?
- [ ] HTML requires them
- [x] Keyboard users rely on them to see where they are
- [ ] They make pages load faster
> Without a visible focus style, keyboard users can't tell which element they're on.

### Why shouldn't essential information appear only on hover?
- [x] Touchscreens have no hover
- [ ] Hover effects are slow
- [ ] Hover only works on links
> On phones and tablets there's no pointer to hover with, so hover-only details are never seen.

### What does `:focus-visible` style?
- [ ] Every focused element, including after a mouse click
- [x] Focus the browser decides should be visible, usually keyboard focus
- [ ] Hidden elements, to make them visible
> Browsers apply `:focus-visible` mainly for keyboard focus, so mouse users don't see an outline on every click.
