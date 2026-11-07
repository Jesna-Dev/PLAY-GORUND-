---
title: Merge intervals
difficulty: advanced
minutes: 20
topics: sorting, arrays
js: mergeIntervals(intervals)
python: merge_intervals(intervals)
---

You're given a list of time intervals, each written as `[start, end]`. Merge every set of overlapping intervals into one, and return the result sorted by start.

- Intervals that only touch, like `[1, 4]` and `[4, 5]`, count as overlapping.
- The input isn't necessarily sorted.
- An empty list gives an empty list.

<!-- tests -->

```json
[
  { "args": [[[1, 3], [2, 6], [8, 10]]], "expected": [[1, 6], [8, 10]], "example": true },
  { "args": [[[1, 4], [4, 5]]], "expected": [[1, 5]], "example": true },
  { "args": [[]], "expected": [] },
  { "args": [[[5, 7], [1, 2]]], "expected": [[1, 2], [5, 7]] },
  { "args": [[[1, 10], [2, 3], [4, 5]]], "expected": [[1, 10]] },
  { "args": [[[6, 8], [1, 9], [2, 4], [4, 7]]], "expected": [[1, 9]] },
  { "args": [[[1, 2]]], "expected": [[1, 2]] }
]
```

<!-- hints -->

- Sort the intervals by their start first. After that, overlaps are always next to each other.
- Walk through the sorted list and keep a result list. Compare each interval with the last one in the result.
- If it starts before (or exactly when) the last one ends, extend the last one's end. Be careful: `[1, 10]` followed by `[2, 3]` must keep the end at 10.

<!-- solution -->

Sorting by start puts overlapping intervals next to each other. Then one pass merges them:

```js
function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}
```

```python
def merge_intervals(intervals):
    merged = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
```

Two details matter. Using `<=` rather than `<` merges intervals that only touch. Using `max` for the new end handles an interval that sits completely inside another, like `[2, 3]` inside `[1, 10]`.

Sorting dominates the running time, so it grows like n log n for n intervals. In JavaScript, sort with a compare function: the default `sort()` compares numbers as text, so 10 would come before 9.
