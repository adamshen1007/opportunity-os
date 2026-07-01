import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_AUTHOR,
  REDDIT_FAKE_COMMENT,
  REDDIT_FAKE_POST,
  REDDIT_FAKE_SUBREDDIT,
  parseRedditProviderResponse
} from "../index.js";
import type {
  RedditProviderResponseInput,
  RedditProviderSafeComment,
  RedditProviderSafePost
} from "../index.js";

const { rawMetadata: _postMetadata, ...safePost } = REDDIT_FAKE_POST;
const { metadata: _commentMetadata, ...safeComment } = REDDIT_FAKE_COMMENT;

describe("reddit provider response parser", () => {
  it("maps safe provider posts into reddit data envelopes", () => {
    const input = {
      kind: "posts",
      items: [
        {
          ...safePost,
          safeMetadata: {
            source: "fixture"
          }
        } satisfies RedditProviderSafePost
      ],
      pagination: {
        direction: "forward",
        requestedLimit: 10,
        returnedCount: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      rateLimit: {
        checkedAt: "2026-07-01T00:00:00.000Z",
        limit: 100,
        remaining: 99,
        resetAfterSeconds: 60
      }
    } satisfies RedditProviderResponseInput;

    const result = parseRedditProviderResponse(input);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.envelope.kind).toBe("posts");
    if (result.envelope.kind !== "posts") return;
    expect(result.envelope.items[0]?.rawMetadata).toEqual({
      kind: "safe-raw-metadata-placeholder",
      redacted: true,
      source: "reddit-public-metadata",
      fields: {
        source: "fixture"
      }
    });
    expect(result.envelope.metadata.pagination?.page.itemCount).toBe(1);
    expect(result.envelope.metadata.rateLimit?.remaining).toBe(99);
  });

  it("maps comments, subreddits, and authors without storing provider internals", () => {
    const commentResult = parseRedditProviderResponse({
      kind: "comments",
      items: [safeComment satisfies RedditProviderSafeComment]
    });
    const subredditResult = parseRedditProviderResponse({
      kind: "subreddits",
      items: [REDDIT_FAKE_SUBREDDIT]
    });
    const authorResult = parseRedditProviderResponse({
      kind: "authors",
      items: [REDDIT_FAKE_AUTHOR]
    });
    const serialized = JSON.stringify([commentResult, subredditResult, authorResult]);

    expect(commentResult.ok).toBe(true);
    expect(subredditResult.ok).toBe(true);
    expect(authorResult.ok).toBe(true);
    expect(serialized).not.toContain("raw-token-value");
    expect(serialized).not.toContain("authorization");
  });

  it("rejects malformed provider responses with safe validation failures", () => {
    const result = parseRedditProviderResponse({
      kind: "posts",
      items: [
        {
          id: "post_without_required_safe_fields",
          token: "raw-token-value"
        }
      ]
    });
    const serialized = JSON.stringify(result);

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          code: "reddit-provider-response-malformed",
          path: ["items"],
          safeMessage: "Provider response items are missing required safe fields."
        }
      ]
    });
    expect(serialized).not.toContain("raw-token-value");
  });
});
