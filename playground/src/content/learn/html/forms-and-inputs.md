---
title: Forms and inputs
minutes: 14
summary: Collect information with forms, labels and the browser's built-in validation.
---

A **form** gathers input from the person using your page. Each field is an `<input>`, and each input needs a `<label>` that says what it's for:

```html
<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Sign up</button>
</form>
```

The label's `for` must match the input's `id`. That link lets people click the words to focus the field, and it lets screen readers announce the field's name.

## Pick the right type

The `type` attribute changes the keyboard on phones and the checks the browser runs:

- `text` for short free text
- `email` for email addresses
- `password` for hidden text
- `number` for quantities
- `checkbox` for yes or no choices

## Validation for free

The browser can stop a form from being sent until it's valid, with no JavaScript at all:

```html
<input type="text" required minlength="3" maxlength="20" />
<input type="number" min="1" max="10" />
```

`required` means the field can't be empty. `minlength` and `maxlength` limit text length, and `min` and `max` limit numbers.

Browser checks help people fix mistakes quickly, but anyone can bypass them. A real server must always check the data again.

## The `name` attribute

When a form is sent, each value is labeled with its input's `name`. An input without a `name` isn't sent at all.

<!-- exercise -->

Build a sign-up form with:

1. An email field with `id="email"`, `type="email"`, and `required`.
2. A password field with `id="password"`, `type="password"`, `required`, and `minlength="8"`.
3. A `<label>` connected to each field with `for`.
4. A submit button.

```html starter
<h1>Create your account</h1>

<form>
  <!-- Add your labels, inputs and button here -->
</form>
```

```html solution
<h1>Create your account</h1>

<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <label for="password">Password</label>
  <input id="password" name="password" type="password" required minlength="8" />

  <button type="submit">Sign up</button>
</form>
```

```js tests
check("The email field has type email", () => equal($("form #email")?.type, "email"));
check("The email field is required", () => equal($("#email")?.required, true));
check("The password field has type password", () => equal($("form #password")?.type, "password"));
check("The password field is required", () => equal($("#password")?.required, true));
check("The password needs at least 8 characters", () => equal($("#password")?.minLength, 8));
check("Each field has a connected label", () => $('label[for="email"]') !== null && $('label[for="password"]') !== null);
check("There is a submit button", () => $('form button:not([type="button"]), form input[type="submit"]') !== null);
```

```text hints
Connect them by making the label's for match the input's id, like for="email" and id="email".
minlength="8" goes on the password input, next to required.
```

<!-- quiz -->

### What connects a `<label>` to an `<input>`?
- [x] The label's `for` matches the input's `id`
- [ ] The label's `name` matches the input's `type`
- [ ] Placing them on the same line
> `for` and `id` create the link that makes the label clickable and readable by screen readers.

### Why must the server check data even when you use `required`?
- [ ] Browsers ignore `required`
- [x] People can bypass checks that run in the browser
- [ ] `required` only works on phones
> Browser checks are a convenience. Anyone can send data to a server without using your form.

### What happens to an input with no `name` when the form is sent?
- [ ] It's sent with the name "input"
- [ ] The form won't send
- [x] Its value isn't sent
> A form only sends fields that have a `name`.
