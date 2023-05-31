/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
import assert from 'node:assert';
import { ObjectId } from 'mongodb';
import randomCase from 'random-case';
import { toss } from 'toss-expression';

import * as Backend from 'universe/backend';
import { getEnv } from 'universe/backend/env';
import { ErrorMessage } from 'universe/error';

import {
  userTypes,
  toPublicUser,
  type NewUser,
  type PatchUser,
  type PublicUserAdministrator,
  type PublicUserBlogger,
  toPublicPage
} from 'universe/backend/db';

import { useMockDateNow } from 'multiverse/mongo-common';
import { getDb } from 'multiverse/mongo-schema';
import { setupMemoryServerOverride } from 'multiverse/mongo-test';
import { itemToObjectId, itemToStringId } from 'multiverse/mongo-item';

import { dummyAppData } from 'testverse/db';
import { mockEnvFactory } from 'testverse/setup';

setupMemoryServerOverride();
useMockDateNow();

const withMockedEnv = mockEnvFactory({ NODE_ENV: 'test' });
const sortedUsers = dummyAppData.users.slice().reverse();

// TODO: make this into a package alongside the other helpers like itemExists
// TODO: and some of the jest multiverse libs. Add a descriptor/error msg
// TODO: functionality too!
async function expectRejectionsWithMatchingErrors<
  T extends [data: unknown, errorMessage: string][]
>(spec: T, rejectionFn: (data: T[number][0]) => Promise<unknown>) {
  await Promise.all(
    spec.map(([data, message], index) =>
      expect(
        rejectionFn(data).then(
          () => {
            return `test failed at index #${index}: ${JSON.stringify(
              data,
              undefined,
              2
            )}\n\nexpected error: ${message}`;
          },
          // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
          (error) => Promise.reject({ index, data, error })
        )
      ).rejects.toMatchObject({ index, error: { message } })
    )
  );
}

describe('::getAllUsers', () => {
  it('returns all users in order (latest first)', async () => {
    expect.hasAssertions();

    await expect(Backend.getAllUsers({ after_id: undefined })).resolves.toStrictEqual(
      sortedUsers.map((internalUser) => toPublicUser(internalUser))
    );
  });

  it('does not crash when database is empty', async () => {
    expect.hasAssertions();

    await expect(
      Backend.getAllUsers({ after_id: undefined })
    ).resolves.not.toStrictEqual([]);

    await (await getDb({ name: 'app' })).collection('users').deleteMany({});
    await expect(Backend.getAllUsers({ after_id: undefined })).resolves.toStrictEqual(
      []
    );
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        expect([
          await Backend.getAllUsers({ after_id: undefined }),
          await Backend.getAllUsers({
            after_id: itemToStringId(sortedUsers[0])
          }),
          await Backend.getAllUsers({
            after_id: itemToStringId(sortedUsers[1])
          }),
          await Backend.getAllUsers({
            after_id: itemToStringId(sortedUsers[2])
          }),
          await Backend.getAllUsers({
            after_id: itemToStringId(sortedUsers[3])
          })
        ]).toStrictEqual([...sortedUsers.map((user) => [toPublicUser(user)]), []]);
      },
      { RESULTS_PER_PAGE: '1' }
    );
  });

  it('rejects if after_id is not a valid ObjectId (undefined is okay)', async () => {
    expect.hasAssertions();

    await expect(Backend.getAllUsers({ after_id: 'fake-oid' })).rejects.toMatchObject(
      { message: ErrorMessage.InvalidObjectId('fake-oid') }
    );
  });

  it('rejects if after_id not found', async () => {
    expect.hasAssertions();

    const after_id = new ObjectId().toString();

    await expect(Backend.getAllUsers({ after_id })).rejects.toMatchObject({
      message: ErrorMessage.ItemNotFound(after_id, 'user_id')
    });
  });
});

