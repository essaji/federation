import { RequestInit, Headers } from 'apollo-server-env';

// Make this file a module
// See: https://github.com/microsoft/TypeScript/issues/17736
export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveFetched(requestUrl: string, requestOpts?: RequestInit): R;
      toHaveFetchedNth(nthCall: number, requestUrl: string, requestOpts?: RequestInit): R;
    }
  }
}

function prepareHttpOptions(requestUrl: string, requestOpts: RequestInit): RequestInit {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (requestOpts.headers) {
    for (const [name, value] of new Headers(requestOpts.headers)) {
      headers.set(name, value);
    }
  }

  const requestHttp = {
    method: 'POST',
    headers,
    url: requestUrl
  };

  return {
    ...requestHttp,
    body: JSON.stringify(requestOpts.body)
  };

}

function toHaveFetched(
  this: jest.MatcherUtils,
  fetch: jest.SpyInstance,
  requestUrl: string,
  requestOpts: RequestInit = {}
): { message(): string; pass: boolean } {
  const httpOptions = prepareHttpOptions(requestUrl, requestOpts);
  let pass = false;
  let message = () => '';
  try {
    expect(fetch).toBeCalledWith(requestUrl, httpOptions);
    pass = true;
  } catch (e) {
    message = () => e.message;
  }

  return {
    message,
    pass,
  };
}

function toHaveFetchedNth(
  this: jest.MatcherUtils,
  fetch: jest.SpyInstance,
  nthCall: number,
  requestUrl: string,
  requestOpts: RequestInit = {}
): { message(): string; pass: boolean } {
  const httpOptions = prepareHttpOptions(requestUrl, requestOpts);
  let pass = false;
  let message = () => '';
  try {
    expect(fetch).toHaveBeenNthCalledWith(nthCall, requestUrl, httpOptions);
    pass = true;
  } catch (e) {
    message = () => e.message;
  }

  return {
    message,
    pass,
  };
}


expect.extend({
  toHaveFetched,
  toHaveFetchedNth,
});
