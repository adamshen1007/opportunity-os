import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_AUTHOR,
  REDDIT_FAKE_COMMENT,
  REDDIT_FAKE_CONFIG,
  REDDIT_FAKE_HOST_CONTEXT,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_POST,
  REDDIT_FAKE_RATE_LIMIT,
  REDDIT_FAKE_SUBREDDIT
} from "../index.js";
import type { RedditAssertionHelper, RedditFixtureSet } from "../index.js";

describe("reddit deterministic fixture contracts", () => {
  it("provides deterministic fake data and config without real credentials", () => {
    const fixtures: RedditFixtureSet = {
      post: REDDIT_FAKE_POST,
      comment: REDDIT_FAKE_COMMENT,
      subreddit: REDDIT_FAKE_SUBREDDIT,
      author: REDDIT_FAKE_AUTHOR,
      pagination: REDDIT_FAKE_PAGINATION,
      rateLimit: REDDIT_FAKE_RATE_LIMIT,
      config: REDDIT_FAKE_CONFIG,
      hostContext: REDDIT_FAKE_HOST_CONTEXT
    };

    expect(fixtures.post.id).toBe("post_fixture");
    expect(fixtures.comment.id).toBe("comment_fixture");
    expect(fixtures.subreddit.id).toBe("sub_fixture");
    expect(fixtures.author.id).toBe("author_fixture");
    expect(fixtures.pagination.cursor.nextCursor?.replaySafe).toBe(true);
    expect(fixtures.rateLimit.remaining).toBe(99);
    expect(JSON.stringify(fixtures)).not.toMatch(/real|password|token=|bearer/iu);
  });

  it("defines assertion helper shapes without executable provider calls", () => {
    const helper: RedditAssertionHelper = {
      assertSafeMetadata: (value: unknown) => {
        expect(JSON.stringify(value)).not.toMatch(/password|token=|bearer/iu);
      },
      assertDeterministicFixture: (value: unknown) => {
        expect(value).toBeDefined();
      }
    };

    helper.assertSafeMetadata(REDDIT_FAKE_POST);
    helper.assertDeterministicFixture(REDDIT_FAKE_HOST_CONTEXT);
  });
});
