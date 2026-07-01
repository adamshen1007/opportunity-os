import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_ENDPOINTS,
  REDDIT_PROVIDER_REDACTED_HEADER_VALUE,
  createRedditProviderRequestDescription
} from "../index.js";
import type {
  RedditProviderEndpoint,
  RedditProviderRequestDescription
} from "../index.js";

const endpoints: readonly RedditProviderEndpoint[] = [
  "posts",
  "comments",
  "subreddits",
  "authors"
];

describe("reddit provider request builder", () => {
  it("supports deterministic request descriptions for all approved endpoints", () => {
    expect(REDDIT_PROVIDER_ENDPOINTS).toEqual(endpoints);

    const descriptions = endpoints.map((endpoint) =>
      createRedditProviderRequestDescription({
        endpoint,
        baseUrl: "https://provider.example",
        filters: {
          subredditName: "typescript",
          authorUsername: "safe_author",
          query: "deterministic"
        },
        pagination: {
          cursor: {
            value: "cursor_001",
            replaySafe: true,
            source: "reddit-pagination"
          },
          limit: 25
        },
        timeoutMs: 5000,
        correlationId: "corr_provider_request"
      })
    );

    expect(descriptions.map((description) => description.operationName)).toEqual([
      "reddit.read.posts",
      "reddit.read.comments",
      "reddit.read.subreddits",
      "reddit.read.authors"
    ]);
    expect(descriptions.map((description) => description.method)).toEqual([
      "GET",
      "GET",
      "GET",
      "GET"
    ]);
    expect(descriptions[0]?.url).toBe(
      "https://provider.example/posts?after=cursor_001&author=safe_author&limit=25&query=deterministic&subreddit=typescript"
    );
  });

  it("redacts auth header values in serialized request descriptions", () => {
    const description: RedditProviderRequestDescription =
      createRedditProviderRequestDescription({
        endpoint: "posts",
        baseUrl: "https://provider.example",
        auth: {
          scheme: "Bearer",
          token: { value: "raw-access-token", sensitive: true }
        },
        correlationId: "corr_provider_secret",
        requestId: "req_provider_secret"
      });
    const serialized = JSON.stringify(description);

    expect(description.headers).toEqual([
      {
        name: "authorization",
        value: `Bearer ${REDDIT_PROVIDER_REDACTED_HEADER_VALUE}`,
        sensitive: true
      }
    ]);
    expect(serialized).not.toContain("raw-access-token");
    expect(serialized).toContain(REDDIT_PROVIDER_REDACTED_HEADER_VALUE);
  });
});
