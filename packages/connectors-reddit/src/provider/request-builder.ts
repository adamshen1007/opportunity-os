import type { RedditCursorValue } from "../data/index.js";
import type { RedditOperationName, RedditReadOperationFilters } from "../operations/index.js";
import type { RedditSensitiveAuthValue } from "./auth.js";
import type { RedditTransportHeader, RedditTransportRequest } from "./transport.js";

export const REDDIT_PROVIDER_ENDPOINTS = [
  "posts",
  "comments",
  "subreddits",
  "authors"
] as const;

export const REDDIT_PROVIDER_REDACTED_HEADER_VALUE = "[REDACTED]" as const;

export type RedditProviderEndpoint = (typeof REDDIT_PROVIDER_ENDPOINTS)[number];

export type RedditProviderAuthHeaderInput = {
  readonly scheme: "Bearer";
  readonly token: RedditSensitiveAuthValue;
};

export type RedditProviderPaginationInput = {
  readonly cursor?: RedditCursorValue;
  readonly limit?: number;
};

export type RedditProviderRequestBuilderInput = {
  readonly endpoint: RedditProviderEndpoint;
  readonly baseUrl: string;
  readonly filters?: RedditReadOperationFilters;
  readonly pagination?: RedditProviderPaginationInput;
  readonly auth?: RedditProviderAuthHeaderInput;
  readonly timeoutMs?: number;
  readonly correlationId: string;
  readonly requestId?: string;
};

export type RedditProviderRequestDescription = RedditTransportRequest & {
  readonly endpoint: RedditProviderEndpoint;
  readonly operationName: RedditOperationName;
};

const endpointOperationNames: Record<RedditProviderEndpoint, RedditOperationName> = {
  posts: "reddit.read.posts",
  comments: "reddit.read.comments",
  subreddits: "reddit.read.subreddits",
  authors: "reddit.read.authors"
};

const endpointPaths: Record<RedditProviderEndpoint, string> = {
  posts: "/posts",
  comments: "/comments",
  subreddits: "/subreddits",
  authors: "/authors"
};

function appendQuery(url: URL, key: string, value: string | number | undefined): void {
  if (value !== undefined && value !== "") {
    url.searchParams.set(key, String(value));
  }
}

function buildHeaders(auth: RedditProviderAuthHeaderInput | undefined): readonly RedditTransportHeader[] {
  if (!auth) return [];

  return [
    {
      name: "authorization",
      value: `${auth.scheme} ${REDDIT_PROVIDER_REDACTED_HEADER_VALUE}`,
      sensitive: true
    }
  ];
}

export function createRedditProviderRequestDescription(
  input: RedditProviderRequestBuilderInput
): RedditProviderRequestDescription {
  const url = new URL(endpointPaths[input.endpoint], input.baseUrl);

  appendQuery(url, "after", input.pagination?.cursor?.value);
  appendQuery(url, "limit", input.pagination?.limit);
  appendQuery(url, "author", input.filters?.authorUsername);
  appendQuery(url, "query", input.filters?.query);
  appendQuery(url, "subreddit", input.filters?.subredditName);
  url.searchParams.sort();

  return {
    endpoint: input.endpoint,
    operationName: endpointOperationNames[input.endpoint],
    method: "GET",
    url: url.toString(),
    headers: buildHeaders(input.auth),
    timeoutMs: input.timeoutMs,
    metadata: {
      correlationId: input.correlationId,
      ...(input.requestId ? { requestId: input.requestId } : {})
    }
  };
}
