---
title: Classes and objects
minutes: 18
summary: Bundle data and behavior together with classes, and raise errors when something goes wrong.
---

A **class** is a blueprint. An **object** is one thing built from it, with its own data and the behavior the class describes:

```python
class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = []

    def learn(self, trick):
        self.tricks.append(trick)


rex = Dog("Rex")
rex.learn("sit")
print(rex.name, rex.tricks)  # Rex ['sit']
```

`__init__` runs when an object is created. `self` is the object itself, and Python passes it in for you, so `rex.learn("sit")` calls `learn` with `self` set to `rex`.

Values stored on `self` are called **attributes**. Functions in a class are called **methods**.

## Raising errors

When a method is asked to do something impossible, raise an exception rather than carrying on with bad data:

```python
def set_age(self, age):
    if age < 0:
        raise ValueError("Age can't be negative")
    self.age = age
```

The code that calls it can handle the error with `try` and `except`:

```python
try:
    rex.set_age(-1)
except ValueError as error:
    print(error)
```

## Printing objects nicely

`__str__` decides what `print` and `str()` show:

```python
def __str__(self):
    return f"{self.name} knows {len(self.tricks)} tricks"
```

## Inheritance

A class can build on another one and replace or add methods:

```python
class Puppy(Dog):
    def learn(self, trick):
        print("Maybe later!")
```

<!-- exercise -->

Write a class `BankAccount`:

1. `BankAccount(owner, balance=0)` stores `owner` and `balance`.
2. `deposit(amount)` adds to the balance.
3. `withdraw(amount)` subtracts from the balance. If `amount` is more than the balance, raise a `ValueError` and leave the balance unchanged.
4. `str(account)` returns text like `Ada: 25`.

```python starter
class BankAccount:
    def __init__(self, owner, balance=0):
        pass

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass


account = BankAccount("Ada", 10)
account.deposit(15)
print(account)
```

```python solution
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Not enough money")
        self.balance -= amount

    def __str__(self):
        return f"{self.owner}: {self.balance}"


account = BankAccount("Ada", 10)
account.deposit(15)
print(account)
```

```python tests
def deposited():
    account = BankAccount("Ada", 10)
    account.deposit(5)
    equal(account.balance, 15)


def withdrawn():
    account = BankAccount("Ada", 10)
    account.withdraw(4)
    equal(account.balance, 6)


def everything():
    account = BankAccount("Ada", 10)
    account.withdraw(10)
    equal(account.balance, 0)


def overdrawn():
    account = BankAccount("Ada", 10)
    try:
        account.withdraw(50)
    except ValueError:
        equal(account.balance, 10)
        return
    raise AssertionError("Expected a ValueError.")


check("The owner is stored", lambda: equal(BankAccount("Ada").owner, "Ada"))
check("The balance starts at 0 by default", lambda: equal(BankAccount("Ada").balance, 0))
check("deposit adds to the balance", deposited)
check("withdraw subtracts from the balance", withdrawn)
check("You can withdraw everything", everything)
check("Overdrawing raises ValueError and keeps the balance", overdrawn)
check('str() returns text like "Ada: 25"', lambda: equal(str(BankAccount("Ada", 25)), "Ada: 25"))
```

```text hints
Every method takes self first, and the data lives on self, like self.balance.
Withdrawing exactly the whole balance is allowed, so only raise when amount > self.balance.
```

<!-- quiz -->

### What is `self`?
- [x] The object the method was called on
- [ ] The class's name
- [ ] A reserved word for the first variable
> When you call `rex.learn("sit")`, Python passes `rex` in as `self`.

### When does `__init__` run?
- [ ] When the class is defined
- [x] Each time a new object is created
- [ ] When the program ends
> `Dog("Rex")` creates an object and runs `__init__` to set it up.

### Why raise an error instead of ignoring a bad withdrawal?
- [ ] Errors make programs faster
- [x] The caller finds out right away that it didn't work
- [ ] Python requires it
> Failing loudly stops bad data from spreading and gives the caller a chance to respond.
