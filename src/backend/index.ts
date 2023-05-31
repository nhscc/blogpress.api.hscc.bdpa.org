import assert from 'node:assert';
import { MongoServerError, ObjectId } from 'mongodb';
import { toss } from 'toss-expression';

import { getEnv } from 'universe/backend/env';

import {
  ErrorMessage,
  GuruMeditationError,
  InvalidItemError,
  ItemNotFoundError,
  ValidationError
} from 'universe/error';

import {
  type Email,
  type UserId,
  type BlogId,
  type SessionId,
  type Username,
  type NewUser,
  type NewPage,
  type PatchUser,
  type PatchPage,
  type PatchBlog,
  type InternalUser,
  type InternalPage,
  type InternalSession,
  type InternalInfo,
  type PublicUser,
  type PublicBlog,
  type PublicPage,
  type PublicInfo,
  type PublicPageMetadata,
  type TokenAttributeOwner,
  userTypes,
  toPublicUser,
  toPublicPage,
  publicUserProjection,
  publicPageProjection,
  publicBlogProjection,
  publicPageMetadataProjection
} from 'universe/backend/db';

import { isPlainObject } from 'multiverse/is-plain-object';
import { getDb } from 'multiverse/mongo-schema';
import { itemExists, itemToObjectId } from 'multiverse/mongo-item';

const emailRegex = /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/i;
const usernameRegex = /^[\d_a-z-]+$/;
const alphanumericRegex = /^[\w-]+$/i;
const hexadecimalRegex = /^[\dA-Fa-f]+$/;
const hrefRegex = /^(\/\/|[\w-])/i;

/**
 * Validate a username string for correctness.
 */
function isValidUsername(username: unknown): username is Username {
  return (
    typeof username == 'string' &&
    usernameRegex.test(username) &&
    username.length >= getEnv().MIN_USER_NAME_LENGTH &&
    username.length <= getEnv().MAX_USER_NAME_LENGTH
  );
}

/**
 * Validate a new or patch user data object.
 */
function validateGenericUserData(
  data: NewUser | PatchUser | undefined,
  { required }: { required: boolean }
): asserts data is NewUser | PatchUser {
  if (!isPlainObject(data)) {
    throw new ValidationError(ErrorMessage.InvalidJSON());
  }

  const {
    USER_KEY_LENGTH,
    USER_SALT_LENGTH,
    MIN_USER_EMAIL_LENGTH,
    MAX_USER_EMAIL_LENGTH
  } = getEnv();

  if (
    (required || (!required && data.email !== undefined)) &&
    (typeof data.email != 'string' ||
      !emailRegex.test(data.email) ||
      data.email.length < MIN_USER_EMAIL_LENGTH ||
      data.email.length > MAX_USER_EMAIL_LENGTH)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength(
        'email',
        MIN_USER_EMAIL_LENGTH,
        MAX_USER_EMAIL_LENGTH,
        'string'
      )
    );
  }

  if (
    (required || (!required && data.salt !== undefined)) &&
    (typeof data.salt != 'string' ||
      !hexadecimalRegex.test(data.salt) ||
      data.salt.length != USER_SALT_LENGTH)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength('salt', USER_SALT_LENGTH, null, 'hexadecimal')
    );
  }

  if (
    (required || (!required && data.key !== undefined)) &&
    (typeof data.key != 'string' ||
      !hexadecimalRegex.test(data.key) ||
      data.key.length != USER_KEY_LENGTH)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength('key', USER_KEY_LENGTH, null, 'hexadecimal')
    );
  }
}

/**
 * Validate a patch blog data object.
 */
