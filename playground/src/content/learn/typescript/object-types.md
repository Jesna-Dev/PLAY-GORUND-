---
title: Object types
minutes: 11
summary: Describe the shape of objects with type aliases and interfaces.
---

Most data is objects. TypeScript lets you describe their shape once and reuse it:

```ts
type User = {
  name: string;
  age: number;
  email?: string;
};

const ada: User = { name: "Ada", age: 36 };
```

The `?` makes `email` optional. Leaving out `name`, or misspelling a property, is an error.

## Interfaces

`interface` does the same job for object shapes:

```ts
interface Product {
  id: number;
  title: string;
  price: number;
}
```

Both work. Many teams use `type` for everything, because it can also describe unions, which come in the next lesson.

## Object types in functions

```ts
function label(product: Product): string {
  return `${product.title}: €${product.price}`;
}
```

Now your editor autocompletes `product.` and flags typos like `product.prise`.

## Read-only properties

```ts
type Point = {
  readonly x: number;
  readonly y: number;
};
```

Assigning to `point.x` after creation is now an error.

<!-- quiz -->

### In `type User = { name: string; email?: string }`, what does `?` mean?
- [ ] `email` can be any type
- [x] `email` is optional
- [ ] `email` is required
> Optional properties can be left out. Their type is `string | undefined`.

### `User` has only `name` and `email`. What happens with `const u: User = { name: "Ada", age: 36 }`?
- [x] TypeScript reports an error about the extra property
- [ ] TypeScript adds `age` to the type
- [ ] TypeScript ignores the extra property
> Extra properties in an object literal are flagged, which catches typos.

### Can both `interface` and `type` describe object shapes?
- [x] Yes
- [ ] No, only `interface` can
- [ ] No, only `type` can
> For object shapes they're interchangeable. `type` can also describe unions.
