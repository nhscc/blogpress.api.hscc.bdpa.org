[blogpress.api.hscc.bdpa.org](../README.md) / src/backend/db

# Module: src/backend/db

## Table of contents

### Interfaces

- [AnswerId](../interfaces/src_backend_db.AnswerId.md)
- [CommentId](../interfaces/src_backend_db.CommentId.md)
- [MailId](../interfaces/src_backend_db.MailId.md)
- [QuestionId](../interfaces/src_backend_db.QuestionId.md)
- [UserId](../interfaces/src_backend_db.UserId.md)

### Type Aliases

- [InternalAnswer](src_backend_db.md#internalanswer)
- [InternalComment](src_backend_db.md#internalcomment)
- [InternalMail](src_backend_db.md#internalmail)
- [InternalQuestion](src_backend_db.md#internalquestion)
- [InternalUser](src_backend_db.md#internaluser)
- [NewAnswer](src_backend_db.md#newanswer)
- [NewComment](src_backend_db.md#newcomment)
- [NewMail](src_backend_db.md#newmail)
- [NewQuestion](src_backend_db.md#newquestion)
- [NewUser](src_backend_db.md#newuser)
- [PatchAnswer](src_backend_db.md#patchanswer)
- [PatchQuestion](src_backend_db.md#patchquestion)
- [PatchUser](src_backend_db.md#patchuser)
- [PointsUpdateOperation](src_backend_db.md#pointsupdateoperation)
- [Projection](src_backend_db.md#projection)
- [PublicAnswer](src_backend_db.md#publicanswer)
- [PublicComment](src_backend_db.md#publiccomment)
- [PublicMail](src_backend_db.md#publicmail)
- [PublicQuestion](src_backend_db.md#publicquestion)
- [PublicUser](src_backend_db.md#publicuser)
- [SelectResult](src_backend_db.md#selectresult)
- [Username](src_backend_db.md#username)
- [ViewsUpdateOperation](src_backend_db.md#viewsupdateoperation)
- [VoterStatus](src_backend_db.md#voterstatus)
- [VoterStatusResult](src_backend_db.md#voterstatusresult)
- [VotesUpdateOperation](src_backend_db.md#votesupdateoperation)

### Variables

- [publicCommentProjection](src_backend_db.md#publiccommentprojection)
- [publicMailProjection](src_backend_db.md#publicmailprojection)
- [publicQuestionProjection](src_backend_db.md#publicquestionprojection)
- [publicUserProjection](src_backend_db.md#publicuserprojection)
- [questionStatuses](src_backend_db.md#questionstatuses)
- [vacuousProjection](src_backend_db.md#vacuousprojection)

### Functions

- [addAnswerToDb](src_backend_db.md#addanswertodb)
- [addCommentToDb](src_backend_db.md#addcommenttodb)
- [getSchemaConfig](src_backend_db.md#getschemaconfig)
- [patchAnswerInDb](src_backend_db.md#patchanswerindb)
- [patchCommentInDb](src_backend_db.md#patchcommentindb)
- [publicAnswerMap](src_backend_db.md#publicanswermap)
- [publicAnswerProjection](src_backend_db.md#publicanswerprojection)
- [publicCommentMap](src_backend_db.md#publiccommentmap)
- [removeAnswerFromDb](src_backend_db.md#removeanswerfromdb)
- [removeCommentFromDb](src_backend_db.md#removecommentfromdb)
- [selectAnswerFromDb](src_backend_db.md#selectanswerfromdb)
- [selectCommentFromDb](src_backend_db.md#selectcommentfromdb)
- [selectResultProjection](src_backend_db.md#selectresultprojection)
- [toPublicAnswer](src_backend_db.md#topublicanswer)
- [toPublicComment](src_backend_db.md#topubliccomment)
- [toPublicMail](src_backend_db.md#topublicmail)
- [toPublicQuestion](src_backend_db.md#topublicquestion)
- [toPublicUser](src_backend_db.md#topublicuser)
- [voterStatusProjection](src_backend_db.md#voterstatusprojection)

## Type Aliases

### InternalAnswer

Ƭ **InternalAnswer**: `WithId`<{ `accepted`: `boolean` ; `commentItems`: [`InternalComment`](src_backend_db.md#internalcomment)[] ; `createdAt`: `UnixEpochMs` ; `creator`: [`Username`](src_backend_db.md#username) ; `downvoterUsernames`: [`Username`](src_backend_db.md#username)[] ; `downvotes`: `number` ; `text`: `string` ; `upvoterUsernames`: [`Username`](src_backend_db.md#username)[] ; `upvotes`: `number`  }\>

The shape of an internal answer.

#### Defined in

[src/backend/db.ts:280](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L280)

___

### InternalComment

Ƭ **InternalComment**: `WithId`<{ `createdAt`: `UnixEpochMs` ; `creator`: [`Username`](src_backend_db.md#username) ; `downvoterUsernames`: [`Username`](src_backend_db.md#username)[] ; `downvotes`: `number` ; `text`: `string` ; `upvoterUsernames`: [`Username`](src_backend_db.md#username)[] ; `upvotes`: `number`  }\>

The shape of an internal comment.

#### Defined in

[src/backend/db.ts:335](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L335)

___

### InternalMail

Ƭ **InternalMail**: `WithId`<{ `createdAt`: `UnixEpochMs` ; `receiver`: [`Username`](src_backend_db.md#username) ; `sender`: [`Username`](src_backend_db.md#username) ; `subject`: `string` ; `text`: `string`  }\>

The shape of internal mail.

#### Defined in

[src/backend/db.ts:168](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L168)

___

### InternalQuestion

Ƭ **InternalQuestion**: `WithId`<{ `answerItems`: [`InternalAnswer`](src_backend_db.md#internalanswer)[] ; `answers`: `number` ; `commentItems`: [`InternalComment`](src_backend_db.md#internalcomment)[] ; `comments`: `number` ; `createdAt`: `UnixEpochMs` ; `creator`: [`Username`](src_backend_db.md#username) ; `downvoterUsernames`: [`Username`](src_backend_db.md#username)[] ; `downvotes`: `number` ; `hasAcceptedAnswer`: `boolean` ; `sorter`: { `uvac`: `number` ; `uvc`: `number`  } ; `status`: typeof [`questionStatuses`](src_backend_db.md#questionstatuses)[`number`] ; `text`: `string` ; `title`: `string` ; `title-lowercase`: `string` ; `upvoterUsernames`: [`Username`](src_backend_db.md#username)[] ; `upvotes`: `number` ; `views`: `number`  }\>

The shape of an internal question.

#### Defined in

[src/backend/db.ts:196](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L196)

___

### InternalUser

Ƭ **InternalUser**: `WithId`<{ `answerIds`: [questionId: QuestionId, answerId: AnswerId][] ; `email`: `string` ; `key`: `string` ; `points`: `number` ; `questionIds`: [`QuestionId`](../interfaces/src_backend_db.QuestionId.md)[] ; `salt`: `string` ; `username`: [`Username`](src_backend_db.md#username)  }\>

The shape of an internal application user.

#### Defined in

[src/backend/db.ts:118](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L118)

___

### NewAnswer

Ƭ **NewAnswer**: `Omit`<`WithoutId`<[`InternalAnswer`](src_backend_db.md#internalanswer)\>, ``"createdAt"`` \| ``"accepted"`` \| ``"upvotes"`` \| ``"upvoterUsernames"`` \| ``"downvotes"`` \| ``"downvoterUsernames"`` \| ``"commentItems"``\>

The shape of a new answer.

#### Defined in

[src/backend/db.ts:307](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L307)

___

### NewComment

Ƭ **NewComment**: `Omit`<`WithoutId`<[`InternalComment`](src_backend_db.md#internalcomment)\>, ``"createdAt"`` \| ``"upvotes"`` \| ``"upvoterUsernames"`` \| ``"downvotes"`` \| ``"downvoterUsernames"``\>

The shape of a new comment.

#### Defined in

[src/backend/db.ts:358](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L358)

___

### NewMail

Ƭ **NewMail**: `Partial`<`Omit`<`WithoutId`<[`InternalMail`](src_backend_db.md#internalmail)\>, ``"createdAt"``\>\>

The shape of new mail.

#### Defined in

[src/backend/db.ts:186](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L186)

___

### NewQuestion

Ƭ **NewQuestion**: `Omit`<`WithoutId`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>, ``"createdAt"`` \| ``"title-lowercase"`` \| ``"createdAt"`` \| ``"status"`` \| ``"hasAcceptedAnswer"`` \| ``"upvotes"`` \| ``"upvoterUsernames"`` \| ``"downvotes"`` \| ``"downvoterUsernames"`` \| ``"answers"`` \| ``"answerItems"`` \| ``"comments"`` \| ``"commentItems"`` \| ``"views"`` \| ``"sorter"``\>

The shape of a new question.

#### Defined in

[src/backend/db.ts:237](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L237)

___

### NewUser

Ƭ **NewUser**: `Partial`<`Omit`<`WithoutId`<[`InternalUser`](src_backend_db.md#internaluser)\>, ``"points"`` \| ``"questionIds"`` \| ``"answerIds"``\>\>

The shape of a new application user.

#### Defined in

[src/backend/db.ts:143](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L143)

___

### PatchAnswer

Ƭ **PatchAnswer**: `Partial`<`Omit`<`WithoutId`<[`InternalAnswer`](src_backend_db.md#internalanswer)\>, ``"creator"`` \| ``"createdAt"`` \| ``"upvoterUsernames"`` \| ``"downvoterUsernames"`` \| ``"commentItems"``\>\>

The shape of a patch answer.

#### Defined in

[src/backend/db.ts:321](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L321)

___

### PatchQuestion

Ƭ **PatchQuestion**: `Partial`<`Omit`<`WithoutId`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>, ``"creator"`` \| ``"title-lowercase"`` \| ``"createdAt"`` \| ``"hasAcceptedAnswer"`` \| ``"upvoterUsernames"`` \| ``"downvoterUsernames"`` \| ``"answers"`` \| ``"answerItems"`` \| ``"comments"`` \| ``"commentItems"`` \| ``"views"`` \| ``"sorter"``\> & { `views`: [`InternalQuestion`](src_backend_db.md#internalquestion)[``"views"``] \| [`ViewsUpdateOperation`](src_backend_db.md#viewsupdateoperation)  }\>

The shape of a patch question.

#### Defined in

[src/backend/db.ts:259](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L259)

___

### PatchUser

Ƭ **PatchUser**: `Partial`<`Omit`<`WithoutId`<[`InternalUser`](src_backend_db.md#internaluser)\>, ``"username"`` \| ``"questionIds"`` \| ``"answerIds"`` \| ``"points"``\> & { `points`: [`InternalUser`](src_backend_db.md#internaluser)[``"points"``] \| { [key in keyof PointsUpdateOperation]?: PointsUpdateOperation[key] extends string ? string : PointsUpdateOperation[key] }  }\>

The shape of a patch application user.

#### Defined in

[src/backend/db.ts:150](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L150)

___

### PointsUpdateOperation

Ƭ **PointsUpdateOperation**: `Object`

The shape of an update operation on a user's points total.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `op` | ``"increment"`` \| ``"decrement"`` |

#### Defined in

[src/backend/db.ts:110](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L110)

___

### Projection

Ƭ **Projection**: { [key in keyof InternalAnswer]?: unknown } & `Document`

A generic projection specification.

#### Defined in

[src/backend/db.ts:12](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L12)

___

### PublicAnswer

Ƭ **PublicAnswer**: `Omit`<`WithoutId`<[`InternalAnswer`](src_backend_db.md#internalanswer)\>, ``"upvoterUsernames"`` \| ``"downvoterUsernames"`` \| ``"commentItems"``\> & { `answer_id`: `string` ; `comments`: `number` ; `question_id`: `string`  }

The shape of a public answer.

#### Defined in

[src/backend/db.ts:295](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L295)

___

### PublicComment

Ƭ **PublicComment**: `Omit`<`WithoutId`<[`InternalComment`](src_backend_db.md#internalcomment)\>, ``"upvoterUsernames"`` \| ``"downvoterUsernames"``\> & { `comment_id`: `string`  }

The shape of a public comment.

#### Defined in

[src/backend/db.ts:348](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L348)

___

### PublicMail

Ƭ **PublicMail**: `WithoutId`<[`InternalMail`](src_backend_db.md#internalmail)\> & { `mail_id`: `string`  }

The shape of public mail.

#### Defined in

[src/backend/db.ts:179](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L179)

___

### PublicQuestion

Ƭ **PublicQuestion**: `Omit`<`WithoutId`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>, ``"title-lowercase"`` \| ``"upvoterUsernames"`` \| ``"downvoterUsernames"`` \| ``"answerItems"`` \| ``"commentItems"`` \| ``"sorter"``\> & { `question_id`: `string`  }

The shape of a public question.

#### Defined in

[src/backend/db.ts:222](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L222)

___

### PublicUser

Ƭ **PublicUser**: `Omit`<`WithoutId`<[`InternalUser`](src_backend_db.md#internaluser)\>, ``"key"`` \| ``"questionIds"`` \| ``"answerIds"``\> & { `answers`: `number` ; `questions`: `number` ; `user_id`: `string`  }

The shape of a public application user.

#### Defined in

[src/backend/db.ts:131](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L131)

___

### SelectResult

Ƭ **SelectResult**: `NonNullable`<[`VoterStatusResult`](src_backend_db.md#voterstatusresult)\> & { `isCreator`: `boolean`  } \| ``null``

The shape of vote count update operation authorization information.

#### Defined in

[src/backend/db.ts:605](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L605)

___

### Username

Ƭ **Username**: `string`

#### Defined in

[src/backend/db.ts:81](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L81)

___

### ViewsUpdateOperation

Ƭ **ViewsUpdateOperation**: ``"increment"``

The shape of an update operation on a question's views total.

#### Defined in

[src/backend/db.ts:96](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L96)

___

### VoterStatus

Ƭ **VoterStatus**: ``"upvoted"`` \| ``"downvoted"`` \| ``null``

A type representing how a user voted on a question, answer, or comment.

#### Defined in

[src/backend/db.ts:567](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L567)

___

### VoterStatusResult

Ƭ **VoterStatusResult**: { `voterStatus`: [`VoterStatus`](src_backend_db.md#voterstatus)  } \| ``null``

A type representing the result of applying the voterStatusProjection output
via cursor projection.

#### Defined in

[src/backend/db.ts:573](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L573)

___

### VotesUpdateOperation

Ƭ **VotesUpdateOperation**: `Object`

The shape of an update operation on a question or comment's
upvotes/downvotes.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `op` | ``"increment"`` \| ``"decrement"`` |
| `target` | ``"upvotes"`` \| ``"downvotes"`` |

#### Defined in

[src/backend/db.ts:102](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L102)

## Variables

### publicCommentProjection

• `Const` **publicCommentProjection**: `Object`

A MongoDB cursor projection that transforms an internal comment into a public
comment.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | ``false`` |
| `comment_id` | { `$toString`: ``"$_id"`` = '$\_id' } |
| `comment_id.$toString` | ``"$_id"`` |
| `createdAt` | ``true`` |
| `creator` | ``true`` |
| `downvotes` | ``true`` |
| `text` | ``true`` |
| `upvotes` | ``true`` |

#### Defined in

[src/backend/db.ts:533](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L533)

___

### publicMailProjection

• `Const` **publicMailProjection**: `Object`

A MongoDB cursor projection that transforms internal mail into public mail.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | ``false`` |
| `createdAt` | ``true`` |
| `mail_id` | { `$toString`: ``"$_id"`` = '$\_id' } |
| `mail_id.$toString` | ``"$_id"`` |
| `receiver` | ``true`` |
| `sender` | ``true`` |
| `subject` | ``true`` |
| `text` | ``true`` |

#### Defined in

[src/backend/db.ts:464](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L464)

___

### publicQuestionProjection

• `Const` **publicQuestionProjection**: `Object`

A MongoDB cursor projection that transforms an internal question into a
public question.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | ``false`` |
| `answers` | ``true`` |
| `comments` | ``true`` |
| `createdAt` | ``true`` |
| `creator` | ``true`` |
| `downvotes` | ``true`` |
| `hasAcceptedAnswer` | ``true`` |
| `question_id` | { `$toString`: ``"$_id"`` = '$\_id' } |
| `question_id.$toString` | ``"$_id"`` |
| `status` | ``true`` |
| `text` | ``true`` |
| `title` | ``true`` |
| `upvotes` | ``true`` |
| `views` | ``true`` |

#### Defined in

[src/backend/db.ts:478](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L478)

___

### publicUserProjection

• `Const` **publicUserProjection**: `Object`

A MongoDB cursor projection that transforms an internal user into a public
user.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | ``false`` |
| `answers` | { `$size`: ``"$answerIds"`` = '$answerIds' } |
| `answers.$size` | ``"$answerIds"`` |
| `email` | ``true`` |
| `points` | ``true`` |
| `questions` | { `$size`: ``"$questionIds"`` = '$questionIds' } |
| `questions.$size` | ``"$questionIds"`` |
| `salt` | ``true`` |
| `user_id` | { `$toString`: ``"$_id"`` = '$\_id' } |
| `user_id.$toString` | ``"$_id"`` |
| `username` | ``true`` |

#### Defined in

[src/backend/db.ts:450](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L450)

___

### questionStatuses

• `Const` **questionStatuses**: readonly [``"open"``, ``"closed"``, ``"protected"``]

Valid internal question statuses.

#### Defined in

[src/backend/db.ts:191](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L191)

___

### vacuousProjection

• `Const` **vacuousProjection**: `Object`

A meaningless MongoDB cursor projection used for existence checking without
wasting the bandwidth to pull down all of the data that might be embedded
within an object's fields.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `exists` | { `$literal`: `boolean` = true } |
| `exists.$literal` | `boolean` |

#### Defined in

[src/backend/db.ts:562](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L562)

## Functions

### addAnswerToDb

▸ **addAnswerToDb**(`«destructured»`): `Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

Adds a nested answer object to a question document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answer` | [`InternalAnswer`](src_backend_db.md#internalanswer) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

#### Defined in

[src/backend/db.ts:742](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L742)

___

### addCommentToDb

▸ **addCommentToDb**(`«destructured»`): `Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

Adds a nested comment object to a question document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answerId?` | [`AnswerId`](../interfaces/src_backend_db.AnswerId.md) |
| › `comment` | [`InternalComment`](src_backend_db.md#internalcomment) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

#### Defined in

[src/backend/db.ts:763](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L763)

___

### getSchemaConfig

▸ **getSchemaConfig**(): [`DbSchema`](lib_mongo_schema.md#dbschema)

A JSON representation of the backend Mongo database structure. This is used
for consistent app-wide db access across projects and to generate transient
versions of the db during testing.

#### Returns

[`DbSchema`](lib_mongo_schema.md#dbschema)

#### Defined in

[src/backend/db.ts:19](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L19)

___

### patchAnswerInDb

▸ **patchAnswerInDb**(`«destructured»`): `Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

Patches a nested answer object in a question document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answerId` | [`AnswerId`](../interfaces/src_backend_db.AnswerId.md) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |
| › `updateOps` | `Document` |

#### Returns

`Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

#### Defined in

[src/backend/db.ts:813](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L813)

___

### patchCommentInDb

▸ **patchCommentInDb**(`«destructured»`): `Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

Patches a nested comment object in a question document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answerId?` | [`AnswerId`](../interfaces/src_backend_db.AnswerId.md) |
| › `commentId` | [`CommentId`](../interfaces/src_backend_db.CommentId.md) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |
| › `updateOps` | `Document` |

#### Returns

`Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

#### Defined in

[src/backend/db.ts:834](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L834)

___

### publicAnswerMap

▸ **publicAnswerMap**(`variable`, `questionId`): `Object`

A MongoDB aggregation expression that maps an internal answer into a public
answer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `accepted` | \`$$${string}.accepted\` |
| `answer_id` | { `$toString`: \`$$${string}.\_id\`  } |
| `answer_id.$toString` | \`$$${string}.\_id\` |
| `comments` | { `$size`: \`$$${string}.commentItems\`  } |
| `comments.$size` | \`$$${string}.commentItems\` |
| `createdAt` | \`$$${string}.createdAt\` |
| `creator` | \`$$${string}.creator\` |
| `downvotes` | \`$$${string}.downvotes\` |
| `question_id` | `string` |
| `text` | \`$$${string}.text\` |
| `upvotes` | \`$$${string}.upvotes\` |

#### Defined in

[src/backend/db.ts:516](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L516)

___

### publicAnswerProjection

▸ **publicAnswerProjection**(`questionId`): `Object`

A MongoDB cursor projection that transforms an internal answer into a public
answer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `_id` | ``false`` |
| `accepted` | ``true`` |
| `answer_id` | { `$toString`: ``"$_id"`` = '$\_id' } |
| `answer_id.$toString` | ``"$_id"`` |
| `comments` | { `$size`: ``"$commentItems"`` = '$commentItems' } |
| `comments.$size` | ``"$commentItems"`` |
| `createdAt` | ``true`` |
| `creator` | ``true`` |
| `downvotes` | ``true`` |
| `question_id` | `string` |
| `text` | ``true`` |
| `upvotes` | ``true`` |

#### Defined in

[src/backend/db.ts:498](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L498)

___

### publicCommentMap

▸ **publicCommentMap**(`variable`): `Object`

A MongoDB aggregation expression that maps an internal comment into a public
comment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `comment_id` | { `$toString`: \`$$${string}.\_id\`  } |
| `comment_id.$toString` | \`$$${string}.\_id\` |
| `createdAt` | \`$$${string}.createdAt\` |
| `creator` | \`$$${string}.creator\` |
| `downvotes` | \`$$${string}.downvotes\` |
| `text` | \`$$${string}.text\` |
| `upvotes` | \`$$${string}.upvotes\` |

#### Defined in

[src/backend/db.ts:547](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L547)

___

### removeAnswerFromDb

▸ **removeAnswerFromDb**(`«destructured»`): `Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

Deletes a nested answer object from a question document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answerId` | [`AnswerId`](../interfaces/src_backend_db.AnswerId.md) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

#### Defined in

[src/backend/db.ts:866](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L866)

___

### removeCommentFromDb

▸ **removeCommentFromDb**(`«destructured»`): `Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

Deletes a nested comment object from a question document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answerId?` | [`AnswerId`](../interfaces/src_backend_db.AnswerId.md) |
| › `commentId` | [`CommentId`](../interfaces/src_backend_db.CommentId.md) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Promise`<`UpdateResult`<[`InternalQuestion`](src_backend_db.md#internalquestion)\>\>

#### Defined in

[src/backend/db.ts:887](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L887)

___

### selectAnswerFromDb

▸ **selectAnswerFromDb**<`T`\>(`«destructured»`): `Promise`<`T`\>

Returns a nested answer object via aggregation pipeline, optionally applying
a projection to the result.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | ``null`` \| [`InternalAnswer`](src_backend_db.md#internalanswer) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answerId?` | [`AnswerId`](../interfaces/src_backend_db.AnswerId.md) |
| › `answer_creator?` | `string` |
| › `projection?` | [`Projection`](src_backend_db.md#projection) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Promise`<`T`\>

#### Defined in

[src/backend/db.ts:696](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L696)

___

### selectCommentFromDb

▸ **selectCommentFromDb**<`T`\>(`«destructured»`): `Promise`<`T`\>

Returns a nested comment object via aggregation pipeline, optionally applying
a projection to the result.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | ``null`` \| [`InternalComment`](src_backend_db.md#internalcomment) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `answerId?` | [`AnswerId`](../interfaces/src_backend_db.AnswerId.md) |
| › `commentId` | [`CommentId`](../interfaces/src_backend_db.CommentId.md) |
| › `projection?` | [`Projection`](src_backend_db.md#projection) |
| › `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

`Promise`<`T`\>

#### Defined in

[src/backend/db.ts:720](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L720)

___

### selectResultProjection

▸ **selectResultProjection**(`username`): `Object`

A MongoDB cursor projection that returns select information about an internal
question, answer, or comment for the purpose of vote update operation
authorization.

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `_id` | `boolean` |
| `isCreator` | { `$eq`: `string`[]  } |
| `isCreator.$eq` | `string`[] |
| `voterStatus` | { `$switch`: { `branches`: { `case`: { `$in`: `string`[]  } ; `then`: `string` = 'upvoted' }[] ; `default`: ``null`` = null }  } |
| `voterStatus.$switch` | { `branches`: { `case`: { `$in`: `string`[]  } ; `then`: `string` = 'upvoted' }[] ; `default`: ``null`` = null } |
| `voterStatus.$switch.branches` | { `case`: { `$in`: `string`[]  } ; `then`: `string` = 'upvoted' }[] |
| `voterStatus.$switch.default` | ``null`` |

#### Defined in

[src/backend/db.ts:616](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L616)

___

### toPublicAnswer

▸ **toPublicAnswer**(`internalAnswer`, `questionId`): [`PublicAnswer`](src_backend_db.md#publicanswer)

Transforms an internal answer into a public answer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `internalAnswer` | [`InternalAnswer`](src_backend_db.md#internalanswer) |
| `questionId` | [`QuestionId`](../interfaces/src_backend_db.QuestionId.md) |

#### Returns

[`PublicAnswer`](src_backend_db.md#publicanswer)

#### Defined in

[src/backend/db.ts:415](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L415)

___

### toPublicComment

▸ **toPublicComment**(`internalComment`): [`PublicComment`](src_backend_db.md#publiccomment)

Transforms an internal comment into a public comment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `internalComment` | [`InternalComment`](src_backend_db.md#internalcomment) |

#### Returns

[`PublicComment`](src_backend_db.md#publiccomment)

#### Defined in

[src/backend/db.ts:435](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L435)

___

### toPublicMail

▸ **toPublicMail**(`internalMail`): [`PublicMail`](src_backend_db.md#publicmail)

Transforms internal mail into a public mail.

#### Parameters

| Name | Type |
| :------ | :------ |
| `internalMail` | [`InternalMail`](src_backend_db.md#internalmail) |

#### Returns

[`PublicMail`](src_backend_db.md#publicmail)

#### Defined in

[src/backend/db.ts:381](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L381)

___

### toPublicQuestion

▸ **toPublicQuestion**(`internalQuestion`): [`PublicQuestion`](src_backend_db.md#publicquestion)

Transforms an internal question into a public question.

#### Parameters

| Name | Type |
| :------ | :------ |
| `internalQuestion` | [`InternalQuestion`](src_backend_db.md#internalquestion) |

#### Returns

[`PublicQuestion`](src_backend_db.md#publicquestion)

#### Defined in

[src/backend/db.ts:395](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L395)

___

### toPublicUser

▸ **toPublicUser**(`internalUser`): [`PublicUser`](src_backend_db.md#publicuser)

Transforms an internal user into a public user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `internalUser` | [`InternalUser`](src_backend_db.md#internaluser) |

#### Returns

[`PublicUser`](src_backend_db.md#publicuser)

#### Defined in

[src/backend/db.ts:366](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L366)

___

### voterStatusProjection

▸ **voterStatusProjection**(`username`): `Object`

A MongoDB cursor projection that evaluates an internal question, answer, or
comment and returns how the specified user voted on said item.

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `_id` | `boolean` |
| `voterStatus` | { `$switch`: { `branches`: { `case`: { `$in`: `string`[]  } ; `then`: `string` = 'upvoted' }[] ; `default`: ``null`` = null }  } |
| `voterStatus.$switch` | { `branches`: { `case`: { `$in`: `string`[]  } ; `then`: `string` = 'upvoted' }[] ; `default`: ``null`` = null } |
| `voterStatus.$switch.branches` | { `case`: { `$in`: `string`[]  } ; `then`: `string` = 'upvoted' }[] |
| `voterStatus.$switch.default` | ``null`` |

#### Defined in

[src/backend/db.ts:579](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/db.ts#L579)
