---
title: Effects and data fetching
minutes: 15
summary: Sync components with things outside React using useEffect, dependencies and cleanup.
---

Rendering should only work out what to show. Anything that reaches outside React, like fetching data, setting a timer or changing the page title, is a **side effect**. `useEffect` runs that code after React updates the screen:

```jsx
import { useEffect, useState } from "react";

function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
}
```

## The dependency array

The second argument says when the effect should run again:

- `[title]` runs after the first render, then whenever `title` changes.
- `[]` runs only after the first render.
- Leaving the array out runs it after every render.

List every prop and state value the effect uses. Leaving one out means the effect keeps using an old value.

## Cleaning up

An effect can return a **cleanup** function. React calls it before running the effect again, and when the component is removed:

```jsx
useEffect(() => {
  const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(timer);
}, []);
```

Without the cleanup, the timer would keep running forever.

## Fetching data

Responses can arrive out of order, so ignore any result that's no longer wanted:

```jsx
useEffect(() => {
  let ignore = false;

  fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (!ignore) setUser(data);
    });

  return () => {
    ignore = true;
  };
}, [id]);
```

## You might not need an effect

If a value can be worked out from props or state, calculate it during rendering. Storing it in state and updating it in an effect only adds an extra render and a chance for bugs:

```jsx
const fullName = `${first} ${last}`;
```

<!-- quiz -->

### When does an effect with `[]` as its dependencies run?
- [x] Once, after the first render
- [ ] After every render
- [ ] Never
> An empty array means there's nothing that can make it run again.

### Why return a cleanup function from an effect that starts a timer?
- [ ] React requires every effect to return one
- [x] To stop the timer when it's no longer needed
- [ ] To make the first render faster
> React runs the cleanup before the next effect and when the component is removed.

### A `total` can be calculated from `items` in state. Where should it be calculated?
- [x] During rendering
- [ ] In a `useEffect` that stores it in state
- [ ] In a timer
> Values you can derive don't need their own state or an effect.
