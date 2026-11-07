---
title: Unions and narrowing
minutes: 12
summary: Let a value be one of several types, and check which one you have.
---

A **union** type says a value can be one of several types:

```ts
let id: string | number;
id = "a1";
id = 42;
```

Unions of exact values are great for options:

```ts
type Status = "loading" | "success" | "error";

let status: Status = "loading";
status = "done"; // Error: Type '"done"' is not assignable to type 'Status'.
```

## Narrowing

With a union, TypeScript only lets you do what's safe for every member. Check the type first, and TypeScript **narrows** it inside the block:

```ts
function format(id: string | number): string {
  if (typeof id === "number") {
    return id.toFixed(0); // id is a number here
  }
  return id.toUpperCase(); // and a string here
}
```

## Handling missing values

`null` and `undefined` can be part of unions too, and TypeScript makes you deal with them:

```ts
function greet(name: string | undefined): string {
  if (!name) {
    return "Hello, stranger";
  }
  return `Hello, ${name}`;
}
```

This catches one of the most common JavaScript bugs: using a value that might not be there.

<!-- quiz -->

### What can a variable of type `"small" | "large"` hold?
- [ ] Any string
- [x] Only "small" or "large"
- [ ] A boolean
> A union of exact values allows those values and nothing else.

### Inside `if (typeof value === "string") { ... }`, what does TypeScript know about `value`?
- [x] It's a string
- [ ] Nothing new
- [ ] It's not a string
> The `typeof` check narrows the union, so string methods are allowed inside the block.

### Why does TypeScript reject `name.toUpperCase()` when `name` is `string | undefined`?
- [ ] `toUpperCase` doesn't exist
- [x] `name` might be `undefined`, which has no `toUpperCase` method
- [ ] Strings can't be uppercased in TypeScript
> Check for `undefined` first, and TypeScript narrows `name` to `string`.
