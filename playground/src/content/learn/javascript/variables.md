---
title: Variables and values
minutes: 10
summary: Store values in variables, and print them with console.log.
---

A **variable** is a name for a value. Create one with `const` or `let`:

```js
const city = "Lisbon";
let temperature = 21;

console.log(city);
console.log(temperature);
```

`console.log` prints a value to the console. It's the quickest way to see what your code is doing.

## `const` or `let`?

- `const` makes a variable you can't reassign. Use it by default.
- `let` makes a variable you can change later.

```js
let score = 0;
score = score + 10;
console.log(score); // 10
```

Trying to reassign a `const` throws an error, which catches mistakes early.

## Kinds of values

- **Strings** are text, in quotes: `"hello"` or `'hello'`.
- **Numbers** are written plainly: `42`, `3.14`.
- **Booleans** are `true` or `false`.

## Building strings

A **template literal** is written with backticks, and fills in values with `${...}`:

```js
const name = "Ada";
const age = 36;
console.log(`${name} is ${age} years old.`);
```

This prints `Ada is 36 years old.`

<!-- exercise -->

1. Create a `const` called `name` set to `"Grace"`.
2. Create a `let` called `age` set to `85`.
3. Use a template literal to print exactly: **Grace is 85 years old.**

```js starter
// Create your variables here

// Then print the sentence with console.log
```

```js solution
const name = "Grace";
let age = 85;
console.log(`${name} is ${age} years old.`);
```

```text expected
Grace is 85 years old.
```

```js tests
check("name is \"Grace\"", () => equal(name, "Grace"));
check("age is 85", () => equal(age, 85));
```

```text hints
Template literals use backticks (`), not quotes.
Put each variable inside ${...}, and end the sentence with a full stop.
```

<!-- quiz -->

### Which keyword should you use for a value that never changes?
- [x] `const`
- [ ] `let`
- [ ] `var`
> Use `const` by default, and reach for `let` only when you need to reassign.

### What does `let x = 5; x = x + 1; console.log(x);` print?
- [ ] 5
- [x] 6
- [ ] x + 1
> `x` starts at 5, then becomes 5 + 1, so it prints 6.

### If `name` is "Sam", what does `console.log("Hi, ${name}")` print?
- [x] `Hi, ${name}`
- [ ] `Hi, Sam`
- [ ] An error
> Plain quotes print `${...}` as it is. Only template literals, written with backticks, fill in values.
