---
title: Arrays and loops
minutes: 12
summary: Keep lists of values in arrays, and work through them with loops.
---

An **array** holds a list of values in order:

```js
const scores = [72, 95, 88];

console.log(scores[0]); // 72, the first item
console.log(scores.length); // 3
```

Positions, called **indexes**, start at 0. The last item is at `scores.length - 1`.

## Changing arrays

```js
const todo = ["Buy milk"];
todo.push("Call Sam"); // adds to the end
console.log(todo); // ["Buy milk", "Call Sam"]
```

`const` stops you replacing the array, but you can still change what's inside it.

## Looping with `for...of`

A `for...of` loop runs once for each item:

```js
const prices = [4, 10, 6];
let total = 0;

for (const price of prices) {
  total = total + price;
}

console.log(total); // 20
```

Starting a total and adding to it in a loop is called the **accumulator** pattern. You'll use it constantly.

## Array methods

Arrays have built-in methods for common jobs:

```js
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8]
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]
```

`%` gives the remainder after dividing, so `n % 2 === 0` is true for even numbers.

<!-- exercise -->

Write a function `countLongWords(words)` that returns how many words in the array have **more than 5** letters.

```js starter
function countLongWords(words) {
  let count = 0;
  // Loop over the words and add 1 for each long one
  return count;
}

console.log(countLongWords(["apple", "banana", "kiwi", "cherries"])); // 2
```

```js solution
function countLongWords(words) {
  let count = 0;
  for (const word of words) {
    if (word.length > 5) {
      count = count + 1;
    }
  }
  return count;
}

console.log(countLongWords(["apple", "banana", "kiwi", "cherries"]));
```

```js tests
check('countLongWords(["apple", "banana", "kiwi", "cherries"]) returns 2', () => equal(countLongWords(["apple", "banana", "kiwi", "cherries"]), 2));
check("countLongWords([]) returns 0", () => equal(countLongWords([]), 0));
check('A five-letter word doesn\'t count: countLongWords(["hello"]) returns 0', () => equal(countLongWords(["hello"]), 0));
check('countLongWords(["elephant", "giraffe"]) returns 2', () => equal(countLongWords(["elephant", "giraffe"]), 2));
```

```text hints
Strings have a length too: word.length.
"More than 5" means > 5, not >= 5.
```

<!-- quiz -->

### What's the index of the first item in an array?
- [x] 0
- [ ] 1
- [ ] -1
> JavaScript counts positions from 0.

### What does `[3, 6, 9].map((n) => n / 3)` give?
- [x] `[1, 2, 3]`
- [ ] `[3, 6, 9]`
- [ ] `6`
> `map` makes a new array by running the function on every item.

### What happens after `const list = [1]; list.push(2);`?
- [ ] An error, because `list` is a `const`
- [x] `list` becomes `[1, 2]`
> `const` stops the variable pointing at a new array. Changing the array's contents is allowed.
