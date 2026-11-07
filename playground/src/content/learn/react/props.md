---
title: Props
minutes: 10
summary: Pass data into components with props, so one component can show different content.
---

**Props** are the inputs to a component. You pass them like HTML attributes:

```jsx
<Profile name="Ada" role="Engineer" />
```

The component receives them as one object. Destructuring pulls out the values you need:

```jsx
function Profile({ name, role }) {
  return (
    <div className="profile">
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}
```

Now one component can show anyone.

## Props are read-only

A component should never change its own props. If something needs to change over time, that's **state**, which is the next lesson.

## Passing other kinds of values

Strings can go in quotes. Anything else, like numbers, arrays or functions, goes in curly braces:

```jsx
<Rating stars={4} tags={["cozy", "quiet"]} />
```

## Lists of components

Use `map` to turn an array of data into components. Give each one a unique `key` so React can keep track of it:

```jsx
const people = [
  { id: 1, name: "Ada", role: "Engineer" },
  { id: 2, name: "Grace", role: "Admiral" },
];

function Team() {
  return people.map((person) => (
    <Profile key={person.id} name={person.name} role={person.role} />
  ));
}
```

<!-- quiz -->

### How do you pass the number 3 as a prop called `count`?
- [ ] `count="3"`
- [x] `count={3}`
- [ ] `count=3`
> Quotes make a string. Use curly braces for numbers and other values.

### Can a component change its own props?
- [ ] Yes, props are ordinary variables
- [x] No, props are read-only. Values that change belong in state
> Props come from the parent. A component that changes them makes bugs that are hard to trace.

### Why does each item in a list need a `key`?
- [x] So React can tell items apart when the list changes
- [ ] To set the order of the list
- [ ] Keys are optional and do nothing
> Without stable keys, React can mix items up when they're added, removed or reordered.