describe('::getBlogPagesMetadata', () => {
  it('returns metadata for all pages belonging to a blog in order (latest first)', async () => {
    expect.hasAssertions();
    assert(dummyAppData.users[3].blogName);

    await expect(
      Backend.getBlogPagesMetadata({ blogName: dummyAppData.users[3].blogName })
    ).resolves.toStrictEqual(
      dummyAppData.pages
        .filter((internalPage) =>
          internalPage.blog_id.equals(dummyAppData.users[3]._id)
        )
        .reverse()
        .map((internalPage) => toPublicPage(internalPage))
    );
  });

  it('returns empty array if blog has no pages', async () => {
    expect.hasAssertions();
    assert(dummyAppData.users[3].blogName);

    await expect(
      (await getDb({ name: 'app' }))
        .collection('pages')
        .countDocuments({ blog_id: dummyAppData.users[3]._id })
    ).resolves.toBe(0);

    await expect(
      Backend.getBlogPagesMetadata({ blogName: dummyAppData.users[3].blogName })
    ).resolves.toStrictEqual([]);
  });

  it('rejects if blogName not found', async () => {
    expect.hasAssertions();

    await expect(
      Backend.getBlogPagesMetadata({ blogName: 'dne-blog' })
    ).rejects.toStrictEqual([]);
  });
});

describe('::getUser', () => {
  it('returns user by username or email', async () => {
    expect.hasAssertions();

    assert(dummyAppData.users[0].username !== null);

    await expect(
      Backend.getUser({ usernameOrEmail: dummyAppData.users[0].username })
    ).resolves.toStrictEqual(toPublicUser(dummyAppData.users[0]));
  });

  it('rejects if username or email missing or not found', async () => {
    expect.hasAssertions();
    const usernameOrEmail = 'does-not-exist';

    await expect(Backend.getUser({ usernameOrEmail })).rejects.toMatchObject({
      message: ErrorMessage.ItemNotFound(usernameOrEmail, 'user')
    });

    await expect(
      Backend.getUser({ usernameOrEmail: undefined as unknown as string })
    ).rejects.toMatchObject({
      message: ErrorMessage.InvalidItem('usernameOrEmail', 'parameter')
    });
  });
});

describe('::getBlog', () => {
  it('todo', async () => {
    expect.hasAssertions();
  });
});

describe('::getPage', () => {
  it('todo', async () => {
    expect.hasAssertions();
  });
});

describe('::getInfo', () => {
  it('returns information about the entire system', async () => {
    expect.hasAssertions();
  });
});

describe('::getPageSessionsCount', () => {
  it('returns the number of active entries associated with the blog page', async () => {
    expect.hasAssertions();
  });

  it('rejects if blogName not found', async () => {
    expect.hasAssertions();
  });

  it('rejects if pageName not found', async () => {
    expect.hasAssertions();
  });
});

