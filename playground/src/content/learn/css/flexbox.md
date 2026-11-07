---
title: Flexbox
minutes: 11
summary: Line elements up in a row or column, and control the space between them.
---

Flexbox lays out a box's children along a line. Turn it on with `display: flex` on the **parent**:

```css
.toolbar {
  display: flex;
  gap: 12px;
}
```

The children now sit side by side in a row, with 12px between them. `gap` is the simplest way to space items apart.

## Direction

Items run in a row by default. Use `flex-direction: column` to stack them instead.

## Spacing along the line

`justify-content` decides where the items sit along the line:

- `flex-start` (the default): packed at the start.
- `center`: in the middle.
- `space-between`: the first item at the start, the last at the end, and equal space between.

## Alignment across the line

In a row, `align-items` controls vertical alignment. `center` is the classic fix for lining up an icon with text:

```css
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Letting items grow

Give a child `flex: 1` and it takes up the space left over. That's handy for a search box that fills a toolbar.

<!-- exercise -->

Turn `.toolbar` into a flex row where:

1. The items have a `12px` gap between them.
2. The first item is at the left edge and the last at the right.
3. The items are vertically centered.

```html fixture
<nav class="toolbar">
  <strong>Notes</strong>
  <span>12 saved</span>
  <button>New note</button>
</nav>
```

```css starter
.toolbar {
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
}
```

```css solution
.toolbar {
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
}
```

```js tests
check("The toolbar uses display: flex", () => equal(css(".toolbar", "display"), "flex"));
check("There's a 12px gap", () => equal(css(".toolbar", "columnGap"), "12px"));
check("Items are spread with space-between", () => equal(css(".toolbar", "justifyContent"), "space-between"));
check("Items are vertically centered", () => equal(css(".toolbar", "alignItems"), "center"));
```

```text hints
All four declarations go on .toolbar, the parent.
Spreading items to the edges is justify-content. Vertical centering in a row is align-items.
```

<!-- quiz -->

### Where do you put `display: flex`?
- [x] On the parent of the items you want to line up
- [ ] On each item
- [ ] Only on `<body>`
> Flexbox is set on the container. Its direct children become flex items.

### Which declaration puts the first and last items at the edges, with equal space between?
- [ ] `align-items: space-between`
- [x] `justify-content: space-between`
- [ ] `gap: auto`
> `justify-content` spaces items along the line, and `space-between` pushes the outer items to the edges.

### In a flex row, what does `align-items: center` do?
- [ ] Centers the items horizontally
- [x] Centers the items vertically
- [ ] Centers the text inside each item
> In a row, the cross axis is vertical, and `align-items` works on the cross axis.
