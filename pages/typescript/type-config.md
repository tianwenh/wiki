## Type config

The goal is to, at type level, constrain the dependency between bits.

Suppose config type is as simple as:

```ts
type Config = {
  a: boolean;
  b: boolean;
};

// Or
function doThings(enableA: boolean, enableB: boolean);
```

Here `a`, `b` should be independent. This however is just one of the states.

### States

- `11` (means `a=true b=true`)
- `10`
- `01`
- `00`

### Combinations

- 4 states C(4,4):
  - `11 10 01 00`
- 1 states C(4,1):
  - `11` or `10` or `01` or `00`
- 2 states C(4,2):
  - `11 10` or `11 01` or `10 00` or `01 00`
  - `10 01` or `11 00`
- 3 states C(4,3):
  - `11 10 00` or `11 01 00`
  - `11 10 01` or `10 01 00`

**Each subset combination needs to be constrained different!**

### 1. `11 10 01 00`

Config both.

This is the most common case.

- `a`: independent
- `b`: independent

```ts
type Config = {
  a: boolean;
  b: boolean;
};
```

### 2. `11` or `10` or `01` or `00`

Config none.

No config is needed.

- `a`: fixed
- `b`: fixed

```ts
type Config = {
  a: true;
  b: false;
};
```

### 3. `11 10` or `11 01` or `10 00` or `01 00`

Config one.

- `a`: independent
- `b`: fixed

```ts
type Config = {
  a: true;
  b: boolean;
};
```

### 4. `10 01` or `11 00`

Config one.

- `a`: independent
- `b`: dependent on `a`
  - `a`
  - !`a`

```ts
type Config<T extends boolean> = {
  a: T;
  b: T; // Opposite<T>;
};

// Or just one param
type Config = {
  ab: boolean;
};
```

### 5. `11 10 00` or `11 01 00` or `11 10 01` or `10 01 00`

???

- `a`: independent
- `b`:
  - independent(`L`) if `a` is true(or false)(`Cond`)
  - dependent if `a` is false(or true)(`R`)

Or

- `b`: independent
- `a`:
  - independent(`L`) if `b` is false(`Cond`)
  - dependent if `b` is true(`R`)

```ts
type Box<A, B> = {
  a: A;
  b: B;
};
type Calc<T, Cond, L, R> = T extends Cond ? Box<T, L> : Box<T, R>;
type Config<A, Cond, L, R> = Calc<A, Cond, L, R>;
type Cfg = Config<boolean, true, boolean, true>; // `11 10 01`
```

## General form

```ts
type Box<A, B> = {
  a: A;
  b: B;
};
type Calc<T, Cond, L, R> = T extends Cond ? Box<T, L> : Box<T, R>;
type Config<A, Cond, L, R> = Calc<A, Cond, L, R>;
```

In human language:

If `Cond`, then `L`, else `R`.

In fact, all above states can be expressed this way.

**The more fixed params you have (Cond, L, R), the more obvious is the pattern.**

```ts
// 1. 11 10 01 00
type C11_10_01_00 = Config<boolean, never, never, boolean>;
// 2. `11` or `10` or `01` or `00`
type C11 = Config<true, never, never, true>;
type C10 = Config<true, never, never, false>;
type C01 = Config<false, never, never, true>;
type C00 = Config<false, never, never, false>;
// 3. `11 10` or `11 01` or `10 00` or `01 00`
type C11_10 = Config<true, never, never, boolean>;
type C11_01 = Config<boolean, never, never, true>;
type C10_00 = Config<boolean, never, never, false>;
type C01_00 = Config<false, never, never, boolean>;
// 4. `10 01` or `11 00`
type C10_01 = Config<boolean, true, false, true>;
type C11_00 = Config<boolean, true, true, false>;
// 5. `11 10 00` or `11 01 00` or `11 10 01` or `10 01 00`
type C11_10_00 = Config<boolean, true, boolean, false>;
// or type C11_10_00 = Config<boolean, false, false, boolean>;
type C11_01_00 = Config<boolean, false, boolean, true>;
type C11_10_01 = Config<boolean, true, boolean, true>;
type C10_01_00 = Config<boolean, true, false, boolean>;
```

## Another perspective

- `State`: structure
- `DependentState`: computation

```ts
type State<A, B> = {
  a: A;
  b: B;
};
// 1. 11 10 01 00
type C11_10_01_00 = State<boolean, boolean>;
// 2. `11` or `10` or `01` or `00`
type C11 = State<true, true>;
type C10 = State<true, false>;
type C01 = State<false, true>;
type C00 = State<false, false>;
// 3. `11 10` or `11 01` or `10 00` or `01 00`
type C11_10 = State<true, boolean>;
type C11_01 = State<boolean, true>;
type C10_00 = State<boolean, false>;
type C01_00 = State<false, boolean>;

type DependentState<L, R, A = boolean> = A extends true
  ? State<A, R>
  : State<A, L>;
// 4. `10 01` or `11 00`
type C10_01 = DependentState<true, false>;
type C11_00 = DependentState<false, true>;
// 5. `11 10 00` or `11 01 00` or `11 10 01` or `10 01 00`
type C11_10_00 = DependentState<false, boolean>;
type C11_01_00 = DependentState<boolean, true>;
type C11_10_01 = DependentState<true, boolean>;
type C10_01_00 = DependentState<boolean, false>;
```

## Conclusion

### Program breaks down by:

- static part:
  - type system
  - syntax
  - ...
- dynamic part:
  - code logic

Move towards static means:

- unit testing => type system checking
- documentation => wrting types
- ad-hoc behaviors => constrained possibility

#### Real story

A lot of times, people just always use `C11_10_01_00`, whereas in reality code logic suggests `C11_10_00` for instance.

To eliminate possibility other than `C11_10_00`, now you need to:

- write code logic to check
- write unit test to verify
- write document to tell readers

Ok, why don't we just define type `C11_10_00`? Yeah.. we can, but:

- `C11_10_00` is hard to write, especially in languages without ADT
- Better write test for `C11_10_00`
  - Yes... in unsound language, like TS
  - Fallback safe...
- Hard to extend/modify, if typing (with type computation) is really complicated
  - Struggling making code compile

### Type breaks down by:

- static part:
  - primitive types
- dynamic part:
  - polymorphisms
  - abstract data type (array etc)
  - dependent type

Move towards static means:

- generic type / constraints => hardcode primitive type
- easy to change/extend/think about...

We always wish to move towards a generic solution with typing, that's why fancy stuffs are introduced.

However, code might be type checked in a situation where nothing can now be added anymore, or it won't compile.
