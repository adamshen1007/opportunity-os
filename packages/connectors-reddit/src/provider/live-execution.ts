import type { RedditDataEnvelope } from "../data/index.js";
import type { RedditOAuthCredentials, RedditOAuthToken } from "./auth.js";
import { exchangeRedditOAuthToken } from "./oauth-client.js";
import { createRedditProviderError, type RedditProviderError } from "./provider-error.js";
import { mapRedditLiveListingResponse } from "./live-response-mapper.js";
import { parseRedditProviderResponse } from "./response-parser.js";
import type { RedditHttpTransport, RedditTransportRequest } from "./transport.js";

export type RedditLiveRuntimeContext = {
  readonly correlationId: string;
  readonly requestId?: string;
};

export type RedditLivePublicPostsInput = {
  readonly credentials: RedditOAuthCredentials;
  readonly transport: RedditHttpTransport;
  readonly subreddit: string;
  readonly limit: number;
  readonly tokenEndpoint?: string;
  readonly apiBaseUrl?: string;
  readonly requestedAt: string;
  readonly runtimeContext: RedditLiveRuntimeContext;
  readonly timeoutMs?: number;
};

export type RedditLivePublicPostsResult =
  | {
      readonly ok: true;
      readonly envelope: RedditDataEnvelope;
      readonly token: RedditOAuthToken;
    }
  | {
      readonly ok: false;
      readonly error: RedditProviderError;
    };

function subredditPostsRequest(input: {
  readonly apiBaseUrl: string;
  readonly subreddit: string;
  readonly limit: number;
  readonly token: RedditOAuthToken;
  readonly userAgent: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly timeoutMs?: number;
}): RedditTransportRequest {
  const url = new URL(`/r/${encodeURIComponent(input.subreddit)}/new`, input.apiBaseUrl);
  url.searchParams.set("limit", String(input.limit));
  url.searchParams.sort();

  return {
    method: "GET",
    url: url.toString(),
    headers: [
      {
        name: "authorization",
        value: `Bearer ${input.token.accessToken.value}`,
        sensitive: true
      },
      {
        name: "user-agent",
        value: input.userAgent
      }
    ],
    timeoutMs: input.timeoutMs,
    metadata: {
      correlationId: input.correlationId,
      ...(input.requestId ? { requestId: input.requestId } : {}),
      redditEndpoint: "subreddit-new-posts"
    }
  };
}

function failure(input: {
  readonly message: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly cause?: unknown;
}): RedditLivePublicPostsResult {
  return {
    ok: false,
    error: createRedditProviderError({
      code: "REDDIT_PROVIDER_TRANSPORT_FAILED",
      message: input.message,
      correlationId: input.correlationId,
      requestId: input.requestId,
      cause: input.cause
    })
  };
}

export async function fetchRedditLivePublicPosts(
  input: RedditLivePublicPostsInput
): Promise<RedditLivePublicPostsResult> {
  const tokenResult = await exchangeRedditOAuthToken({
    credentials: input.credentials,
    transport: input.transport,
    tokenEndpoint: input.tokenEndpoint,
    requestedAt: input.requestedAt,
    correlationId: input.runtimeContext.correlationId,
    requestId: input.runtimeContext.requestId,
    timeoutMs: input.timeoutMs
  });

  if (!tokenResult.ok) {
    return {
      ok: false,
      error: tokenResult.error
    };
  }

  const request = subredditPostsRequest({
    apiBaseUrl: input.apiBaseUrl ?? "https://oauth.reddit.com",
    subreddit: input.subreddit,
    limit: input.limit,
    token: tokenResult.token,
    userAgent: input.credentials.userAgent,
    correlationId: input.runtimeContext.correlationId,
    requestId: input.runtimeContext.requestId,
    timeoutMs: input.timeoutMs
  });
  const transportResult = await Promise.resolve(input.transport.send<unknown>(request));

  if (!transportResult.ok) {
    return failure({
      message: transportResult.safeMessage,
      correlationId: input.runtimeContext.correlationId,
      requestId: input.runtimeContext.requestId,
      cause: transportResult
    });
  }

  const mapped = mapRedditLiveListingResponse({
    kind: "posts",
    body: transportResult.response.body,
    headers: transportResult.response.metadata.headers,
    checkedAt: transportResult.response.metadata.receivedAt ?? input.requestedAt,
    requestedLimit: input.limit
  });

  if (!mapped.ok) {
    return failure({
      message: mapped.safeMessage,
      correlationId: input.runtimeContext.correlationId,
      requestId: input.runtimeContext.requestId
    });
  }

  const parsed = parseRedditProviderResponse(mapped.response);
  if (!parsed.ok) {
    return failure({
      message: "Reddit live response could not be mapped into safe provider contracts.",
      correlationId: input.runtimeContext.correlationId,
      requestId: input.runtimeContext.requestId,
      cause: parsed
    });
  }

  return {
    ok: true,
    envelope: parsed.envelope,
    token: tokenResult.token
  };
}
