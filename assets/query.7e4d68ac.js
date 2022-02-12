var e=[{routepath:"README",content:`## HTWiki

Collection of random notes.
`},{routepath:"typescript/guideline",content:`## Guideline

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
  - array / tuple \`T[]\` / \`[T]\`
    - [variadic-tuple-types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
  - object \`{x: 1}\`
- union \`T | U\`
- intersection \`T & U\`
- function \`(x: T) => U\`

### Type Operations

- index \`keyof T\`: object to union
- lookup \`T[K]\`: tuple to union
- mapped \`{[Key in K]: X}\`: map object / array
- conditional \`T extends U ? X : Y\`: if else
  - [inference](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types) \`infer\`
    - naked type / [distributive](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
    - boxed type \`[T] extends [never]\`
    - covariance vs contravariance

### Subtype

Conditional type (if else, type constraints, pattern matching) heavily depends on subtype.

\`\`\`ts
type IsSubtype<T, U> = T extends U ? true : false;
\`\`\`

Mental model:

\`\`\`ts
declare const t: T;
// U has wider range of possibility, includes T as one possibility.
const u: U = t; // ok

declare const u: U;
const t: T = u; // error
\`\`\`

Common subtypes:

\`\`\`ts
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
\`\`\`

## Type conversions

Possibly the most practical part.

Writing TS type is about converting between type ([primitive](#primitive-types) or [composed](#structural-types)) with [type operations](#type-operations).

Check out [[type-challenges]] for applications.

### string | number | bigint | boolean | null | undefined to string

\`\`\`ts
type Allowed = string | number | bigint | boolean | null | undefined;
type NumberToString<T extends Allowed> = \`\${T}\`;
type StringOnly<T> = T extends Allowed ? \`\${T}\` : never;
\`\`\`

- template literal types
- conditional

### object to union

\`\`\`ts
type ObjectToUnion<T> = keyof T;
\`\`\`

- index

### tuple to union

\`\`\`ts
type TupleToUnion<T extends unknown[]> = T[number];
\`\`\`

- generic constraints
- lookup

### tuple to object

\`\`\`ts
type TupleToObject<T extends readonly PropertyKey[]> = {
  [K in T[number]]: unknown;
}
\`\`\`

- generic constraints
- mapped
- lookup

### union to intersection

\`\`\`ts
type Dist<T> = T extends T ? (x: T) => void : never;
type Contra<T> = T extends (x: infer X) => unknown ? X : never;
type UnionToIntersection<U> = Contra<Dist<U>>;
// X|Y
// Dist<X|Y> = (x: X) => void | (x: Y) => void;
// UnionToIntersection<X|Y> = X&Y
\`\`\`

- conditional
  - distributive: \`Dist\`
  - contravariance: \`Contra\`

### union to tuple

\`\`\`ts
type LastInUnion<U> = Contra<UnionToIntersection<Dist<U>>>;
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];
\`\`\`

- funciton overload \`LastInUnion\`
- is never

### object to tuple

\`\`\`ts
type ObjectToTuple<T> = UnionToTuple<ObjectToUnion<T>>;
\`\`\`

### object to intersection

\`\`\`ts
type ObjectToIntersection<T> = UnionToIntersection<ObjectToUnion<T>>;
\`\`\`

### union to object

\`\`\`ts
type UnionToObject<T> = TupleToObject<UnionToTuple<T>>;
\`\`\`

### tuple to intersection

\`\`\`ts
type TupleToIntersection<T> = UnionToIntersection<TupleToUnion<T>>;
\`\`\`

## Miscs

- Recursion
  - depth 49
  - tail call depth 999
- https://github.com/microsoft/TypeScript/issues/14833
- https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
- https://github.com/sandersn/mini-typescript
- https://basarat.gitbook.io/typescript/overview
- https://github.com/microsoft/TypeScript-Compiler-Notes`},{routepath:"typescript/type-challenges",content:`## Type challenges

My type challenges speed run.

## object

- Partial
- Required
- Readonly
- Record
- Pick
- Omit
- NonNullable
- class
  - ConstructorParameters
  - InstanceType
  - ThisParameterType
  - OmitThisParameter
  - ThisType

### [Pick](https://github.com/type-challenges/type-challenges/blob/master/questions/4-easy-pick/README.md)

\`\`\`ts
type MyPick<T, K extends keyof T> = {
  [Key in K]: T[Key];
}
\`\`\`

### [Readonly](https://github.com/type-challenges/type-challenges/blob/master/questions/7-easy-readonly/README.md)

\`\`\`ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
}
\`\`\`

### [Tuple to Object](https://github.com/type-challenges/type-challenges/blob/master/questions/11-easy-tuple-to-object/README.md)

\`\`\`ts
type TupleToUnion<T extends unknown[]> = T[number];
type TupleToObject<T extends readonly string[]> = {
  [K in TupleToUnion<T>]: K;
}
\`\`\`

### [Omit](https://github.com/type-challenges/type-challenges/blob/master/questions/3-medium-omit/README.md)

\`\`\`ts
type MyOmit<T, K> = {
  [Key in Exclude<keyof T, K>]: T[Key];
}
\`\`\`

### [Readonly 2](https://github.com/type-challenges/type-challenges/blob/master/questions/8-medium-readonly-2/README.md)

\`\`\`ts
type Merge<T> = {
  [K in keyof T]: T[K];
}
type MyReadonly2<T, K extends keyof T = keyof T>
  = Merge<Readonly<Pick<T, K>> & Omit<T, K>>;
\`\`\`

### [Deep Readonly](https://github.com/type-challenges/type-challenges/blob/master/questions/9-medium-deep-readonly/README.md)

\`\`\`ts
type DeepReadonly<T> = T extends string|number|boolean|Function ? T : {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
}
\`\`\`

### [Chainable Options](https://github.com/type-challenges/type-challenges/blob/master/questions/12-medium-chainable-options/README.md)

\`\`\`ts
type Merge<T> = {
  [K in keyof T]: T[K];
}
type Chainable<T = {}> = {
  option<K extends string, V>(key: K, value: V): Chainable<Merge<T & Record<K, V>>>;
  get(): T;
}
\`\`\`

### [Append to object](https://github.com/type-challenges/type-challenges/blob/master/questions/527-medium-append-to-object/README.md)

\`\`\`ts
type Merge<T> = {
  [K in keyof T]: T[K];
}
type AppendToObject<T, U extends string, V> = Merge<T & {[K in U]: V}>;
\`\`\`

### [Merge](https://github.com/type-challenges/type-challenges/blob/master/questions/599-medium-merge/README.md)

\`\`\`ts
type Merge<F, S> = {
  [K in keyof F | keyof S]: K extends keyof S
    ? S[K]
    : K extends keyof F ? F[K] : never;
};
\`\`\`

### [Diff](https://github.com/type-challenges/type-challenges/blob/master/questions/645-medium-diff/README.md)

\`\`\`ts
type Merge<T> = {
  [K in keyof T]: T[K];
}
type Diff<T, U> = Merge<Omit<T, keyof U> & Omit<U, keyof T>>;
\`\`\`

### [ReplaceKeys](https://github.com/type-challenges/type-challenges/blob/master/questions/1130-medium-replacekeys/README.md)

\`\`\`ts
type ReplaceKeys<U, T, Y> = {
  [K in keyof U]: K extends T
    ? (K extends keyof Y ? Y[K] : never)
    : U[K];
}
\`\`\`

### [Remove Index Signature](https://github.com/type-challenges/type-challenges/blob/master/questions/1367-medium-remove-index-signature/README.md)

\`\`\`ts
type LiteralOnly<T> = string extends T ? never : number extends T ? never : T;
type RemoveIndexSignature<T> = {
  [K in keyof T as LiteralOnly<K>]: T[K];
};
\`\`\`

### [PickByType](https://github.com/type-challenges/type-challenges/blob/master/questions/2595-medium-pickbytype/README.md)

\`\`\`ts
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
}
\`\`\`

### [PartialByKeys](https://github.com/type-challenges/type-challenges/blob/master/questions/2757-medium-partialbykeys/README.md)

\`\`\`ts
type Merge<T> = {
  [K in keyof T]: T[K];
}
type MyPick<T, K> = {
  [Key in keyof T as Key extends K ? Key : never]: T[Key];
}
type PartialByKeys<T, K extends string|number|symbol = keyof T>
  = Merge<Partial<MyPick<T, K>> & Omit<T, K>>;
\`\`\`

### [RequiredByKeys](https://github.com/type-challenges/type-challenges/blob/master/questions/2759-medium-requiredbykeys/README.md)

\`\`\`ts
type Merge<T> = {
  [K in keyof T]: T[K];
}
type MyPick<T, K> = {
  [Key in keyof T as Key extends K ? Key : never]: T[Key];
}
type RequiredByKeys<T, K extends string|number|symbol = keyof T>
  = Merge<Required<MyPick<T, K>> & Omit<T, K>>;
\`\`\`

### [Mutable](https://github.com/type-challenges/type-challenges/blob/master/questions/2793-medium-mutable/README.md)

\`\`\`ts
type Mutable<T> = T extends Readonly<infer R> ? R : T;
\`\`\`

\`\`\`ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
}
\`\`\`

### [OmitByType](https://github.com/type-challenges/type-challenges/blob/master/questions/2852-medium-omitbytype/README.md)

\`\`\`ts
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
}
\`\`\`

### [ObjectEntries](https://github.com/type-challenges/type-challenges/blob/master/questions/2946-medium-objectentries/README.md)

\`\`\`ts
type Dist<T, K extends keyof T = keyof T> = K extends K ? [K, T[K]] : never;
type ObjectEntries<T> = Dist<Required<T>>;
\`\`\`

how to invert object's key value?

\`\`\`ts
type Pairs<T, K extends keyof T = keyof T> = K extends K ? [K, T[K]] : never;
type ReversedObject<T extends Record<PropertyKey, PropertyKey>> = {
    [P in Pairs<T> as P[0]]: P[1];
}
\`\`\`

### [InorderTraversal](https://github.com/type-challenges/type-challenges/blob/master/questions/3376-medium-inordertraversal/README.md)

\`\`\`ts
type InorderTraversal<T> = T extends {val: infer V, left: infer TL, right: infer TR}
  ? [...InorderTraversal<TL>, V, ...InorderTraversal<TR>]
  : [];
\`\`\`

### [Flip](https://github.com/type-challenges/type-challenges/blob/master/questions/4179-medium-flip/README.md)

\`\`\`ts
type Flip<T extends Record<string, string|boolean|number>> = {
  [K in keyof T as \`\${T[K]}\`]: K;
}
\`\`\`

### [MapTypes](https://github.com/type-challenges/type-challenges/blob/master/questions/5821-medium-maptypes/README.md)

\`\`\`ts
type Dist<T, V> = T extends {mapFrom: V} ? T : never;
type MapTypes<T, R extends {mapFrom: unknown, mapTo: unknown}> = {
  [K in keyof T]: Dist<R, T[K]> extends never ? T[K] : Dist<R, T[K]>['mapTo']
}
\`\`\`

### [Simple Vue](https://github.com/type-challenges/type-challenges/blob/master/questions/6-hard-simple-vue/README.md)

\`\`\`ts
type MapReturnType<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => infer R ? R : never
}
declare function SimpleVue<D, C, M>(options: {
  data?(): D;
  computed: C & ThisType<D>;
  methods?: M & ThisType<D & M & MapReturnType<C>>;
}): unknown;
\`\`\`

??? this type https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype


### [Get Required](https://github.com/type-challenges/type-challenges/blob/master/questions/57-hard-get-required/README.md)

\`\`\`ts
type GetRequired<T> = {
  [K in keyof T as Pick<T, K> extends Required<Pick<T, K>> ? K : never]: T[K]
}
\`\`\`

### [Get Optional](https://github.com/type-challenges/type-challenges/blob/master/questions/59-hard-get-optional/README.md)

\`\`\`ts
type GetOptional<T> = {
  [K in keyof T as Pick<T, K> extends Required<Pick<T, K>> ? never : K]: T[K]
}
\`\`\`

### [Required Keys](https://github.com/type-challenges/type-challenges/blob/master/questions/89-hard-required-keys/README.md)

\`\`\`ts
type GetRequired<T> = {
  [K in keyof T as Pick<T, K> extends Required<Pick<T, K>> ? K : never]: T[K]
}
type RequiredKeys<T> = keyof GetRequired<T>;
\`\`\`

### [Optional Keys](https://github.com/type-challenges/type-challenges/blob/master/questions/90-hard-optional-keys/README.md)

\`\`\`ts
type GetOptional<T> = {
  [K in keyof T as Pick<T, K> extends Required<Pick<T, K>> ? never : K]: T[K]
}
type OptionalKeys<T> = keyof GetOptional<T>;
\`\`\`

### [Vue Basic Props](https://github.com/type-challenges/type-challenges/blob/master/questions/213-hard-vue-basic-props/README.md)

\`\`\`ts
type Constructor<T> = new (...args: any[]) => T;
type ConvertType<T> =
  T extends StringConstructor
    ? string :
    T extends BooleanConstructor
      ? boolean :
      T extends NumberConstructor
        ? number
        : T extends Constructor<unknown>
          ? InstanceType<T>
          : T;
type GetType<T> =
  T extends {type: infer P}
    ? P extends unknown[]
      ? ConvertType<P[number]>
      : ConvertType<P>
    : T extends Constructor<unknown>
      ? InstanceType<T>
      : T;
type MapProps<T> = {
  [K in keyof T]: GetType<T[K]>;
}
type MapReturnType<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => infer R ? R : never
}
declare function VueBasicProps<P, D, C, M>(options: {
  props: P;
  data(this: MapProps<P>): D;
  computed: C & ThisType<D&MapProps<P>>;
  methods: M & ThisType<MapProps<P> & D & MapReturnType<C> & M>;
}): unknown
\`\`\`

### [Deep object to unique](https://github.com/type-challenges/type-challenges/blob/master/questions/553-hard-deep-object-to-unique/README.md)

\`\`\`ts
declare const KEY: unique symbol;

type DeepObjectToUniq<O, Parent = O, Path extends readonly PropertyKey[] = []> = {
  [K in keyof O]: O[K] extends object
    ? DeepObjectToUniq<O[K], O, [...Path, K]>
    : O[K];
} & {
  readonly [KEY]?: readonly [Parent, Path];
};
\`\`\`

### [DeepPick](https://github.com/type-challenges/type-challenges/blob/master/questions/956-hard-deeppick/README.md)

\`\`\`ts
type Get<T, K> = K extends \`\${infer P}.\${infer Rest}\`
  ? P extends keyof T ? {[Key in P]: Get<T[P], Rest>} : never
  : K extends keyof T ? {[Key in K]: T[K]} : never;
type DeepPick<T, P> = UnionToIntersect<Get<T, P>>;
\`\`\`

### [Pinia](https://github.com/type-challenges/type-challenges/blob/master/questions/1290-hard-pinia/README.md)

\`\`\`ts
type MapReturnType<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => infer R ? R : never
}
declare function defineStore<S, G, A>(store: {
  id: string;
  state(): S;
  getters: G & ThisType<Readonly<S & MapReturnType<G>>>;
  actions: A & ThisType<S & Readonly<MapReturnType<G>> & A>;
}): Readonly<S & MapReturnType<G> & A>;
\`\`\`

### [ClassPublicKeys](https://github.com/type-challenges/type-challenges/blob/master/questions/2828-hard-classpublickeys/README.md)

\`\`\`ts
type ClassPublicKeys<T> = keyof T;
\`\`\`

### [IsRequiredKey](https://github.com/type-challenges/type-challenges/blob/master/questions/2857-hard-isrequiredkey/README.md)

\`\`\`ts
type GetRequired<T> = {
  [K in keyof T as Pick<T, K> extends Required<Pick<T, K>> ? K : never]: T[K]
}
type RequiredKeys<T> = keyof GetRequired<T>;
// Prevent union type dist
type IsRequiredKey<T, K extends keyof T> = [K] extends [RequiredKeys<T>] ? true : false;
\`\`\`

### [ObjectFromEntries](https://github.com/type-challenges/type-challenges/blob/master/questions/2949-hard-objectfromentries/README.md)

\`\`\`ts
type StringOnly<T> = T extends string ? T : never;
type GetN<T, N extends number = 0> = T extends unknown[] ? T[N] : never;
type ObjectFromEntries<T> = {
  [P in T as StringOnly<GetN<P>>]: GetN<P, 1>;
}
\`\`\`

\`\`\`ts
type ObjectFromEntries<T extends [string, unknown]> = {
  [K in T as K[0]]: K[1];
}
\`\`\`

similar to ObjectEntries

### [Mutable Keys](https://github.com/type-challenges/type-challenges/blob/master/questions/5181-hard-mutable-keys/README.md)

\`\`\`ts
type GetMutable<T> = {
  [K in keyof T as Equal<Readonly<Pick<T, K>>, Pick<T, K>> extends true ? never : K]: T[K];
}
type MutableKeys<T> = keyof GetMutable<T>;
\`\`\`

### [Get Readonly Keys](https://github.com/type-challenges/type-challenges/blob/master/questions/5-extreme-readonly-keys/README.md)

\`\`\`ts
type GetReadonly<T> = {
  [K in keyof T as Equal<Readonly<Pick<T, K>>, Pick<T, K>> extends true ? K : never]: T[K]
}
type GetReadonlyKeys<T> = keyof GetReadonly<T>;
\`\`\`

## array / tuple

### [First of Array](https://github.com/type-challenges/type-challenges/blob/master/questions/14-easy-first/README.md)

\`\`\`ts
type First<T extends unknown[]> = T extends [infer F, ...infer _] ? F : never;
\`\`\`

### [Length of Tuple](https://github.com/type-challenges/type-challenges/blob/master/questions/18-easy-tuple-length/README.md)

\`\`\`ts
type Length<T extends readonly unknown[]> = T['length'];
\`\`\`

### [Concat](https://github.com/type-challenges/type-challenges/blob/master/questions/533-easy-concat/README.md)

\`\`\`ts
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
\`\`\`

- thinking when object spread will be supported?

### [Includes](https://github.com/type-challenges/type-challenges/blob/master/questions/898-easy-includes/README.md)

\`\`\`ts
type Includes<T extends readonly unknown[], U> = T extends [infer F, ...infer Rest]
  ? Equal<F, U> extends true ? true : Includes<Rest, U>
  : false;
\`\`\`

### [Push](https://github.com/type-challenges/type-challenges/blob/master/questions/3057-easy-push/README.md)

\`\`\`ts
type Push<T extends unknown[], U> = [...T, U];
\`\`\`

### [Unshift](https://github.com/type-challenges/type-challenges/blob/master/questions/3060-easy-unshift/README.md)

\`\`\`ts
type Unshift<T extends unknown[], U> = [U, ...T];
\`\`\`

### [Tuple to Union](https://github.com/type-challenges/type-challenges/blob/master/questions/10-medium-tuple-to-union/README.md)

\`\`\`ts
type TupleToUnion<T extends unknown[]> = T[number];
\`\`\`

### [Last of Array](https://github.com/type-challenges/type-challenges/blob/master/questions/15-medium-last/README.md)

\`\`\`ts
type Last<T extends unknown[]> = T extends [...infer V, infer Last] ? Last : never;
\`\`\`

### [Pop](https://github.com/type-challenges/type-challenges/blob/master/questions/16-medium-pop/README.md)

\`\`\`ts
type Pop<T> = T extends [...infer Rest, infer _] ? Rest : [];
\`\`\`

### [Flatten](https://github.com/type-challenges/type-challenges/blob/master/questions/459-medium-flatten/README.md)

\`\`\`ts
type Flatten<T> = T extends []
  ? T
  : T extends [infer First, ...infer Rest] ? [...Flatten<First>, ...Flatten<Rest>] : [T];
\`\`\`

### [AnyOf](https://github.com/type-challenges/type-challenges/blob/master/questions/949-medium-anyof/README.md)

\`\`\`ts
type Truthy<T> = Equal<T, {}> extends true ? never : T extends 0|''|false|[] ? never : true;
type AnyOf<T extends readonly unknown[]> = T extends [infer First, ...infer Rest]
  ? true extends Truthy<First> ? true : AnyOf<Rest>
  : false;
\`\`\`

\`\`\`ts
type AnyOf<T extends readonly unknown[]> =
  T[number] extends 0 | '' | false | [] | Record<string, never> ? false : true;
\`\`\`

### [MinusOne](https://github.com/type-challenges/type-challenges/blob/master/questions/2257-medium-minusone/README.md)

\`\`\`ts
type TupleOfLength<T, Result extends unknown[] = []> =
  Result['length'] extends T ? Result : TupleOfLength<T, [...Result, 0]>;
type MinusOne<T extends number> =
  TupleOfLength<T> extends [infer First, ...infer Rest] ? Rest['length'] : never;
\`\`\`

### [Shift](https://github.com/type-challenges/type-challenges/blob/master/questions/3062-medium-shift/README.md)

\`\`\`ts
type Shift<T> = T extends [infer First, ...infer Rest] ? Rest : T;
\`\`\`

### [Tuple to Nested Object](https://github.com/type-challenges/type-challenges/blob/master/questions/3188-medium-tuple-to-nested-object/README.md)

\`\`\`ts
type TupleToNestedObject<T, U> = T extends [infer First, ...infer Rest]
  ? {[K in First as K extends string ? K : never]: TupleToNestedObject<Rest, U>}
  : U;
\`\`\`

### [Reverse](https://github.com/type-challenges/type-challenges/blob/master/questions/3192-medium-reverse/README.md)

\`\`\`ts
type Reverse<T> = T extends [infer First, ...infer Rest] ? [...Reverse<Rest>, First] : T;
\`\`\`

### [FlattenDepth](https://github.com/type-challenges/type-challenges/blob/master/questions/3243-medium-flattendepth/README.md)

\`\`\`ts
type FlattenDepth<T extends unknown[], N = 1, Acc extends unknown[] = []> =
  T extends [infer F, ...infer Rest]
    ? Acc['length'] extends N
      ? T
      : F extends unknown[]
        ? [...FlattenDepth<F, N, [...Acc, 0]>, ...FlattenDepth<Rest, N, Acc>]
        : [F, ...FlattenDepth<Rest, N, Acc>]
    : [];
\`\`\`

\`\`\`ts
type FlattenDepth<T, N = 1, Acc extends unknown[] = []> =
  T extends [infer F, ...infer Rest]
    ? Acc['length'] extends N
      ? T
      : [...FlattenDepth<F, N, [...Acc, 0]>, ...FlattenDepth<Rest, N, Acc>]
    : T;
\`\`\`

### [Fibonacci Sequence](https://github.com/type-challenges/type-challenges/blob/master/questions/4182-medium-fibonacci-sequence/README.md)

\`\`\`ts
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...
type Fibonacci<T extends number, Acc extends number[][] = [[], [0]]> = Acc extends [...infer Rest, infer F, infer S]
  ? Rest['length'] extends T
    ? F extends number [] ? F['length'] : never
    : F extends number[] ? S extends number[] ? Fibonacci<T, [...Acc, [...F, ...S]]> : never : never
  : never;
\`\`\`

### [Greater Than](https://github.com/type-challenges/type-challenges/blob/master/questions/4425-medium-greater-than/README.md)

\`\`\`ts
type TupleOfLength<T, Result extends unknown[] = []> =
  Result['length'] extends T ? Result : TupleOfLength<T, [...Result, 0]>;
type MinusOne<T extends number> =
  TupleOfLength<T> extends [infer First, ...infer Rest] ? Rest['length'] : never;
type GreaterThan<T extends number, U extends number> =
  T extends 0 ? false : U extends 0 ? true : GreaterThan<MinusOne<T>, MinusOne<U>>;
\`\`\`

### [Zip](https://github.com/type-challenges/type-challenges/blob/master/questions/4471-medium-zip/README.md)

\`\`\`ts
type Zip<T extends unknown[], U extends unknown[]> = T extends [infer TF, ...infer TRest]
  ? (U extends [infer UF, ...infer URest] ? [[TF, UF], ...Zip<TRest, URest>] : [])
  : [];
\`\`\`

\`\`\`ts
type Zip<T extends unknown[], U extends unknown[]> =
  [T, U] extends [[infer L, ...infer RestT], [infer R, ...infer RestU]]
    ? [[L, R], ...Zip<RestT, RestU>]
    : [];
\`\`\`

### [Chunk](https://github.com/type-challenges/type-challenges/blob/master/questions/4499-medium-chunk/README.md)

\`\`\`ts
type Chunk<T extends unknown[], L, Acc extends unknown[] = []> =  Acc['length'] extends L
  ? [Acc, ...Chunk<T, L, []>]
  : T extends [infer First, ...infer Rest]
    ? Chunk<Rest, L, [...Acc, First]>
    : Acc extends [] ? [] : [Acc];
\`\`\`

### [Fill](https://github.com/type-challenges/type-challenges/blob/master/questions/4518-medium-fill/README.md)

\`\`\`ts
type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T['length'],
  Result extends unknown[] = [],
  Flag = false
> = Flag extends true
  ? Result['length'] extends End
    ? [...Result, ...T]
    : T extends [infer F, ...infer Rest]
      ? Fill<Rest, N, Start, End, [...Result, N], true>
      : Result
  : Result['length'] extends Start
    ? Fill<T, N, Start, End, Result, true>
    : T extends [infer F, ...infer Rest]
      ? Fill<Rest, N, Start, End, [...Result, F], false>
      : Result;
\`\`\`

### [Without](https://github.com/type-challenges/type-challenges/blob/master/questions/5117-medium-without/README.md)

\`\`\`ts
type ToUnion<T> = T extends unknown[] ? T[number] : T;
type Without<T, U> = T extends [infer F, ...infer Rest]
  ? F extends ToUnion<U> ? Without<Rest, U> : [F, ...Without<Rest, U>]
  : T;
\`\`\`

### [IndexOf](https://github.com/type-challenges/type-challenges/blob/master/questions/5153-medium-indexof/README.md)

\`\`\`ts
type IndexOf<T, U> = T extends [...infer Rest, infer L]
  ? L extends U
    ? IndexOf<Rest, U> extends -1
      ? Rest['length']
      : IndexOf<Rest, U>
    : IndexOf<Rest, U>
  : -1;
\`\`\`

\`\`\`ts
type IndexOf<T, U, Acc extends unknown[] = []> = T extends [infer F, ...infer Rest]
  ? F extends U ? Acc['length'] : IndexOf<Rest, U, [...Acc, F]>
  : -1;
\`\`\`

### [LastIndexOf](https://github.com/type-challenges/type-challenges/blob/master/questions/5317-medium-lastindexof/README.md)

\`\`\`ts
type LastIndexOf<T, U> = T extends [...infer Rest, infer L]
    ? L extends U ? Rest['length'] : LastIndexOf<Rest, U>
    : -1;
\`\`\`

### [Unique](https://github.com/type-challenges/type-challenges/blob/master/questions/5360-medium-unique/README.md)

\`\`\`ts
type Unique<T, Seen = never> = T extends [infer F, ...infer Rest]
  ? F extends Seen ? Unique<Rest, Seen> : [F, ...Unique<Rest, Seen|F>]
  : [];
\`\`\`

### [Promise.all](https://github.com/type-challenges/type-challenges/blob/master/questions/20-medium-promise-all/README.md)

\`\`\`ts
type UnPromise<T> = T extends Promise<infer P> ? P : T;
type UnPromiseList<T> = T extends [infer F, ...infer Rest] ? [UnPromise<F>, ...UnPromiseList<Rest>] : [];
declare function PromiseAll<T extends unknown[]>(values: readonly [...T]): Promise<UnPromiseList<T>>;
\`\`\`

\`\`\`ts
type UnPromise<T> = {
  [K in keyof T]: T[K] extends Promise<infer V> ? V : T[K];
}
declare function PromiseAll<T extends unknown[]>(values: readonly [...T]): Promise<UnPromise<T>>;
\`\`\`

### [Tuple Filter](https://github.com/type-challenges/type-challenges/blob/master/questions/399-hard-tuple-filter/README.md)

\`\`\`ts
type FilterOut<T extends unknown[], F> = T extends [infer First, ...infer Rest]
  ? [First] extends [F] ? FilterOut<Rest, F> : [First, ...FilterOut<Rest, F>]
  : [];
\`\`\`

### [Tuple to Enum Object](https://github.com/type-challenges/type-challenges/blob/master/questions/472-hard-tuple-to-enum-object/README.md)

\`\`\`ts
type Cap<T> = T extends string ? Capitalize<T> : never;
type GetNPair<T, Acc extends unknown[] = []>
  = T extends readonly [infer F, ...infer Rest]
    ? [[Cap<F>, Acc['length']], ...GetNPair<Rest, [...Acc, unknown]>]
    : [];
type GetKPair<T>
  = T extends readonly [infer F, ...infer Rest]
    ? [[Cap<F>, F], ...GetKPair<Rest>]
    : [];
type GetPair<T, N> = N extends true ? GetNPair<T> : GetKPair<T>;

type StringOnly<T> = T extends string ? T : never;
type GetN<T, N extends number = 0> = T extends unknown[] ? T[N] : never;
type ObjectFromEntries<T> = {
  [P in T as StringOnly<GetN<P>>]: GetN<P, 1>;
}
type Enum<T extends readonly string[], N extends boolean = false>
  = Readonly<ObjectFromEntries<GetPair<T, N>[number]>>;
\`\`\`

### [Slice](https://github.com/type-challenges/type-challenges/blob/master/questions/216-extreme-slice/README.md)

similar to \`Fill\`

\`\`\`ts
type SlicePos<
  T extends unknown[],
  Start extends number = 0,
  End extends number = T['length'],
  Acc extends unknown[] = [],
  Flag = false
> = Flag extends true
  ? Acc['length'] extends End
    ? []
    : T extends [infer F, ...infer Rest]
      ? [F, ...SlicePos<Rest, Start, End, [...Acc, F], true>]
      : []
  : Acc['length'] extends Start
    ? SlicePos<T, Start, End, Acc, true>
    : T extends [infer F, ...infer Rest]
      ? SlicePos<Rest, Start, End, [...Acc, F], false>
      : [];

type Slice<
  T extends unknown[],
  Start extends number = 0,
  End extends number = T['length'],
> = SlicePos<T, MakePos<Start, T['length']>, MakePos<End, T['length']>>
\`\`\`

### [Integers Comparator](https://github.com/type-challenges/type-challenges/blob/master/questions/274-extreme-integers-comparator/README.md)

\`\`\`ts
enum Comparison {
  Greater,
  Equal,
  Lower,
}
type IsNeg<T extends number> = \`\${T}\` extends \`-\${infer _}\` ? true : false;
type Abs<T extends number> = \`\${T}\` extends \`-\${infer V}\` ? V : \`\${T}\`;
type Comp<A extends string, B extends string, Acc extends unknown[] = []> = A extends B
  ? Comparison.Equal
  : \`\${Acc['length']}\` extends A
    ? Comparison.Lower
    : \`\${Acc['length']}\` extends B
      ? Comparison.Greater
      : Comp<A, B, [...Acc, unknown]>;
type Comparator<A extends number, B extends number> = IsNeg<A> extends true
  ? IsNeg<B> extends true
    ? Comp<Abs<B>, Abs<A>>
    : Comparison.Lower
  : IsNeg<B> extends true
    ? Comparison.Greater
    : Comp<\`\${A}\`, \`\${B}\`>;
\`\`\`

## function

- Parameters
- ReturnType

### [Parameters](https://github.com/type-challenges/type-challenges/blob/master/questions/3312-easy-parameters/README.md)

\`\`\`ts
type MyParameters<T> = T extends (...args: infer Args) => unknown ? Args : never;
\`\`\`

### [Get Return Type](https://github.com/type-challenges/type-challenges/blob/master/questions/2-medium-return-type/README.md)

\`\`\`ts
type MyReturnType<T> = T extends (...args: infer Args) => infer R ? R : never;
\`\`\`

### [Append Argument](https://github.com/type-challenges/type-challenges/blob/master/questions/191-medium-append-argument/README.md)

\`\`\`ts
type AppendArgument<Fn, A> = Fn extends (...args: infer Args) => infer R
  ? (...args: [...Args, A]) => R
  : Fn;
\`\`\`

### [Flip Arguments](https://github.com/type-challenges/type-challenges/blob/master/questions/3196-medium-flip-arguments/README.md)

\`\`\`ts
type Reverse<T> = T extends [infer First, ...infer Rest] ? [...Reverse<Rest>, First] : T;
type FlipArguments<T> = T extends (...args: infer Args) => infer R ? (...args: Reverse<Args>) => R : T;
\`\`\`

\`\`\`ts
type FlipArguments<T extends (...args: any) => any> = (...args: Reverse<Parameters<T>>) => ReturnType<T>;
\`\`\`

### [Currying 1](https://github.com/type-challenges/type-challenges/blob/master/questions/17-hard-currying-1/README.md)

\`\`\`ts
type Curry<T> = T extends (...args: infer Args) => infer R
  ? Args extends [infer F, infer S, ...infer Rest]
    ? (x: F) => Curry<(...args: [S, ...Rest]) => R>
    : T
  : never;
declare function Currying<T>(fn: T): Curry<T>;
\`\`\`

### [Currying 2](https://github.com/type-challenges/type-challenges/blob/master/questions/462-extreme-currying-2/README.md)

\`\`\`ts
type ArgsUnion<T extends unknown[]> = T extends [infer F, ...infer Rest]
  ? [F] | [F, ...ArgsUnion<Rest>]
  : [];
type Drop<T, N extends number, Acc extends unknown[] = []>
  = Acc['length'] extends N ? T : T extends [infer _, ...infer Rest] ? Drop<Rest, N, [...Acc, unknown]> : never;
type Curried<T> = T extends (...args: infer Args) => infer R
  ? <A extends ArgsUnion<Args>>(...args: A) => A extends Args
    ? R
    : Curried<(...args: Drop<Args, A['length']>) => R>
  : never;
declare function DynamicParamsCurrying<T>(fn: T): Curried<T>;
\`\`\`

## string

- Uppercase
- Lowercase
- Capitalize
- Uncapitalize

### [Typed Get](https://github.com/type-challenges/type-challenges/blob/master/questions/270-hard-typed-get/README.md)

\`\`\`ts
type Get<T, K> = K extends \`\${infer P}.\${infer Rest}\`
  ? Get<Get<T, P>, Rest>
  : K extends keyof T ? T[K] : never;
\`\`\`

### [Trim Left](https://github.com/type-challenges/type-challenges/blob/master/questions/106-medium-trimleft/README.md)

\`\`\`ts
type Space = ' '|'\\n'|'\\t';
type TrimLeft<S extends string> = S extends \`\${Space}\${infer Rest}\` ? TrimLeft<Rest> : S;
\`\`\`

### [Trim](https://github.com/type-challenges/type-challenges/blob/master/questions/108-medium-trim/README.md)

\`\`\`ts
type Space = ' '|'\\n'|'\\t';
type TrimLeft<S extends string> = S extends \`\${Space}\${infer Rest}\` ? TrimLeft<Rest> : S;
type TrimRight<S extends string> = S extends \`\${infer Rest}\${Space}\` ? TrimRight<Rest> : S;
type Trim<S extends string> = TrimRight<TrimLeft<S>>;
\`\`\`

### [Capitalize](https://github.com/type-challenges/type-challenges/blob/master/questions/110-medium-capitalize/README.md)

\`\`\`ts
type Capitalize<S extends string> = S extends \`\${infer C}\${infer Rest}\` ? \`\${Uppercase<C>}\${Rest}\` : S;
\`\`\`

### [Replace](https://github.com/type-challenges/type-challenges/blob/master/questions/116-medium-replace/README.md)

\`\`\`ts
type Replace<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends \`\${infer C}\${From}\${infer Rest}\` ? \`\${C}\${To}\${Rest}\` : S;
\`\`\`

### [ReplaceAll](https://github.com/type-challenges/type-challenges/blob/master/questions/119-medium-replaceall/README.md)

\`\`\`ts
type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends \`\${infer C}\${From}\${infer Rest}\` ? \`\${C}\${To}\${ReplaceAll<Rest, From, To>}\` : S;
\`\`\`

### [Length of String](https://github.com/type-challenges/type-challenges/blob/master/questions/298-medium-length-of-string/README.md)

\`\`\`ts
type LengthOfString<S extends string, T extends unknown[] = []> =
  S extends \`\${infer C}\${infer Rest}\` ? LengthOfString<Rest, [...T, C]> : T['length'];
\`\`\`

### [Absolute](https://github.com/type-challenges/type-challenges/blob/master/questions/529-medium-absolute/README.md)

\`\`\`ts
type Absolute<T extends number | string | bigint> = \`\${T}\` extends \`-\${infer V}\` ? V : \`\${T}\`;
\`\`\`

### [String to Union](https://github.com/type-challenges/type-challenges/blob/master/questions/531-medium-string-to-union/README.md)

\`\`\`ts
type StringToUnion<T extends string> =
  T extends \`\${infer C}\${infer Rest}\` ? C|StringToUnion<Rest> : never;
\`\`\`

### [CamelCase](https://github.com/type-challenges/type-challenges/blob/master/questions/610-medium-camelcase/README.md)

\`\`\`ts
type CamelCase<S> = S extends \`\${infer First}-\${infer C}\${infer Rest}\`
  ? Uppercase<C> extends C
    ? \`\${First}-\${CamelCase<\`\${C}\${Rest}\`>}\`
    : \`\${First}\${Uppercase<C>}\${CamelCase<Rest>}\`
  : S;
\`\`\`

### [KebabCase](https://github.com/type-challenges/type-challenges/blob/master/questions/612-medium-kebabcase/README.md)

\`\`\`ts
type KebabCase<S, D extends string = ''> = S extends \`\${infer C}\${infer Rest}\`
  ? C extends Lowercase<C>
    ? \`\${C}\${KebabCase<Rest, '-'>}\`
    : \`\${D}\${Lowercase<C>}\${KebabCase<Rest, '-'>}\`
  : S;
\`\`\`

### [Percentage Parser](https://github.com/type-challenges/type-challenges/blob/master/questions/1978-medium-percentage-parser/README.md)

\`\`\`ts
type MP = '+'|'-';
type P = '%';
type Sign<T> = T extends \`\${infer C}\${infer Rest}\`? C extends MP ? C : '' : '';
type Percentage<T> = T extends \`\${infer Rest}\${P}\`?  P : '';
type DropSign<T> = T extends \`\${MP}\${infer Rest}\` ? Rest : T;
type DropPercentage<T> = T extends \`\${infer Rest}%\` ? Rest : T;
type PercentageParser<T> = [Sign<T>, DropPercentage<DropSign<T>>, Percentage<T>];
\`\`\`

### [Drop Char](https://github.com/type-challenges/type-challenges/blob/master/questions/2070-medium-drop-char/README.md)

\`\`\`ts
type DropChar<S, C extends string> =
  S extends \`\${infer First}\${C}\${infer Last}\` ? DropChar<\`\${First}\${Last}\`, C> : S;
\`\`\`

### [StartsWith](https://github.com/type-challenges/type-challenges/blob/master/questions/2688-medium-startswith/README.md)

\`\`\`ts
type StartsWith<T extends string, U extends string> = T extends \`\${U}\${infer Rest}\`? true : false;
\`\`\`

### [EndsWith](https://github.com/type-challenges/type-challenges/blob/master/questions/2693-medium-endswith/README.md)

\`\`\`ts
type EndsWith<T extends string, U extends string> = T extends \`\${infer Rest}\${U}\`? true : false;
\`\`\`

### [BEM style string](https://github.com/type-challenges/type-challenges/blob/master/questions/3326-medium-bem-style-string/README.md)

\`\`\`ts
type Dist<T extends string, U extends string, D extends string> =
  [U] extends [never] ? T : U extends U ? \`\${T}\${D}\${U}\` : never;
type BEM<B extends string, E extends string[], M extends string[]> =
  Dist<Dist<B, E[number], '__'>, M[number], '--'>;
\`\`\`

### [AllCombinations](https://github.com/type-challenges/type-challenges/blob/master/questions/4260-medium-nomiwase/README.md)

\`\`\`ts
type Permutation<T extends string, U extends string = T> = Equal<T, never> extends true
  ? ''
  : (T extends U ? \`\${T}\${Permutation<Exclude<U, T>>}\` : never);

type AllCombinations<S, Acc extends string = never> = S extends \`\${infer F}\${infer Rest}\`
  ? Permutation<Acc|F> | AllCombinations<Rest, Acc> | AllCombinations<Rest, Acc|F>
  : '';
\`\`\`

???
\`\`\`ts
type AllCombinations<S, Acc extends string = ''> = S extends \`\${infer F}\${infer Rest}\`
  ? \`\${F}\${AllCombinations<\`\${Acc}\${Rest}\`>}\` | AllCombinations<Rest, \`\${Acc}\${F}\`>
  : '';
\`\`\`

literal template string matching behavior:
\`\`\`ts
// Match all
type T = '' extends \`\${infer R}\` ? R : never; // ''
type T = '1' extends \`\${infer R}\` ? R : never; // '1'
type T = '12' extends \`\${infer R}\` ? R : never; // '12'
// Match first char
type T = '' extends \`\${infer R}\${infer Rest}\` ? R : never; // never
type T = '1' extends \`\${infer R}\${infer Rest}\` ? R : never; // '1'
type T = '12' extends \`\${infer R}\${infer Rest}\` ? R : never; // '1'
\`\`\`

### [Trim Right](https://github.com/type-challenges/type-challenges/blob/master/questions/4803-medium-trim-right/README.md)

\`\`\`ts
type Space = ' '|'\\n'|'\\t';
type TrimRight<S extends string> = S extends \`\${infer Rest}\${Space}\` ? TrimRight<Rest> : S;
\`\`\`

### [Trunc](https://github.com/type-challenges/type-challenges/blob/master/questions/5140-medium-trunc/README.md)

\`\`\`ts
type Trunc<T extends number|string> = \`\${T}\` extends \`\${infer Rest}.\${infer _}\` ? Rest : \`\${T}\`;
\`\`\`

### [Join](https://github.com/type-challenges/type-challenges/blob/master/questions/5310-medium-join/README.md)

\`\`\`ts
type Join<T, U extends string, D extends string = ''> = T extends [infer F, ...infer Rest]
  ? F extends string ? \`\${D}\${F}\${Join<Rest, U, U>}\` : never
  : '';
\`\`\`

### [Capitalize Words](https://github.com/type-challenges/type-challenges/blob/master/questions/112-hard-capitalizewords/README.md)

\`\`\`ts
type CapitalizeWords<S extends string, Flag = true> =
  S extends \`\${infer F}\${infer Rest}\`
    ? Flag extends true
      ? \`\${Uppercase<F>}\${CapitalizeWords<Rest, false>}\`
      :  \`\${F}\${CapitalizeWords<Rest, F extends ' '|','|'.' ? true : false>}\`
    : '';
\`\`\`

\`\`\`ts
type FirstDivider<S> = S extends \`\${infer C}\${infer Rest}\` ?
  C extends ','|'.'|' ' ? C : FirstDivider<Rest>
  : never;

type CapitalizeWords<S extends string> =
  S extends \`\${infer W}\${FirstDivider<S>}\${infer Rest}\` ?
  \`\${Capitalize<W>}\${FirstDivider<S>}\${CapitalizeWords<Rest>}\`
  : Capitalize<S>;
\`\`\`

### [CamelCase](https://github.com/type-challenges/type-challenges/blob/master/questions/114-hard-camelcase/README.md)

\`\`\`ts
type CamelCase2<S, D extends string> = S extends \`\${infer First}\${D}\${infer C}\${infer Rest}\`
  ? Uppercase<C> extends C
    ? \`\${First}\${D}\${CamelCase<\`\${C}\${Rest}\`>}\`
    : \`\${First}\${Uppercase<C>}\${CamelCase<Rest>}\`
  : S;
type CamelCase<S extends string> = CamelCase2<Lowercase<S>, '_'>;
\`\`\`

### [C-printf Parser](https://github.com/type-challenges/type-challenges/blob/master/questions/147-hard-c-printf-parser/README.md)

\`\`\`ts
type ParsePrintFormat<S, Prev = ''> = S extends \`\${infer F}\${infer Rest}\`
  ? Prev extends '%'
    ? F extends keyof ControlsMap
      ? [ControlsMap[F], ...ParsePrintFormat<Rest, ''>]
      : ParsePrintFormat<Rest, ''>
    : ParsePrintFormat<Rest, F>
  : [];
\`\`\`

### [String to Number](https://github.com/type-challenges/type-challenges/blob/master/questions/300-hard-string-to-number/README.md)

\`\`\`ts
type ToNumber<S extends string, Acc extends unknown[] = []> =
  S extends \`\${Acc['length']}\` ? Acc['length'] : ToNumber<S, [...Acc, 0]>;
\`\`\`

### [printf](https://github.com/type-challenges/type-challenges/blob/master/questions/545-hard-printf/README.md)

\`\`\`ts
type CMap = {
  's': string;
  'd': number;
}
type Format<T extends string, Prev = ''> = T extends \`\${infer F}\${infer Rest}\`
  ? Prev extends '%'
    ? F extends keyof CMap
      ? (x: CMap[F]) => Format<Rest, ''>
      : Format<Rest, ''>
    : Format<Rest, F>
  : string;
\`\`\`

### [Length of String 2](https://github.com/type-challenges/type-challenges/blob/master/questions/651-hard-length-of-string-2/README.md)

TODO:

\`\`\`ts
\`\`\`

- trick

### [String Join](https://github.com/type-challenges/type-challenges/blob/master/questions/847-hard-string-join/README.md)

\`\`\`ts
type Join<T, U extends string, D extends string = ''> = T extends [infer F, ...infer Rest]
  ? F extends string ? \`\${D}\${F}\${Join<Rest, U, U>}\` : never
  : '';
declare function join<D extends string>(delimiter: D): <T extends string[]>(...parts: T) => Join<T, D>;
\`\`\`

### [Camelize](https://github.com/type-challenges/type-challenges/blob/master/questions/1383-hard-camelize/README.md)

\`\`\`ts
type CamelCase2<S, D extends string> = S extends \`\${infer First}\${D}\${infer C}\${infer Rest}\`
  ? Uppercase<C> extends C
    ? \`\${First}\${D}\${CamelCase<\`\${C}\${Rest}\`>}\`
    : \`\${First}\${Uppercase<C>}\${CamelCase<Rest>}\`
  : S;
type CamelCase<S extends string> = CamelCase2<Lowercase<S>, '_'>;
type Camelize<T> = T extends unknown[]
  ? T extends [infer F, ...infer Rest]
    ? [Camelize<F>, ...Camelize<Rest>]
    : []
  : T extends string
    ? CamelCase<T>
    : {
      [K in keyof T as Camelize<K>]: Camelize<T[K]>;
    };
\`\`\`

### [Drop String](https://github.com/type-challenges/type-challenges/blob/master/questions/2059-hard-drop-string/README.md)

\`\`\`ts
type StringToUnion<T extends string> =
  T extends \`\${infer C}\${infer Rest}\` ? C|StringToUnion<Rest> : never;
type DropString<S, R extends string > = S extends \`\${infer C}\${infer Rest}\`
  ? \`\${C extends StringToUnion<R> ? '' : C}\${DropString<Rest, R>}\`
  : S;
\`\`\`

### [Split](https://github.com/type-challenges/type-challenges/blob/master/questions/2822-hard-split/README.md)

\`\`\`ts
type Split<S, SEP extends string> = string extends S
  ? string[]
  : S extends \`\${infer F}\${SEP}\${infer Rest}\`
    ? [F, ...Split<Rest, SEP>]
    : S extends SEP ? [] : [S];
\`\`\`

### [IsPalindrome](https://github.com/type-challenges/type-challenges/blob/master/questions/4037-hard-ispalindrome/README.md)

\`\`\`ts
type IsPalindrome<T extends number|string>
  = \`\${T}\` extends \`\${infer F}\${infer _}\`
    ? \`\${T}\` extends F
      ? true
      : \`\${T}\` extends \`\${F}\${infer Rest}\${F}\` ? IsPalindrome<Rest> : false
    : false;
\`\`\`

### [Query String Parser](https://github.com/type-challenges/type-challenges/blob/master/questions/151-extreme-query-string-parser/README.md)

\`\`\`ts
type Split<S, SEP extends string> = string extends S
  ? string[]
  : S extends \`\${infer F}\${SEP}\${infer Rest}\`
    ? [F, ...Split<Rest, SEP>]
    : S extends SEP ? [] : [S];
type StringOnly<T> = T extends string ? T : never;
type ToObj<T extends unknown[]> =
  T extends [infer F, infer L]
    ? Record<StringOnly<F>, L>
    : T[0] extends '' ? {} : Record<StringOnly<T[0]>, true>;
type MapKV<T> = T extends [infer F, ...infer Rest] ? [ToObj<Split<F, '='>>, ...MapKV<Rest>] : [];
type ToPair<T> = MapKV<Split<T, '&'>>;
type Merge<O, T> = {
  [K in keyof T | keyof O]: K extends keyof T
    ? K extends keyof O
      ? O[K] extends T[K] ? T[K] : [O[K], T[K]]
      : T[K]
    : K extends keyof O ? O[K] : never;
}
type MergeObj<T> = T extends [infer F, ...infer Rest] ? Merge<F, MergeObj<Rest>> : {};
type ParseQueryString<T> = MergeObj<ToPair<T>>;
\`\`\`

## others, union, intersection etc

- Exclude
- Extract

### [Exclude](https://github.com/type-challenges/type-challenges/blob/master/questions/43-easy-exclude/README.md)

\`\`\`ts
type MyExclude<T, U> = T extends U ? never : T;
\`\`\`

### [Awaited](https://github.com/type-challenges/type-challenges/blob/master/questions/189-easy-awaited/README.md)

\`\`\`ts
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;
\`\`\`

- conditional
  - infer

### [If](https://github.com/type-challenges/type-challenges/blob/master/questions/268-easy-if/README.md)

\`\`\`ts
type If<C, T, F> = C extends true ? T : F;
\`\`\`

### [Type Lookup](https://github.com/type-challenges/type-challenges/blob/master/questions/62-medium-type-lookup/README.md)

\`\`\`ts
type LookUp<U, T> = U extends {type: T} ? U : never;
\`\`\`

### [Permutation](https://github.com/type-challenges/type-challenges/blob/master/questions/296-medium-permutation/README.md)

\`\`\`ts
type Permutation<T, U = T> = Equal<T, never> extends true
  ? []
  : (T extends U ? [T, ...Permutation<Exclude<U, T>>] : never);
\`\`\`

\`\`\`ts
type Permutation<T, U = T> = [T] extends [never]
  ? []
  : (T extends U ? [T, ...Permutation<Exclude<U, T>>] : never);
\`\`\`

### [IsNever](https://github.com/type-challenges/type-challenges/blob/master/questions/1042-medium-isnever/README.md)

\`\`\`ts
type IsNever<T> = Equal<never, T>;
\`\`\`

\`\`\`ts
type IsNever<T> = [T] extends [never] ? true : false;
\`\`\`

### [IsUnion](https://github.com/type-challenges/type-challenges/blob/master/questions/1097-medium-isunion/README.md)

\`\`\`ts
type NotEqual<T, U> = Equal<T, U> extends true ? false : true;
type Dist<T> = T extends T ? [T] : never;
type IsUnion<T> = NotEqual<[T], Dist<T>>;
\`\`\`

\`\`\`ts
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true
\`\`\`

\`\`\`ts
type IsUnion<T> = UnionToTuple<T>['length'] extends 1 ? false : true;
\`\`\`

### [IsTuple](https://github.com/type-challenges/type-challenges/blob/master/questions/4484-medium-istuple/README.md)

\`\`\`ts
type IsTuple<T> = T extends readonly [infer T, ...infer Rest] ? IsTuple<Rest> : Equal<T, []>;
\`\`\`

\`\`\`ts
type IsTuple<T> = T extends readonly unknown[]
  ? number extends T['length'] ? false : true : false;
\`\`\`

\`IsTuple<never>\` never has some strange behavior.
[T] extends [never]

### [Union to Intersection](https://github.com/type-challenges/type-challenges/blob/master/questions/55-hard-union-to-intersection/README.md)

\`\`\`ts
type Dist<T> = T extends T ? (x: T) => void : never;
type UnionToIntersection<U> =
  Dist<U> extends (x: infer X) => void ? X : never;
// X|Y
// Dist<X|Y> = (x: X) => void | (x: Y) => void;
// UnionToIntersection<X|Y> = X&Y
\`\`\`
- naked vs boxed type
- covariance vs contravariance

### [IsAny](https://github.com/type-challenges/type-challenges/blob/master/questions/223-hard-isany/README.md)

\`\`\`ts
type IsAny<T> = Equal<any, T>;
\`\`\`

### [Union to Tuple](https://github.com/type-challenges/type-challenges/blob/master/questions/730-hard-union-to-tuple/README.md)

\`\`\`ts
type Dist<T> = T extends T ? (x: T) => void : never;
type UnionToIntersection<U> =
  Dist<U> extends (x: infer X) => void ? X : never;
// X|Y
// Dist<X|Y> = (x: X) => void | (x: Y) => void;
// UnionToIntersection<X|Y> = X&Y
type LastInUnion<U> =
  UnionToIntersection<Dist<U>> extends (x: infer L) => void
  ? L
  : never;
// Dist<X|Y> = (x: X) => void | (x: Y) => void;
// UnionToIntersection<Dist<X|Y>> = (x: X) => void & (x: Y) => void
// LastInUnion<X|Y> = ?
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];
\`\`\`

### [Intersection](https://github.com/type-challenges/type-challenges/blob/master/questions/5423-hard-intersection/README.md)

\`\`\`ts
type ToUnion<T> = T extends unknown[] ? T[number] : T;
type Intersection<T> = T extends [infer F]
  ? ToUnion<F>
  : T extends [infer F, ...infer Rest]
    ? ToUnion<F> & Intersection<Rest>
    : never;
\`\`\`

### [Sum](https://github.com/type-challenges/type-challenges/blob/master/questions/476-extreme-sum/README.md)

\`\`\`ts
type ToString<T> = T extends number ? \`\${T}\` : T;
type TupleOfLength<T extends string|number|bigint, Result extends unknown[] = []> =
  \`\${Result['length']}\` extends \`\${T}\` ? Result : TupleOfLength<T, [...Result, 0]>;

type Sum<A extends string | number | bigint, B extends string | number | bigint> = ToString<[...TupleOfLength<A>, ...TupleOfLength<B>]['length']>;
\`\`\`

## TODO:

### [Multiply](https://github.com/type-challenges/type-challenges/blob/master/questions/517-extreme-multiply/README.md)

TODO:

\`\`\`ts
\`\`\`

repeat by sum

### [Tag](https://github.com/type-challenges/type-challenges/blob/master/questions/697-extreme-tag/README.md)

TODO:

\`\`\`ts
\`\`\`

### [Inclusive Range](https://github.com/type-challenges/type-challenges/blob/master/questions/734-extreme-inclusive-range/README.md)

TODO:

\`\`\`ts
\`\`\`

### [Sort](https://github.com/type-challenges/type-challenges/blob/master/questions/741-extreme-sort/README.md)

TODO:

\`\`\`ts
\`\`\`

### [DistributeUnions](https://github.com/type-challenges/type-challenges/blob/master/questions/869-extreme-distributeunions/README.md)

TODO:

\`\`\`ts
\`\`\`

### [Assert Array Index](https://github.com/type-challenges/type-challenges/blob/master/questions/925-extreme-assert-array-index/README.md)

TODO:

\`\`\`ts
\`\`\`
`}];export{e as default};
