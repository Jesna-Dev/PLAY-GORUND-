---
title: Palindrome sentences
difficulty: intermediate
minutes: 12
topics: strings, two pointers
js: isPalindrome(text)
python: is_palindrome(text)
---

A palindrome reads the same forwards and backwards. Write a function that checks whether a sentence is a palindrome, **ignoring case and every character that isn't a letter or a digit**.

So "A man, a plan, a canal: Panama" counts, because its letters read "amanaplanacanalpanama" both ways. An empty string counts as a palindrome.

<!-- tests -->

```json
[
  { "args": ["A man, a plan, a canal: Panama"], "expected": true, "example": true },
  { "args": ["race a car"], "expected": false, "example": true },
  { "args": [""], "expected": true },
  { "args": ["No 'x' in Nixon"], "expected": true },
  { "args": ["12321"], "expected": true },
  { "args": ["ab"], "expected": false },
  { "args": ["Was it a car or a cat I saw?"], "expected": true }
]
```

<!-- hints -->

- First build a cleaned-up version of the text: lowercase, letters and digits only.
- Then compare the cleaned text with its reverse.
- In JavaScript, `text.replace(/[^a-z0-9]/g, "")` removes everything except lowercase letters and digits.

<!-- solution -->

Clean the text, then compare it with its reverse:

```js
function isPalindrome(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === [...clean].reverse().join("");
}
```

```python
def is_palindrome(text):
    clean = "".join(char for char in text.lower() if char.isalnum())
    return clean == clean[::-1]
```

**Going further:** this makes a cleaned copy of the text. A two-pointer version avoids that. Start one pointer at each end, skip characters that aren't letters or digits, compare, and move both pointers inward. It does the same work using no extra memory.
