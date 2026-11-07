---
title: Forms people can finish
minutes: 11
summary: Label every field, ask only for what you need, and help people recover from mistakes.
---

Forms are where people sign up, pay and get things done. A confusing form loses them at the last step.

## Every field needs a visible label

A placeholder isn't a label. It disappears when people start typing, so they forget what the field was for, and placeholders are often too faint to read. Connect a `<label>` to its field with matching `for` and `id`:

```html
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email">
```

Now clicking the label focuses the field, and screen readers announce the label when the field is focused.

## Use the right input type

`type="email"`, `type="tel"` and `type="number"` bring up the right keyboard on phones. `autocomplete` lets browsers fill in details people have typed before.

## Ask for less

Every extra field is a reason to give up. Ask only for what you need now. Mark the few optional fields, rather than putting an asterisk on every required one.

## Helpful errors

When something's wrong, say what and how to fix it, next to the field:

- Unhelpful: "Invalid input"
- Helpful: "Enter a date like 31/12/2026"

Keep what people typed. Never clear the form because of one mistake.

## Clear buttons

Label buttons with what they do. "Create account" says more than "Submit".

<!-- exercise -->

This sign-up form relies on placeholders. Make it usable:

1. Give every input a `<label>`, connected with `for` and `id`.
2. Make the email input `type="email"`.
3. Change the button text from "Submit" to something that says what it does.

```css fixture
form {
  display: grid;
  gap: 6px;
  max-width: 280px;
  font-family: system-ui, sans-serif;
}

input {
  padding: 8px;
  margin-bottom: 10px;
}

button {
  padding: 10px;
}
```

```html starter
<form>
  <input placeholder="Full name">
  <input placeholder="Email">
  <input type="password" placeholder="Password">
  <button>Submit</button>
</form>
```

```html solution
<form>
  <label for="name">Full name</label>
  <input id="name" autocomplete="name">

  <label for="email">Email</label>
  <input id="email" type="email" autocomplete="email">

  <label for="password">Password</label>
  <input id="password" type="password" autocomplete="new-password">

  <button>Create account</button>
</form>
```

```js tests
check("There are still three inputs", () => equal($$("input").length, 3));
check("Every input has a connected label with text", () =>
  $$("input").every((input) => input.labels.length > 0 && input.labels[0].textContent.trim().length > 0));
check("The email input uses type=\"email\"", () => $$("input").some((input) => input.type === "email"));
check("The button says what it does", () => {
  const label = (text("button") ?? "").toLowerCase();
  return label.length > 0 && !["submit", "ok", "go", "send"].includes(label);
});
```

```text hints
Each input needs an id, and its label needs a matching for: <label for="name"> and <input id="name">.
Put each label just before its input.
```

<!-- quiz -->

### Why isn't a placeholder enough as a label?
- [ ] Placeholders don't work on phones
- [x] It disappears when people start typing, and is often too faint to read
- [ ] Placeholders can't contain capital letters
> People lose the hint as soon as they type, which is exactly when they need it.

### What connects a `<label>` to an `<input>`?
- [x] A `for` attribute that matches the input's `id`
- [ ] Putting the label after the input
- [ ] Giving both the same `class`
> Matching `for` and `id` links them, so clicking the label focuses the field.

### Which error message is most helpful?
- [ ] Invalid input
- [ ] Error 422
- [x] Enter a phone number with 10 digits
> A good error says what's wrong and how to fix it.
