---
title: Functions and comprehensions
minutes: 15
summary: Write flexible functions, and build lists and dictionaries in a single readable line.
---

## Default and keyword arguments

A parameter can have a default value, and callers can name the arguments they pass:

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Ada"))                # Hello, Ada!
print(greet("Ada", greeting="Hi")) # Hi, Ada!
```

Avoid a list or dictionary as a default value. It's created once and shared by every call, so use `None` and create a new one inside the function.

## List comprehensions

A **comprehension** builds a list from a loop in one expression:

```python
numbers = [1, 2, 3, 4]

squares = [n * n for n in numbers]        # [1, 4, 9, 16]
evens = [n for n in numbers if n % 2 == 0] # [2, 4]
```

Read it as "give me this, for each item, if this is true". When a comprehension gets hard to read, go back to a normal loop.

## Dictionary comprehensions

The same idea works for dictionaries:

```python
prices = {"tea": 3, "cake": 5}
doubled = {item: price * 2 for item, price in prices.items()}
```

## Sorting with a key

`sorted` returns a new list. Its `key` is a function that picks what to compare, and `lambda` writes a small function in place:

```python
people = [("Ada", 36), ("Sam", 22)]

by_age = sorted(people, key=lambda person: person[1])
oldest_first = sorted(people, key=lambda person: person[1], reverse=True)
```

<!-- exercise -->

Write a function `passing_students(scores, minimum=50)`. `scores` is a dictionary of names to scores. Return a list of the names with a score of at least `minimum`, **in alphabetical order**. Try to use a comprehension.

```python starter
def passing_students(scores, minimum=50):
    # Return the sorted names of everyone who passed
    pass


print(passing_students({"Sam": 40, "Lin": 75, "Ada": 90}))
```

```python solution
def passing_students(scores, minimum=50):
    return sorted(name for name, score in scores.items() if score >= minimum)


print(passing_students({"Sam": 40, "Lin": 75, "Ada": 90}))
```

```python tests
sample = {"Sam": 40, "Lin": 75, "Ada": 90}
check("Uses a minimum of 50 by default", lambda: equal(passing_students(sample), ["Ada", "Lin"]))
check("Accepts a different minimum", lambda: equal(passing_students(sample, 80), ["Ada"]))
check("Accepts the minimum by name", lambda: equal(passing_students(sample, minimum=30), ["Ada", "Lin", "Sam"]))
check("A score equal to the minimum counts", lambda: equal(passing_students({"Bo": 50}), ["Bo"]))
check("An empty dictionary gives an empty list", lambda: equal(passing_students({}), []))
```

```text hints
scores.items() gives you each name and score together.
sorted() can wrap the whole comprehension: sorted(name for name, score in ...).
```

<!-- quiz -->

### What does `[n * 2 for n in [1, 2, 3] if n > 1]` give?
- [x] `[4, 6]`
- [ ] `[2, 4, 6]`
- [ ] `[2, 3]`
> The `if` keeps 2 and 3, and each is then doubled.

### What does `sorted(items)` do to `items`?
- [x] Nothing, it returns a new list
- [ ] Sorts it in place and returns nothing
- [ ] Deletes it
> `sorted` makes a new list. The list method `items.sort()` is the one that changes the original.

### Why is `def add(item, items=[]):` a problem?
- [ ] Parameters can't have defaults
- [x] The same list is shared between every call
- [ ] Lists can't be passed to functions
> Default values are created once, so changes to the list carry over to later calls.