describe('::createUser', () => {
  it('creates and returns a new administrator user', async () => {
    expect.hasAssertions();

    const $provenance = 'fake-owner';
    const newUser: Omit<Required<NewUser>, 'blogName'> = {
      username: 'new-user',
      email: 'new-user@email.com',
      key: '0'.repeat(getEnv().USER_KEY_LENGTH),
      salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
      type: 'administrator'
    };

    await expect(
      Backend.createUser({ $provenance, data: newUser })
    ).resolves.toStrictEqual<PublicUserAdministrator>({
      user_id: expect.any(String),
      username: newUser.username,
      email: newUser.email,
      salt: newUser.salt,
      type: 'administrator'
    });

    await expect(
      (await getDb({ name: 'app' }))
        .collection('users')
        .countDocuments({ username: 'new-user' })
    ).resolves.toBe(1);
  });

  it('creates and returns a new blogger user', async () => {
    expect.hasAssertions();

    const $provenance = 'fake-owner';
    const newUser: Required<NewUser> = {
      username: 'new-user',
      email: 'new-user@email.com',
      key: '0'.repeat(getEnv().USER_KEY_LENGTH),
      salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
      type: 'blogger',
      blogName: 'blog-name'
    };

    await expect(
      Backend.createUser({ $provenance, data: newUser })
    ).resolves.toStrictEqual<PublicUserBlogger>({
      user_id: expect.any(String),
      username: newUser.username,
      email: newUser.email,
      salt: newUser.salt,
      type: 'blogger',
      banned: false,
      blogName: newUser.blogName
    });

    await expect(
      (await getDb({ name: 'app' }))
        .collection('users')
        .countDocuments({ username: 'new-user' })
    ).resolves.toBe(1);
  });

  it('creates and returns new users without usernames', async () => {
    expect.hasAssertions();

    const usersDb = (await getDb({ name: 'app' })).collection('users');

    await expect(usersDb.countDocuments({ username: null })).resolves.toBe(1);

    await Backend.createUser({
      $provenance: 'fake-owner',
      data: {
        email: 'new-user@email.com',
        key: '0'.repeat(getEnv().USER_KEY_LENGTH),
        salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
        type: 'blogger',
        blogName: 'blog-name'
      }
    });

    await expect(usersDb.countDocuments({ username: null })).resolves.toBe(2);

    await Backend.createUser({
      $provenance: 'fake-owner',
      data: {
        email: 'new-user-2@email.com',
        key: '0'.repeat(getEnv().USER_KEY_LENGTH),
        salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
        type: 'administrator'
      }
    });

    await expect(usersDb.countDocuments({ username: null })).resolves.toBe(3);
  });

  it('rejects if $provenance is not a string', async () => {
    expect.hasAssertions();
  });

  it('rejects when attempting to create a user with a duplicate username or email', async () => {
    expect.hasAssertions();

    assert(dummyAppData.users[0].username);

    await expect(
      Backend.createUser({
        data: {
          username: dummyAppData.users[0].username,
          email: 'new-user@email.com',
          key: '0'.repeat(getEnv().USER_KEY_LENGTH),
          salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
          type: 'administrator'
        },
        $provenance: 'fake-owner'
      })
    ).rejects.toMatchObject({
      message: ErrorMessage.DuplicateFieldValue('username')
    });

    await expect(
      Backend.createUser({
        data: {
          username: 'new-user',
          email: dummyAppData.users[0].email,
          key: '0'.repeat(getEnv().USER_KEY_LENGTH),
          salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
          type: 'blogger',
          blogName: 'some-blog'
        },
        $provenance: 'fake-owner'
      })
    ).rejects.toMatchObject({ message: ErrorMessage.DuplicateFieldValue('email') });
  });

  it('rejects when attempting to create a user with a duplicate blog name', async () => {
    expect.hasAssertions();

    assert(dummyAppData.users[2].blogName !== undefined);

    await expect(
      Backend.createUser({
        data: {
          username: 'new-user',
          email: 'new-user@email.com',
          key: '0'.repeat(getEnv().USER_KEY_LENGTH),
          salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
          type: 'blogger',
          blogName: dummyAppData.users[2].blogName
        },
        $provenance: 'fake-owner'
      })
    ).rejects.toMatchObject({
      message: ErrorMessage.DuplicateFieldValue('blogName')
    });
  });

  it('rejects if data is invalid or contains properties that violates limits', async () => {
    expect.hasAssertions();

    const {
      MIN_USER_NAME_LENGTH: minULength,
      MAX_USER_NAME_LENGTH: maxULength,
      MIN_USER_EMAIL_LENGTH: minELength,
      MAX_USER_EMAIL_LENGTH: maxELength,
      MAX_BLOG_NAME_LENGTH: maxBLength,
      USER_SALT_LENGTH: saltLength,
      USER_KEY_LENGTH: keyLength
    } = getEnv();

    const newUsers: [NewUser, string][] = [
      [undefined as unknown as NewUser, ErrorMessage.InvalidJSON()],
      ['string data' as NewUser, ErrorMessage.InvalidJSON()],
      [
        {} as NewUser,
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: null } as unknown as NewUser,
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: 'x'.repeat(minELength - 1) },
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: 'x'.repeat(maxELength + 1) },
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: 'x'.repeat(maxELength) },
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: 'valid@email.address' },
        ErrorMessage.InvalidStringLength('salt', saltLength, null, 'hexadecimal')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength - 1)
        },
        ErrorMessage.InvalidStringLength('salt', saltLength, null, 'hexadecimal')
      ],
      [
        {
          email: 'valid@email.address',
          salt: null
        } as unknown as NewUser,
        ErrorMessage.InvalidStringLength('salt', saltLength, null, 'hexadecimal')
      ],
      [
        {
          email: 'valid@email.address',
          salt: 'x'.repeat(saltLength)
        },
        ErrorMessage.InvalidStringLength('salt', saltLength, null, 'hexadecimal')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength)
        },
        ErrorMessage.InvalidStringLength('key', keyLength, null, 'hexadecimal')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength - 1)
        },
        ErrorMessage.InvalidStringLength('key', keyLength, null, 'hexadecimal')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: 'x'.repeat(keyLength)
        },
        ErrorMessage.InvalidStringLength('key', keyLength, null, 'hexadecimal')
      ],
      [
        {
          username: 'must be alphanumeric',
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator'
        },
        ErrorMessage.InvalidStringLength(
          'username',
          minULength,
          maxULength,
          'lowercase alphanumeric'
        )
      ],
      [
        {
          username: 'must-be-@lphanumeric',
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator'
        },
        ErrorMessage.InvalidStringLength(
          'username',
          minULength,
          maxULength,
          'lowercase alphanumeric'
        )
      ],
      [
        {
          username: 'must-be-LOWERCASE',
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator'
        },
        ErrorMessage.InvalidStringLength(
          'username',
          minULength,
          maxULength,
          'lowercase alphanumeric'
        )
      ],
      [
        {
          username: '#&*@^(#@(^$&*#',
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator'
        },
        ErrorMessage.InvalidStringLength(
          'username',
          minULength,
          maxULength,
          'lowercase alphanumeric'
        )
      ],
      [
        {
          username: 'x'.repeat(minULength - 1),
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator'
        },
        ErrorMessage.InvalidStringLength(
          'username',
          minULength,
          maxULength,
          'lowercase alphanumeric'
        )
      ],
      [
        {
          username: 'x'.repeat(maxULength + 1),
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator'
        },
        ErrorMessage.InvalidStringLength(
          'username',
          minULength,
          maxULength,
          'lowercase alphanumeric'
        )
      ],
      [
        {
          username: 'x'.repeat(maxULength - 1),
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator',
          user_id: 1
        } as NewUser,
        ErrorMessage.UnknownField('user_id')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          blogName: 'some-blog'
        } as NewUser,
        ErrorMessage.InvalidFieldValue('type', undefined, userTypes)
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength)
        } as NewUser,
        ErrorMessage.InvalidFieldValue('type', undefined, userTypes)
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'administrator',
          blogName: 'some-blog'
        } as NewUser,
        ErrorMessage.UnknownField('blogName')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'blogger',
          blogName: 'not alphanumeric'
        } as NewUser,
        ErrorMessage.InvalidStringLength('blogName', 1, maxBLength, 'alphanumeric')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'blogger',
          blogName: 'not-@lphanumeric'
        } as NewUser,
        ErrorMessage.InvalidStringLength('blogName', 1, maxBLength, 'alphanumeric')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'blogger',
          blogName: null
        } as unknown as NewUser,
        ErrorMessage.InvalidStringLength('blogName', 1, maxBLength, 'alphanumeric')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'blogger',
          blogName: 'x'.repeat(maxBLength + 1)
        } as NewUser,
        ErrorMessage.InvalidStringLength('blogName', 1, maxBLength, 'alphanumeric')
      ],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          type: 'blogger',
          blogName: ''
        } as NewUser,
        ErrorMessage.InvalidStringLength('blogName', 1, maxBLength, 'alphanumeric')
      ]
    ];

    await expectRejectionsWithMatchingErrors(newUsers, (data) =>
      Backend.createUser({ data, $provenance: 'fake-owner' })
    );
  });
});

