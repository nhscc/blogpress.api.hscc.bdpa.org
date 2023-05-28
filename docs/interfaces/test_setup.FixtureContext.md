[blogpress.api.hscc.bdpa.org](../README.md) / [test/setup](../modules/test_setup.md) / FixtureContext

# Interface: FixtureContext<CustomOptions\>

[test/setup](../modules/test_setup.md).FixtureContext

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomOptions` | extends `Record`<`string`, `unknown`\> = {} |

## Hierarchy

- `Partial`<[`TestResultProvider`](test_setup.TestResultProvider.md)\>

- `Partial`<[`TreeOutputProvider`](test_setup.TreeOutputProvider.md)\>

- `Partial`<[`GitProvider`](test_setup.GitProvider.md)\>

  ↳ **`FixtureContext`**

## Table of contents

### Properties

- [debug](test_setup.FixtureContext.md#debug)
- [fileContents](test_setup.FixtureContext.md#filecontents)
- [git](test_setup.FixtureContext.md#git)
- [options](test_setup.FixtureContext.md#options)
- [root](test_setup.FixtureContext.md#root)
- [testIdentifier](test_setup.FixtureContext.md#testidentifier)
- [testResult](test_setup.FixtureContext.md#testresult)
- [treeOutput](test_setup.FixtureContext.md#treeoutput)
- [using](test_setup.FixtureContext.md#using)

## Properties

### debug

• **debug**: [`Debugger`](lib_debug_extended.Debugger.md)

#### Defined in

[test/setup.ts:788](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L788)

___

### fileContents

• **fileContents**: `Object`

#### Index signature

▪ [filePath: `string`]: `string`

#### Defined in

[test/setup.ts:787](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L787)

___

### git

• `Optional` **git**: `SimpleGit`

#### Inherited from

Partial.git

#### Defined in

[test/setup.ts:803](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L803)

___

### options

• **options**: [`FixtureOptions`](test_setup.FixtureOptions.md) & `CustomOptions`

#### Defined in

[test/setup.ts:785](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L785)

___

### root

• **root**: `string`

#### Defined in

[test/setup.ts:783](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L783)

___

### testIdentifier

• **testIdentifier**: `string`

#### Defined in

[test/setup.ts:784](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L784)

___

### testResult

• `Optional` **testResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `exitCode` | `number` |
| `stderr` | `string` |
| `stdout` | `string` |

#### Inherited from

Partial.testResult

#### Defined in

[test/setup.ts:793](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L793)

___

### treeOutput

• `Optional` **treeOutput**: `string`

#### Inherited from

Partial.treeOutput

#### Defined in

[test/setup.ts:798](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L798)

___

### using

• **using**: [`MockFixture`](test_setup.MockFixture.md)<[`FixtureContext`](test_setup.FixtureContext.md)<{}\>\>[]

#### Defined in

[test/setup.ts:786](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L786)
