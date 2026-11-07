---
title: Lists and loops
minutes: 12
summary: Store sequences of values in lists, and repeat work with for loops.
---

A **list** holds values in order:

```python
scores = [72, 95, 88]

print(scores[0])    # 72
print(len(scores))  # 3
```

Indexes start at 0, and `scores[-1]` is the last item.

## Adding items

```python
todo = ["Buy milk"]
todo.append("Call Sam")
print(todo)  # ['Buy milk', 'Call Sam']
```

## `for` loops

A `for` loop runs its block once for each item:

```python
prices = [4, 10, 6]
total = 0

for price in prices:
    total = total + price

print(total)  # 20
```

## `range`

`range(n)` counts from 0 up to, but not including, `n`. `range(1, 4)` gives 1, 2 and 3:

```python
for number in range(1, 4):
    print(number * 10)
```

This prints 10, 20 and 30.

<!-- exercise -->

Write a function `squares(n)` that returns a list of the squares of the numbers from 1 to `n`. For example, `squares(4)` returns `[1, 4, 9, 16]`.

```python starter
def squares(n):
    result = []
    # Loop from 1 to n and append each square
    return result


print(squares(4))
```

```python solution
def squares(n):
    result = []
    for number in range(1, n + 1):
        result.append(number * number)
    return result


print(squares(4))
```

```python tests
check("squares(4) returns [1, 4, 9, 16]", lambda: equal(squares(4), [1, 4, 9, 16]))
check("squares(1) returns [1]", lambda: equal(squares(1), [1]))
check("squares(0) returns []", lambda: equal(squares(0), []))
check("squares(6) ends with 36", lambda: equal(squares(6)[-1], 36))
```

```text hints
range(1, n + 1) includes n. range(1, n) stops one short.
A number squared is number * number, or number ** 2.
```

<!-- quiz -->

### What does `range(3)` produce?
- [x] 0, 1, 2
- [ ] 1, 2, 3
- [ ] 0, 1, 2, 3
> `range(3)` starts at 0 and stops before 3.

### How do you add `"pear"` to the end of the list `fruit`?
- [ ] `fruit.push("pear")`
- [x] `fruit.append("pear")`
- [ ] `fruit + "pear"`
> Python lists use `append`. `push` is the JavaScript name.

### What is `[10, 20, 30][-1]`?
- [ ] 10
- [x] 30
- [ ] An error
> Negative indexes count from the end, so `-1` is the last item.