describe('::createPage', () => {
  it('creates and returns a new blog page', async () => {
    expect.hasAssertions();
  });

  it('allows creation of empty pages', async () => {
    expect.hasAssertions();
  });

  it('rejects when attempting to create a page with a duplicate pageName', async () => {
    expect.hasAssertions();
  });

  it('rejects when creating a page would put user over MAX_USER_BLOG_PAGES', async () => {
    expect.hasAssertions();
  });

  it('rejects if $provenance is not a string', async () => {
    expect.hasAssertions();
  });

  it('rejects if blogName not found', async () => {
    expect.hasAssertions();
  });

  it('rejects if data is invalid or contains properties that violates limits', async () => {
    expect.hasAssertions();
    // TODO: rejects on bad/too long/too short name
    // TODO: rejects on bad/too long/too short contents
  });
});

describe('::createSession', () => {
  it('creates a new session when ip-user_id pair do not match', async () => {
    expect.hasAssertions();
  });

  it('renews an existing session when ip-user_id pair match', async () => {
    expect.hasAssertions();
  });

  it('$provenance is ignored when renewing (instead of creating)', async () => {
    expect.hasAssertions();
  });

  it('rejects when attempting to create a page with a duplicate pageName', async () => {
    expect.hasAssertions();
  });

  it('rejects if $provenance is not a string', async () => {
    expect.hasAssertions();
  });

  it('rejects if blogName not found', async () => {
    expect.hasAssertions();
  });

  it('rejects if pageName not found', async () => {
    expect.hasAssertions();
  });

  it('rejects if data is invalid or contains properties that violates limits', async () => {
    expect.hasAssertions();
    // TODO: rejects on bad/too long/too short name
    // TODO: rejects on bad/too long/too short contents
  });
});

