---
title: Balanced brackets
difficulty: intermediate
minutes: 15
topics: stacks, strings
js: isBalanced(text)
python: is_balanced(text)
---

Check whether every bracket in a string is closed in the right order. There are three kinds: `()`, `[]` and `{}`. Ignore every other character.

A string is balanced when each opening bracket is closed by the same kind of bracket, and inner pairs close before outer ones. An empty string is balanced.

<!-- tests -->

```json
[
  { "args": ["([]{})"], "expected": true, "example": true },
  { "args": ["([)]"], "expected": false, "example": true },
  { "args": ["((("], "expected": false },
  { "args": [""], "expected": true },
  { "args": ["a(b[c]d)e"], "expected": true },
  { "args": ["}{"], "expected": false },
  { "args": ["{[()()]}"], "expected": true },
  { "args": ["(]"], "expected": false }
]
```

<!-- hints -->

- The most recent opening bracket must be the first one to close. Which data structure gives you the most recent item first?
- Use a list as a stack: push opening brackets, and pop when you see a closing one.
- A closing bracket is wrong if the stack is empty or the popped bracket doesn't match. At the end, the stack must be empty.

<!-- solution -->

A **stack** is the natural fit: the last bracket opened must be the first one closed.

```js
function isBalanced(text) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const char of text) {
    if ("([{".includes(char)) {
      stack.push(char);
    } else if (char in pairs) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}
```

```python
def is_balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for char in text:
        if char in "([{":
            stack.append(char)
        elif char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
    return not stack
```

Two cases are easy to miss. `"((("` never fails during the loop, so you must check that the stack is empty at the end. `"}{"` closes before anything opens, so popping from an empty stack must count as a failure.

This takes one pass through the string, so it's fast even for long input.
