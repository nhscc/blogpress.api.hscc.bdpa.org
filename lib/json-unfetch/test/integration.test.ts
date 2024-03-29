/**
 * @jest-environment jsdom
 */
import { createServer, type ServerResponse, type IncomingMessage } from 'node:http';
import { createHttpTerminator } from 'http-terminator';
import { globalJsonRequestOptions, jsonFetch } from 'multiverse/json-unfetch';

let cleanupFn = async () => undefined;

afterAll(async () => cleanupFn());

describe('::jsonFetch', () => {
  it('works', async () => {
    expect.hasAssertions();

    let status = 200;
    let header: Record<string, string> = { 'content-type': 'application/json' };
    let data: unknown = { hello: 'world!' };

    const server = createServer((_req: IncomingMessage, res: ServerResponse) => {
      res.statusCode = status;

      res.setHeader('access-control-allow-origin', '*');
      const headers = Object.entries(header);
      headers.length && res.setHeader(...headers[0]);

      let dat;
      try {
        if (data != '{"broken') {
          dat = JSON.stringify(data);
        }
      } catch {
        dat = data;
      }

      res.end(dat);
    });

    // ? Unlike node-fetch, unfetch keeps connection handles open a while after
    // ? they complete, perhaps for pooling/caching reasons...
    const httpTerminator = createHttpTerminator({ server });
    cleanupFn = async () => void (await httpTerminator.terminate());

    const port = await new Promise<number>((resolve, reject) => {
      server.listen(() => {
        const addr = server.address();
        !addr || typeof addr == 'string'
          ? reject(new Error('assertion failed unexpectedly'))
          : resolve(addr.port);
      });
    });

    const localUrl = `http://localhost:${port}/`;
    let { res, json, error } = await jsonFetch(localUrl);

    expect(res.url).toBe(localUrl);
    expect(json).toStrictEqual(data);
    expect(error).toBeUndefined();

    status = 555;

    ({ res, json, error } = await jsonFetch(localUrl));

    expect(json).toBeUndefined();
    expect(error).toStrictEqual(data);

    status = 200;
    header = {};

    ({ res, json, error } = await jsonFetch(localUrl));

    expect(json).toBeUndefined();
    expect(error).toStrictEqual({});

    await expect(
      jsonFetch(localUrl, { rejectIfNonJsonContentType: true })
    ).rejects.toThrow('without a content-type');

    header = { 'content-type': 'text/unknown' };
    ({ res, json, error } = await jsonFetch(localUrl));

    expect(json).toBeUndefined();
    expect(error).toStrictEqual({});

    await expect(
      jsonFetch(localUrl, { rejectIfNotOk: true, rejectIfNonJsonContentType: true })
    ).rejects.toThrow('"text/unknown"');

    data = { hello: 'world!' };

    await expect(
      jsonFetch(localUrl, { rejectIfNonJsonContentType: true }).catch(
        ({ json }) => json
      )
    ).resolves.toStrictEqual(data);

    header = { 'content-type': 'application/json' };
    status = 666;

    ({ res, json, error } = await jsonFetch(localUrl));

    expect(json).toBeUndefined();
    expect(error).toStrictEqual(data);

    data = {};

    ({ res, json, error } = await jsonFetch(localUrl));

    expect(json).toBeUndefined();
    expect(error).toStrictEqual({});

    globalJsonRequestOptions.rejectIfNotOk = true;

    await expect(jsonFetch(localUrl)).rejects.toThrow('666');

    data = { hello: 'worlds!' };
    status = 201;

    ({ res, json, error } = await jsonFetch(localUrl));

    expect(res.status).toBe(status);
    expect(json).toStrictEqual(data);
    expect(error).toBeUndefined();

    delete globalJsonRequestOptions.rejectIfNotOk;

    header = { 'CONTENT-TYPE': 'application/json' };
    status = 200;

    ({ res, json, error } = await jsonFetch(localUrl));

    expect(res.status).toBe(status);
    expect(json).toStrictEqual(data);
    expect(error).toBeUndefined();

    await expect(
      jsonFetch(localUrl, {
        headers: { 'CONTENT-TYPE': 'application/json' },
        method: 'POST',
        body: { hi: 'world' }
      })
    ).resolves.toBeDefined();

    header = {};
    status = 500;
    data = '{"broken';

    await expect(
      jsonFetch(localUrl, {
        rejectIfNonJsonContentType: true
      })
    ).rejects.toThrow(/without a content-type/);

    ({ res, json, error } = await jsonFetch(localUrl));

    expect(res.status).toBe(status);
    expect(json).toBeUndefined();
    expect(error).toStrictEqual({});

    header = { 'content-type': 'application/json' };

    await expect(jsonFetch(localUrl)).rejects.toThrow(
      /failed to parse response body:/
    );

    await expect(
      jsonFetch(localUrl, {
        rejectIfNonJsonContentType: true,
        rejectIfNotOk: true
      })
    ).rejects.toThrow(/500/);

    await expect(
      jsonFetch(localUrl, {
        rejectIfNonJsonContentType: true
      })
    ).rejects.toThrow(/failed to parse response body:/);

    const badObj = { badObj: {} };
    badObj.badObj = badObj;

    await expect(
      jsonFetch(localUrl, {
        body: badObj
      })
    ).rejects.toThrow(/failed to stringify request body:/);
  });
});
