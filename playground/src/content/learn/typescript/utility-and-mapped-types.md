---
title: Utility and mapped types
minutes: 18
summary: Derive new types from existing ones, and let the compiler prove you've handled every case.
---

Good TypeScript keeps one source of truth. Rather than writing similar types by hand, derive them so they can't drift apart.

```ts
type User = {
  id: number;
  name: string;
  email: string;
};
```

## Built-in utility types

- `Partial<User>` makes every property optional.
- `Required<User>` makes every property required.
- `Readonly<User>` makes every property read-only.
- `Pick<User, "id" | "name">` keeps only those properties.
- `Omit<User, "email">` keeps everything except those properties.
- `Record<string, User>` is an object with those keys and values.

A typical use is an update function that accepts any subset of fields, but never the `id`:

```ts
function updateUser(id: number, changes: Partial<Omit<User, "id">>) {
  // ...
}

updateUser(1, { name: "Ada" });
```

## Types from values

`typeof` reads the type of a value, and `as const` keeps its exact literal values:

```ts
const statuses = ["draft", "published", "archived"] as const;
type Status = (typeof statuses)[number]; // "draft" | "published" | "archived"
```

Add a status to the array and the type updates by itself.

## Mapped types

A **mapped type** loops over keys to build a new type. This is how `Partial` is made:

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

You can also transform the value types. Here, every field gets an error message:

```ts
type FormErrors<T> = {
  [K in keyof T]?: string;
};
```

## Exhaustive checks with `never`

Give each member of a union a shared `kind` field, and `switch` can narrow it. `never` is the type with no possible values, so assigning to it fails if a case was missed:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    default: {
      const unreachable: never = shape;
      return unreachable;
    }
  }
}
```

Add a `triangle` to `Shape` and this code stops compiling until you handle it.

<!-- quiz -->

### Which type accepts any subset of `User`'s fields, but not `id`?
- [ ] `Omit<Partial<User>>`
- [x] `Partial<Omit<User, "id">>`
- [ ] `Pick<User, "id">`
> `Omit` removes `id`, and `Partial` makes what's left optional.

### What does `[K in keyof T]` do in a mapped type?
- [x] Goes through each property name of `T`
- [ ] Loops over an array at runtime
- [ ] Deletes the keys of `T`
> Mapped types run at compile time and build a new type, one key at a time.

### What does assigning a value to `never` in a `default` branch achieve?
- [ ] It crashes the program at compile time on purpose every time
- [x] The code stops compiling if a union member isn't handled
- [ ] It makes the `switch` faster
> If every case is handled, nothing reaches `default`. If one is missed, its type can't be assigned to `never`.