function validatePatchBlogData(
  data: PatchBlog | undefined
): asserts data is PatchBlog {
  if (!isPlainObject(data)) {
    throw new ValidationError(ErrorMessage.InvalidJSON());
  }

  const {
    MAX_BLOG_PAGE_NAME_LENGTH,
    MAX_NAV_LINK_HREF_LENGTH,
    MAX_NAV_LINK_TEXT_LENGTH
  } = getEnv();

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.length < 1 ||
    data.name.length > MAX_BLOG_PAGE_NAME_LENGTH ||
    !alphanumericRegex.test(data.name)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength(
        'name',
        1,
        MAX_BLOG_PAGE_NAME_LENGTH,
        'alphanumeric'
      )
    );
  }

  if (
    !data.rootPage ||
    typeof data.rootPage !== 'string' ||
    data.rootPage.length < 1 ||
    data.rootPage.length > MAX_BLOG_PAGE_NAME_LENGTH ||
    !alphanumericRegex.test(data.rootPage)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength(
        'rootPage',
        1,
        MAX_BLOG_PAGE_NAME_LENGTH,
        'alphanumeric'
      )
    );
  }

  if (!data.navLinks || !Array.isArray(data.navLinks)) {
    throw new ValidationError(ErrorMessage.InvalidFieldValue('navLinks'));
  }

  for (const link of data.navLinks) {
    if (!link || !isPlainObject(data.navLinks) || Object.keys(link).length !== 2) {
      throw new ValidationError(
        ErrorMessage.InvalidArrayValue('navLinks', data.navLinks.toString())
      );
    }

    if (
      typeof link.href !== 'string' ||
      !link.href ||
      link.href.length > MAX_NAV_LINK_HREF_LENGTH ||
      !hrefRegex.test(link.href)
    ) {
      throw new ValidationError(
        ErrorMessage.InvalidObjectKeyValue('navLink.href', link.href)
      );
    }

    if (
      typeof link.text !== 'string' ||
      !link.text ||
      link.text.length > MAX_NAV_LINK_TEXT_LENGTH
    ) {
      throw new ValidationError(
        ErrorMessage.InvalidObjectKeyValue('navLink.text', link.text)
      );
    }
  }
}

/**
 * Validate a new or patch page data object.
 */
function validateGenericPageData(
  data: NewPage | PatchPage | undefined,
  { required }: { required: boolean }
): asserts data is NewPage | PatchPage {
  if (!isPlainObject(data)) {
    throw new ValidationError(ErrorMessage.InvalidJSON());
  }

  const { MAX_BLOG_PAGE_CONTENTS_LENGTH_BYTES: maxBlogPageContentsLengthBytes } =
    getEnv();

  if (
    (required || (!required && data.contents !== undefined)) &&
    (typeof data.contents != 'string' ||
      data.contents.length > maxBlogPageContentsLengthBytes)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength(
        'contents',
        0,
        maxBlogPageContentsLengthBytes,
        'string'
      )
    );
  }
}

/**
 * Transforms a username-or-email string into a user object.
 */
async function usernameOrEmailParamToUser<T extends InternalUser>(
  usernameOrEmail: Username | Email | undefined
): Promise<T>;
async function usernameOrEmailParamToUser<T extends PublicUser | PublicBlog>(
  usernameOrEmail: Username | Email | undefined,
  projection: object
): Promise<T>;
async function usernameOrEmailParamToUser<
  T extends InternalUser | PublicUser | PublicBlog
>(usernameOrEmail: Username | Email | undefined, projection?: object): Promise<T> {
  if (!usernameOrEmail) {
    throw new InvalidItemError('usernameOrEmail', 'parameter');
  }

  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');

  const user = await userDb.findOne<T>(
    {
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    },
    { projection }
  );

  if (!user) {
    throw new ItemNotFoundError(usernameOrEmail, 'user');
  }

  return user;
}

async function blogNameToUser<T extends InternalUser>(
  blogName: string | undefined
): Promise<T>;
async function blogNameToUser<T extends PublicUser | PublicBlog>(
  blogName: string | undefined,
  projection: object
): Promise<T>;
async function blogNameToUser<T extends InternalUser | PublicUser | PublicBlog>(
  blogName: string | undefined,
  projection?: object
): Promise<T> {
  if (!blogName) {
    throw new InvalidItemError('blogName', 'parameter');
  }

  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');
  const user = await userDb.findOne<T>({ blogName }, { projection });

  if (!user) {
    throw new ItemNotFoundError(blogName, 'blog');
  }

  return user;
}

