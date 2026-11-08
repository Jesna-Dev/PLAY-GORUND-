---
title: Closures and higher-order functions
minutes: 18
summary: Write functions that remember values and build new behavior out of other functions.
---

In JavaScript, functions are values. You can store them, pass them around and return them. A function that takes or returns another function is called a **higher-order function**. `map` and `filter` are two you've already used.

## Closures

A function keeps access to the variables around where it was created, even after the outer function has finished. That's a **closure**:

```js
function createCounter() {
  let count = 0;

  return () => {
    count = count + 1;
    return count;
  };
}

const next = createCounter();
console.log(next()); // 1
console.log(next()); // 2
```

`count` isn't reachable from outside, so only the returned function can change it. Closures give you private state.

Each call makes a separate closure:

```js
const other = createCounter();
console.log(other()); // 1
```

## Wrapping a function

A higher-order function can return a new function that adds behavior around an existing one:

```js
function logged(fn) {
  return (x) => {
    console.log("Calling with", x);
    return fn(x);
  };
}

const double = logged((n) => n * 2);
double(4); // logs, then returns 8
```

## Memoizing

**Memoizing** saves the result of a slow function, so repeating a call returns the saved answer. A closure holds the saved results, and a `Map` works well for looking them up:

```js
const cache = new Map();
cache.set("a", 1);
cache.has("a"); // true
cache.get("a"); // 1
```

Only memoize **pure** functions, which always give the same result for the same input and have no side effects.

<!-- exercise -->

Write `memoize(fn)`. It returns a new function that takes one argument. The first time it sees an argument, it calls `fn` and saves the result. After that, it returns the saved result without calling `fn` again.

```js starter
function memoize(fn) {
  // Keep a Map here, and return a function that uses it instead of fn
  return fn;
}

const square = memoize((n) => n * n);
console.log(square(4)); // 16
```

```js solution
function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) {
      cache.set(arg, fn(arg));
    }
    return cache.get(arg);
  };
}

const square = memoize((n) => n * n);
console.log(square(4));
```

```js tests
const counted = () => {
  const inner = (n) => {
    inner.calls = (inner.calls || 0) + 1;
    return n * 2;
  };
  return inner;
};
check("Returns the right result", () => equal(memoize((n) => n + 1)(1), 2));
check("Only calls fn once for a repeated argument", () => {
  const fn = counted();
  const fast = memoize(fn);
  fast(5);
  fast(5);
  equal(fn.calls, 1);
});
check("Calls fn again for a new argument", () => {
  const fn = counted();
  const fast = memoize(fn);
  fast(1);
  fast(2);
  equal(fn.calls, 2);
});
check("Remembers results that are 0", () => {
  const fn = counted();
  const fast = memoize(fn);
  equal(fast(0), 0);
  fast(0);
  equal(fn.calls, 1);
});
check("Each memoized function has its own results", () => {
  equal(memoize((n) => n + 1)(1), 2);
  equal(memoize((n) => n + 2)(1), 3);
});
```

```text hints
Create the Map inside memoize but outside the function you return.
Check with cache.has(arg), because a saved result might be 0, and 0 counts as false in an if.
```

<!-- quiz -->

### What is a closure?
- [x] A function that keeps access to the variables around where it was created
- [ ] A function with no parameters
- [ ] The final `}` of a function
> The returned function in `createCounter` still reaches `count` after the outer function has ended.

### After `const a = createCounter(); const b = createCounter(); a(); a();`, what does `b()` return?
- [x] `1`
- [ ] `3`
- [ ] `undefined`
> Each call to `createCounter` creates its own separate `count`.

### Which function is safe to memoize?
- [x] One that always returns the same output for the same input
- [ ] One that returns the current time
- [ ] One that returns a random number
> A saved result is only correct if calling the function again would give the same answer.
