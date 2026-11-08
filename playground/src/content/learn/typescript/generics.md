---
title: Generics
minutes: 15
summary: Write functions and types that work with many types without losing safety.
---

Imagine a function that returns the first item of an array. Typing it as `any` works, but the type information is lost:

```ts
function first(items: any[]): any {
  return items[0];
}

const name = first(["Ada"]); // any, so nothing is checked
```

A **generic** adds a type parameter, a placeholder that's filled in when the function is used:

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const name = first(["Ada"]); // string | undefined
const age = first([36]); // number | undefined
```

`T` connects the input to the output. TypeScript works out what it is from the argument, so you rarely need to write it yourself.

## Generic types

Types and interfaces can have parameters too:

```ts
type ApiResult<T> = {
  data: T;
  fetchedAt: Date;
};

const user: ApiResult<{ name: string }> = {
  data: { name: "Ada" },
  fetchedAt: new Date(),
};
```

You've already used this. `Array<string>` is the same as `string[]`.

## Constraints

Inside a plain generic, TypeScript knows nothing about `T`. Use `extends` to require a certain shape:

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hi", "hello"); // works with strings
longest([1], [1, 2]); // and with arrays
longest(1, 2); // error: numbers have no length
```

## `keyof`

`keyof` produces a union of an object type's property names. Together with a constraint, it makes safe property access possible:

```ts
function pluck<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}

const age = pluck({ name: "Ada", age: 36 }, "age"); // number
pluck({ name: "Ada" }, "email"); // error
```

`T[K]` means "the type of property `K` on `T`".

<!-- quiz -->

### Why is `function first<T>(items: T[]): T | undefined` better than using `any`?
- [x] The return type follows the type of the array passed in
- [ ] It runs faster
- [ ] It stops the array from being empty
> `T` links the input and output, so the result keeps its real type.

### What does `<T extends { length: number }>` require?
- [ ] `T` must be a number
- [x] `T` must have a numeric `length` property
- [ ] `T` must be exactly `{ length: number }`
> A constraint sets the minimum shape. Strings and arrays both qualify.

### For `type User = { id: number; name: string }`, what is `keyof User`?
- [x] `"id" | "name"`
- [ ] `number | string`
- [ ] `User[]`
> `keyof` gives a union of the property names.
