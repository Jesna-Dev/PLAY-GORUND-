---
title: Visual hierarchy
minutes: 9
summary: Guide people's eyes to what matters most with size, weight, color and space.
---

When people land on a screen, they don't read it from top to bottom. They scan. **Visual hierarchy** decides what they notice first, second and third.

## The tools of hierarchy

- **Size**: bigger things get noticed first.
- **Weight and contrast**: bold, dark or saturated elements stand out from light, thin ones.
- **Color**: a single accent color draws the eye, as long as you use it sparingly.
- **Position**: in left-to-right languages, people start at the top left.
- **Space**: an element with room around it feels important.

## One primary action

Each screen should have one most important action, styled as the **primary** button. Other actions get quieter **secondary** styles. When everything shouts, nothing is heard.

```css
.button-primary {
  background: #0f766e;
  color: white;
}

.button-secondary {
  background: transparent;
  color: #0f766e;
  border: 1px solid #0f766e;
}
```

## The squint test

Blur your eyes, or step back from the screen. What stands out? If it isn't the most important thing, adjust size, weight or color until it is.

> **Tip:** Headings should get smaller as they go down a level. A page where `<h2>` is bigger than `<h1>` confuses readers and breaks the outline.

<!-- exercise -->

This pricing card has no hierarchy: everything is the same size and weight. Add CSS so that:

1. The `h1` is **at least 28px** and bold.
2. The `.price` is larger than the 16px body text.
3. The `.primary` button has a solid background color, with text that stands out clearly against it.
4. The `.secondary` button keeps its transparent background.

```html fixture
<div class="card">
  <h1>Pro plan</h1>
  <p class="price">€12 a month</p>
  <p>Unlimited projects, priority support and team sharing.</p>
  <button class="primary">Start free trial</button>
  <button class="secondary">Compare plans</button>
</div>
```

```css starter
body {
  font-family: system-ui, sans-serif;
  font-size: 16px;
}

h1,
.price,
p {
  font-size: 16px;
  font-weight: normal;
}

button {
  font: inherit;
  padding: 10px 16px;
  border: 1px solid #0f766e;
  border-radius: 8px;
  background: transparent;
  color: #0f766e;
}

/* Add your rules below */

```

```css solution
body {
  font-family: system-ui, sans-serif;
  font-size: 16px;
}

h1,
.price,
p {
  font-size: 16px;
  font-weight: normal;
}

button {
  font: inherit;
  padding: 10px 16px;
  border: 1px solid #0f766e;
  border-radius: 8px;
  background: transparent;
  color: #0f766e;
}

h1 {
  font-size: 32px;
  font-weight: bold;
}

.price {
  font-size: 24px;
  font-weight: 600;
}

.primary {
  background: #0f766e;
  color: white;
}
```

```js tests
const px = (target, property) => parseFloat(css(target, property));
check("The heading is at least 28px", () => px("h1", "fontSize") >= 28);
check("The heading is bold", () => Number(css("h1", "fontWeight")) >= 600);
check("The price is bigger than the body text", () => px(".price", "fontSize") > 16);
check("The primary button has a solid background", () => color(".primary", "backgroundColor") !== "transparent");
check("The primary button's text has at least 4.5:1 contrast", () => {
  const ratio = contrast(".primary");
  if (ratio < 4.5) throw new Error(`The contrast is ${ratio.toFixed(2)}:1.`);
});
check("The secondary button stays transparent", () => equal(color(".secondary", "backgroundColor"), "transparent"));
```

```text hints
New rules for h1 and .price go below the starter rules, so they win.
For the primary button, set both background and color. White text on a dark background works well.
```

<!-- quiz -->

### What is visual hierarchy?
- [ ] The order of elements in the HTML
- [x] How a design leads attention from the most to the least important things
- [ ] A ranking of colors from dark to light
> Hierarchy is about attention: what people notice first, second and third.

### A form has Save, Cancel and Delete buttons, all in the same bright color. What's the problem?
- [x] Nothing stands out, so people can't tell which action is the main one
- [ ] Buttons should never be colored
- [ ] There are too few buttons
> Give the main action the strongest style, and make the others quieter.

### What does the squint test check?
- [ ] Whether text is large enough to read
- [x] Which elements still stand out when details are blurred
- [ ] Whether colors work for colorblind people
> Blurring removes detail and leaves only the hierarchy. The most important thing should still stand out.
