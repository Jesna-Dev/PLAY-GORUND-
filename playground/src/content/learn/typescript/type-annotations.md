---
title: Types and annotations
minutes: 10
summary: Describe what kind of value a variable holds, and let TypeScript catch mistakes.
---

TypeScript is JavaScript with **types**. You describe what kind of value each variable and parameter holds, and TypeScript checks your code before it runs:

```ts
let city: string = "Oslo";
let population: number = 709_037;
let isCapital: boolean = true;

city = 42; // Error: Type 'number' is not assignable to type 'string'.
```

The error shows up in your editor as you type, long before anyone sees a bug.

## Inference

You don't need to annotate everything. TypeScript **infers** types from values:

```ts
let count = 0; // TypeScript knows count is a number
count = "zero"; // Error
```

Add annotations where TypeScript can't work the type out, especially on function parameters.

## Typing functions

```ts
function area(width: number, height: number): number {
  return width * height;
}

area(3, 4); // 12
area("3", 4); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

The `: number` after the parentheses is the return type.

## Arrays

```ts
const scores: number[] = [72, 95, 88];
scores.push("100"); // Error
```

> **Tip:** Types disappear when TypeScript compiles to JavaScript. They cost nothing when your code runs.

<!-- quiz -->

### What does TypeScript do with `let total: number = "10";`?
- [ ] Converts "10" to the number 10
- [x] Reports an error, because a string isn't a number
- [ ] Nothing until the code runs
> TypeScript never converts values. It reports the mismatch in your editor.

### Where is a type annotation most useful?
- [ ] On every variable
- [x] On function parameters, where TypeScript can't infer the type
- [ ] Only on strings
> Values assigned at creation are inferred. Parameters arrive from callers, so they need annotations.

### What happens to types when TypeScript compiles to JavaScript?
- [x] They're removed
- [ ] They become runtime checks
- [ ] They're turned into comments
> Types only exist while you write and check code.
