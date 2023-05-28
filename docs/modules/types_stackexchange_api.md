[blogpress.api.hscc.bdpa.org](../README.md) / types/stackexchange-api

# Module: types/stackexchange-api

## Table of contents

### Type Aliases

- [EpochTimeInSeconds](types_stackexchange_api.md#epochtimeinseconds)
- [SecondsFromNow](types_stackexchange_api.md#secondsfromnow)
- [StackExchangeAnswer](types_stackexchange_api.md#stackexchangeanswer)
- [StackExchangeApiResponse](types_stackexchange_api.md#stackexchangeapiresponse)
- [StackExchangeComment](types_stackexchange_api.md#stackexchangecomment)
- [StackExchangeQuestion](types_stackexchange_api.md#stackexchangequestion)
- [StackExchangeUser](types_stackexchange_api.md#stackexchangeuser)
- [UriString](types_stackexchange_api.md#uristring)

## Type Aliases

### EpochTimeInSeconds

Ƭ **EpochTimeInSeconds**: `Opaque`<`number`, ``"EpochTimeInSeconds"``\>

#### Defined in

[types/stackexchange-api.ts:3](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L3)

___

### SecondsFromNow

Ƭ **SecondsFromNow**: `Opaque`<`number`, ``"SecondsFromNow"``\>

#### Defined in

[types/stackexchange-api.ts:4](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L4)

___

### StackExchangeAnswer

Ƭ **StackExchangeAnswer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `answer_id` | `number` |
| `body` | `string` |
| `content_license` | `string` |
| `creation_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `is_accepted` | `boolean` |
| `last_activity_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `last_edit_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `owner` | [`StackExchangeUser`](types_stackexchange_api.md#stackexchangeuser) |
| `question_id` | `number` |
| `score` | `number` |

#### Defined in

[types/stackexchange-api.ts:26](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L26)

___

### StackExchangeApiResponse

Ƭ **StackExchangeApiResponse**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `backoff?` | [`SecondsFromNow`](types_stackexchange_api.md#secondsfromnow) |
| `error_id?` | `number` |
| `error_message?` | `string` |
| `error_name?` | `string` |
| `has_more` | `boolean` |
| `items` | `T`[] |
| `quota_max` | `number` |
| `quota_remaining` | `number` |

#### Defined in

[types/stackexchange-api.ts:61](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L61)

___

### StackExchangeComment

Ƭ **StackExchangeComment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body` | `string` |
| `comment_id` | `number` |
| `content_license` | `string` |
| `creation_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `edited` | `boolean` |
| `owner` | [`StackExchangeUser`](types_stackexchange_api.md#stackexchangeuser) |
| `post_id` | `number` |
| `score` | `number` |

#### Defined in

[types/stackexchange-api.ts:39](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L39)

___

### StackExchangeQuestion

Ƭ **StackExchangeQuestion**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accepted_answer_id` | `number` |
| `answer_count` | `number` |
| `body` | `string` |
| `content_license` | `string` |
| `creation_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `is_answered` | `boolean` |
| `last_activity_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `last_edit_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `link` | [`UriString`](types_stackexchange_api.md#uristring) |
| `owner` | [`StackExchangeUser`](types_stackexchange_api.md#stackexchangeuser) |
| `protected_date` | [`EpochTimeInSeconds`](types_stackexchange_api.md#epochtimeinseconds) |
| `question_id` | `number` |
| `score` | `number` |
| `tags` | `string`[] |
| `title` | `string` |
| `view_count` | `number` |

#### Defined in

[types/stackexchange-api.ts:7](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L7)

___

### StackExchangeUser

Ƭ **StackExchangeUser**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accept_rate` | `number` |
| `account_id` | `number` |
| `display_name` | `string` |
| `link` | [`UriString`](types_stackexchange_api.md#uristring) |
| `profile_image` | [`UriString`](types_stackexchange_api.md#uristring) |
| `reputation` | `number` |
| `user_id` | `number` |
| `user_type` | `string` |

#### Defined in

[types/stackexchange-api.ts:50](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L50)

___

### UriString

Ƭ **UriString**: `Opaque`<`string`, ``"UriString"``\>

#### Defined in

[types/stackexchange-api.ts:5](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/types/stackexchange-api.ts#L5)
