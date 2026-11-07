---
title: Longest unique substring
difficulty: advanced
minutes: 20
topics: sliding window, maps
js: longestUniqueSubstring(text)
python: longest_unique_substring(text)
---

Return the length of the longest run of **consecutive** characters in a string where no character repeats.

For `"abcabcbb"` the answer is 3, from `"abc"`. For `"pwwkew"` it's 3, from `"wke"`. Note that `"pwke"` doesn't count, because its letters aren't next to each other in the string.

<!-- tests -->

```json
[
  { "args": ["abcabcbb"], "expected": 3, "example": true },
  { "args": ["bbbbb"], "expected": 1, "example": true },
  { "args": [""], "expected": 0 },
  { "args": ["pwwkew"], "expected": 3 },
  { "args": ["dvdf"], "expected": 3 },
  { "args": ["abba"], "expected": 2 },
  { "args": ["abcdef"], "expected": 6 }
]
```

<!-- hints -->

- Checking every substring works but is slow. Instead, keep a window of characters with no repeats, and slide it along.
- Remember the last index where you saw each character.
- When the current character was last seen inside the window, move the window's start just past that position. Never move the start backwards: try your code on `"abba"`.

<!-- solution -->

This is a **sliding window**. The window always holds characters with no repeats. Each new character extends it, and a repeat moves its start forward:

```js
function longestUniqueSubstring(text) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (lastSeen.has(char) && lastSeen.get(char) >= start) {
      start = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}
```

```python
def longest_unique_substring(text):
    last_seen = {}
    start = 0
    best = 0
    for i, char in enumerate(text):
        if char in last_seen and last_seen[char] >= start:
            start = last_seen[char] + 1
        last_seen[char] = i
        best = max(best, i - start + 1)
    return best
```

The check `lastSeen.get(char) >= start` is what makes `"abba"` work. When the final "a" arrives, its last position is 0, but the window already starts at 2, so that old "a" isn't inside it any more. Without the check, the start would jump backwards to 1 and the answer would be wrong.

Each character is visited once, so this runs in time proportional to the length of the string.
