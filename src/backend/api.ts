import { getEnv } from 'universe/backend/env';
import { deriveSchemeAndToken, getAttributes } from 'multiverse/next-auth';

import type { PageConfig } from 'next';
import type { IncomingHttpHeaders } from 'node:http';

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
  const { owner } = await getAttributes({
    target: await deriveSchemeAndToken({
      authString: authorizationHeader
    })
  });

  return owner;
}
