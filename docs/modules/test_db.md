[blogpress.api.hscc.bdpa.org](../README.md) / test/db

# Module: test/db

## Table of contents

### Type Aliases

- [DummyAppData](test_db.md#dummyappdata)

### Variables

- [dummyAppData](test_db.md#dummyappdata-1)

### Functions

- [getDummyData](test_db.md#getdummydata)

## Type Aliases

### DummyAppData

Ƭ **DummyAppData**: `Object`

The shape of the application database's test data.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_generatedAt` | `number` |
| `mail` | [`InternalMail`](src_backend_db.md#internalmail)[] |
| `questions` | [`InternalQuestion`](src_backend_db.md#internalquestion)[] |
| `users` | [`InternalUser`](src_backend_db.md#internaluser)[] |

#### Defined in

[test/db.ts:22](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/db.ts#L22)

## Variables

### dummyAppData

• `Const` **dummyAppData**: [`DummyAppData`](test_db.md#dummyappdata)

Test data for the application database.

#### Defined in

[test/db.ts:422](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/db.ts#L422)

## Functions

### getDummyData

▸ **getDummyData**(): [`DummyData`](lib_mongo_test.md#dummydata)

Returns data used to hydrate databases and their collections.

#### Returns

[`DummyData`](lib_mongo_test.md#dummydata)

#### Defined in

[test/db.ts:15](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/test/db.ts#L15)