describe('::updateUser', () => {
  it('updates an existing user by username', async () => {
    expect.hasAssertions();
    assert(dummyAppData.users[2].username);
    assert(dummyAppData.users[2].type === 'blogger');

    const usersDb = (await getDb({ name: 'app' })).collection('users');

    const patchUser: PatchUser = {
      email: 'fake@email.com',
      key: '0'.repeat(getEnv().USER_KEY_LENGTH),
      salt: '0'.repeat(getEnv().USER_SALT_LENGTH),
      banned: true
    };

    await expect(
      usersDb.countDocuments({
        username: dummyAppData.users[2].username,
        ...patchUser
      })
    ).resolves.toBe(0);

    await expect(
      Backend.updateUser({
        usernameOrEmail: dummyAppData.users[2].username,
        data: patchUser
      })
    ).resolves.toBeUndefined();

    await expect(
      usersDb.countDocuments({
        username: dummyAppData.users[2].username,
        ...patchUser
      })
    ).resolves.toBe(1);
  });

  it('updates an existing user by email', async () => {
    expect.hasAssertions();

    const usersDb = (await getDb({ name: 'app' })).collection('users');

    const patchUser: PatchUser = {
      email: 'fake@email.com',
      key: '0'.repeat(getEnv().USER_KEY_LENGTH),
      salt: '0'.repeat(getEnv().USER_SALT_LENGTH)
    };

    await expect(
      usersDb.countDocuments({
        email: dummyAppData.users[0].email,
        ...patchUser
      })
    ).resolves.toBe(0);

    await expect(
      Backend.updateUser({
        usernameOrEmail: dummyAppData.users[0].email,
        data: patchUser
      })
    ).resolves.toBeUndefined();

    await expect(
      usersDb.countDocuments({
        email: dummyAppData.users[0].email,
        ...patchUser
      })
    ).resolves.toBe(1);
  });

  it('does not reject when demonstrating idempotency', async () => {
    expect.hasAssertions();
    assert(dummyAppData.users[0].username);

    await expect(
      Backend.updateUser({
        usernameOrEmail: dummyAppData.users[0].username,
        data: { salt: dummyAppData.users[0].salt }
      })
    ).resolves.toBeUndefined();
  });

  it('rejects if no data passed in', async () => {
    expect.hasAssertions();

    await expect(
      Backend.updateUser({
        usernameOrEmail: 'does-not@ex.ist',
        data: {}
      })
    ).rejects.toMatchObject({
      message: ErrorMessage.ItemNotFound('does-not@ex.ist', 'user')
    });
  });

  it('rejects if attempting to update user with incorrect params for type', async () => {
    expect.hasAssertions();

    assert(dummyAppData.users[0].type === 'administrator');
    assert(dummyAppData.users[2].type === 'blogger');

    await expect(
      Backend.updateUser({
        usernameOrEmail: dummyAppData.users[2].email,
        data: { banned: true }
      })
    ).resolves.toBeUndefined();

    await expect(
      Backend.updateUser({
        usernameOrEmail: dummyAppData.users[0].email,
        data: { banned: true }
      })
    ).rejects.toMatchObject({
      message: ErrorMessage.UnknownField('banned')
    });
  });

  it('rejects if the username or email is missing or not found', async () => {
    expect.hasAssertions();

    await expect(
      Backend.updateUser({
        usernameOrEmail: 'fake-user',
        data: {
          email: 'fake@email.com',
          key: '0'.repeat(getEnv().USER_KEY_LENGTH),
          salt: '0'.repeat(getEnv().USER_SALT_LENGTH)
        }
      })
    ).rejects.toMatchObject({
      message: ErrorMessage.ItemNotFound('fake-user', 'user')
    });

    await expect(
      Backend.updateUser({
        usernameOrEmail: undefined as unknown as string,
        data: {
          email: 'fake@email.com',
          key: '0'.repeat(getEnv().USER_KEY_LENGTH),
          salt: '0'.repeat(getEnv().USER_SALT_LENGTH)
        }
      })
    ).rejects.toMatchObject({
      message: ErrorMessage.InvalidItem('usernameOrEmail', 'parameter')
    });
  });

  it('rejects when attempting to update a user to a duplicate email', async () => {
    expect.hasAssertions();
    assert(dummyAppData.users[1].username);

    await expect(
      Backend.updateUser({
        usernameOrEmail: dummyAppData.users[1].username,
        data: {
          email: dummyAppData.users[0].email
        }
      })
    ).rejects.toMatchObject({ message: ErrorMessage.DuplicateFieldValue('email') });
  });

  it('rejects if data is invalid or contains properties that violates limits', async () => {
    expect.hasAssertions();

    const {
      MIN_USER_EMAIL_LENGTH: minELength,
      MAX_USER_EMAIL_LENGTH: maxELength,
      USER_SALT_LENGTH: saltLength,
      USER_KEY_LENGTH: keyLength
    } = getEnv();

    const patchUsers: [PatchUser, string][] = [
      [undefined as unknown as PatchUser, ErrorMessage.InvalidJSON()],
      ['string data' as PatchUser, ErrorMessage.InvalidJSON()],
      [
        { email: '' },
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: 'x'.repeat(minELength - 1) },
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: 'x'.repeat(maxELength + 1) },
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { email: 'x'.repeat(maxELength) },
        ErrorMessage.InvalidStringLength('email', minELength, maxELength, 'string')
      ],
      [
        { salt: '' },
        ErrorMessage.InvalidStringLength('salt', saltLength, null, 'hexadecimal')
      ],
      [
        { salt: '0'.repeat(saltLength - 1) },
        ErrorMessage.InvalidStringLength('salt', saltLength, null, 'hexadecimal')
      ],
      [
        { salt: 'x'.repeat(saltLength) },
        ErrorMessage.InvalidStringLength('salt', saltLength, null, 'hexadecimal')
      ],
      [
        { key: '' },
        ErrorMessage.InvalidStringLength('key', keyLength, null, 'hexadecimal')
      ],
      [
        { key: '0'.repeat(keyLength - 1) },
        ErrorMessage.InvalidStringLength('key', keyLength, null, 'hexadecimal')
      ],
      [
        { key: 'x'.repeat(keyLength) },
        ErrorMessage.InvalidStringLength('key', keyLength, null, 'hexadecimal')
      ],
      [{ banned: 'true' as unknown as boolean }, ErrorMessage.UnknownField('banned')],
      [{ banned: null as unknown as boolean }, ErrorMessage.UnknownField('banned')],
      [{ data: 1 } as PatchUser, ErrorMessage.UnknownField('data')],
      [
        { blogName: 'new-blog-name' } as PatchUser,
        ErrorMessage.UnknownField('blogName')
      ],
      [{ name: 'username' } as PatchUser, ErrorMessage.UnknownField('name')],
      [
        {
          email: 'valid@email.address',
          salt: '0'.repeat(saltLength),
          key: '0'.repeat(keyLength),
          username: 'new-username'
        } as PatchUser,
        ErrorMessage.UnknownField('username')
      ]
    ];

    await expectRejectionsWithMatchingErrors(patchUsers, (data) => {
      assert(dummyAppData.users[0].username);
      return Backend.updateUser({
        usernameOrEmail: dummyAppData.users[0].username,
        data
      });
    });

    await expectRejectionsWithMatchingErrors(
      [
        [
          { banned: 'true' as unknown as boolean },
          ErrorMessage.InvalidFieldValue('banned', 'true', ['true', 'false'])
        ],
        [
          { banned: null as unknown as boolean },
          ErrorMessage.InvalidFieldValue('banned', null, ['true', 'false'])
        ]
      ],
      (data) => {
        return Backend.updateUser({
          usernameOrEmail: dummyAppData.users[2].email,
          data
        });
      }
    );
  });
});

