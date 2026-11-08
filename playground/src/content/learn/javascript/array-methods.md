---
title: Transforming data with array methods
minutes: 15
summary: Combine filter, map, reduce and sort to turn raw data into exactly what you need.
---

You've written loops by hand. Real programs mostly reshape lists of objects, and array methods make each step short and readable.

```js
const players = [
  { name: "Ada", score: 90 },
  { name: "Sam", score: 40 },
  { name: "Lin", score: 75 },
];
```

## `filter`, `map` and `find`

```js
const passed = players.filter((p) => p.score >= 50); // Ada and Lin
const names = players.map((p) => p.name); // ["Ada", "Sam", "Lin"]
const sam = players.find((p) => p.name === "Sam"); // the first match, or undefined
```

## `reduce`

`reduce` boils a list down to one value. Its function receives the running total and the current item, and what it returns becomes the next total:

```js
const total = players.reduce((sum, p) => sum + p.score, 0); // 205
```

The `0` is the starting value. Always provide one, because calling `reduce` on an empty array without it throws an error.

## `sort`, carefully

`sort` compares items using a function. Return a negative number to put `a` first, and a positive number to put `b` first:

```js
const ranked = [...players].sort((a, b) => b.score - a.score);
```

`sort` changes the original array, so `[...players]` makes a copy first. Without a compare function, it sorts as text, so `[10, 9]` stays in that order.

## Chaining

Each method returns a new array, so they read like a list of steps:

```js
const winners = players
  .filter((p) => p.score >= 50)
  .map((p) => p.name);
```

<!-- exercise -->

Write a function `topScorers(players, minimum)` that returns the **names** of players whose score is at least `minimum`, **highest score first**. It must not change the original array.

```js starter
function topScorers(players, minimum) {
  // Filter, sort, then map to names
}

const players = [
  { name: "Ada", score: 90 },
  { name: "Sam", score: 40 },
  { name: "Lin", score: 75 },
];

console.log(topScorers(players, 50)); // ["Ada", "Lin"]
```

```js solution
function topScorers(players, minimum) {
  return players
    .filter((p) => p.score >= minimum)
    .sort((a, b) => b.score - a.score)
    .map((p) => p.name);
}

const players = [
  { name: "Ada", score: 90 },
  { name: "Sam", score: 40 },
  { name: "Lin", score: 75 },
];

console.log(topScorers(players, 50));
```

```js tests
const sample = () => [
  { name: "Sam", score: 40 },
  { name: "Lin", score: 75 },
  { name: "Ada", score: 90 },
];
check("Returns names, highest score first", () => equal(topScorers(sample(), 50), ["Ada", "Lin"]));
check("A score equal to the minimum counts", () => equal(topScorers(sample(), 75), ["Ada", "Lin"]));
check("Returns an empty array when nobody qualifies", () => equal(topScorers(sample(), 100), []));
check("Doesn't change the original array", () => {
  const original = sample();
  topScorers(original, 0);
  equal(original.map((p) => p.name), ["Sam", "Lin", "Ada"]);
});
```

```text hints
filter already returns a new array, so sorting its result leaves the original alone.
Sort with (a, b) => b.score - a.score, and only then map to names.
```

<!-- quiz -->

### What does `[1, 2, 3].reduce((sum, n) => sum + n, 10)` return?
- [ ] `6`
- [x] `16`
- [ ] `[11, 12, 13]`
> The total starts at 10, and each number is added to it.

### What does `[10, 9, 1].sort()` return?
- [ ] `[1, 9, 10]`
- [x] `[1, 10, 9]`
- [ ] `[10, 9, 1]`
> Without a compare function, items are compared as text, and "10" comes before "9".

### What does `find` return when nothing matches?
- [ ] An empty array
- [ ] `false`
- [x] `undefined`
> `find` returns the first match, and `undefined` if there isn't one.
