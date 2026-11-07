---
title: State with useState
minutes: 12
summary: Make components interactive by keeping values that change in state.
---

**State** is data a component remembers between renders, like a counter's value or whether a menu is open. The `useState` hook creates it:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

`useState(0)` returns two things: the current value, and a function to update it. Calling `setCount` stores the new value and tells React to draw the component again.

## Don't change state directly

`count = count + 1` won't update the screen. Always use the setter function.

## Events

Event props like `onClick` and `onChange` take a function. Pass the function itself; don't call it:

```jsx
<button onClick={handleClick}>Save</button>   // right
<button onClick={handleClick()}>Save</button> // runs during render
```

## Controlled inputs

Keep a text field's value in state so you can use it elsewhere:

```jsx
function NameForm() {
  const [name, setName] = useState("");

  return (
    <>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <p>Hello, {name || "stranger"}!</p>
    </>
  );
}
```

<!-- quiz -->

### What does `useState(0)` return?
- [ ] Just the number 0
- [x] The current value and a function to update it
- [ ] A function that returns 0
> It returns a pair, which is why it's usually destructured: `const [count, setCount] = useState(0)`.

### Why doesn't `count = count + 1` update the screen?
- [x] React only re-renders when you call the setter, like `setCount`
- [ ] Because `count` is a string
- [ ] It does update the screen
> Assigning to the variable changes nothing React knows about. The setter stores the value and schedules a new render.

### Which is the right way to attach a click handler?
- [x] `onClick={handleClick}`
- [ ] `onClick={handleClick()}`
- [ ] `onclick="handleClick"`
> `handleClick()` would run immediately while rendering. Pass the function, and React calls it on click.
