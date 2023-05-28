[blogpress.api.hscc.bdpa.org](../README.md) / src/pages

# Module: src/pages

## Table of contents

### Functions

- [default](src_pages.md#default)
- [getServerSideProps](src_pages.md#getserversideprops)

## Functions

### default

▸ **default**(`«destructured»`): `Element`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `undefined` |
| › `isInProduction` | `boolean` | `undefined` |
| › `nodeEnv` | `string` | `env.NODE_ENV` |
| › `nodeVersion` | `string` | `process.version` |

#### Returns

`Element`

#### Defined in

[src/pages/index.tsx:17](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/pages/index.tsx#L17)

___

### getServerSideProps

▸ **getServerSideProps**(): `Promise`<{ `props`: { `isInProduction`: `boolean` ; `nodeEnv`: `string` = env.NODE\_ENV; `nodeVersion`: `string` = process.version }  }\>

#### Returns

`Promise`<{ `props`: { `isInProduction`: `boolean` ; `nodeEnv`: `string` = env.NODE\_ENV; `nodeVersion`: `string` = process.version }  }\>

#### Defined in

[src/pages/index.tsx:5](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/pages/index.tsx#L5)
