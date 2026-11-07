---
title: Reverse a string
difficulty: beginner
minutes: 10
topics: strings, loops
js: reverseString(text)
python: reverse_string(text)
---

Write a function that takes a string and returns it with its characters in reverse order.

Spaces and punctuation are reversed too, like any other character.

<!-- tests -->

```json
[
  { "args": ["hello"], "expected": "olleh", "example": true },
  { "args": ["Codly"], "expected": "yldoC", "example": true },
  { "args": [""], "expected": "" },
  { "args": ["a"], "expected": "a" },
  { "args": ["racecar"], "expected": "racecar" },
  { "args": ["Hello, World!"], "expected": "!dlroW ,olleH" }
]
```

<!-- hints -->

- You can build the answer one character at a time, starting from the end of the string.
- In JavaScript, `[...text]` turns a string into an array of characters, and arrays have a `reverse()` method.
- In Python, a slice can walk backwards: try `text[::-1]`.

<!-- solution -->

The shortest solutions use built-in tools. In JavaScript, turn the string into an array of characters, reverse the array, and join it back into a string:

```js
function reverseString(text) {
  return [...text].reverse().join("");
}
```

In Python, a slice with a step of `-1` reads the string backwards:

```python
def reverse_string(text):
    return text[::-1]
```

Both take time proportional to the length of the string. Writing the loop yourself is good practice too: start with an empty string, and add each character from the last index down to 0.
