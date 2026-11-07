---
title: Count the vowels
difficulty: beginner
minutes: 10
topics: strings, loops
js: countVowels(text)
python: count_vowels(text)
---

Write a function that returns how many vowels a string contains. The vowels are **a, e, i, o and u**, in lowercase or uppercase. The letter y doesn't count.

<!-- tests -->

```json
[
  { "args": ["hello"], "expected": 2, "example": true },
  { "args": ["AEIOU"], "expected": 5, "example": true },
  { "args": ["rhythm"], "expected": 0 },
  { "args": [""], "expected": 0 },
  { "args": ["Programming is fun"], "expected": 5 },
  { "args": ["Why? Because!"], "expected": 4 }
]
```

<!-- hints -->

- Loop over the characters and keep a running count.
- Convert the text to lowercase first, so you only need to check five letters.
- `"aeiou".includes(char)` in JavaScript, or `char in "aeiou"` in Python, checks whether a character is a vowel.

<!-- solution -->

Lowercase the text once, then count the characters that appear in `"aeiou"`:

```js
function countVowels(text) {
  let count = 0;
  for (const char of text.toLowerCase()) {
    if ("aeiou".includes(char)) {
      count += 1;
    }
  }
  return count;
}
```

Python can count in one line with `sum` and a generator expression:

```python
def count_vowels(text):
    return sum(1 for char in text.lower() if char in "aeiou")
```

Lowercasing first is the key step. Without it, `"AEIOU"` would count as 0.
