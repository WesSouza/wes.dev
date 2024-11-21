---
title: "'B' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint 'A'."
slug: b-is-assignable-to-the-constraint-of-type-t-but-t-could-be-instantiated-with-a-different-subtype-of-constraint-a
description: 'This error has plagued me for years now. And thanks to Inigo I finally understood the...'
date: '2023-01-15T21:23:12.893Z'
tags: ['typescript', 'generics', 'javascript']
published: true
wes95_file: '/C/My Documents/Blog/B is assignable to the constraint of type T.doc'
---

# 'B' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint 'A'.

This error has plagued me for years now. And [thanks to Inigo I finally understood the problem](https://stackoverflow.com/a/70392066/572647).

TL;DR: When you use `T extends A` in a generic declaration, you require `T` to be _at least_ `A`, but it can have more properties (by being a different subtype).

The problem arises when you want to _create_ an object that conforms to `T` thinking it can just conform to `A`. You can't, because `T` can require additional or more specific properties than `A`.

This happens a lot when we create [React Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) that handle generic objects and arrays.

One solution is to pass a callback function to the generic that knows how to translate something like `A` to `T`, given what your generic function expects to handle.

# The Code

Suppose we are creating a hook to abstract filtering options for a [combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), having a disabled "No results found" option if there is no result for the search:

```ts
type SelectOption = {
  name: string;
  value: string | null;
  icon?: string;
  description?: string;
  disabled?: boolean;
};

function useComboboxFilter<T extends SelectOption>(props: {
  options: T[];
  filterValue: string;
}): { filteredOptions: T[] } {
  let filteredOptions = props.filterValue
    ? props.options.filter((option) => option.name.includes(props.filterValue))
    : props.options;

  if (props.filterValue && !filteredOptions.length) {
    filteredOptions = [
      { name: 'No results found', value: null, disabled: true },
    ];
  }

  return { filteredOptions };
}
```

{% details Note for React devs %}
Because this is an example, I didn't properly optimize the code. A proper React Hook should wrap `filteredOptions` and the return object in a `useMemo`:

```ts
function useComboboxFilter<T extends SelectOption>(props: {
  options: T[];
  filterValue: string;
}): { filteredOptions: T[] } {
  const filteredOptions = useMemo(() => {
    let filteredOptions = props.filterValue
      ? props.options.filter((option) =>
          option.name.includes(props.filterValue),
        )
      : props.options;

    if (props.filterValue && !filteredOptions.length) {
      filteredOptions = [
        { name: 'No results found', value: null, disabled: true },
      ];
    }

    return filteredOptions;
  }, [props.filterValue, props.options]);

  return useMemo(() => ({ filteredOptions }), [filteredOptions]);
}
```

{% enddetails %}

# The Problem

If you [check this code with the TypeScript compiler](https://www.typescriptlang.org/play?#code/C4TwDgpgBAyhA2EDGwDyZgEsD2A7KAvFAN4BQUUuAhgLYQBcUAzsAE6a4DmA3OVAG5V4AVwbM2HTlAA+lYfHi8KAE0xMqAI0TLGG7NkRVcvAL69SAM2G4UOfMKYQAwthp69ADwBimeMAisADwAKlAQHv64ykywCMhoGHYAfAAUYKzYYEyMZBSZWHjZUMEA2gC6SlAWvv6sAGpCoows7FymAJQ5VTUBEMroBbhFpWVQJiR8iMDdfr39iYWEUOmZTAB01bP1jRB8FAD8yxlZa-l265u1KSlneO2ESVC3uGvUdGscSCLKEExpxxcetsRBB2u09lBGCsTs8mOYKJgLFB-qsNkCGiCoAAyLFQACElzmA3Oa0QXGAAAt7rkKDNan1iYsiCUIRRiJRaGIAEQAOWwUFYv3kwBiFmw1mUXIANAIdoxcPJ4DLVOotH1GGxRGMpRCKnwTKQ+ILgMJWPh2YTBfNBjEzKQTEA), you will get this error:

```
Type '{ name: string; value: null; disabled: true; }'
is not assignable to type 'T'.
  '{ name: string; value: null; disabled: true; }' is
  assignable to the constraint of type 'T', but 'T' could
  be instantiated with a different subtype of constraint
  'SelectOption'. ts(2322)
```

This is a cryptic error message: it properly describes the problem without helping the reader understand how this happened or what they actually did wrong.

The problem here is quite simple: `{ name: string; value: null; disabled: true; }` satisfies `SelectOption`, but because `T` could be a different subtype of `SelectOption`, that is, a type with slightly different requirements, your generic function can't know what it is to **create a new version of it**.

A clear problem for our example is: imagine the generic type `T` we created requires an `id` property:

```
type SelectOptionWithId = {
  id: string;
} & SelectOption;

const myFilter = useComboboxFilter<SelectOptionWithId>({
  options: [],
  filterValue: "bla",
});
```

The result `myFilter` in this case will have an object _without `id`_, because the generic hook doesn't know it needs to add that property.

Because the generic code doesn't know `T`, you can only create a new version of `SelectOption`. To fix this, you need a way to transform a `SelectOption` object into `T`, which only your non-generic code can provide.

# One Solution

Because inside `useComboboxFilter` you only know about `SelectOption`, and you only care about the `name`, `value` and `disabled` properties of it, you can create a required function parameter that translate a partial `SelectOption` into any T:

```ts
function useComboboxFilter<T extends SelectOption>(props: {
  options: T[];
  createOption: (
    option: Pick<SelectOption, 'name' | 'value' | 'disabled'>,
  ) => T;
  filterValue: string;
}): { filteredOptions: T[] } {
  let filteredOptions = props.filterValue
    ? props.options.filter((option) => option.name.includes(props.filterValue))
    : props.options;

  if (props.filterValue && !filteredOptions.length) {
    filteredOptions = [
      props.createOption({
        name: 'No results found',
        value: null,
        disabled: true,
      }),
    ];
  }

  return { filteredOptions };
}
```

[The error is gone!](https://www.typescriptlang.org/play?#code/C4TwDgpgBAyhA2EDGwDyZgEsD2A7KAvFAN4BQUUuAhgLYQBcUAzsAE6a4DmA3OVAG5V4AVwbM2HTlAA+lYfHi8KAE0xMqAI0TLGG7NkRVcvAL69SAM2G4UOfMKYQAwthp69ADwBimeMAisADwAKlAQHv64ykywCMhoGHYAfAAUYKzYYEyMZBSZWHjZUMEA2gC6SlBIrBBU-ugFuIwpfHmJeIwACphIANaBcIgoDXYANFAARNR0EzKTgiIQs7ITqupaEMoTSXwAlIRJxZUWvv6sAGpCoows7FymuzlQJ34BmyOFjKVlUCYkfIhgM9Tm9lB9cDEiOlMkwAHQvM6XRatKAAfig0KysPydjhCICKRSOLw+wIh2JuFh0wgsI4SBEyggTDSGSx+IuVwgu12KMYmLhFKY5gomAsUBZMPhII5iygADI5VAAITs97tCGwxBcYAAC32uQowNeNTB6shUBKKIo-Nh1Vq9XVKQNhsN1MYEwActgoDUmPJgDELNhrFtRlbDQtrnIFGGXS61pptIw2KJY3GTLs0xQKnwTKQ+DVgMJWPhiEazmrGjEzKQ80A)

When you then use your generic `useComboboxFilter` with a subtype of `SelectOption`, you must make sure the generic function can create a new object that satisfies that type:

```ts
type SelectOptionWithId = {
  id: string;
} & SelectOption;

const createOption = (option: SelectOption): SelectOptionWithId => ({
  id: Math.random().toString(),
  ...option,
});

const myFilter = useComboboxFilter({
  options: [],
  createOption,
  filterValue: 'bla',
});
```

Note that with the `createOption` property, TypeScript infers `SelectOptionWithId` for `myFilter`.

---

If you want to learn more about generics and other neat TypeScript features, be sure to check @mattpocockuk's [YouTube videos](https://www.youtube.com/@mattpocockuk) and his [Total TypeScript online course](https://www.totaltypescript.com).
