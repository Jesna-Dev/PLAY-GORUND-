---
title: Making decisions
minutes: 10
summary: Use if, elif and else, and learn why indentation matters in Python.
---

`if` runs a block of code only when a condition is true:

```python
temperature = 30

if temperature > 25:
    print("Wear sunscreen.")
```

Note the colon at the end of the `if` line, and the indented block underneath. In Python, **indentation is part of the syntax**: it's how Python knows which lines belong to the `if`. Use four spaces.

## `elif` and `else`

```python
hour = 14

if hour < 12:
    print("Good morning")
elif hour < 18:
    print("Good afternoon")
else:
    print("Good evening")
```

Python checks the conditions from the top and runs the first block that matches.

## Comparisons and logic

- `==` equal, `!=` not equal, `<`, `>`, `<=`, `>=`
- `and`, `or`, `not` combine conditions

## Functions that decide

`def` defines a function, and `return` sends back a result. You'll use this pattern in the exercise:

```python
def describe(score):
    if score >= 50:
        return "pass"
    return "fail"


print(describe(72))  # pass
```

<!-- exercise -->

Write a function `letter_grade(score)` that returns:

- `"A"` for 90 and above
- `"B"` for 75 to 89
- `"C"` for anything below 75

```python starter
def letter_grade(score):
    # Return "A", "B" or "C"
    pass


print(letter_grade(95))
print(letter_grade(80))
print(letter_grade(60))
```

```python solution
def letter_grade(score):
    if score >= 90:
        return "A"
    elif score >= 75:
        return "B"
    else:
        return "C"


print(letter_grade(95))
print(letter_grade(80))
print(letter_grade(60))
```

```python tests
check('letter_grade(95) returns "A"', lambda: equal(letter_grade(95), "A"))
check('letter_grade(90) returns "A"', lambda: equal(letter_grade(90), "A"))
check('letter_grade(89) returns "B"', lambda: equal(letter_grade(89), "B"))
check('letter_grade(75) returns "B"', lambda: equal(letter_grade(75), "B"))
check('letter_grade(74) returns "C"', lambda: equal(letter_grade(74), "C"))
```

```text hints
Check the highest grade first: if score >= 90:
Every if, elif and else line ends with a colon, and the lines under it are indented.
```

<!-- quiz -->

### What tells Python which lines belong to an `if`?
- [ ] Curly braces
- [x] Indentation
- [ ] Semicolons
> Python groups lines into blocks by their indentation.

### What's Python's spelling of "else if"?
- [ ] `else if`
- [ ] `elseif`
- [x] `elif`
> Python shortens it to `elif`.

### What does `5 == 5.0` evaluate to?
- [x] `True`
- [ ] `False`
> `==` compares values, and 5 and 5.0 are the same number.
