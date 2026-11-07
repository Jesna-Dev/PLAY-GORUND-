---
title: Spiral matrix
difficulty: advanced
minutes: 20
topics: 2D arrays, simulation
js: spiralOrder(matrix)
python: spiral_order(matrix)
---

A matrix is a list of rows, where every row has the same length. Return all its values in **clockwise spiral order**: along the top row, down the right side, back along the bottom, up the left side, and then inwards.

The matrix can be any shape, including a single row, a single column, or empty.

<!-- tests -->

```json
[
  { "args": [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], "expected": [1, 2, 3, 6, 9, 8, 7, 4, 5], "example": true },
  { "args": [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], "expected": [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], "example": true },
  { "args": [[]], "expected": [] },
  { "args": [[[1]]], "expected": [1] },
  { "args": [[[1], [2], [3]]], "expected": [1, 2, 3] },
  { "args": [[[1, 2], [3, 4]]], "expected": [1, 2, 4, 3] },
  { "args": [[[1, 2, 3]]], "expected": [1, 2, 3] }
]
```

<!-- hints -->

- Keep four boundaries: top row, bottom row, left column and right column.
- After walking one side, move that boundary inwards. For example, after the top row, add 1 to top.
- Before walking the bottom row or the left column, check that the boundaries haven't crossed. Single rows and single columns break solutions that skip this.

<!-- solution -->

Track four boundaries and shrink them as you go. Each loop around peels off one ring of the matrix:

```js
function spiralOrder(matrix) {
  const result = [];
  if (matrix.length === 0) return result;
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) result.push(matrix[top][col]);
    top++;
    for (let row = top; row <= bottom; row++) result.push(matrix[row][right]);
    right--;
    if (top <= bottom) {
      for (let col = right; col >= left; col--) result.push(matrix[bottom][col]);
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) result.push(matrix[row][left]);
      left++;
    }
  }
  return result;
}
```

```python
def spiral_order(matrix):
    result = []
    if not matrix:
        return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    return result
```

The two `if` checks are the whole difficulty. In `[[1, 2, 3]]`, after reading the top row there's no bottom row left to read backwards. Without the check, the values would be added a second time.

Every value is visited exactly once, so the time grows with the number of values.
