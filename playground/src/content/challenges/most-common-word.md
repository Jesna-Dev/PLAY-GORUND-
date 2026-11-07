---
title: Most common word
difficulty: intermediate
minutes: 15
topics: strings, maps
js: mostCommonWord(text)
python: most_common_word(text)
---

Return the word that appears most often in a piece of text.

- A word is a run of the letters a to z. Everything else, like spaces, punctuation and apostrophes, separates words.
- Ignore case, and return the word in lowercase.
- If two words are tied, return the one that appears **first** in the text.

The text always contains at least one word.

<!-- tests -->

```json
[
  { "args": ["the cat and the hat"], "expected": "the", "example": true },
  { "args": ["Apple apple BANANA banana banana"], "expected": "banana", "example": true },
  { "args": ["one two"], "expected": "one" },
  { "args": ["Hi! Hi? hi."], "expected": "hi" },
  { "args": ["b a a b"], "expected": "b" },
  { "args": ["It's sunny, it's warm"], "expected": "it" }
]
```

<!-- hints -->

- Split the lowercased text into words with a regular expression: `/[a-z]+/g` in JavaScript, `re.findall(r"[a-z]+", ...)` in Python.
- Count each word with a `Map` or a dictionary.
- Both keep keys in the order they were first added. Walk through them and only replace the best word when a count is strictly bigger, so ties keep the earlier word.

<!-- solution -->

Count every word, then pick the highest count, keeping the earliest word on ties:

```js
function mostCommonWord(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const counts = new Map();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  let best = "";
  for (const [word, count] of counts) {
    if (count > (counts.get(best) ?? 0)) {
      best = word;
    }
  }
  return best;
}
```

```python
import re


def most_common_word(text):
    words = re.findall(r"[a-z]+", text.lower())
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    best = ""
    for word, count in counts.items():
        if count > counts.get(best, 0):
            best = word
    return best
```

The tie rule works because a `Map` in JavaScript and a `dict` in Python both remember insertion order, which is the order words first appear. Using `>` rather than `>=` means a later word has to beat the current best, not just match it.

In `"It's sunny, it's warm"`, the apostrophe splits "it's" into "it" and "s". Both appear twice, and "it" comes first.
