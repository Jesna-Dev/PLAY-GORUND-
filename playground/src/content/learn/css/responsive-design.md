---
title: Responsive design
minutes: 12
summary: Use grids and media queries so one layout works on phones and wide screens.
---

People visit pages on phones, tablets and wide monitors. A **responsive** layout adapts to the space it has.

## Start with flexible sizes

Avoid fixed widths that are wider than a phone. `max-width` lets a box shrink on small screens but stops it growing too wide:

```css
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}
```

`margin: 0 auto` centers the box when there's room.

## Grids

CSS Grid makes columns easy. `1fr` means one share of the free space:

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

## Media queries

A **media query** applies rules only when a condition is true, like the screen being narrow:

```css
@media (max-width: 600px) {
  .gallery {
    grid-template-columns: 1fr;
  }
}
```

On screens 600px wide or less, the gallery becomes a single column.

> **Tip:** Use the phone and tablet buttons above the preview to see your layout at different widths.

<!-- exercise -->

1. Make `.gallery` a grid with three equal columns and a `16px` gap.
2. Add a media query so screens `600px` wide or less get a single column.

```html fixture
<div class="gallery">
  <div class="tile">1</div>
  <div class="tile">2</div>
  <div class="tile">3</div>
  <div class="tile">4</div>
  <div class="tile">5</div>
  <div class="tile">6</div>
</div>
```

```css starter
.tile {
  padding: 24px;
  background: #e2e8f0;
  border-radius: 8px;
  text-align: center;
}

.gallery {

}
```

```css solution
.tile {
  padding: 24px;
  background: #e2e8f0;
  border-radius: 8px;
  text-align: center;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 600px) {
  .gallery {
    grid-template-columns: 1fr;
  }
}
```

```js tests
const narrow = (r) => r.media && /max-width:\s*600px|width\s*<=\s*600px/.test(r.media);
const gallery = rules().filter((r) => r.selector === ".gallery");
check("The gallery uses display: grid", () => gallery.some((r) => !r.media && r.style.display === "grid"));
check("It has three equal columns", () => gallery.some((r) => !r.media && /^(repeat\(3,\s*1fr\)|1fr 1fr 1fr)$/.test(r.style.gridTemplateColumns)));
check("The gap is 16px", () => gallery.some((r) => !r.media && (r.style.gap === "16px" || r.style.columnGap === "16px")));
check("There's a media query for max-width: 600px", () => rules().some(narrow));
check("Inside it, the gallery has one column", () => gallery.some((r) => narrow(r) && /^(1fr|repeat\(1,\s*1fr\))$/.test(r.style.gridTemplateColumns)));
```

```text hints
Three equal columns: grid-template-columns: repeat(3, 1fr);
The media query wraps a whole rule: @media (max-width: 600px) { .gallery { ... } }
```

<!-- quiz -->

### What does `@media (max-width: 600px) { ... }` do?
- [ ] Sets the page's maximum width to 600px
- [x] Applies the rules inside only when the viewport is 600px wide or less
- [ ] Hides the page on screens wider than 600px
> A media query is a condition. Its rules apply only while the condition is true.

### What does `grid-template-columns: repeat(3, 1fr)` create?
- [x] Three columns that share the space equally
- [ ] Three rows
- [ ] Columns that are 3px wide
> `1fr` is one share of the free space, and `repeat(3, 1fr)` makes three of them.

### Why use `max-width` rather than `width` for a page container?
- [ ] It's faster
- [x] The box can shrink on narrow screens but won't grow past the limit
- [ ] `width` doesn't work on `<div>`
> `max-width` caps the size without forcing small screens to scroll sideways.