async function pageNameToPage<T extends InternalPage>(
  pageName: string | undefined,
  blog_id: BlogId
): Promise<T>;
async function pageNameToPage<T extends PublicPage | PublicPageMetadata>(
  pageName: string | undefined,
  blog_id: BlogId,
  projection: object
): Promise<T>;
async function pageNameToPage<
  T extends InternalPage | PublicPage | PublicPageMetadata
>(pageName: string | undefined, blog_id: BlogId, projection?: object): Promise<T> {
  if (!pageName) {
    throw new InvalidItemError('pageName', 'parameter');
  }

  const db = await getDb({ name: 'app' });
  const pageDb = db.collection<InternalPage>('pages');
  const page = await pageDb.findOne<T>({ blog_id, name: pageName }, { projection });

  if (!page) {
    throw new ItemNotFoundError(pageName, 'page');
  }

  return page;
}

export async function getAllUsers({
  after_id
}: {
  after_id: string | undefined;
}): Promise<PublicUser[]> {
  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');
  const afterId = after_id ? itemToObjectId<UserId>(after_id) : undefined;

  if (afterId && !(await itemExists(userDb, afterId))) {
    throw new ItemNotFoundError(after_id, 'user_id');
  }

  return (
    userDb
      // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
      .find<PublicUser>(afterId ? { _id: { $lt: afterId } } : {}, {
        projection: publicUserProjection,
        limit: getEnv().RESULTS_PER_PAGE,
        sort: { _id: -1 }
      })
      .toArray()
  );
}

export async function getBlogPagesMetadata({
  blogName
}: {
  blogName: string | undefined;
}): Promise<PublicPageMetadata[]> {
  const db = await getDb({ name: 'app' });
  const pageDb = db.collection<InternalPage>('pages');
  const { _id: blog_id } = await blogNameToUser(blogName);

  return pageDb
    .find<PublicPage>(
      { blog_id },
      {
        projection: publicPageMetadataProjection,
        limit: getEnv().RESULTS_PER_PAGE,
        sort: { _id: -1 }
      }
    )
    .toArray();
}

export async function getUser({
  usernameOrEmail
}: {
  usernameOrEmail: Username | Email | undefined;
}): Promise<PublicUser> {
  return usernameOrEmailParamToUser(usernameOrEmail, publicUserProjection);
}

export async function getBlog({
  blogName
}: {
  blogName: string | undefined;
}): Promise<PublicBlog> {
  return blogNameToUser(blogName, publicBlogProjection);
}

export async function getPage({
  blogName,
  pageName
}: {
  blogName: string | undefined;
  pageName: string | undefined;
}): Promise<PublicPage> {
  const { _id: blog_id } = await blogNameToUser(blogName);
  return pageNameToPage(pageName, blog_id, publicPageProjection);
}

export async function getInfo(): Promise<PublicInfo> {
  const db = await getDb({ name: 'app' });
  const infoDb = db.collection<InternalInfo>('info');

  return (
    (await infoDb.findOne<PublicInfo>({}, { projection: { _id: false } })) ||
    toss(new GuruMeditationError('system info is missing'))
  );
}

export async function getPageSessionsCount({
  blogName,
  pageName
}: {
  blogName: string | undefined;
  pageName: string | undefined;
}): Promise<number> {
  const { _id: blog_id } = await blogNameToUser(blogName);
  const { _id: page_id } = await pageNameToPage(pageName, blog_id);

  const db = await getDb({ name: 'app' });
  const sessionDb = db.collection<InternalSession>('sessions');

  return sessionDb.countDocuments({
    blog_id,
    page_id
  });
}