describe('::updateBlog', () => {
  it('updates an existing page', async () => {
    expect.hasAssertions();
  });

  it('allows update to empty page contents', async () => {
    expect.hasAssertions();
  });

  it('does not reject when demonstrating idempotency', async () => {
    expect.hasAssertions();
  });

  it('rejects if no data passed in', async () => {
    expect.hasAssertions();
  });

  it('rejects if the blogName is missing or not found', async () => {
    expect.hasAssertions();
  });

  it('rejects when attempting to update a page to a duplicate pageName in the same blog', async () => {
    expect.hasAssertions();
  });

  it('does not reject when attempting to update a page to a duplicate pageName but not in the same blog', async () => {
    expect.hasAssertions();
  });

  it('rejects if data is invalid or contains properties that violates limits', async () => {
    expect.hasAssertions();
  });
});

describe('::updatePage', () => {
  it('updates an existing page', async () => {
    expect.hasAssertions();
  });

  it('allows update to empty page contents', async () => {
    expect.hasAssertions();
  });

  it('does not reject when demonstrating idempotency', async () => {
    expect.hasAssertions();
  });

  it('rejects if no data passed in', async () => {
    expect.hasAssertions();
  });

  it('rejects if the blogName is missing or not found', async () => {
    expect.hasAssertions();
  });

  it('rejects when attempting to update a page to a duplicate pageName in the same blog', async () => {
    expect.hasAssertions();
  });

  it('does not reject when attempting to update a page to a duplicate pageName but not in the same blog', async () => {
    expect.hasAssertions();
  });

  it('rejects if data is invalid or contains properties that violates limits', async () => {
    expect.hasAssertions();
  });
});

