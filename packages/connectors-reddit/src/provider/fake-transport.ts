import {
  REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE
} from "./fixtures.js";
import type {
  RedditHttpTransport,
  RedditTransportRequest,
  RedditTransportResponse,
  RedditTransportResult
} from "./transport.js";

export type RedditFakeTransport = RedditHttpTransport & {
  readonly kind: "reddit-provider-fake-transport";
  readonly requests: readonly RedditTransportRequest[];
  readonly getRequests: () => readonly RedditTransportRequest[];
};

export type RedditFakeTransportInput = {
  readonly response?: RedditTransportResponse<unknown>;
};

function recordSafeRequest(request: RedditTransportRequest): RedditTransportRequest {
  return {
    ...request,
    headers: request.headers?.map((header) => ({
      ...header,
      value: header.sensitive ? "[REDACTED]" : header.value
    }))
  };
}

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
      requests.push(recordSafeRequest(request));

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
