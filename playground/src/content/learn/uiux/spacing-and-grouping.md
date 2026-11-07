---
title: Spacing and grouping
minutes: 10
summary: Use space to show which things belong together, and keep it consistent with a spacing scale.
---

Space isn't empty. It tells people how things relate. This is the **law of proximity**: items close together look like a group, and items far apart look unrelated.

## Put related things close

A label sits right above its field. The gap to the next label is bigger, so each label and field read as one unit:

```css
label {
  display: block;
  margin-bottom: 4px;
}

.field {
  margin-bottom: 24px;
}
```

If a label were equally far from the field above and the field below, people would have to guess which one it describes.

## Use a spacing scale

Pick a small set of spacing values and only use those, for example 4, 8, 12, 16, 24, 32 and 48 pixels. A scale makes layouts feel consistent, and makes decisions faster: "Is this 16 or 24?" is easier than "Is this 17 or 21?"

## Alignment

Line things up along shared edges. Text that starts at slightly different positions looks messy, even when people can't say why. For anything longer than a heading, one strong left edge usually reads better than centered text.

## White space isn't wasted

Crowded screens are harder to scan. Generous padding around groups, and space between sections, make content feel calmer and easier to read.

<!-- exercise -->

In this sign-in form, every gap is the same, so the labels float halfway between fields. Change the margins so that:

1. The gap between each label and its own input is **8px or less**.
2. The gap between one field and the next label is **at least 20px**.

```html fixture
<form>
  <div class="field">
    <label for="email">Email</label>
    <input id="email" type="email">
  </div>
  <div class="field">
    <label for="password">Password</label>
    <input id="password" type="password">
  </div>
  <button>Sign in</button>
</form>
```

```css starter
body {
  font-family: system-ui, sans-serif;
}

label {
  display: block;
  margin-bottom: 16px;
}

input {
  display: block;
  width: 240px;
  padding: 8px;
  margin-bottom: 16px;
}

.field {
  margin-bottom: 0;
}
```

```css solution
body {
  font-family: system-ui, sans-serif;
}

label {
  display: block;
  margin-bottom: 4px;
}

input {
  display: block;
  width: 240px;
  padding: 8px;
  margin-bottom: 0;
}

.field {
  margin-bottom: 24px;
}
```

```js tests
const box = (node) => node.getBoundingClientRect();
const [firstLabel, secondLabel] = $$("label");
const [firstInput] = $$("input");
const insideGap = () => box(firstInput).top - box(firstLabel).bottom;
const betweenGap = () => box(secondLabel).top - box(firstInput).bottom;
check("Each label is 8px or less from its input", () => {
  const gap = Math.round(insideGap());
  if (gap > 8) throw new Error(`The gap is ${gap}px.`);
});
check("Fields are at least 20px apart", () => {
  const gap = Math.round(betweenGap());
  if (gap < 20) throw new Error(`The gap is ${gap}px.`);
});
check("The gap between fields is bigger than the gap inside a field", () => betweenGap() > insideGap());
```

```text hints
The label's margin-bottom sets the gap above its input. Make it small.
The space between fields comes from the input's margin-bottom and the .field's margin-bottom.
```

<!-- quiz -->

### What does the law of proximity say?
- [x] Items that are close together are seen as a group
- [ ] Important items should be near the top
- [ ] Buttons should be near the edge of the screen
> People group what's close together, so use distance to show relationships.

### A label is 16px below one field and 16px above the next. What's the problem?
- [ ] Nothing, the spacing is consistent
- [x] It's unclear which field the label belongs to
- [ ] Labels should always sit beside fields
> Put a label closer to its own field than to anything else.

### Why use a spacing scale?
- [ ] Browsers require it
- [x] It keeps spacing consistent, and makes decisions quicker
- [ ] It makes pages load faster
> A short list of allowed values keeps layouts tidy and saves time deciding.
