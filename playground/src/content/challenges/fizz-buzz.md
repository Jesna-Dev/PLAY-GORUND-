---
title: FizzBuzz
difficulty: beginner
minutes: 12
topics: loops, conditions
js: fizzBuzz(n)
python: fizz_buzz(n)
---

Return a list of strings for the numbers from 1 to `n`:

- `"FizzBuzz"` for numbers divisible by both 3 and 5
- `"Fizz"` for numbers divisible by 3
- `"Buzz"` for numbers divisible by 5
- the number itself, as a string, for everything else

If `n` is 0, return an empty list.

<!-- tests -->

```json
[
  { "args": [5], "expected": ["1", "2", "Fizz", "4", "Buzz"], "example": true },
  { "args": [3], "expected": ["1", "2", "Fizz"], "example": true },
  { "args": [1], "expected": ["1"] },
  { "args": [0], "expected": [] },
  { "args": [15], "expected": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] }
]
```

<!-- hints -->

- `%` gives the remainder after dividing. A number is divisible by 3 when `number % 3` is 0.
- Order matters. Check "divisible by both" before the single checks, or 15 will come out as "Fizz".
- Numbers must be strings in the result: `String(i)` in JavaScript, `str(i)` in Python.

<!-- solution -->

Loop from 1 to `n`, and check the combined case first:

```js
function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(String(i));
    }
  }
  return result;
}
```

```python
def fizz_buzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result
```

A number divisible by both 3 and 5 is divisible by 15, so `i % 15` covers the combined case in one check.
