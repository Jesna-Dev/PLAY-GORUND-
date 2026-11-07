---
title: Two sum
difficulty: intermediate
minutes: 15
topics: arrays, maps
js: twoSum(numbers, target)
python: two_sum(numbers, target)
---

Given a list of numbers and a target, find the **two different positions** whose numbers add up to the target. Return their indexes as a list `[i, j]`, with the smaller index first.

Every input has exactly one answer, and you can't use the same position twice.

<!-- tests -->

```json
[
  { "args": [[2, 7, 11, 15], 9], "expected": [0, 1], "example": true },
  { "args": [[3, 2, 4], 6], "expected": [1, 2], "example": true },
  { "args": [[3, 3], 6], "expected": [0, 1] },
  { "args": [[1, 5, 3, 8], 11], "expected": [2, 3] },
  { "args": [[-1, -2, -3, -4], -6], "expected": [1, 3] },
  { "args": [[0, 4, 3, 0], 0], "expected": [0, 3] }
]
```

<!-- hints -->

- The straightforward way checks every pair with two nested loops. That works. Can you do it in one pass?
- For each number, the partner you need is `target - number`.
- Remember each number's index in a `Map` or dictionary as you go. Before storing a number, check whether its partner is already there.

<!-- solution -->

Checking every pair works, but takes time proportional to n² for a list of n numbers. A map makes it a single pass: for each number, look up whether its partner has already been seen.

```js
function twoSum(numbers, target) {
  const seen = new Map();
  for (let i = 0; i < numbers.length; i++) {
    const partner = target - numbers[i];
    if (seen.has(partner)) {
      return [seen.get(partner), i];
    }
    seen.set(numbers[i], i);
  }
  return [];
}
```

```python
def two_sum(numbers, target):
    seen = {}
    for i, number in enumerate(numbers):
        partner = target - number
        if partner in seen:
            return [seen[partner], i]
        seen[number] = i
    return []
```

Checking for the partner **before** storing the current number is what stops a number pairing with itself. In `[3, 2, 4]` with target 6, the first 3 doesn't match itself, because it isn't in the map yet when it's checked.
