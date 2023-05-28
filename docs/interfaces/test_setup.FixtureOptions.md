[blogpress.api.hscc.bdpa.org](../README.md) / [test/setup](../modules/test_setup.md) / FixtureOptions

# Interface: FixtureOptions

[test/setup](../modules/test_setup.md).FixtureOptions

## Hierarchy

- `Partial`<[`WebpackTestFixtureOptions`](test_setup.WebpackTestFixtureOptions.md)\>

- `Partial`<[`GitRepositoryFixtureOptions`](test_setup.GitRepositoryFixtureOptions.md)\>

- `Partial`<[`DummyDirectoriesFixtureOptions`](test_setup.DummyDirectoriesFixtureOptions.md)\>

  ↳ **`FixtureOptions`**

## Table of contents

### Properties

- [directoryPaths](test_setup.FixtureOptions.md#directorypaths)
- [initialFileContents](test_setup.FixtureOptions.md#initialfilecontents)
- [performCleanup](test_setup.FixtureOptions.md#performcleanup)
- [setupGit](test_setup.FixtureOptions.md#setupgit)
- [use](test_setup.FixtureOptions.md#use)
- [webpackVersion](test_setup.FixtureOptions.md#webpackversion)

## Properties

### directoryPaths

• `Optional` **directoryPaths**: `string`[]

#### Inherited from

Partial.directoryPaths

#### Defined in

[test/setup.ts:774](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L774)

___

### initialFileContents

• **initialFileContents**: `Object`

#### Index signature

▪ [filePath: `string`]: `string`

#### Defined in

[test/setup.ts:759](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L759)

___

### performCleanup

• **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:757](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L757)

___

### setupGit

• `Optional` **setupGit**: (`git`: `SimpleGit`) => `unknown`

#### Type declaration

▸ (`git`): `unknown`

##### Parameters

| Name | Type |
| :------ | :------ |
| `git` | `SimpleGit` |

##### Returns

`unknown`

#### Inherited from

Partial.setupGit

#### Defined in

[test/setup.ts:769](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L769)

___

### use

• **use**: [`MockFixture`](test_setup.MockFixture.md)<[`FixtureContext`](test_setup.FixtureContext.md)<{}\>\>[]

#### Defined in

[test/setup.ts:758](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L758)

___

### webpackVersion

• `Optional` **webpackVersion**: `string`

#### Inherited from

Partial.webpackVersion

#### Defined in

[test/setup.ts:764](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/setup.ts#L764)
