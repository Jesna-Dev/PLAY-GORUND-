---
title: The box model
minutes: 10
summary: Control spacing with padding, borders and margins.
---

Every element is a rectangle, or box. CSS gives each box four layers, from the inside out:

1. **Content**: the text or image itself.
2. **Padding**: space between the content and the border.
3. **Border**: a line around the padding.
4. **Margin**: space outside the border, pushing other boxes away.

```css
.card {
  padding: 16px;
  border: 2px solid #94a3b8;
  margin: 24px;
}
```

`border` is a shorthand for width, style and color. The style is required: `solid`, `dashed` and `dotted` are common.

## One side at a time

Each of these properties has versions for single sides:

```css
.card {
  padding-top: 8px;
  padding-left: 20px;
  margin-bottom: 32px;
}
```

You can also give `padding` and `margin` two values. `padding: 8px 20px;` means 8px on the top and bottom, and 20px on the left and right.

## Sizing boxes predictably

By default, `width` sets the content's width, and padding and border are added on top. Most projects change this so `width` means the whole box:

```css
* {
  box-sizing: border-box;
}
```

<!-- exercise -->

Style the `.card` so it has:

1. `16px` of padding on every side.
2. A `2px` solid border, in any color.
3. `24px` of margin on every side.

```html fixture
<div class="card">
  <h2>Weekend hike</h2>
  <p>Meet at the station at 9am. Bring water and a snack.</p>
</div>
```

```css starter
.card {

}
```

```css solution
.card {
  padding: 16px;
  border: 2px solid #94a3b8;
  margin: 24px;
}
```

```js tests
const sides = ["Top", "Right", "Bottom", "Left"];
check("Padding is 16px on every side", () => sides.every((s) => css(".card", "padding" + s) === "16px"));
check("The border is 2px wide", () => sides.every((s) => css(".card", "border" + s + "Width") === "2px"));
check("The border is solid", () => equal(css(".card", "borderTopStyle"), "solid"));
check("Margin is 24px on every side", () => sides.every((s) => css(".card", "margin" + s) === "24px"));
```

```text hints
Write the declarations between the braces of .card { }.
A border needs a width, a style and a color: border: 2px solid gray;
```

<!-- quiz -->

### Which layer sits between the content and the border?
- [x] Padding
- [ ] Margin
- [ ] Outline
> Padding is inside the border. Margin is outside it.

### What does `margin: 10px 30px;` do?
- [ ] 10px on the left, 30px on the right
- [x] 10px top and bottom, 30px left and right
- [ ] 10px on every side, then 30px more
> With two values, the first is for top and bottom, the second for left and right.

### Why do many projects set `box-sizing: border-box`?
- [ ] To add a border to every element
- [x] So `width` includes padding and border, which makes sizes easier to predict
- [ ] To remove all margins
> With `border-box`, a 300px-wide box stays 300px wide when you add padding or a border.
