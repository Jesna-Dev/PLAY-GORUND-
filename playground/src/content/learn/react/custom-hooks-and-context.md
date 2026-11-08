---
title: Custom hooks and context
minutes: 18
summary: Share logic with custom hooks, and share data across the tree with context.
---

As apps grow, two problems show up: the same logic appears in many components, and props get passed through layers that don't use them. Custom hooks solve the first, and context helps with the second.

## Custom hooks

A **custom hook** is a function whose name starts with `use` and which calls other hooks. It moves logic out of a component so you can reuse it:

```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((value) => !value);
  return [on, toggle];
}

function Menu() {
  const [open, toggleOpen] = useToggle();
  return <button onClick={toggleOpen}>{open ? "Close" : "Open"}</button>;
}
```

Hooks share **logic**, not data. Each component that calls `useToggle` gets its own separate state.

## The rules of hooks

Call hooks only at the top level of a component or a custom hook, never inside loops, conditions or nested functions. React tells hooks apart by the order they're called in, so that order must be the same on every render.

## Context

**Prop drilling** means passing a prop through components that only hand it along. Context lets any component below a provider read a value directly:

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Badge() {
  const theme = useContext(ThemeContext);
  return <span className={theme}>New</span>;
}
```

`Badge` gets the theme without `Page` ever knowing about it.

## Use context with care

Every component that reads a context renders again when its value changes. Context suits data many components need and that changes rarely, like the theme or the signed-in user. For data only a few levels down, ordinary props are simpler and easier to follow.

A custom hook pairs well with context, because it can hide the details and give a clear error:

```jsx
const UserContext = createContext(null);

function useUser() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used inside UserContext.Provider");
  return user;
}
```

<!-- quiz -->

### Two components call the same `useToggle()` hook. What happens when one toggles?
- [x] Only that component's state changes
- [ ] Both components change
- [ ] React throws an error
> Custom hooks share logic. Every call gets its own state.

### Why can't you call a hook inside an `if`?
- [x] React relies on hooks being called in the same order every render
- [ ] `if` statements are slow
- [ ] Hooks only work inside loops
> A condition could change the order of the calls, and React would match state to the wrong hook.

### What is context best suited to?
- [ ] Every piece of state in the app
- [x] Data that many components need and that changes rarely
- [ ] A value passed down one level
> Everything reading a context renders again when it changes, so keep it for widely shared values.
