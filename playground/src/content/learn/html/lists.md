---
title: Lists
minutes: 7
summary: Group related items with bulleted and numbered lists.
---

Lists group related items. HTML has two everyday kinds.

## Unordered lists

Use `<ul>` when order doesn't matter, like a shopping list. Each item is an `<li>`, short for list item:

```html
<ul>
  <li>Eggs</li>
  <li>Flour</li>
  <li>Milk</li>
</ul>
```

Browsers show these with bullet points.

## Ordered lists

Use `<ol>` when order matters, like the steps of a recipe. The browser numbers the items for you:

```html
<ol>
  <li>Whisk the eggs and milk.</li>
  <li>Stir in the flour.</li>
  <li>Cook in a hot pan.</li>
</ol>
```

If you add or remove a step, the numbers update on their own.

## Lists inside lists

An `<li>` can contain another list:

```html
<ul>
  <li>Fruit
    <ul>
      <li>Apples</li>
      <li>Pears</li>
    </ul>
  </li>
</ul>
```

Only `<li>` elements belong directly inside `<ul>` and `<ol>`.

<!-- exercise -->

Under the heading, write the steps for making tea as a numbered list with **at least three** steps.

```html starter
<h1>How to make tea</h1>

```

```html solution
<h1>How to make tea</h1>
<ol>
  <li>Boil the water.</li>
  <li>Put a tea bag in a cup.</li>
  <li>Pour in the water and wait three minutes.</li>
</ol>
```

```js tests
check("There is a numbered list (<ol>)", () => $("ol") !== null);
check("The list has at least three items", () => $$("ol > li").length >= 3);
check("Every item has text", () => $$("ol > li").length > 0 && $$("ol > li").every((li) => li.textContent.trim().length > 0));
```

```text hints
Steps happen in order, so use <ol>, not <ul>.
Each step goes in its own <li> inside the <ol>.
```

<!-- quiz -->

### Which list fits the steps of a recipe?
- [x] `<ol>`
- [ ] `<ul>`
- [ ] `<li>`
> Steps happen in order, so an ordered list is the right choice.

### What goes directly inside a `<ul>`?
- [ ] `<p>` elements
- [x] `<li>` elements
- [ ] Plain text
> List items are the only elements that belong directly inside `<ul>` and `<ol>`.
