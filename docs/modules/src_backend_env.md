[blogpress.api.hscc.bdpa.org](../README.md) / src/backend/env

# Module: src/backend/env

## Table of contents

### Functions

- [getEnv](src_backend_env.md#getenv)

## Functions

### getEnv

▸ **getEnv**<`T`\>(): { `AUTH_HEADER_MAX_LENGTH`: `number` ; `BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES`: ``null`` \| `number` ; `BAN_HAMMER_MAX_REQUESTS_PER_WINDOW`: ``null`` \| `number` ; `BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER`: ``null`` \| `number` ; `BAN_HAMMER_RESOLUTION_WINDOW_SECONDS`: ``null`` \| `number` ; `BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS`: ``null`` \| `number` ; `DEBUG`: ``null`` \| `string` ; `DEBUG_INSPECTING`: `boolean` = !!process.env.VSCODE\_INSPECTOR\_OPTIONS; `DISABLED_API_VERSIONS`: `string`[] ; `DISALLOWED_METHODS`: `string`[] ; `IGNORE_RATE_LIMITS`: `boolean` ; `LOCKOUT_ALL_CLIENTS`: `boolean` ; `MAX_CONTENT_LENGTH_BYTES`: `number` ; `MONGODB_MS_PORT`: ``null`` \| `number` ; `MONGODB_URI`: `string` ; `NODE_ENV`: `string` ; `OVERRIDE_EXPECT_ENV`: `OverrideEnvExpect` ; `PRUNE_DATA_MAX_BANNED_BYTES`: ``null`` \| `number` ; `PRUNE_DATA_MAX_LOGS_BYTES`: ``null`` \| `number` ; `REQUESTS_PER_CONTRIVED_ERROR`: `number` ; `RESULTS_PER_PAGE`: `number`  } & { `MAX_ANSWER_BODY_LENGTH_BYTES`: `number` ; `MAX_COMMENT_LENGTH`: `number` ; `MAX_MAIL_BODY_LENGTH_BYTES`: `number` ; `MAX_MAIL_SUBJECT_LENGTH`: `number` ; `MAX_PARAMS_PER_REQUEST`: `number` ; `MAX_QUESTION_BODY_LENGTH_BYTES`: `number` ; `MAX_QUESTION_TITLE_LENGTH`: `number` ; `MAX_USER_EMAIL_LENGTH`: `number` ; `MAX_USER_NAME_LENGTH`: `number` ; `MIN_USER_EMAIL_LENGTH`: `number` ; `MIN_USER_NAME_LENGTH`: `number` ; `PRUNE_DATA_MAX_MAIL_BYTES`: ``null`` \| `number` ; `PRUNE_DATA_MAX_QUESTIONS_BYTES`: ``null`` \| `number` ; `PRUNE_DATA_MAX_USERS_BYTES`: ``null`` \| `number` ; `STACKAPPS_AUTH_KEY`: ``null`` \| `string` ; `STACKAPPS_COLLECTALL_FIRST_ANSWER_COMMENTS`: ``null`` \| `number` ; `STACKAPPS_COLLECTALL_QUESTION_ANSWERS`: ``null`` \| `number` ; `STACKAPPS_COLLECTALL_QUESTION_COMMENTS`: ``null`` \| `number` ; `STACKAPPS_INTERVAL_PERIOD_MS`: `number` ; `STACKAPPS_MAX_PAGE_SIZE`: ``null`` \| `number` ; `STACKAPPS_MAX_REQUESTS_PER_INTERVAL`: ``null`` \| `number` ; `STACKAPPS_TOTAL_API_GENERATED_QUESTIONS`: ``null`` \| `number` ; `USER_KEY_LENGTH`: `number` ; `USER_SALT_LENGTH`: `number`  } & `T`

Returns an object representing the application's runtime environment.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Environment`](lib_next_env.md#environment) = [`Environment`](lib_next_env.md#environment) |

#### Returns

{ `AUTH_HEADER_MAX_LENGTH`: `number` ; `BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES`: ``null`` \| `number` ; `BAN_HAMMER_MAX_REQUESTS_PER_WINDOW`: ``null`` \| `number` ; `BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER`: ``null`` \| `number` ; `BAN_HAMMER_RESOLUTION_WINDOW_SECONDS`: ``null`` \| `number` ; `BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS`: ``null`` \| `number` ; `DEBUG`: ``null`` \| `string` ; `DEBUG_INSPECTING`: `boolean` = !!process.env.VSCODE\_INSPECTOR\_OPTIONS; `DISABLED_API_VERSIONS`: `string`[] ; `DISALLOWED_METHODS`: `string`[] ; `IGNORE_RATE_LIMITS`: `boolean` ; `LOCKOUT_ALL_CLIENTS`: `boolean` ; `MAX_CONTENT_LENGTH_BYTES`: `number` ; `MONGODB_MS_PORT`: ``null`` \| `number` ; `MONGODB_URI`: `string` ; `NODE_ENV`: `string` ; `OVERRIDE_EXPECT_ENV`: `OverrideEnvExpect` ; `PRUNE_DATA_MAX_BANNED_BYTES`: ``null`` \| `number` ; `PRUNE_DATA_MAX_LOGS_BYTES`: ``null`` \| `number` ; `REQUESTS_PER_CONTRIVED_ERROR`: `number` ; `RESULTS_PER_PAGE`: `number`  } & { `MAX_ANSWER_BODY_LENGTH_BYTES`: `number` ; `MAX_COMMENT_LENGTH`: `number` ; `MAX_MAIL_BODY_LENGTH_BYTES`: `number` ; `MAX_MAIL_SUBJECT_LENGTH`: `number` ; `MAX_PARAMS_PER_REQUEST`: `number` ; `MAX_QUESTION_BODY_LENGTH_BYTES`: `number` ; `MAX_QUESTION_TITLE_LENGTH`: `number` ; `MAX_USER_EMAIL_LENGTH`: `number` ; `MAX_USER_NAME_LENGTH`: `number` ; `MIN_USER_EMAIL_LENGTH`: `number` ; `MIN_USER_NAME_LENGTH`: `number` ; `PRUNE_DATA_MAX_MAIL_BYTES`: ``null`` \| `number` ; `PRUNE_DATA_MAX_QUESTIONS_BYTES`: ``null`` \| `number` ; `PRUNE_DATA_MAX_USERS_BYTES`: ``null`` \| `number` ; `STACKAPPS_AUTH_KEY`: ``null`` \| `string` ; `STACKAPPS_COLLECTALL_FIRST_ANSWER_COMMENTS`: ``null`` \| `number` ; `STACKAPPS_COLLECTALL_QUESTION_ANSWERS`: ``null`` \| `number` ; `STACKAPPS_COLLECTALL_QUESTION_COMMENTS`: ``null`` \| `number` ; `STACKAPPS_INTERVAL_PERIOD_MS`: `number` ; `STACKAPPS_MAX_PAGE_SIZE`: ``null`` \| `number` ; `STACKAPPS_MAX_REQUESTS_PER_INTERVAL`: ``null`` \| `number` ; `STACKAPPS_TOTAL_API_GENERATED_QUESTIONS`: ``null`` \| `number` ; `USER_KEY_LENGTH`: `number` ; `USER_SALT_LENGTH`: `number`  } & `T`

#### Defined in

[src/backend/env.ts:11](https://github.com/nhscc/blogpress.api.hscc.bdpa.org/blob/764312e/src/backend/env.ts#L11)
