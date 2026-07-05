import type { RedditOAuthToken } from "./auth.js";
import type {
  RedditApiClient,
  RedditApiClientContext,
  RedditApiClientRequest,
  RedditApiClientResult
} from "./api-client.js";
import { createRedditProviderRequestDescription } from "./request-builder.js";
import type { RedditTransportHeader, RedditTransportRequest } from "./transport.js";

export type RedditLiveApiClientInput = RedditApiClientContext & {
  readonly token: RedditOAuthToken;
};

function injectBearerToken(
  request: RedditTransportRequest,
  token: RedditOAuthToken
): RedditTransportRequest {
  const headers: RedditTransportHeader[] = [
    ...(request.headers?.filter((header) => header.name.toLowerCase() !== "authorization") ?? []),
    {
      name: "authorization",
      value: `Bearer ${token.accessToken.value}`,
      sensitive: true
    }
  ];

  return {
    ...request,
    headers
  };
}

export function createRedditLiveApiClient(input: RedditLiveApiClientInput): RedditApiClient {
  return {
    context: input,
    describe: createRedditProviderRequestDescription,
    execute: async <TBody = unknown>(
      request: RedditApiClientRequest
    ): Promise<RedditApiClientResult<TBody>> => {
      const result = await Promise.resolve(
        input.transport.send<TBody>(injectBearerToken(request.description, input.token))
      );

      return {
        ...result,
        description: request.description
      };
    }
  };
}
