import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_FIXTURE_AUTHOR_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_AUTH_LIFECYCLE,
  REDDIT_PROVIDER_FIXTURE_AUTH_STATE,
  REDDIT_PROVIDER_FIXTURE_COMMENT_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_PAGINATION,
  REDDIT_PROVIDER_FIXTURE_POST_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_RATE_LIMIT,
  REDDIT_PROVIDER_FIXTURE_REQUEST,
  REDDIT_PROVIDER_FIXTURE_SAFE_ERROR,
  REDDIT_PROVIDER_FIXTURE_SUBREDDIT_RESPONSE,
  REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE,
  parseRedditProviderResponse
} from "../index.js";

const unsafePattern =
  /raw-token|access-token|refresh-token|client-secret|authorization:\s*bearer|raw-provider-response|raw-payload|credential-value/iu;

describe("reddit provider deterministic fixtures", () => {
  it("covers safe request, response, pagination, rate limit, auth lifecycle, and error fixtures", () => {
    expect(REDDIT_PROVIDER_FIXTURE_REQUEST.endpoint).toBe("posts");
    expect(REDDIT_PROVIDER_FIXTURE_POST_RESPONSE.kind).toBe("posts");
    expect(REDDIT_PROVIDER_FIXTURE_COMMENT_RESPONSE.kind).toBe("comments");
    expect(REDDIT_PROVIDER_FIXTURE_SUBREDDIT_RESPONSE.kind).toBe("subreddits");
    expect(REDDIT_PROVIDER_FIXTURE_AUTHOR_RESPONSE.kind).toBe("authors");
    expect(REDDIT_PROVIDER_FIXTURE_PAGINATION.cursor.nextCursor?.replaySafe).toBe(true);
    expect(REDDIT_PROVIDER_FIXTURE_RATE_LIMIT.window.windowName).toBe("fixture-window");
    expect(REDDIT_PROVIDER_FIXTURE_AUTH_STATE.status).toBe("token-valid");
    expect(REDDIT_PROVIDER_FIXTURE_AUTH_LIFECYCLE.state).toBe("token-valid");
    expect(REDDIT_PROVIDER_FIXTURE_SAFE_ERROR.redditProviderCode).toBe(
      "REDDIT_PROVIDER_TRANSPORT_FAILED"
    );
    expect(REDDIT_PROVIDER_FIXTURE_TRANSPORT_RESPONSE.metadata.safeSource).toBe(
      "fixture-transport"
    );
  });

  it("contains no real tokens or raw provider payloads", () => {
    const serialized = JSON.stringify({
      request: REDDIT_PROVIDER_FIXTURE_REQUEST,
      post: REDDIT_PROVIDER_FIXTURE_POST_RESPONSE,
      comment: REDDIT_PROVIDER_FIXTURE_COMMENT_RESPONSE,
      subreddit: REDDIT_PROVIDER_FIXTURE_SUBREDDIT_RESPONSE,
      author: REDDIT_PROVIDER_FIXTURE_AUTHOR_RESPONSE,
      error: REDDIT_PROVIDER_FIXTURE_SAFE_ERROR
    });

    expect(serialized).not.toMatch(unsafePattern);
    expect(serialized).toContain("[REDACTED]");
  });

  it("parses fixture posts into existing reddit data contracts", () => {
    const parsed = parseRedditProviderResponse(REDDIT_PROVIDER_FIXTURE_POST_RESPONSE);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.envelope.kind).toBe("posts");
    expect(parsed.envelope.metadata.pagination?.cursor.nextCursor?.value).toBe(
      "cursor_next"
    );
    expect(parsed.envelope.metadata.rateLimit?.remaining).toBe(99);
  });
});
