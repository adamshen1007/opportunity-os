import {
  REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE
} from "./fixtures.js";
import type {
  RedditHttpTransport,
  RedditTransportRequest,
  RedditTransportResult
} from "./transport.js";

export type RedditFakeTransport = RedditHttpTransport & {
  readonly kind: "reddit-provider-fake-transport";
  readonly requests: readonly RedditTransportRequest[];
  readonly getRequests: () => readonly RedditTransportRequest[];
};

export type RedditFakeTransportInput = {
  readonly response?: typeof REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE;
};

export function createRedditFakeTransport(
  input: RedditFakeTransportInput = {}
): RedditFakeTransport {
  const requests: RedditTransportRequest[] = [];
  const response = input.response ?? REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE;

  return {
    kind: "reddit-provider-fake-transport",
    requests,
    getRequests: () => [...requests],
    send: <TBody = unknown>(request: RedditTransportRequest): RedditTransportResult<TBody> => {
      requests.push({
        ...request,
        headers: request.headers?.map((header) => ({ ...header }))
      });

      return {
        ok: true,
        response: {
          ...response,
          body: response.body as TBody
        }
      };
    }
  };
}