describe('::renewSession', () => {
  it('renews an existing session, preventing it from being deleted', async () => {
    expect.hasAssertions();
  });

  it('rejects with 404 if session not found', async () => {
    expect.hasAssertions();
  });
});

describe('::deleteUser', () => {
  it('deletes a user by username', async () => {
    expect.hasAssertions();
    assert(dummyAppData.users[0].username !== null);

    const usersDb = (await getDb({ name: 'app' })).collection('users');

    await expect(
      usersDb.countDocuments({ _id: itemToObjectId(dummyAppData.users[0]) })
    ).resolves.toBe(1);

    await expect(
      Backend.deleteUser({ usernameOrEmail: dummyAppData.users[0].username })
    ).resolves.toBeUndefined();

    await expect(
      usersDb.countDocuments({ _id: itemToObjectId(dummyAppData.users[0]) })
    ).resolves.toBe(0);
  });

  it('deletes a user by email', async () => {
    expect.hasAssertions();

    const usersDb = (await getDb({ name: 'app' })).collection('users');

    await expect(
      usersDb.countDocuments({ _id: itemToObjectId(dummyAppData.users[0]) })
    ).resolves.toBe(1);

    await expect(
      Backend.deleteUser({ usernameOrEmail: dummyAppData.users[0].email })
    ).resolves.toBeUndefined();

    await expect(
      usersDb.countDocuments({ _id: itemToObjectId(dummyAppData.users[0]) })
    ).resolves.toBe(0);
  });

  it('rejects if the username/email is missing or not found', async () => {
    expect.hasAssertions();

    await expect(
      Backend.deleteUser({ usernameOrEmail: 'does-not-exist' })
    ).rejects.toMatchObject({
      message: ErrorMessage.ItemNotFound('does-not-exist', 'user')
    });

    await expect(
      Backend.deleteUser({ usernameOrEmail: undefined as unknown as string })
    ).rejects.toMatchObject({
      message: ErrorMessage.InvalidItem('usernameOrEmail', 'parameter')
    });

    await expect(
      Backend.deleteUser({ usernameOrEmail: null as unknown as string })
    ).rejects.toMatchObject({
      message: ErrorMessage.InvalidItem('usernameOrEmail', 'parameter')
    });
  });
});

