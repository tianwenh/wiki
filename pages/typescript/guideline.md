## Guideline

My guideline for writing TS types.

## Essential building blocks

These are features of TS you should know:

### Primitive types

- boolean
- number / bigint
- string
- unique symbol
- void / undefined
- null
- unknown
- never
- any

### "Structural" types

Structural type is not a formal term. It means type from composition of multiple types.

- product
  - array / tuple `T[]` / `[T]`
    - [variadic-tuple-types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
  - object `{x: 1}`
- union `T | U`
- intersection `T & U`
- function `(x: T) => U`

### Type Operations

- index `keyof T`: object to union
- lookup `T[K]`: tuple to union
- mapped `{[Key in K]: X}`: map object / array
- conditional `T extends U ? X : Y`: if else
  - [inference](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types) `infer`
    - naked type / [distributive](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
    - boxed type `[T] extends [never]`
    - covariance vs contravariance

### Subtype

Conditional type (if else, type constraints, pattern matching) heavily depends on subtype.

```ts
type IsSubtype<T, U> = T extends U ? true : false;
```

Mental model:

```ts
declare const t: T;
// U has wider range of possibility, includes T as one possibility.
const u: U = t; // ok

declare const u: U;
const t: T = u; // error
```

Common subtypes:

```ts
IsSubtype<bigint, number> // false
IsSubtype<void, undefined> // false
IsSubtype<undefined, void> // true
IsSubtype<string, any> // true, string is everything union
IsSubtype<any, string> // boolean, distributive
IsSubtype<unknown, string> // false
IsSubtype<string, unknown> // true!! top type, everything is assignable to unknown by design
IsSubtype<string, never> // false
IsSubtype<never, string> // never!! distribute nothing, thus never
IsSubtype<1, 1|2> // true
IsSubtype<1|2, 1> // boolean, distributive
IsSubtype<[1], [1|2]> // true
IsSubtype<[1|2], [1]> // false
IsSubtype<[1, 2], [1]> // false
IsSubtype<[1], [1, 2]> // false
IsSubtype<{a: 1}, {}> // true
IsSubtype<{}, {a: 1}> // false
IsSubtype<{a: number}, {a: 1}> // false
IsSubtype<{a: 1}, {a: number}> // true
IsSubtype<((x: number) => 1), (x: 1) => number> // true, covariance and contravariance
IsSubtype<((x: 1) => 2)&((x: '1') => '2'), (x: never) => '2'|2> // true
```

## Type conversions

Possibly the most practical part.

Writing TS type is about converting between type ([primitive](#primitive-types) or [composed](#structural-types)) with [type operations](#type-operations).

Check out [[type-challenges]] for applications.

### string | number | bigint | boolean | null | undefined to string

```ts
type Allowed = string | number | bigint | boolean | null | undefined;
type NumberToString<T extends Allowed> = `${T}`;
type StringOnly<T> = T extends Allowed ? `${T}` : never;
```

- template literal types
- conditional

### object to union

```ts
type ObjectToUnion<T> = keyof T;
```

- index

### tuple to union

```ts
type TupleToUnion<T extends unknown[]> = T[number];
```

- generic constraints
- lookup

### tuple to object

```ts
type TupleToObject<T extends readonly PropertyKey[]> = {
  [K in T[number]]: unknown;
}
```

- generic constraints
- mapped
- lookup

### union to intersection

```ts
type Dist<T> = T extends T ? (x: T) => void : never;
type Contra<T> = T extends (x: infer X) => unknown ? X : never;
type UnionToIntersection<U> = Contra<Dist<U>>;
// X|Y
// Dist<X|Y> = (x: X) => void | (x: Y) => void;
// UnionToIntersection<X|Y> = X&Y
```

- conditional
  - distributive: `Dist`
  - contravariance: `Contra`

### union to tuple

```ts
type LastInUnion<U> = Contra<UnionToIntersection<Dist<U>>>;
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];
```

- funciton overload `LastInUnion`
- is never

### object to tuple

```ts
type ObjectToTuple<T> = UnionToTuple<ObjectToUnion<T>>;
```

### object to intersection

```ts
type ObjectToIntersection<T> = UnionToIntersection<ObjectToUnion<T>>;
```

### union to object

```ts
type UnionToObject<T> = TupleToObject<UnionToTuple<T>>;
```

### tuple to intersection

```ts
type TupleToIntersection<T> = UnionToIntersection<TupleToUnion<T>>;
```

## Miscs

- Recursion
  - depth 49
  - tail call depth 999
- https://github.com/microsoft/TypeScript/issues/14833
- https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
- https://github.com/sandersn/mini-typescript
- https://basarat.gitbook.io/typescript/overview
- https://github.com/microsoft/TypeScript-Compiler-Notes