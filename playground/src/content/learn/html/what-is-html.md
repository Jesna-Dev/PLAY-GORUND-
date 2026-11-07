---
title: Elements and tags
minutes: 8
summary: Learn how HTML describes a page with elements, and write your first heading and paragraph.
---

HTML (HyperText Markup Language) describes what's on a web page: this is a heading, this is a paragraph, this is a link. The browser reads it and decides how to show it.

## Elements

You mark up content with **elements**. Most elements have an opening tag, some content and a closing tag with a slash:

```html
<p>This is a paragraph.</p>
```

`<p>` opens the paragraph and `</p>` closes it. Everything in between is the paragraph's content.

## Headings

HTML has six levels of heading, `<h1>` to `<h6>`. Use `<h1>` once for the page's main title, then `<h2>` for sections, `<h3>` for sub-sections, and so on.

```html
<h1>Space facts</h1>
<h2>The Moon</h2>
<p>The Moon is about 384,400 km from Earth.</p>
```

Choose a heading level by its place in the outline, not by how big you want the text. You'll change sizes with CSS later.

## Nesting

Elements can sit inside other elements. Close the inner one before the outer one:

```html
<p>Water boils at <strong>100 °C</strong> at sea level.</p>
```

`<strong>` marks important text. Browsers show it in bold.

> **Tip:** Indent nested elements so the structure is easy to see. The browser ignores the extra spaces.

<!-- exercise -->

Make the first page of a recipe book:

1. Add an `<h1>` that says **My Recipe Book**.
2. Below it, add a paragraph that introduces the book in your own words.

The preview updates as you type. Press **Check answer** when you're ready.

```html starter
<!-- Write your HTML below -->

```

```html solution
<h1>My Recipe Book</h1>
<p>Simple recipes I cook every week.</p>
```

```js tests
check("There is an <h1> heading", () => $("h1") !== null);
check("The heading says “My Recipe Book”", () => equal(text("h1"), "My Recipe Book"));
check("There is a paragraph with some text", () => $$("p").some((p) => p.textContent.trim().length > 0));
```

```text hints
Headings and paragraphs both need an opening and a closing tag.
Check the spelling and capital letters in the heading: My Recipe Book.
```

<!-- quiz -->

### Which tag closes a paragraph?
- [ ] `<p>`
- [x] `</p>`
- [ ] `<p/>`
- [ ] `<close p>`
> A closing tag repeats the element's name with a slash in front: `</p>`.

### How many `<h1>` headings should a page usually have?
- [x] One, for the page's main title
- [ ] One per paragraph
- [ ] As many as you like, to make text bigger
> Use one `<h1>` for the main title, then `<h2>` and below for sections. Text size is a job for CSS.

### What's wrong with `<p>Hello <strong>world</p></strong>`?
- [ ] Nothing, it's valid
- [x] The tags close in the wrong order
- [ ] `<strong>` can't go inside `<p>`
> Close the inner element first: `<p>Hello <strong>world</strong></p>`.
