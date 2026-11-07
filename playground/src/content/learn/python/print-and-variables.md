---
title: Printing and variables
minutes: 9
summary: Print output, and store values in variables.
---

`print` shows a value in the console:

```python
print("Hello, world!")
print(42)
```

## Variables

A variable stores a value under a name. Python doesn't need a keyword, just `=`:

```python
city = "Nairobi"
population = 4_397_073

print(city)
print(population)
```

Underscores in numbers are only there to make them easier to read. Python ignores them.

Variable names are lowercase words joined with underscores, like `first_name`. This style is called snake_case.

## Kinds of values

- `str`: text, in quotes: `"hello"`
- `int`: whole numbers: `7`
- `float`: decimals: `3.5`
- `bool`: `True` or `False`, with capital letters

## f-strings

Put an `f` before a string to fill in values with `{...}`:

```python
name = "Ada"
age = 36
print(f"{name} is {age} years old.")
```

This prints `Ada is 36 years old.`

> **Tip:** `print` can take several values separated by commas, and puts spaces between them: `print("Total:", 12)`.

<!-- exercise -->

1. Create a variable `name` set to `"Grace"`.
2. Create a variable `age` set to `85`.
3. Use an f-string to print exactly: **Grace is 85 years old.**

```python starter
# Create your variables here

# Then print the sentence
```

```python solution
name = "Grace"
age = 85
print(f"{name} is {age} years old.")
```

```text expected
Grace is 85 years old.
```

```python tests
check('name is "Grace"', lambda: equal(name, "Grace"))
check("age is 85", lambda: equal(age, 85))
```

```text hints
Put f right before the opening quote: f"..."
Variables go inside curly braces, like {name}.
```

<!-- quiz -->

### Which of these is a Python boolean?
- [ ] `true`
- [x] `True`
- [ ] `"True"`
> Python's booleans are `True` and `False`, with capital letters. `"True"` in quotes is a string.

### What does `print(f"{2 + 3} apples")` print?
- [ ] `{2 + 3} apples`
- [x] `5 apples`
- [ ] `2 + 3 apples`
> f-strings work out whatever is inside the braces.

### Which variable name follows Python's usual style?
- [x] `total_price`
- [ ] `TotalPrice`
- [ ] `total-price`
> Python uses snake_case for variables. Hyphens aren't allowed in names at all.
