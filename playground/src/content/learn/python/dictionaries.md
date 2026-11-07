---
title: Dictionaries
minutes: 12
summary: Look values up by name with dictionaries, and use them to count things.
---

A **dictionary** stores pairs of keys and values, so you can look things up by name:

```python
ages = {"Ada": 36, "Grace": 85}

print(ages["Grace"])  # 85
ages["Alan"] = 41     # add a new pair
print(len(ages))      # 3
```

Keys are usually strings. Looking up a key that doesn't exist raises a `KeyError`.

## Safe lookups

`get` returns a default instead of failing:

```python
print(ages.get("Linus", 0))  # 0
```

## Looping over a dictionary

`items()` gives you each key and value together:

```python
for name, age in ages.items():
    print(f"{name}: {age}")
```

## Counting with a dictionary

Dictionaries are perfect for counting. Use each thing as a key, and add 1 every time you see it:

```python
colors = ["red", "blue", "red"]
counts = {}

for color in colors:
    counts[color] = counts.get(color, 0) + 1

print(counts)  # {'red': 2, 'blue': 1}
```

<!-- exercise -->

Write a function `count_words(text)` that returns a dictionary of how many times each word appears. Use `text.lower().split()` to get the words, so capital letters don't matter.

For example, `count_words("the cat saw the dog")` returns `{"the": 2, "cat": 1, "saw": 1, "dog": 1}`.

```python starter
def count_words(text):
    counts = {}
    words = text.lower().split()
    # Count each word
    return counts


print(count_words("the cat saw the dog"))
```

```python solution
def count_words(text):
    counts = {}
    words = text.lower().split()
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts


print(count_words("the cat saw the dog"))
```

```python tests
check('"the" is counted twice', lambda: equal(count_words("the cat saw the dog").get("the"), 2))
check("Every word is counted", lambda: equal(count_words("the cat saw the dog"), {"the": 2, "cat": 1, "saw": 1, "dog": 1}))
check("Capital letters count as the same word", lambda: equal(count_words("Hi hi HI"), {"hi": 3}))
check("An empty string gives an empty dictionary", lambda: equal(count_words(""), {}))
```

```text hints
counts.get(word, 0) gives the current count, or 0 the first time you see a word.
Store the new count back: counts[word] = counts.get(word, 0) + 1
```

<!-- quiz -->

### What happens with `ages["Zoe"]` if "Zoe" isn't a key?
- [ ] It returns `None`
- [x] It raises a `KeyError`
- [ ] It returns `0`
> Square-bracket lookups fail on missing keys. `ages.get("Zoe")` returns `None` instead.

### What does `{"a": 1, "b": 2}.get("c", 5)` return?
- [ ] `None`
- [x] `5`
- [ ] An error
> `get` returns its second argument when the key is missing.

### Which loop gives you both keys and values?
- [ ] `for key in d:`
- [x] `for key, value in d.items():`
- [ ] `for value in d.values():`
> Looping over a dictionary directly gives only the keys. `items()` gives key and value pairs.