export async function createUser({
  data,
  $provenance
}: {
  data: NewUser | undefined;
  $provenance: TokenAttributeOwner;
}): Promise<PublicUser> {
  validateGenericUserData(data, { required: true });

  if (!data.type || !userTypes.includes(data.type)) {
    throw new ValidationError(
      ErrorMessage.InvalidFieldValue('type', undefined, userTypes)
    );
  }

  const { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH, MAX_BLOG_NAME_LENGTH } =
    getEnv();

  if (data.username && !isValidUsername(data.username)) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength(
        'username',
        MIN_USER_NAME_LENGTH,
        MAX_USER_NAME_LENGTH,
        'lowercase alphanumeric'
      )
    );
  }

  if (data.type === 'administrator' && data.blogName) {
    throw new ValidationError(ErrorMessage.UnknownField('blogName'));
  } else if (
    data.type === 'blogger' &&
    (!data.blogName ||
      !alphanumericRegex.test(data.blogName) ||
      data.blogName.length < 1 ||
      data.blogName.length > MAX_BLOG_NAME_LENGTH)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength(
        'blogName',
        1,
        MAX_BLOG_NAME_LENGTH,
        'alphanumeric'
      )
    );
  }

  const { email, username, key, salt, type, blogName, ...rest } =
    data as Required<NewUser>;
  const restKeys = Object.keys(rest);

  if (restKeys.length != 0) {
    throw new ValidationError(ErrorMessage.UnknownField(restKeys[0]));
  }

  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');

  if (username && (await itemExists(userDb, { key: 'username', id: username }))) {
    throw new ValidationError(ErrorMessage.DuplicateFieldValue('username'));
  }

  if (blogName && (await itemExists(userDb, { key: 'blogName', id: blogName }))) {
    throw new ValidationError(ErrorMessage.DuplicateFieldValue('blogName'));
  }

  const newUser: InternalUser = Object.assign(
    {
      _id: new ObjectId(),
      $provenance,
      username,
      salt: salt.toLowerCase(),
      email,
      key: key.toLowerCase()
    },
    type === 'administrator'
      ? { type: 'administrator' as const }
      : {
          type: 'blogger' as const,
          createdAt: Date.now(),
          blogName,
          blogRootPage: 'home',
          banned: false,
          navLinks: [{ href: 'home', text: 'home' }]
        }
  );

  // * At this point, we can finally trust this data is valid and not malicious
  try {
    await userDb.insertOne(newUser);
  } catch (error) {
    /* istanbul ignore else */
    if (
      error instanceof MongoServerError &&
      error.code == 11_000 &&
      error.keyPattern?.email !== undefined
    ) {
      throw new ValidationError(ErrorMessage.DuplicateFieldValue('email'));
    }

    /* istanbul ignore next */
    throw error;
  }

  return toPublicUser(newUser);
}

export async function createPage({
  blogName,
  data,
  $provenance
}: {
  blogName: string | undefined;
  data: NewPage | undefined;
  $provenance: TokenAttributeOwner;
}): Promise<PublicPage> {
  validateGenericPageData(data, { required: true });

  const { MAX_BLOG_PAGE_NAME_LENGTH, MAX_USER_BLOG_PAGES } = getEnv();

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.length < 1 ||
    data.name.length > MAX_BLOG_PAGE_NAME_LENGTH ||
    !alphanumericRegex.test(data.name)
  ) {
    throw new ValidationError(
      ErrorMessage.InvalidStringLength(
        'name',
        1,
        MAX_BLOG_PAGE_NAME_LENGTH,
        'alphanumeric'
      )
    );
  }

  const { name, contents, ...rest } = data as Required<NewPage>;
  const restKeys = Object.keys(rest);

  if (restKeys.length != 0) {
    throw new ValidationError(ErrorMessage.UnknownField(restKeys[0]));
  }

  const db = await getDb({ name: 'app' });
  const pageDb = db.collection<InternalPage>('pages');
  const { _id: blog_id } = await blogNameToUser(blogName);
  const numOfPages = await pageDb.countDocuments({ blog_id });

  if (numOfPages >= MAX_USER_BLOG_PAGES) {
    throw new ValidationError(ErrorMessage.TooManyPages());
  }

  const newPage: InternalPage = {
    _id: new ObjectId(),
    $provenance,
    blog_id,
    name,
    contents,
    createdAt: Date.now(),
    totalViews: 0
  };

  // * At this point, we can finally trust this data is valid and not malicious
  try {
    await pageDb.insertOne(newPage);
  } catch (error) {
    /* istanbul ignore else */
    if (error instanceof MongoServerError && error.code == 11_000) {
      throw new ValidationError(ErrorMessage.DuplicateFieldValue('name'));
    }

    /* istanbul ignore next */
    throw error;
  }

  return toPublicPage(newPage);
}

