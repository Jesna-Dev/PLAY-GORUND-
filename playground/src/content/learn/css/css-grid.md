---
title: CSS Grid
minutes: 15
summary: Lay out rows and columns together with grid templates and spanning items.
---

Flexbox arranges items along one line. **Grid** controls rows and columns at the same time, which suits page layouts and galleries.

```css
.gallery {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 16px;
}
```

Items flow into the cells automatically, filling one row and then starting the next.

## The `fr` unit

`fr` means a fraction of the space left over. Above, the first column is fixed at `200px`, and the other two share the rest equally.

`repeat` saves typing:

```css
grid-template-columns: repeat(3, 1fr);
```

## Spanning cells

An item can take up more than one cell:

```css
.feature {
  grid-column: span 2;
}
```

`grid-row: span 2` does the same vertically.

## Responsive without media queries

This pattern fits as many columns as there's room for, each at least `220px` wide:

```css
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
```

`minmax` sets a smallest and largest size, and `auto-fit` picks the number of columns.

## Grid or Flexbox?

Use Flexbox when content decides the layout, like a row of tags. Use Grid when the layout decides where content goes, like a page or a card gallery. They work well together.

<!-- exercise -->

Turn `.gallery` into a grid where:

1. There are three equal columns, using `1fr`.
2. There's a `16px` gap.
3. `.feature` spans two columns.

```html fixture
<div class="gallery">
  <div class="item feature">Featured</div>
  <div class="item">Two</div>
  <div class="item">Three</div>
  <div class="item">Four</div>
  <div class="item">Five</div>
</div>
```

```css starter
.gallery {
  width: 600px;
}

.item {
  background: #e2e8f0;
  padding: 16px;
}
```

```css solution
.gallery {
  width: 600px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.item {
  background: #e2e8f0;
  padding: 16px;
}

.feature {
  grid-column: span 2;
}
```

```js tests
check("The gallery uses display: grid", () => equal(css(".gallery", "display"), "grid"));
check("There are three columns", () => equal(css(".gallery", "gridTemplateColumns").split(" ").length, 3));
check("The columns are equal", () => equal(new Set(css(".gallery", "gridTemplateColumns").split(" ")).size, 1));
check("There's a 16px gap", () => equal(css(".gallery", "columnGap"), "16px"));
check("The feature spans two columns", () => {
  const feature = $(".feature").getBoundingClientRect().width;
  const normal = $$(".item")[1].getBoundingClientRect().width;
  equal(Math.round(feature), Math.round(normal * 2 + 16));
});
```

```text hints
repeat(3, 1fr) makes three equal columns.
.feature needs its own rule with grid-column: span 2.
```

<!-- quiz -->

### What does `1fr` mean?
- [ ] One pixel
- [x] One share of the leftover space
- [ ] The full width of the page
> After fixed sizes and gaps are taken out, the remaining space is shared out in `fr` units.

### How do you make an item cover two columns?
- [x] `grid-column: span 2`
- [ ] `grid-template-columns: 2`
- [ ] `width: 2fr`
> `span` tells the item how many tracks to cover.

### Which is the best fit for a page with a sidebar, header and main area?
- [x] Grid
- [ ] `float`
- [ ] A long list of margins
> When rows and columns need to line up together, Grid is built for the job.
