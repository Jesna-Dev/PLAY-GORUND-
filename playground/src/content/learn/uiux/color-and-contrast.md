---
title: Color and contrast
minutes: 11
summary: Make text readable for everyone, and never rely on color alone to carry meaning.
---

About 1 in 12 men and 1 in 200 women have some form of color vision deficiency, and everyone struggles with faint text on a phone in sunlight. Good color choices work for all of them.

## Contrast ratio

Contrast is measured as a ratio between the text color and its background, from 1:1 (identical) to 21:1 (black on white). The Web Content Accessibility Guidelines (WCAG) set these minimums:

- **4.5:1** for normal text
- **3:1** for large text (about 24px, or 19px bold), and for icons and input borders

Light gray text on white is the most common failure: `#999999` on white is only 2.8:1.

## Don't rely on color alone

If an error is shown only by turning a field red, people who can't see red miss it. Pair color with text or an icon:

```html
<p class="error">⚠ Enter an email address, like name@example.com</p>
```

## Give colors consistent jobs

Use one color for interactive things like links and buttons, and separate colors for success, warning and error. If blue means "you can click this", don't use blue for decoration.

> **Tip:** Your browser's developer tools show the contrast ratio when you inspect a text color.

<!-- exercise -->

The text on this notice is too faint to read. Change the colors so that:

1. The `.notice p` text has a contrast ratio of at least **4.5:1** against the background.
2. The heading keeps at least **3:1**, which is enough for large text.
3. The notice keeps a **colored** background, so it still looks like a notice.

```html fixture
<div class="notice">
  <h2>Scheduled maintenance</h2>
  <p>The app will be unavailable on Sunday from 2am to 4am while we upgrade our servers.</p>
</div>
```

```css starter
.notice {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  font-family: system-ui, sans-serif;
}

.notice h2 {
  margin-top: 0;
  color: #b45309;
}

.notice p {
  color: #fbbf24;
}
```

```css solution
.notice {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  font-family: system-ui, sans-serif;
}

.notice h2 {
  margin-top: 0;
  color: #b45309;
}

.notice p {
  color: #78350f;
}
```

```js tests
const atLeast = (target, minimum) => {
  const ratio = contrast(target);
  if (ratio < minimum) throw new Error(`The contrast is ${ratio.toFixed(2)}:1. It needs to be at least ${minimum}:1.`);
};
check("The paragraph has at least 4.5:1 contrast", () => atLeast(".notice p", 4.5));
check("The heading has at least 3:1 contrast", () => atLeast(".notice h2", 3));
check("The notice still has a colored background", () => !["transparent", "#ffffff"].includes(color(".notice", "backgroundColor")));
```

```text hints
Keep the yellow background and darken the paragraph's text color.
A dark brown, like #78350f, matches the warm background and reads well.
```

<!-- quiz -->

### What's the WCAG minimum contrast ratio for normal body text?
- [ ] 2:1
- [ ] 3:1
- [x] 4.5:1
- [ ] 21:1
> Normal text needs 4.5:1. Large text and icons need 3:1.

### A form shows errors only by turning the field border red. What's wrong?
- [ ] Red is too bright
- [x] People who can't tell red apart won't notice the error
- [ ] Borders can't show errors
> Pair color with a message that says what went wrong, or with an icon.

### Which pair has the highest contrast?
- [x] Black text on white
- [ ] Gray text on white
- [ ] Yellow text on white
> Black on white is the maximum, 21:1.