export async function createSession({
  blogName,
  pageName,
  $provenance
}: {
  blogName: string | undefined;
  pageName: string | undefined;
  $provenance: TokenAttributeOwner;
}): Promise<SessionId> {
  const db = await getDb({ name: 'app' });
  const sessionDb = db.collection<InternalSession>('sessions');
  const { _id: blog_id } = await blogNameToUser(blogName);
  const { _id: page_id } = await pageNameToPage(pageName, blog_id);

  const newSession: InternalSession = {
    _id: new ObjectId(),
    $provenance,
    blog_id,
    page_id,
    lastRenewedDate: new Date()
  };

  // * At this point, we can finally trust this data is valid and not malicious
  await sessionDb.insertOne(newSession);
  return newSession._id;
}

export async function updateUser({
  usernameOrEmail,
  data
}: {
  usernameOrEmail: Username | Email | undefined;
  data: PatchUser | undefined;
}): Promise<void> {
  const { _id: user_id, type } = await usernameOrEmailParamToUser(usernameOrEmail);

  // ? Optimization
  if (data && !Object.keys(data).length) return;

  validateGenericUserData(data, { required: false });

  if (data.banned !== undefined) {
    if (type === 'administrator') {
      throw new ValidationError(ErrorMessage.UnknownField('banned'));
    } else if (typeof data.banned !== 'boolean') {
      throw new ValidationError(
        ErrorMessage.InvalidFieldValue('banned', data.banned, ['true', 'false'])
      );
    }
  }

  const { email, key, salt, banned, ...rest } = data;
  const restKeys = Object.keys(rest);

  if (restKeys.length != 0) {
    throw new ValidationError(ErrorMessage.UnknownField(restKeys[0]));
  }

  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');

  // * At this point, we can finally trust this data is not malicious, but not
  // * necessarily valid...
  try {
    const result = await userDb.updateOne(
      { _id: user_id },
      {
        $set: {
          ...(email ? { email } : {}),
          ...(salt ? { salt: salt.toLowerCase() } : {}),
          ...(key ? { key: key.toLowerCase() } : {}),
          ...(typeof banned === 'boolean' ? { banned } : {})
        }
      }
    );

    assert(result.matchedCount === 1);
  } catch (error) {
    if (
      error instanceof MongoServerError &&
      error.code == 11_000 &&
      error.keyPattern?.email !== undefined
    ) {
      throw new ValidationError(ErrorMessage.DuplicateFieldValue('email'));
    }

    throw error;
  }
}

export async function updateBlog({
  blogName,
  data
}: {
  blogName: string | undefined;
  data: PatchBlog | undefined;
}): Promise<void> {
  const { _id: blog_id } = await blogNameToUser(blogName);

  // ? Optimization
  if (data && !Object.keys(data).length) return;

  validatePatchBlogData(data);

  const { name, rootPage, navLinks, ...rest } = data;
  const restKeys = Object.keys(rest);

  if (restKeys.length != 0) {
    throw new ValidationError(ErrorMessage.UnknownField(restKeys[0]));
  }

  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');

  // * At this point, we can finally trust this data is valid and not malicious
  const result = await userDb.updateOne(
    { _id: blog_id },
    {
      ...(name ? { $set: { blogName: name } } : {}),
      ...(rootPage ? { $set: { blogRootPage: rootPage } } : {}),
      ...(navLinks ? { $set: { navLinks } } : {})
    }
  );

  assert(result.matchedCount === 1);
}

