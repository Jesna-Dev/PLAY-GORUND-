---
title: Find the largest number
difficulty: beginner
minutes: 8
topics: lists, loops
js: largestNumber(numbers)
python: largest_number(numbers)
---

Write a function that returns the largest number in a list. The list always has at least one number, and the numbers can be negative or decimals.

Try it with a loop first, without `Math.max` or `max()`. It's the pattern behind many harder problems.

<!-- tests -->

```json
[
  { "args": [[3, 9, 2]], "expected": 9, "example": true },
  { "args": [[-5, -2, -9]], "expected": -2, "example": true },
  { "args": [[7]], "expected": 7 },
  { "args": [[1.5, 1.25]], "expected": 1.5 },
  { "args": [[0, -1]], "expected": 0 },
  { "args": [[4, 4, 4]], "expected": 4 }
]
```

<!-- hints -->

- Keep track of the largest value seen so far, and update it when you find a bigger one.
- What should "the largest so far" start as? If you start at 0, a list of negative numbers gives the wrong answer.
- Start with the first number in the list.

<!-- solution -->

Start with the first number, then replace it whenever a bigger one comes along:

```js
function largestNumber(numbers) {
  let largest = numbers[0];
  for (const number of numbers) {
    if (number > largest) {
      largest = number;
    }
  }
  return largest;
}
```

```python
def largest_number(numbers):
    largest = numbers[0]
    for number in numbers:
        if number > largest:
            largest = number
    return largest
```

The common mistake is starting with `largest = 0`. For `[-5, -2, -9]`, nothing is ever bigger than 0, so the function wrongly returns 0. Starting with a real value from the list avoids that.
