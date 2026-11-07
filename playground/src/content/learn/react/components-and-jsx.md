---
title: Components and JSX
minutes: 10
summary: Build an interface from small, reusable components written in JSX.
---

React builds interfaces from **components**: small, reusable pieces like a button, a card or a whole page. A component is a JavaScript function that returns what to show:

```jsx
function Greeting() {
  return <h1>Hello, React!</h1>;
}
```

The HTML-like syntax is called **JSX**. A build tool turns it into regular JavaScript before it reaches the browser.

## Using components

Use a component like an HTML tag. Component names must start with a capital letter, so React can tell them apart from HTML elements:

```jsx
function App() {
  return (
    <main>
      <Greeting />
      <Greeting />
    </main>
  );
}
```

## JSX rules

- Return a single parent element. Wrap siblings in a `<div>`, or in an empty fragment: `<>...</>`.
- Close every tag, including ones like `<img />` and `<br />`.
- Use `className` instead of `class`, because `class` is a reserved word in JavaScript.
- Put JavaScript expressions inside curly braces:

```jsx
function Price() {
  const amount = 12;
  return <p className="price">Total: {amount * 2} euros</p>;
}
```

This shows "Total: 24 euros".

<!-- quiz -->

### Why must component names start with a capital letter?
- [ ] It's only a style convention
- [x] React treats lowercase tags as HTML elements
- [ ] JavaScript functions must be capitalized
> `<greeting />` would be treated as an unknown HTML tag. `<Greeting />` tells React to use your component.

### Which attribute sets a CSS class in JSX?
- [ ] `class`
- [x] `className`
- [ ] `cssClass`
> `class` is a reserved word in JavaScript, so JSX uses `className`.

### How do you show the value of a variable `count` in JSX?
- [ ] `<p>count</p>`
- [x] `<p>{count}</p>`
- [ ] `<p>${count}</p>`
> Curly braces switch from JSX into JavaScript.
