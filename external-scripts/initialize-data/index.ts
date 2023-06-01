/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppError,
  GuruMeditationError,
  HttpError,
  InvalidAppEnvironmentError
} from 'named-app-errors';

import jsonFile from 'jsonfile';
import { type AnyBulkWriteOperation, ObjectId } from 'mongodb';
import { toss } from 'toss-expression';
import { setTimeout as wait } from 'node:timers/promises';
import inquirer, { type PromptModule } from 'inquirer';
import { decode as decodeEntities } from 'html-entities';

import { debugNamespace as namespace } from 'universe/constants';
import { getEnv } from 'universe/backend/env';

import { itemToObjectId } from 'multiverse/mongo-item';
import { RequestQueue } from 'multiverse/throttled-fetch';
import { debugFactory } from 'multiverse/debug-extended';
import { getDb } from 'multiverse/mongo-schema';
import { hydrateDb } from 'multiverse/mongo-test';

import { dummyAppData } from 'testverse/db';

import { deriveKeyFromPassword } from 'externals/initialize-data/crypto';

import type {
  InternalUser,
  InternalInfo,
  InternalPage,
  InternalSession
} from 'universe/backend/db';

const debugNamespace = `${namespace}:initialize-data`;

const log = debugFactory(debugNamespace);
const debug = debugFactory(`${debugNamespace}:debug`);
const logOrDebug = () => {
  return log.enabled ? log : debug;
};

/**
 * Represents one second in milliseconds.
 */
const oneSecondInMs = 1000;

// eslint-disable-next-line no-console
log.log = console.info.bind(console);

// ? Ensure this next line survives Webpack
if (!globalThis.process.env.DEBUG && getEnv().NODE_ENV != 'test') {
  debugFactory.enable(
    `${debugNamespace},${debugNamespace}:*,-${debugNamespace}:debug`
  );
}

/**
 * Returns the `inquirer` instance unless a string `testPrompterParams` is given
 * (passed to URLSearchParams, usually provided by a TEST_PROMPTER_X environment
 * variable), in which case a passthrough promise that resolves to a simulated
 * answer object based on `testPrompterParams` is returned as the resolved
 * result of calling `prompt()` instead.
 */
const getPrompter = (testPrompterParams?: string): { prompt: PromptModule } => {
  return testPrompterParams
    ? {
        prompt: (() => {
          debug(
            `using simulated inquirer prompt based on params: ${testPrompterParams}`
          );

          return Promise.resolve(
            Object.fromEntries(
              Array.from(new URLSearchParams(testPrompterParams).entries())
            )
          );
        }) as unknown as PromptModule
      }
    : inquirer;
};

const commitRootDataToDb = async (data: Data | null) => {
  if (!data) {
    throw new GuruMeditationError('cannot commit null data');
  }

  logOrDebug()('committing dummy root data to database via hydration');

  await hydrateDb({ name: 'root' });
};

/**
 * Setups up a database from scratch by creating collections (only if they do
 * not already exist) and populating them with a large amount of data. Suitable
 * for initializing local machines or production instances alike.
 *
 * This function is data-preserving (all actions are non-destructive: data is
 * never overwritten or deleted)
 */
