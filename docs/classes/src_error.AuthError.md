[blogpress.api.hscc.bdpa.org](../README.md) / [src/error](../modules/src_error.md) / AuthError

# Class: AuthError

[src/error](../modules/src_error.md).AuthError

Represents a generic auth error.

## Hierarchy

- [`AppError`](src_error.AppError.md)

  ↳ **`AuthError`**

  ↳↳ [`NotAuthenticatedError`](src_error.NotAuthenticatedError.md)

  ↳↳ [`NotAuthorizedError`](src_error.NotAuthorizedError.md)

## Table of contents

### Constructors

- [constructor](src_error.AuthError.md#constructor)

### Properties

- [cause](src_error.AuthError.md#cause)
- [message](src_error.AuthError.md#message)
- [name](src_error.AuthError.md#name)
- [stack](src_error.AuthError.md#stack)
- [prepareStackTrace](src_error.AuthError.md#preparestacktrace)
- [stackTraceLimit](src_error.AuthError.md#stacktracelimit)

### Methods

- [captureStackTrace](src_error.AuthError.md#capturestacktrace)

## Constructors

### constructor

• **new AuthError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Overrides

[AppError](src_error.AppError.md).[constructor](src_error.AppError.md#constructor)

#### Defined in

node_modules/named-app-errors/dist/modules/error/auth/auth.d.ts:6

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

[AppError](src_error.AppError.md).[cause](src_error.AppError.md#cause)

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

[AppError](src_error.AppError.md).[message](src_error.AppError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

___

### name

• **name**: `string`

#### Inherited from

[AppError](src_error.AppError.md).[name](src_error.AppError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[AppError](src_error.AppError.md).[stack](src_error.AppError.md#stack)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1056

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[AppError](src_error.AppError.md).[prepareStackTrace](src_error.AppError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[AppError](src_error.AppError.md).[stackTraceLimit](src_error.AppError.md#stacktracelimit)

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[AppError](src_error.AppError.md).[captureStackTrace](src_error.AppError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
