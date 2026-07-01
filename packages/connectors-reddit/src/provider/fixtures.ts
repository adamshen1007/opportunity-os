import {
  REDDIT_FAKE_AUTHOR,
  REDDIT_FAKE_COMMENT,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_POST,
  REDDIT_FAKE_RATE_LIMIT,
  REDDIT_FAKE_SUBREDDIT
} from "../testing/index.js";
import {
  type RedditProviderAuthLifecycleSnapshot,
  createRedditProviderAuthLifecycleSnapshot
} from "./auth-lifecycle.js";
import type { RedditAuthState } from "./auth.js";
import {
  createRedditProviderError
} from "./provider-error.js";
import {
  createRedditProviderRequestDescription,
  type RedditProviderRequestDescription
} from "./request-builder.js";
import type { RedditProviderResponseInput } from "./response-parser.js";
import type { RedditTransportResponse } from "./transport.js";

const { rawMetadata: _postMetadata, ...safePost } = REDDIT_FAKE_POST;
const { metadata: _commentMetadata, ...safeComment } = REDDIT_FAKE_COMMENT;

export const REDDIT_PROVIDER_FIXTURE_AUTH_STATE = {
  status: "token-valid",
  token: {
    tokenType: "bearer",
    accessToken: {
      value: "[REDACTED]",
      sensitive: true
    }
  }
} as const satisfies RedditAuthState;

export const REDDIT_PROVIDER_FIXTURE_AUTH_LIFECYCLE =
  createRedditProviderAuthLifecycleSnapshot({
    state: "token-valid",
    checkedAt: "2026-07-01T00:00:00.000Z",
    expiresAt: "2026-07-01T01:00:00.000Z",
    refreshAfter: "2026-07-01T00:50:00.000Z",
    safeMessage: "Provider token is valid."
  }) satisfies RedditProviderAuthLifecycleSnapshot;

export const REDDIT_PROVIDER_FIXTURE_REQUEST =
  createRedditProviderRequestDescription({
    endpoint: "posts",
    baseUrl: "https://provider.example",
    pagination: {
      cursor: REDDIT_FAKE_PAGINATION.cursor.nextCursor,
      limit: 25
    },
    auth: {
      scheme: "Bearer",
      token: {
        value: "[REDACTED]",
        sensitive: true
      }
    },
    timeoutMs: 5000,
    correlationId: "corr_provider_fixture",
    requestId: "req_provider_fixture"
  }) satisfies RedditProviderRequestDescription;

export const REDDIT_PROVIDER_FIXTURE_POST_RESPONSE = {
  kind: "posts",
  items: [
    {
      ...safePost,
      safeMetadata: {
        source: "fixture"
      }
    }
  ],
  pagination: {
    cursor: {
      value: "cursor_current"
    },
    nextCursor: {
      value: "cursor_next"
    },
    direction: "forward",
    requestedLimit: 25,
    returnedCount: 1,
    maximumLimit: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    createdAt: "2026-07-01T00:00:00.000Z"
  },
  rateLimit: {
    checkedAt: "2026-07-01T00:00:00.000Z",
    headers: [
      { name: "x-ratelimit-limit", value: "100" },
      { name: "x-ratelimit-remaining", value: "99" },
      { name: "x-ratelimit-reset", value: "60" }
    ]
  }
} as const satisfies RedditProviderResponseInput;

export const REDDIT_PROVIDER_FIXTURE_COMMENT_RESPONSE = {
  kind: "comments",
  items: [safeComment]
} as const satisfies RedditProviderResponseInput;

export const REDDIT_PROVIDER_FIXTURE_SUBREDDIT_RESPONSE = {
  kind: "subreddits",
  items: [REDDIT_FAKE_SUBREDDIT]
} as const satisfies RedditProviderResponseInput;

export const REDDIT_PROVIDER_FIXTURE_AUTHOR_RESPONSE = {
  kind: "authors",
  items: [REDDIT_FAKE_AUTHOR]
} as const satisfies RedditProviderResponseInput;

export const REDDIT_PROVIDER_FIXTURE_RATE_LIMIT = REDDIT_FAKE_RATE_LIMIT;

export const REDDIT_PROVIDER_FIXTURE_PAGINATION = REDDIT_FAKE_PAGINATION;

export const REDDIT_PROVIDER_FIXTURE_SAFE_ERROR = createRedditProviderError({
  code: "REDDIT_PROVIDER_TRANSPORT_FAILED",
  message: "Provider fixture failure.",
  correlationId: "corr_provider_fixture",
  requestId: "req_provider_fixture"
}).toJSON();

export const REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE = {
  body: REDDIT_PROVIDER_FIXTURE_POST_RESPONSE,
  metadata: {
    status: 200,
    statusText: "OK",
    receivedAt: "2026-07-01T00:00:00.000Z",
    durationMs: 12,
    safeSource: "fixture-transport"
  }
} as const satisfies RedditTransportResponse<RedditProviderResponseInput>;
