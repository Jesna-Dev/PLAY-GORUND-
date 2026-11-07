---
title: Links and images
minutes: 10
summary: Connect pages with links, and add images that everyone can understand.
---

## Links

The `<a>` (anchor) element makes a link. Its `href` **attribute** says where the link goes:

```html
<a href="https://developer.mozilla.org">Read the MDN docs</a>
```

Attributes go inside the opening tag as `name="value"`. The text between the tags is what people click, so make it describe the destination. "Read the MDN docs" is clearer than "click here".

## Images

The `<img>` element shows a picture. It has no closing tag, because it has no content:

```html
<img src="https://picsum.photos/id/1080/400/250" alt="Fresh strawberries piled in a crate">
```

- `src` is the image's address.
- `alt` describes the image for people using screen readers, and appears if the image can't load.

Write `alt` text that says what matters about the picture. If an image is only decoration, use an empty `alt=""` so screen readers skip it.

> **Tip:** Relative paths like `src="photos/cake.jpg"` point to files next to your page. In this playground, use full web addresses that start with `https://`.

<!-- exercise -->

Add these below the heading:

1. A link to `https://developer.mozilla.org` with the text **Learn more on MDN**.
2. An image with `src="https://picsum.photos/id/1080/400/250"` and alt text that describes it. It's a photo of strawberries in a crate.

```html starter
<h1>Strawberry Season</h1>

```

```html solution
<h1>Strawberry Season</h1>
<a href="https://developer.mozilla.org">Learn more on MDN</a>
<img src="https://picsum.photos/id/1080/400/250" alt="Fresh strawberries in a crate">
```

```js tests
check("There is a link", () => $("a") !== null);
check("The link goes to https://developer.mozilla.org", () => equal(($("a")?.getAttribute("href") ?? "").replace(/\/$/, ""), "https://developer.mozilla.org"));
check("The link text is “Learn more on MDN”", () => equal(text("a"), "Learn more on MDN"));
check("There is an image with the right src", () => equal($("img")?.getAttribute("src"), "https://picsum.photos/id/1080/400/250"));
check("The image has alt text", () => ($("img")?.getAttribute("alt") ?? "").trim().length > 0);
```

```text hints
Attributes go inside the opening tag: <a href="...">.
<img> has no closing tag. Put src and alt inside it.
```

<!-- quiz -->

### Which attribute sets where a link goes?
- [ ] `src`
- [x] `href`
- [ ] `link`
- [ ] `alt`
> `href` holds the link's destination. `src` is for things a page loads, like images.

### Why does an image need `alt` text?
- [ ] It makes the image load faster
- [x] It describes the image for screen reader users, and shows if the image doesn't load
- [ ] It's the image's file name
> Screen readers read `alt` text aloud, and browsers show it when the image fails to load.

### Which link text is most helpful?
- [ ] Click here
- [ ] Link
- [x] Download the 2026 timetable
> Link text should make sense on its own, because many people scan a page or jump between links.
