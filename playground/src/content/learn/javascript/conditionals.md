---
title: Making decisions
minutes: 10
summary: Use if and else to run different code depending on a condition.
---

Programs often need to choose. An `if` statement runs code only when a condition is `true`:

```js
const temperature = 30;

if (temperature > 25) {
  console.log("Wear sunscreen.");
}
```

## `else` and `else if`

Add `else` for when the condition is false, and `else if` to check more conditions in order:

```js
const hour = 14;

if (hour < 12) {
  console.log("Good morning");
} else if (hour < 18) {
  console.log("Good afternoon");
} else {
  console.log("Good evening");
}
```

JavaScript checks each condition from the top and runs the first block that matches.

## Comparisons

- `===` equal, `!==` not equal
- `>`, `<`, `>=`, `<=`
- `&&` and, `||` or, `!` not

Use `===` rather than `==`. The double version converts types first, so `"5" == 5` is `true`, which hides bugs.

## Returning early

Inside a function, `return` stops it straight away. That makes a chain of checks easy to read:

```js
function describe(score) {
  if (score >= 50) {
    return "pass";
  }
  return "fail";
}
```

<!-- exercise -->

Write a function `ticketPrice(age)` that returns:

- `0` for children under 5
- `8` for ages 5 to 17
- `12` for everyone 18 and over

```js starter
function ticketPrice(age) {
  // Return 0, 8 or 12
}

console.log(ticketPrice(4));
console.log(ticketPrice(16));
console.log(ticketPrice(40));
```

```js solution
function ticketPrice(age) {
  if (age < 5) {
    return 0;
  } else if (age < 18) {
    return 8;
  }
  return 12;
}

console.log(ticketPrice(4));
console.log(ticketPrice(16));
console.log(ticketPrice(40));
```

```js tests
check("ticketPrice(4) returns 0", () => equal(ticketPrice(4), 0));
check("ticketPrice(5) returns 8", () => equal(ticketPrice(5), 8));
check("ticketPrice(17) returns 8", () => equal(ticketPrice(17), 8));
check("ticketPrice(18) returns 12", () => equal(ticketPrice(18), 12));
check("ticketPrice(70) returns 12", () => equal(ticketPrice(70), 12));
```

```text hints
Check the youngest group first: if (age < 5).
Ages 5 to 17 are the ones under 18, once you know they aren't under 5.
```

<!-- quiz -->

### What does `"5" === 5` evaluate to?
- [ ] `true`
- [x] `false`
> `===` compares type and value. A string is never strictly equal to a number.

### With `const n = 7;`, which block runs in `if (n > 10) {A} else if (n > 5) {B} else {C}`?
- [ ] A
- [x] B
- [ ] C
> 7 isn't greater than 10, but it is greater than 5. JavaScript stops at the first match.

### Which condition is true when `age` is from 13 to 19?
- [x] `age >= 13 && age <= 19`
- [ ] `age >= 13 || age <= 19`
- [ ] `13 <= age <= 19`
> `&&` needs both parts to be true. The `||` version is true for every age, and the last one doesn't work the way it reads.