export async function updatePage({
  blogName,
  pageName,
  data
}: {
  blogName: string | undefined;
  pageName: string | undefined;
  data: PatchPage | undefined;
}): Promise<void> {
  const { _id: blog_id } = await blogNameToUser(blogName);
  const { _id: page_id } = await pageNameToPage(pageName, blog_id);

  // ? Optimization
  if (data && !Object.keys(data).length) return;

  validateGenericPageData(data, { required: false });

  if (data.totalViews !== undefined && data.totalViews !== 'increment') {
    throw new ValidationError(
      ErrorMessage.InvalidFieldValue('totalViews', data.totalViews, ['increment'])
    );
  }

  const { totalViews, contents, ...rest } = data;
  const restKeys = Object.keys(rest);

  if (restKeys.length != 0) {
    throw new ValidationError(ErrorMessage.UnknownField(restKeys[0]));
  }

  const db = await getDb({ name: 'app' });
  const pageDb = db.collection<InternalPage>('pages');

  // * At this point, we can finally trust this data is valid and not malicious
  const result = await pageDb.updateOne(
    { _id: page_id },
    {
      ...(contents !== undefined ? { $set: { contents } } : {}),
      ...(!!totalViews ? { $inc: { totalViews: 1 } } : {})
    }
  );

  assert(result.matchedCount === 1);
}

export async function renewSession({
  session_id
}: {
  session_id: string | undefined;
}): Promise<void> {
  const db = await getDb({ name: 'app' });
  const sessionDb = db.collection<InternalSession>('sessions');

  // * At this point, we can finally trust this data is valid and not malicious
  const result = await sessionDb.updateOne(
    { _id: itemToObjectId(session_id) },
    { $set: { lastRenewedDate: new Date() } }
  );

  if (result.matchedCount !== 1) {
    throw new ItemNotFoundError(session_id, 'session');
  }
}

export async function deleteUser({
  usernameOrEmail
}: {
  usernameOrEmail: Username | Email | undefined;
}): Promise<void> {
  const { _id: user_id } = await usernameOrEmailParamToUser(usernameOrEmail);

  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');
  const result = await userDb.deleteOne({ _id: user_id });

  assert(result.deletedCount === 1);
}

export async function deletePage({
  blogName,
  pageName
}: {
  blogName: string | undefined;
  pageName: string | undefined;
}): Promise<void> {
  const { _id: blog_id } = await blogNameToUser(blogName);
  const { _id: page_id } = await pageNameToPage(pageName, blog_id);

  const db = await getDb({ name: 'app' });
  const pageDb = db.collection<InternalPage>('pages');
  const result = await pageDb.deleteOne({ _id: page_id });

  assert(result.deletedCount === 1);
}

export async function deleteSession({
  session_id
}: {
  session_id: string | undefined;
}): Promise<void> {
  const db = await getDb({ name: 'app' });
  const sessionDb = db.collection<InternalSession>('sessions');
  const result = await sessionDb.deleteOne({ _id: itemToObjectId(session_id) });

  assert(result.deletedCount === 1);
}

export async function authAppUser({
  usernameOrEmail,
  key
}: {
  usernameOrEmail: Username | Email | undefined;
  key: string | undefined;
}): Promise<boolean> {
  if (!key || !usernameOrEmail) return false;

  const db = await getDb({ name: 'app' });
  const userDb = db.collection<InternalUser>('users');

  return !!(await userDb.countDocuments({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    key
  }));
}