describe('::deletePage', () => {
  it('deletes a blog page', async () => {
    expect.hasAssertions();
  });

  it('does not reject if entry is not found', async () => {
    expect.hasAssertions();
  });

  it('rejects if blogName or pageName is missing or not found', async () => {
    expect.hasAssertions();
  });
});

describe('::deleteSession', () => {
  it('deletes an active session', async () => {
    expect.hasAssertions();
  });

  it('works regardless of blogName or pageName', async () => {
    expect.hasAssertions();
  });

  it('does not reject if session is not found', async () => {
    expect.hasAssertions();
  });

  it('rejects if session_id not a valid ObjectId', async () => {
    expect.hasAssertions();
  });
});

describe('::authAppUser', () => {
  it('returns true iff application-level key matches', async () => {
    expect.hasAssertions();

    await expect(
      Backend.authAppUser({
        usernameOrEmail: 'user1',
        key: dummyAppData.users[0].key
      })
    ).resolves.toBeTrue();

    await expect(
      Backend.authAppUser({ usernameOrEmail: 'user1', key: 'bad' })
    ).resolves.toBeFalse();
  });

  it('returns false if application-level key is empty, null, or undefined', async () => {
    expect.hasAssertions();

    await expect(
      Backend.authAppUser({ usernameOrEmail: 'user1', key: '' })
    ).resolves.toBeFalse();

    await expect(
      Backend.authAppUser({
        usernameOrEmail: 'user1',
        key: null as unknown as string
      })
    ).resolves.toBeFalse();

    await expect(
      Backend.authAppUser({
        usernameOrEmail: 'user1',
        key: undefined as unknown as string
      })
    ).resolves.toBeFalse();
  });
});
