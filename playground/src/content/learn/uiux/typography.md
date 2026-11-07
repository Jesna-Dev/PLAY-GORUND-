---
title: Readable typography
minutes: 10
summary: Choose text sizes, line lengths and line spacing that make reading comfortable.
---

Most interfaces are mostly text. Small typographic choices decide whether people read comfortably or give up.

## Font size

Use at least **16px** for body text on the web. Smaller text makes people zoom or squint, especially on phones. Take sizes from a scale, for example 14, 16, 20, 24 and 32, rather than picking random values, so the hierarchy stays clear.

## Line length

Long lines are tiring: the eye loses its place on the way back to the start of the next line. Aim for about **45 to 75 characters** per line. The `ch` unit is roughly one character wide, which makes this easy:

```css
.article {
  max-width: 65ch;
}
```

## Line height

Body text needs room between lines. A `line-height` of **1.5** is a good default for paragraphs. Headings can be tighter, around 1.2, because they're large and short.

```css
body {
  font-size: 16px;
  line-height: 1.5;
}

h1 {
  line-height: 1.2;
}
```

## Limit your fonts

One font family in two or three weights is enough for most interfaces. Each extra font adds visual noise, and download time.

> **Tip:** Avoid long passages in capitals or italics. Both are slower to read.

<!-- exercise -->

This article is hard to read. Change `.article` so that:

1. Its text is at least `16px`.
2. Its line height is at least `1.5`.
3. Its maximum width is between `45ch` and `75ch`.

```html fixture
<article class="article">
  <h1>A short history of tea</h1>
  <p>Tea has been drunk in China for thousands of years. It began as a medicine, became an everyday drink, and spread along trade routes to Japan, India and the Middle East.</p>
  <p>By the seventeenth century, tea had reached Europe. In Britain it became so popular that afternoon tea turned into a daily ritual, complete with sandwiches and cake.</p>
</article>
```

```css starter
.article {
  font-family: Georgia, serif;
  font-size: 13px;
  line-height: 1.1;
}
```

```css solution
.article {
  font-family: Georgia, serif;
  font-size: 18px;
  line-height: 1.6;
  max-width: 65ch;
}
```

```js tests
const paragraph = $(".article p");
const characterWidth = () => {
  const probe = document.createElement("span");
  probe.textContent = "0";
  $(".article").append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
};
check("The text is at least 16px", () => parseFloat(css(paragraph, "fontSize")) >= 16);
check("The line height is at least 1.5", () => {
  const ratio = parseFloat(css(paragraph, "lineHeight")) / parseFloat(css(paragraph, "fontSize"));
  if (!(ratio >= 1.49)) throw new Error(Number.isNaN(ratio) ? "The line height isn't set." : `The line height is ${ratio.toFixed(2)}.`);
});
check("The article has a max-width", () => css(".article", "maxWidth") !== "none");
check("The max-width is between 45 and 75 characters", () => {
  const characters = parseFloat(css(".article", "maxWidth")) / characterWidth();
  if (!(characters >= 44.5 && characters <= 75.5)) throw new Error("Use a width in ch, from 45ch to 75ch.");
});
```

```text hints
All three declarations go on .article. The text inside inherits them.
For the width, use max-width with ch units, like max-width: 65ch;
```

<!-- quiz -->

### What's a comfortable line length for body text?
- [ ] 20 to 30 characters
- [x] About 45 to 75 characters
- [ ] As wide as the screen
> Within that range, the eye finds the next line easily without jumping too often.

### What's a good default line height for paragraphs?
- [ ] 1
- [x] 1.5
- [ ] 3
> 1.5 gives lines room to breathe without the text falling apart.

### Why avoid long passages in capitals?
- [x] They're slower to read
- [ ] Browsers can't display them
- [ ] They take more storage
> Capitals make every word a similar rectangle, which removes the word shapes we read by.