const invoked = async () => {
    // TODO: logOrDebug()(`inserted ${mailResult.insertedCount} mail documents`);
    // TODO: logOrDebug()(`inserted ${questionsResult.insertedCount} question documents`);
    // TODO: logOrDebug()(`upserted ${usersResult.nUpserted}, updated ${usersResult.nModified} user documents`);
    await getPrompter(process.env.TEST_PROMPTER_INITIALIZER)
      .prompt<{ action: string; token: string }>([
        {
          name: 'action',
          message: 'select an initializer action',
          type: 'list',
          choices: [
            ...(typeof data?.cache.complete == 'boolean'
              ? [
                  {
                    name: 'reinterrogate API using cache',
                    value: 'hit'
                  },
                  {
                    name: 'reinterrogate API using cache and a custom token',
                    value: 'hit-custom'
                  },
                  {
                    name: 'ignore cache and reinterrogate API',
                    value: 'hit-ignore'
                  },
                  {
                    name: 'ignore cache and reinterrogate API using a custom token',
                    value: 'hit-ignore-custom'
                  },
                  {
                    name: data?.cache.complete
                      ? 'commit completed cache data to database'
                      : 'commit incomplete cache data to database',
                    value: 'commit'
                  }
                ]
              : [
                  {
                    name: 'interrogate API',
                    value: 'hit'
                  },
                  {
                    name: 'interrogate API using a custom token',
                    value: 'hit-custom'
                  }
                ]),
            { name: 'exit', value: 'exit' }
          ]
        },
        {
          name: 'token',
          message: 'enter new token',
          type: 'input',
          when: (answers) => answers.action.includes('custom')
        }
      ])
      .then(async (answers) => {
        if (answers.action == 'exit') {
          logOrDebug()('execution complete');
          process.exit(0);
        }

        if (answers.action.startsWith('commit')) {
          await commitApiDataToDb(data);

          logOrDebug()('execution complete');
          process.exit(0);
        }

        interrogateApi = answers.action.startsWith('hit');
        usedStackExAuthKey = answers.token ?? usedStackExAuthKey;

        if (answers.action.startsWith('hit-ignore')) {
          logOrDebug()('cache ignored');
          data = null;
        }
      });

    if (interrogateApi) {
      logOrDebug()('interrogating StackExchange API...');

      data =
        data?.cache?.complete === false
          ? data
          : {
              questions: [],
              users: [],
              cache: {
                complete: false
              }
            };

      const { keyString, saltString } = await deriveKeyFromPassword('password');

      const addOrUpdateUser = async (
        username: string,
        {
          points,
          newQuestionId: newQuestionId,
          newAnswerId: newAnswerId
        }: { points: number; newQuestionId?: QuestionId; newAnswerId?: AnswerId }
      ) => {
        let user = data!.users.find((u) => u.username == username);

        if (!user) {
          user = {
            _id: new ObjectId(),
            username,
            email: `${username}@fake-email.com`,
            salt: saltString,
            key: keyString,
            points,
            questionIds: [],
            answerIds: []
          };

          data!.users.push(user);
        }

        if (newAnswerId) {
          if (!newQuestionId) {
            throw new GuruMeditationError(
              'localUpsertUser cannot use answerId without corresponding questionId'
            );
          }

          user.answerIds.push([newQuestionId, newAnswerId]);
        } else if (newQuestionId) {
          user.questionIds.push(newQuestionId);
        }

        return user;
      };

      const endpointBackoffs: Record<string, number> = {};

      // * max 30req/1000ms https://api.stackexchange.com/docs/throttle
      const queue = new RequestQueue({
        intervalPeriodMs,
        maxRequestsPerInterval,
        // requestInspector: dummyRequestInspector
        fetchErrorInspector: ({
          error: error_,
          queue: q,
          requestInfo,
          requestInit,
          state
        }) => {
          const subDebug = logOrDebug().extend('err');

          const apiEndpoint =
            (state.apiEndpoint as string) ||
            toss(new GuruMeditationError('missing apiEndpoint metadata'));

          const tries = (state.tries as number) ?? 1;
          const retriedTooManyTimes = tries >= maxRequestRetries;

          subDebug(
            `handling fetch error for [${apiEndpoint}] (try #${tries}): ${requestInfo}`
          );

          if (retriedTooManyTimes) {
            subDebug.warn('request retried too many times');
            throw new HttpError(`${error_}`);
          }

          subDebug(`requeuing errored request: ${requestInfo}`);
          return q.addRequestToQueue(requestInfo, requestInit, {
            ...state,
            rescheduled: true,
            tries: tries + 1
          });
        },
        requestInspector: ({ queue: q, requestInfo, requestInit, state }) => {
          const subDebug = logOrDebug().extend('req');

          const apiEndpoint =
            (state.apiEndpoint as string) ||
            toss(new GuruMeditationError('missing apiEndpoint metadata'));
          const tries = (state.tries as number) ?? 1;

          subDebug(`saw [${apiEndpoint}] (try #${tries}): ${requestInfo}`);

          if (
            typeof endpointBackoffs[apiEndpoint] == 'number' &&
            Date.now() <= endpointBackoffs[apiEndpoint]
          ) {
            subDebug.warn(
              `request will be delayed until ${new Date(
                endpointBackoffs[apiEndpoint]
              ).toLocaleString()}`
            );

            return wait(
              Math.max(0, endpointBackoffs[apiEndpoint] - Date.now()),
              undefined,
              {
                signal: requestInit.signal as AbortSignal
              }
            ).then(() => {
              subDebug(`requeuing delayed request: ${requestInfo}`);
              return q.addRequestToQueue(requestInfo, requestInit, {
                ...state,
                rescheduled: true
              });
            });
          }
        },
        responseInspector: async ({
          response,
          queue: q,
          requestInfo,
          requestInit,
          state
        }) => {
          const subDebug = logOrDebug().extend('res');
          const res = response as Response;

          if (state.rescheduled as boolean) {
            subDebug(`passing through rescheduled request to ${requestInfo}`);
            return res;
          } else {
            const apiEndpoint =
              (state.apiEndpoint as string) ||
              toss(new GuruMeditationError('missing apiEndpoint metadata'));
            const tries = (state.tries as number) ?? 1;
            const retriedTooManyTimes = tries >= maxRequestRetries;

            const json: Partial<StackExchangeApiResponse<unknown>> = await res
              .json()
              .catch(() => ({}));

            subDebug(`saw [${apiEndpoint}] (try #${tries}): ${requestInfo}`);

            if (retriedTooManyTimes) {
              subDebug.warn('request retried too many times');
            }

            if (json.backoff) {
              endpointBackoffs[apiEndpoint] =
                Date.now() + json.backoff * oneSecondInMs;

              subDebug.warn(
                `saw backoff demand in response, delaying further requests to endpoint "${apiEndpoint}" until ${new Date(
                  endpointBackoffs[apiEndpoint]
                ).toLocaleString()}`
              );
            }

            if (retriedTooManyTimes && json.error_message) {
              throw new HttpError(res, json.error_message);
            } else if (res.ok) {
              return json;
            } else {
              if (retriedTooManyTimes || (res.status < 500 && res.status != 429)) {
                throw new HttpError(res);
              } else {
                if (res.status == 502 || res.status == 429) {
                  subDebug.warn(
                    `rate limited detected (${res.status}), delaying next interval request processing for ${delayAfterRequestRateLimitMs}ms before requeuing`
                  );
                  q.delayRequestProcessingByMs(delayAfterRequestRateLimitMs);
                } else {
                  subDebug.warn(
                    `a server error occurred (${res.status}), delaying next interval request processing for ${delayAfterRequestErrorMs}ms before requeuing`
                  );
                  q.delayRequestProcessingByMs(delayAfterRequestErrorMs);
                }

                return q.addRequestToQueue(requestInfo, requestInit, {
                  ...state,
                  tries: tries + 1
                });
              }
            }
          }
        }
      });

      queue.beginProcessingRequestQueue();

      try {
        while (interrogateApi) {
          interrogateApi = false;
          const api = getApi(usedStackExAuthKey);

          try {
            if (process.env.TEST_SKIP_REQUESTS) {
              debug.warn(
                'saw debug env var TEST_SKIP_REQUESTS. No requests will be made'
              );
              debug('queue stats: %O', queue.getStats());
            } else {
              await Promise.all([
                (async () => {
                  for (
                    let questionPage = 1;
                    data.questions.length < desiredApiGeneratedQuestionsCount;
                    ++questionPage
                  ) {
                    const questions = await queue.addRequestToQueue<
                      StackExchangeApiResponse<StackExchangeQuestion>
                    >(
                      api.questions({
                        page: questionPage,
                        pageSize: maxPageSize
                      }),
                      undefined,
                      { apiEndpoint: 'questions' }
                    );

                    logOrDebug()(
                      `remaining questions wanted: ${
                        desiredApiGeneratedQuestionsCount - data.questions.length
                      }`
                    );

                    await Promise.all(
                      questions.items.map(async (question, questionIndex) => {
                        const dataQuestionsLength = data!.questions.length;
                        const questionAlreadyCached =
                          data!.cache.complete === false &&
                          data!.questions.find((q) => question.title == q.title);

                        if (questionAlreadyCached) {
                          logOrDebug()(
                            `retrieved question #${
                              dataQuestionsLength + questionIndex + 1
                            } directly from local cache: ${question.title}`
                          );
                        } else if (
                          question.body.length > maxQuestionBodyLength ||
                          question.title.length > maxQuestionTitleLength
                        ) {
                          logOrDebug()(
                            `skipped question #${
                              dataQuestionsLength + questionIndex + 1
                            } for violating length constraints: ${question.title}`
                          );
                        } else {
                          const newQuestionId = new ObjectId();
                          const [questionUpvotes, questionDownvotes] =
                            getUpvotesDownvotesFromScore(question.score);

                          const answerItems: InternalAnswer[] = [];
                          const questionCommentItems: InternalComment[] = [];

                          logOrDebug()(
                            `received question #${
                              dataQuestionsLength + questionIndex + 1
                            } from API: ${question.title}`
                          );

                          await Promise.all([
                            (async () => {
                              for (
                                let answerPage = 1, shouldContinue = true;
                                shouldContinue;
                                ++answerPage
                              ) {
                                const answers = await queue.addRequestToQueue<
                                  StackExchangeApiResponse<StackExchangeAnswer>
                                >(
                                  api.questions.answers({
                                    question_id: question.question_id,
                                    page: answerPage,
                                    pageSize: maxPageSize
                                  }),
                                  undefined,
                                  { apiEndpoint: 'questions.answers' }
                                );

                                const answerItemsLength = answerItems.length;

                                logOrDebug()(
                                  `received ${answers.items.length} of (estimated) ${
                                    question.answer_count
                                  } answers for question #${
                                    dataQuestionsLength + questionIndex + 1
                                  } from API`
                                );

                                await Promise.all(
                                  answers.items.map(async (answer, answerIndex) => {
                                    if (answer.body.length <= maxAnswerLength) {
                                      const newAnswerId = new ObjectId();
                                      const [answerUpvotes, answerDownvotes] =
                                        getUpvotesDownvotesFromScore(answer.score);
                                      const answerCommentItems: InternalComment[] =
                                        [];

                                      for (
                                        let answerCommentPage = 1,
                                          subShouldContinue = true;
                                        subShouldContinue;
                                        ++answerCommentPage
                                      ) {
                                        const comments =
                                          await queue.addRequestToQueue<
                                            StackExchangeApiResponse<StackExchangeComment>
                                          >(
                                            api.answers.comments({
                                              answer_id: answer.answer_id,
                                              page: answerCommentPage,
                                              pageSize: maxPageSize
                                            }),
                                            undefined,
                                            { apiEndpoint: 'answers.comments' }
                                          );

                                        const answerCommentItemsLength =
                                          answerCommentItems.length;

                                        logOrDebug()(
                                          `received ${
                                            comments.items.length
                                          } comments for answer #${
                                            answerItemsLength + answerIndex + 1
                                          } of question #${
                                            dataQuestionsLength + questionIndex + 1
                                          } from API`
                                        );

                                        await Promise.all(
                                          comments.items.map(async (comment) => {
                                            if (
                                              comment.body.length <= maxCommentLength
                                            ) {
                                              const [
                                                commentUpvotes,
                                                commentDownvotes
                                              ] = getUpvotesDownvotesFromScore(
                                                comment.score
                                              );

                                              answerCommentItems.push({
                                                _id: new ObjectId(),
                                                creator: comment.owner.display_name,
                                                createdAt:
                                                  comment.creation_date *
                                                  oneSecondInMs,
                                                text: comment.body,
                                                upvotes: commentUpvotes,
                                                upvoterUsernames: [],
                                                downvotes: commentDownvotes,
                                                downvoterUsernames: []
                                              });

                                              await addOrUpdateUser(
                                                comment.owner.display_name,
                                                { points: comment.owner.reputation }
                                              );
                                            }
                                          })
                                        );

                                        logOrDebug()(
                                          `added ${
                                            answerCommentItems.length -
                                            answerCommentItemsLength
                                          } of ${
                                            comments.items.length
                                          } received comments to answer #${
                                            answerItemsLength + answerIndex + 1
                                          } of question #${
                                            dataQuestionsLength + questionIndex + 1
                                          }`
                                        );

                                        logOrDebug()(
                                          `---\nthere are now ${
                                            answerCommentItems.length
                                          } total comments added to answer #${
                                            answerItemsLength + answerIndex + 1
                                          } of question #${
                                            dataQuestionsLength + questionIndex + 1
                                          }\n---`
                                        );

                                        subShouldContinue = comments.has_more;
                                      }

                                      answerItems.push({
                                        _id: newAnswerId,
                                        creator: answer.owner.display_name,
                                        createdAt:
                                          answer.creation_date * oneSecondInMs,
                                        text: answer.body,
                                        upvotes: answerUpvotes,
                                        upvoterUsernames: [],
                                        downvotes: answerDownvotes,
                                        downvoterUsernames: [],
                                        accepted: answer.is_accepted,
                                        commentItems: answerCommentItems
                                      });

                                      logOrDebug()(
                                        `added answer ${
                                          answerItemsLength + answerIndex + 1
                                        } to question #${
                                          dataQuestionsLength + questionIndex + 1
                                        }`
                                      );

                                      logOrDebug()(
                                        `---\nthere are now ${
                                          answerItems.length
                                        } total answers added to question #${
                                          dataQuestionsLength + questionIndex + 1
                                        }\n---`
                                      );

                                      await addOrUpdateUser(
                                        answer.owner.display_name,
                                        {
                                          points: answer.owner.reputation,
                                          newQuestionId,
                                          newAnswerId
                                        }
                                      );
                                    } else {
                                      logOrDebug()(
                                        `skipped answer #${
                                          answerItemsLength + answerIndex + 1
                                        } of question #${
                                          dataQuestionsLength + questionIndex + 1
                                        } for violating length constraints`
                                      );
                                    }
                                  })
                                );

                                shouldContinue = answers.has_more;
                              }
                            })(),
                            (async () => {
                              for (
                                let commentPage = 1, shouldContinue = true;
                                shouldContinue;
                                ++commentPage
                              ) {
                                const comments = await queue.addRequestToQueue<
                                  StackExchangeApiResponse<StackExchangeComment>
                                >(
                                  api.questions.comments({
                                    question_id: question.question_id,
                                    page: commentPage,
                                    pageSize: maxPageSize
                                  }),
                                  undefined,
                                  { apiEndpoint: 'questions.comments' }
                                );

                                const questionCommentItemsLength =
                                  questionCommentItems.length;

                                logOrDebug()(
                                  `received ${
                                    comments.items.length
                                  } comments for question #${
                                    dataQuestionsLength + questionIndex + 1
                                  } from API`
                                );

                                await Promise.all(
                                  comments.items.map(async (comment) => {
                                    if (comment.body.length <= maxCommentLength) {
                                      const [commentUpvotes, commentDownvotes] =
                                        getUpvotesDownvotesFromScore(comment.score);

                                      questionCommentItems.push({
                                        _id: new ObjectId(),
                                        creator: comment.owner.display_name,
                                        createdAt:
                                          comment.creation_date * oneSecondInMs,
                                        text: comment.body,
                                        upvotes: commentUpvotes,
                                        upvoterUsernames: [],
                                        downvotes: commentDownvotes,
                                        downvoterUsernames: []
                                      });

                                      await addOrUpdateUser(
                                        comment.owner.display_name,
                                        { points: comment.owner.reputation }
                                      );
                                    }
                                  })
                                );

                                logOrDebug()(
                                  `added ${
                                    questionCommentItems.length -
                                    questionCommentItemsLength
                                  } of ${
                                    comments.items.length
                                  } received comments to question #${
                                    dataQuestionsLength + questionIndex + 1
                                  }`
                                );

                                logOrDebug()(
                                  `---\nthere are now ${
                                    questionCommentItems.length
                                  } total comments added to question #${
                                    dataQuestionsLength + questionIndex + 1
                                  }\n---`
                                );

                                shouldContinue = comments.has_more;
                              }
                            })()
                          ]);

                          data!.questions.push({
                            _id: newQuestionId,
                            title: question.title,
                            'title-lowercase': question.title.toLowerCase(),
                            creator: question.owner.display_name,
                            createdAt: question.creation_date * oneSecondInMs,
                            status: 'open',
                            text: question.body,
                            upvotes: questionUpvotes,
                            upvoterUsernames: [],
                            downvotes: questionDownvotes,
                            downvoterUsernames: [],
                            hasAcceptedAnswer: answerItems.some(
                              (answer) => answer.accepted
                            ),
                            views: question.view_count,
                            answers: answerItems.length,
                            answerItems,
                            comments: questionCommentItems.length,
                            commentItems: questionCommentItems,
                            sorter: {
                              uvc:
                                questionUpvotes +
                                question.view_count +
                                questionCommentItems.length,
                              uvac:
                                questionUpvotes +
                                question.view_count +
                                answerItems.length +
                                questionCommentItems.length
                            }
                          });

                          logOrDebug()(
                            `added question #${
                              dataQuestionsLength + questionIndex + 1
                            } to cache`
                          );

                          logOrDebug().extend('cached')(
                            `\n>>> there are now ${
                              data!.questions.length
                            } total of ${desiredApiGeneratedQuestionsCount} wanted questions the cache <<<\n\n`
                          );

                          await addOrUpdateUser(question.owner.display_name, {
                            points: question.owner.reputation,
                            newQuestionId
                          });

                          await cacheDataToDisk(data);
                        }
                      })
                    );

                    if (!questions.has_more) {
                      logOrDebug().warn(
                        'somehow exhausted all questions in the StackExchange API?!'
                      );
                      break;
                    }
                  }
                })(),
                (async () => {
                  const newQuestionId = new ObjectId();
                  let questionCreatedAt = Date.now();
                  const randomAnswers: InternalAnswer[] = [];
                  const randomComments: InternalComment[] = [];
                  const totalDesiredComments =
                    collectAllQuestionCommentsCount +
                    collectAllFirstAnswerCommentsCount;

                  const questionAlreadyCached =
                    data.cache.complete === false && !!data.catchallQuestion;

                  if (questionAlreadyCached) {
                    logOrDebug()(
                      'retrieved catch-all question directly from local cache'
                    );
                  } else {
                    await Promise.all([
                      (async () => {
                        for (
                          let answerPage = 1;
                          randomAnswers.length < collectAllQuestionAnswersCount;
                          ++answerPage
                        ) {
                          const answers = await queue.addRequestToQueue<
                            StackExchangeApiResponse<StackExchangeAnswer>
                          >(
                            api.answers({
                              page: answerPage,
                              pageSize: maxPageSize
                            }),
                            undefined,
                            { apiEndpoint: 'answers' }
                          );

                          const randomAnswersLength = randomAnswers.length;

                          logOrDebug()(
                            `received ${answers.items.length} random answers for catch-all question from API`
                          );

                          await Promise.all(
                            answers.items.map(async (answer) => {
                              if (answer.body.length <= maxAnswerLength) {
                                const createdAt =
                                  answer.creation_date * oneSecondInMs;

                                questionCreatedAt =
                                  createdAt < questionCreatedAt
                                    ? createdAt
                                    : questionCreatedAt;

                                const newAnswerId = new ObjectId();
                                const [answerUpvotes, answerDownvotes] =
                                  getUpvotesDownvotesFromScore(answer.score);

                                randomAnswers.push({
                                  _id: newAnswerId,
                                  creator: answer.owner.display_name,
                                  createdAt,
                                  text: answer.body,
                                  upvotes: answerUpvotes,
                                  upvoterUsernames: [],
                                  downvotes: answerDownvotes,
                                  downvoterUsernames: [],
                                  commentItems: [],
                                  accepted: false
                                });

                                await addOrUpdateUser(answer.owner.display_name, {
                                  points: answer.owner.reputation,
                                  newQuestionId,
                                  newAnswerId
                                });
                              }
                            })
                          );

                          logOrDebug()(
                            `added ${randomAnswers.length - randomAnswersLength} of ${
                              answers.items.length
                            } received answers to catch-all question`
                          );

                          logOrDebug()(
                            `there are now ${randomAnswers.length} total of ${collectAllQuestionAnswersCount} wanted random answers added to catch-all question`
                          );

                          if (!answers.has_more) {
                            logOrDebug().warn(
                              'somehow exhausted all answers in the StackExchange API?!'
                            );
                            break;
                          }
                        }
                      })(),
                      (async () => {
                        for (
                          let commentPage = 1;
                          randomComments.length < totalDesiredComments;
                          ++commentPage
                        ) {
                          const comments = await queue.addRequestToQueue<
                            StackExchangeApiResponse<StackExchangeComment>
                          >(
                            api.comments({
                              page: commentPage,
                              pageSize: maxPageSize
                            }),
                            undefined,
                            { apiEndpoint: 'comments' }
                          );

                          const randomCommentsLength = randomComments.length;

                          logOrDebug()(
                            `received ${comments.items.length} random comments for catch-all question and its first answer from API`
                          );

                          await Promise.all(
                            comments.items.map(async (comment) => {
                              if (comment.body.length <= maxCommentLength) {
                                const createdAt =
                                  comment.creation_date * oneSecondInMs;

                                questionCreatedAt =
                                  createdAt < questionCreatedAt
                                    ? createdAt
                                    : questionCreatedAt;

                                const [commentUpvotes, commentDownvotes] =
                                  getUpvotesDownvotesFromScore(comment.score);

                                randomComments.push({
                                  _id: new ObjectId(),
                                  creator: comment.owner.display_name,
                                  createdAt,
                                  text: comment.body,
                                  upvotes: commentUpvotes,
                                  upvoterUsernames: [],
                                  downvotes: commentDownvotes,
                                  downvoterUsernames: []
                                });

                                await addOrUpdateUser(comment.owner.display_name, {
                                  points: comment.owner.reputation
                                });
                              }
                            })
                          );

                          logOrDebug()(
                            `added ${
                              randomComments.length - randomCommentsLength
                            } of ${
                              comments.items.length
                            } received comments to local storage for catch-all question`
                          );

                          logOrDebug()(
                            `---\nthere are now ${randomComments.length} total of ${totalDesiredComments} wanted random comments stored\n---`
                          );

                          if (!comments.has_more) {
                            logOrDebug().warn(
                              'somehow exhausted all comments in the StackExchange API?!'
                            );
                            break;
                          }
                        }
                      })()
                    ]);

                    // ? Ensure answers and comments are in insertion order (oldest first)
                    randomAnswers.sort((a, b) => a.createdAt - b.createdAt);
                    randomComments.sort((a, b) => a.createdAt - b.createdAt);

                    data.catchallQuestion = {
                      _id: newQuestionId,
                      title:
                        'What are the best answers and comments you can come up with?',
                      'title-lowercase':
                        'what are the best answers and comments you can come up with?',
                      creator: 'Hordak',
                      createdAt: questionCreatedAt - 10 ** 6,
                      status: 'protected',
                      text: '**Hello, world!** What are some of the best random answers, question comments, and answer comments you can come up with? Post below.',
                      upvotes: 15,
                      upvoterUsernames: [],
                      downvotes: 2,
                      downvoterUsernames: [],
                      hasAcceptedAnswer: false,
                      views: 1024,
                      answers: collectAllQuestionAnswersCount,
                      answerItems: randomAnswers.slice(
                        0,
                        collectAllQuestionAnswersCount
                      ),
                      comments: collectAllQuestionCommentsCount,
                      commentItems: randomComments.slice(
                        0,
                        collectAllQuestionCommentsCount
                      ),
                      sorter: {
                        uvc: 15 + 1024 + collectAllQuestionCommentsCount,
                        uvac:
                          15 +
                          1024 +
                          collectAllQuestionAnswersCount +
                          collectAllQuestionCommentsCount
                      }
                    };

                    logOrDebug()(
                      `added ${collectAllQuestionCommentsCount} random comments to catch-all question`
                    );

                    if (randomAnswers[0]) {
                      randomAnswers[0].commentItems = randomComments.slice(
                        collectAllQuestionCommentsCount,
                        totalDesiredComments
                      );

                      logOrDebug()(
                        `added ${
                          totalDesiredComments - collectAllQuestionCommentsCount
                        } random comments to catch-all question's first answer`
                      );
                    } else {
                      logOrDebug().warn('catch-all question has no answers?!');
                    }

                    logOrDebug().extend('cached')(
                      '\n>>> added catch-all question to cache <<<\n\n'
                    );

                    await addOrUpdateUser('Hordak', {
                      points: 1_234_567,
                      newQuestionId
                    });
                  }
                })()
              ]);

              if (data.catchallQuestion) {
                data.questions.push(data.catchallQuestion);
                delete data.catchallQuestion;
              } else {
                throw new GuruMeditationError('missing catchall question');
              }

              // ? Ensure questions are in insertion order (oldest first)
              data.questions.sort((a, b) => a.createdAt - b.createdAt);

              data.cache.complete = true;
            }
          } catch (error) {
            logOrDebug().error(error);

            queue.immediatelyStopProcessingRequestQueue();

            logOrDebug()('interrupted queue stats: %O', queue.getStats());
            logOrDebug()('incomplete cache stats: %O', getDataStats(data));

            await getPrompter(process.env.TEST_PROMPTER_ERRORHANDLER)
              .prompt<{ action: string; token: string }>([
                {
                  name: 'action',
                  message: 'what now?',
                  type: 'list',
                  choices: [
                    {
                      name: 'attempt to continue using a custom token',
                      value: 'hit-custom'
                    },
                    {
                      name: 'commit incomplete cache data to database',
                      value: 'commit'
                    },
                    {
                      name: 'save incomplete cache data to disk and exit',
                      value: 'exit-save'
                    },
                    { name: 'exit without saving any data', value: 'exit' }
                  ]
                },
                {
                  name: 'token',
                  message: 'enter new token',
                  type: 'input',
                  when: (answers) => answers.action.includes('custom')
                }
              ])
              .then(async (answers) => {
                if (answers.action.startsWith('exit')) {
                  if (answers.action == 'exit-save') {
                    await cacheDataToDisk(data);
                  }

                  logOrDebug()('execution interrupted');
                  process.exit(1);
                }

                if (answers.action.startsWith('commit')) {
                  await commitApiDataToDb(data);

                  logOrDebug()('execution interrupted');
                  process.exit(1);
                }

                interrogateApi = answers.action.startsWith('hit');
                usedStackExAuthKey = answers.token ?? usedStackExAuthKey;
                queue.beginProcessingRequestQueue();
              });
          }
        }
      } finally {
        if (queue.isProcessingRequestQueue) {
          queue.gracefullyStopProcessingRequestQueue();
        }

        logOrDebug()('waiting for request queue to terminate...');
        await queue.waitForQueueProcessingToStop();
        logOrDebug()('request queue terminated');
      }

      logOrDebug()('interrogation complete');
      logOrDebug()('final queue stats: %O', queue.getStats());
    }

    if (process.env.TEST_SKIP_REQUESTS) {
      debug.warn(
        'saw debug env var TEST_SKIP_REQUESTS. Post-request tasks will be skipped'
      );
    } else {
      logOrDebug()('final cache stats: %O', getDataStats(data));
      await cacheDataToDisk(data);

      await getPrompter(process.env.TEST_PROMPTER_FINALIZER)
        .prompt<{ action: string; token: string }>([
          {
            name: 'action',
            message: 'what now?',
            type: 'list',
            choices: [
              {
                name: 'commit results to database',
                value: 'commit'
              },
              {
                name: 'commit results to database (include dummy root data)',
                value: 'commit-root'
              },
              { name: 'exit', value: 'exit' }
            ]
          },
          {
            name: 'token',
            message: 'enter new token',
            type: 'input',
            when: (answers) => answers.action.includes('custom')
          }
        ])
        .then(async (answers) => {
          if (!data) {
            throw new GuruMeditationError('data cannot be null');
          }

          if (answers.action == 'exit-save') {
            await cacheDataToDisk(data);
          }

          if (answers.action.startsWith('commit')) {
            if (answers.action == 'commit-root') {
              await commitRootDataToDb(data);
            }

            await commitApiDataToDb(data);
          }
        });
    }

    logOrDebug()('execution complete');
    process.exit(0);
  } catch (error) {
    throw new AppError(`${error}`);
  }
};

export type Data = {
  questions: InternalQuestion[];
  catchallQuestion?: InternalQuestion;
  users: InternalUser[];
  cache: {
    complete: boolean;
  };
};

export default invoked().catch((error: Error) => {
  log.error(error.message);
  process.exit(2);
});
