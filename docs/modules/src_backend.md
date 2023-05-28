[blogpress.api.hscc.bdpa.org](../README.md) / src/backend

# Module: src/backend

## Table of contents

### Type Aliases

- [SorterUpdateAggregationOp](src_backend.md#sorterupdateaggregationop)
- [SubSpecifierObject](src_backend.md#subspecifierobject)

### Functions

- [applyVotesUpdateOperation](src_backend.md#applyvotesupdateoperation)
- [authAppUser](src_backend.md#authappuser)
- [createAnswer](src_backend.md#createanswer)
- [createComment](src_backend.md#createcomment)
- [createMessage](src_backend.md#createmessage)
- [createQuestion](src_backend.md#createquestion)
- [createUser](src_backend.md#createuser)
- [deleteAnswer](src_backend.md#deleteanswer)
- [deleteComment](src_backend.md#deletecomment)
- [deleteMessage](src_backend.md#deletemessage)
- [deleteQuestion](src_backend.md#deletequestion)
- [deleteUser](src_backend.md#deleteuser)
- [getAllUsers](src_backend.md#getallusers)
- [getAnswers](src_backend.md#getanswers)
- [getComments](src_backend.md#getcomments)
- [getHowUserVoted](src_backend.md#gethowuservoted)
- [getQuestion](src_backend.md#getquestion)
- [getUser](src_backend.md#getuser)
- [getUserAnswers](src_backend.md#getuseranswers)
- [getUserMessages](src_backend.md#getusermessages)
- [getUserQuestions](src_backend.md#getuserquestions)
- [searchQuestions](src_backend.md#searchquestions)
- [updateAnswer](src_backend.md#updateanswer)
- [updateQuestion](src_backend.md#updatequestion)
- [updateUser](src_backend.md#updateuser)

## Type Aliases

### SorterUpdateAggregationOp

Ƭ **SorterUpdateAggregationOp**: `Object`

The shape of a specification used to construct $inc update operations to feed
directly to MongoDB. Used for complex updates involving the `sorter.uvc` and
`sorter.uvac` fields.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `$add` | [original: string, nUpdate: number, sUpdates: Object[]] |

#### Defined in

[src/backend/index.ts:132](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L132)

___

### SubSpecifierObject

Ƭ **SubSpecifierObject**: { [subspecifier in "$gt" \| "$lt" \| "$gte" \| "$lte"]?: number }

Whitelisted MongoDB-esque sub-specifiers that can be used with
`searchQuestions()` via the "$or" sub-matcher.

#### Defined in

[src/backend/index.ts:123](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L123)

## Functions

### applyVotesUpdateOperation

▸ **applyVotesUpdateOperation**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answer_id` | `undefined` \| `string` |
| › `comment_id` | `undefined` \| `string` |
| › `operation` | `undefined` \| `Partial`<[`VotesUpdateOperation`](src_backend_db.md#votesupdateoperation)\> |
| › `question_id` | `undefined` \| `string` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:1922](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1922)

___

### authAppUser

▸ **authAppUser**(`«destructured»`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `key` | `undefined` \| `string` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/backend/index.ts:633](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L633)

___

### createAnswer

▸ **createAnswer**(`«destructured»`): `Promise`<[`PublicAnswer`](src_backend_db.md#publicanswer)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | `undefined` \| [`NewAnswer`](src_backend_db.md#newanswer) |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicAnswer`](src_backend_db.md#publicanswer)\>

#### Defined in

[src/backend/index.ts:1326](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1326)

___

### createComment

▸ **createComment**(`«destructured»`): `Promise`<[`PublicComment`](src_backend_db.md#publiccomment)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answer_id` | `undefined` \| `string` |
| › `data` | `undefined` \| [`NewComment`](src_backend_db.md#newcomment) |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicComment`](src_backend_db.md#publiccomment)\>

#### Defined in

[src/backend/index.ts:1675](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1675)

___

### createMessage

▸ **createMessage**(`«destructured»`): `Promise`<[`PublicMail`](src_backend_db.md#publicmail)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | `undefined` \| `Partial`<`Omit`<`WithoutId`<[`InternalMail`](src_backend_db.md#internalmail)\>, ``"createdAt"``\>\> |

#### Returns

`Promise`<[`PublicMail`](src_backend_db.md#publicmail)\>

#### Defined in

[src/backend/index.ts:687](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L687)

___

### createQuestion

▸ **createQuestion**(`«destructured»`): `Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | `undefined` \| [`NewQuestion`](src_backend_db.md#newquestion) |

#### Returns

`Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)\>

#### Defined in

[src/backend/index.ts:1041](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1041)

___

### createUser

▸ **createUser**(`«destructured»`): `Promise`<[`PublicUser`](src_backend_db.md#publicuser)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | `undefined` \| `Partial`<`Omit`<`WithoutId`<[`InternalUser`](src_backend_db.md#internaluser)\>, ``"points"`` \| ``"questionIds"`` \| ``"answerIds"``\>\> |

#### Returns

`Promise`<[`PublicUser`](src_backend_db.md#publicuser)\>

#### Defined in

[src/backend/index.ts:452](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L452)

___

### deleteAnswer

▸ **deleteAnswer**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answer_id` | `undefined` \| `string` |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:1511](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1511)

___

### deleteComment

▸ **deleteComment**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answer_id` | `undefined` \| `string` |
| › `comment_id` | `undefined` \| `string` |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:1764](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1764)

___

### deleteMessage

▸ **deleteMessage**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `mail_id` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:755](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L755)

___

### deleteQuestion

▸ **deleteQuestion**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:1221](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1221)

___

### deleteUser

▸ **deleteUser**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:615](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L615)

___

### getAllUsers

▸ **getAllUsers**(`«destructured»`): `Promise`<[`PublicUser`](src_backend_db.md#publicuser)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `after_id` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicUser`](src_backend_db.md#publicuser)[]\>

#### Defined in

[src/backend/index.ts:304](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L304)

___

### getAnswers

▸ **getAnswers**(`«destructured»`): `Promise`<[`PublicAnswer`](src_backend_db.md#publicanswer)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `after_id` | `undefined` \| `string` |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicAnswer`](src_backend_db.md#publicanswer)[]\>

#### Defined in

[src/backend/index.ts:1256](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1256)

___

### getComments

▸ **getComments**(`«destructured»`): `Promise`<[`PublicComment`](src_backend_db.md#publiccomment)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `after_id` | `undefined` \| `string` |
| › `answer_id` | `undefined` \| `string` |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicComment`](src_backend_db.md#publiccomment)[]\>

#### Defined in

[src/backend/index.ts:1565](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1565)

___

### getHowUserVoted

▸ **getHowUserVoted**(`«destructured»`): `Promise`<[`VoterStatus`](src_backend_db.md#voterstatus)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answer_id` | `undefined` \| `string` |
| › `comment_id` | `undefined` \| `string` |
| › `question_id` | `undefined` \| `string` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<[`VoterStatus`](src_backend_db.md#voterstatus)\>

#### Defined in

[src/backend/index.ts:1829](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1829)

___

### getQuestion

▸ **getQuestion**(`«destructured»`): `Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)\>

#### Defined in

[src/backend/index.ts:1019](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1019)

___

### getUser

▸ **getUser**(`«destructured»`): `Promise`<[`PublicUser`](src_backend_db.md#publicuser)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicUser`](src_backend_db.md#publicuser)\>

#### Defined in

[src/backend/index.ts:329](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L329)

___

### getUserAnswers

▸ **getUserAnswers**(`«destructured»`): `Promise`<[`PublicAnswer`](src_backend_db.md#publicanswer)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `after_id` | `undefined` \| `string` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicAnswer`](src_backend_db.md#publicanswer)[]\>

#### Defined in

[src/backend/index.ts:399](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L399)

___

### getUserMessages

▸ **getUserMessages**(`«destructured»`): `Promise`<[`PublicMail`](src_backend_db.md#publicmail)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `after_id` | `undefined` \| `string` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicMail`](src_backend_db.md#publicmail)[]\>

#### Defined in

[src/backend/index.ts:648](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L648)

___

### getUserQuestions

▸ **getUserQuestions**(`«destructured»`): `Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `after_id` | `undefined` \| `string` |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)[]\>

#### Defined in

[src/backend/index.ts:348](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L348)

___

### searchQuestions

▸ **searchQuestions**(`«destructured»`): `Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `after_id` | `undefined` \| `string` |
| › `match` | `Object` |
| › `regexMatch` | `Object` |
| › `sort` | `undefined` \| `string` |

#### Returns

`Promise`<[`PublicQuestion`](src_backend_db.md#publicquestion)[]\>

#### Defined in

[src/backend/index.ts:773](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L773)

___

### updateAnswer

▸ **updateAnswer**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answer_id` | `undefined` \| `string` |
| › `data` | `undefined` \| `Partial`<`Omit`<`WithoutId`<[`InternalAnswer`](src_backend_db.md#internalanswer)\>, ``"creator"`` \| ``"createdAt"`` \| ``"upvoterUsernames"`` \| ``"downvoterUsernames"`` \| ``"commentItems"``\>\> |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:1407](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1407)

___

### updateQuestion

▸ **updateQuestion**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | `undefined` \| `Partial`<`Omit`<`WithoutId`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>, ``"creator"`` \| ``"createdAt"`` \| ``"upvoterUsernames"`` \| ``"downvoterUsernames"`` \| ``"commentItems"`` \| ``"title-lowercase"`` \| ``"answers"`` \| ``"comments"`` \| ``"views"`` \| ``"hasAcceptedAnswer"`` \| ``"answerItems"`` \| ``"sorter"``\> & { `views`: `number` \| ``"increment"``  }\> |
| › `question_id` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:1101](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L1101)

___

### updateUser

▸ **updateUser**(`«destructured»`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | `undefined` \| `Partial`<`Omit`<`WithoutId`<[`InternalUser`](src_backend_db.md#internaluser)\>, ``"username"`` \| ``"points"`` \| ``"questionIds"`` \| ``"answerIds"``\> & { `points`: `number` \| { `amount?`: `number` ; `op?`: `string`  }  }\> |
| › `username` | `undefined` \| `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:517](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/index.ts#L517)
