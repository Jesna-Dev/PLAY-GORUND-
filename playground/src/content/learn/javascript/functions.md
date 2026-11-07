---
title: Functions
minutes: 11
summary: Package code into reusable functions that take inputs and return results.
---

A **function** is a named block of code you can run again and again. It can take inputs, called **parameters**, and give back a result with `return`:

```js
function area(width, height) {
  return width * height;
}

console.log(area(3, 4)); // 12
console.log(area(10, 2)); // 20
```

`area(3, 4)` **calls** the function. Inside it, `width` is 3 and `height` is 4.

## `return` ends the function

`return` sends a value back and stops the function. A function without `return` gives back `undefined`:

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

const result = greet("Lin"); // prints Hello, Lin!
console.log(result); // undefined
```

Printing and returning are different. A returned value can be stored, compared and passed on. Printed text only goes to the console.

## Arrow functions

Arrow functions are a shorter way to write small functions:

```js
const double = (n) => n * 2;
console.log(double(21)); // 42
```

When the body is a single expression without braces, its value is returned automatically.

<!-- exercise -->

Write a function `celsiusToFahrenheit(celsius)` that **returns** the temperature in Fahrenheit. The formula is celsius × 9 ÷ 5 + 32.

```js starter
function celsiusToFahrenheit(celsius) {

}

console.log(celsiusToFahrenheit(100)); // should print 212
```

```js solution
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

console.log(celsiusToFahrenheit(100));
```

```js tests
check("celsiusToFahrenheit(0) returns 32", () => equal(celsiusToFahrenheit(0), 32));
check("celsiusToFahrenheit(100) returns 212", () => equal(celsiusToFahrenheit(100), 212));
check("celsiusToFahrenheit(-40) returns -40", () => equal(celsiusToFahrenheit(-40), -40));
check("celsiusToFahrenheit(37) returns 98.6", () => Math.abs(celsiusToFahrenheit(37) - 98.6) < 0.001);
```

```text hints
Use return to send the result back. Printing it isn't enough.
In code, × is * and ÷ is /: celsius * 9 / 5 + 32
```

<!-- quiz -->

### What does a function return if it has no `return` statement?
- [ ] `0`
- [ ] `null`
- [x] `undefined`
> Without `return`, a function gives back `undefined`.

### In `function add(a, b) { return a + b; }`, what are `a` and `b`?
- [x] Parameters
- [ ] Return values
- [ ] Global variables
> Parameters are the names for the inputs a function receives when it's called.

### Which arrow function returns its input plus one?
- [x] `(n) => n + 1`
- [ ] `(n) => { n + 1 }`
- [ ] `(n) => return n + 1`
> With braces, you need an explicit `return`. Without braces, the expression's value is returned for you.
