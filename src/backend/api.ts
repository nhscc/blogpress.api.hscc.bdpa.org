import { getEnv } from 'universe/backend/env';

import type { PageConfig } from 'next';
import type { IncomingHttpHeaders } from 'node:http';

// ! Since this is imported via jsdom for some tests, beware imports with
// ! respect to https://github.com/jsdom/jsdom/issues/2524.

/**
 * The default app-wide Next.js API configuration object.
 *
 * @see https://nextjs.org/docs/api-routes/api-middlewares#custom-config
 */
export const defaultConfig: PageConfig = {
  api: {
    bodyParser: {
      get sizeLimit() {
        return getEnv().MAX_CONTENT_LENGTH_BYTES;
      }
    }
  }
};

/**
 * Returns the owner token attribute cross-referenced by the
 * `authorizationHeader`.
 */
export async function authorizationHeaderToOwnerAttribute(
  authorizationHeader: Required<IncomingHttpHeaders['authorization']>
) {
  // ? Ensure these are not imported unless and until they're needed thanks to:
  // ? https://github.com/jsdom/jsdom/issues/2524
  const { deriveSchemeAndToken, getAttributes } = await import(
    'multiverse/next-auth'
  );

  const { owner } = await getAttributes({
    target: await deriveSchemeAndToken({
      authString: authorizationHeader
    })
  });

  return owner;
}
