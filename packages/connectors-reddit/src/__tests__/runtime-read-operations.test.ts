import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_AUTHOR,
  REDDIT_FAKE_COMMENT,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_POST,
  REDDIT_FAKE_RATE_LIMIT,
  REDDIT_FAKE_SUBREDDIT,
  createRedditFixtureProvider,
  readRedditFixtureAuthors,
  readRedditFixtureComments,
  readRedditFixtureOperation,
  readRedditFixturePosts,
  readRedditFixtureSubreddits
} from "../index.js";

describe("Reddit fixture read operations", () => {
  const provider = createRedditFixtureProvider();

  it("reads posts from fixtures with pagination and rate metadata", () => {
    const envelope = readRedditFixturePosts(provider);

    expect(envelope).toEqual({
      kind: "posts",
      items: [REDDIT_FAKE_POST],
      metadata: {
        pagination: REDDIT_FAKE_PAGINATION,
        rateLimit: REDDIT_FAKE_RATE_LIMIT,
        safeSourceMetadata: {
          source: "fixture"
        }
      }
    });
  });

  it("reads comments from fixtures with pagination and rate metadata", () => {
    const envelope = readRedditFixtureComments(provider);

    expect(envelope.kind).toBe("comments");
    expect(envelope.items).toEqual([REDDIT_FAKE_COMMENT]);
    expect(envelope.metadata.pagination).toEqual(REDDIT_FAKE_PAGINATION);
    expect(envelope.metadata.rateLimit).toEqual(REDDIT_FAKE_RATE_LIMIT);
  });

  it("reads subreddits from fixtures with pagination and rate metadata", () => {
    const envelope = readRedditFixtureSubreddits(provider);

    expect(envelope.kind).toBe("subreddits");
    expect(envelope.items).toEqual([REDDIT_FAKE_SUBREDDIT]);
    expect(envelope.metadata.pagination).toEqual(REDDIT_FAKE_PAGINATION);
    expect(envelope.metadata.rateLimit).toEqual(REDDIT_FAKE_RATE_LIMIT);
  });

  it("reads authors from fixtures with pagination and rate metadata", () => {
    const envelope = readRedditFixtureAuthors(provider);

    expect(envelope.kind).toBe("authors");
    expect(envelope.items).toEqual([REDDIT_FAKE_AUTHOR]);
    expect(envelope.metadata.pagination).toEqual(REDDIT_FAKE_PAGINATION);
    expect(envelope.metadata.rateLimit).toEqual(REDDIT_FAKE_RATE_LIMIT);
  });

  it("routes approved operation names deterministically", () => {
    expect(readRedditFixtureOperation(provider, "reddit.read.posts")).toEqual(
      readRedditFixturePosts(provider)
    );
    expect(readRedditFixtureOperation(provider, "reddit.read.comments")).toEqual(
      readRedditFixtureComments(provider)
    );
    expect(readRedditFixtureOperation(provider, "reddit.read.subreddits")).toEqual(
      readRedditFixtureSubreddits(provider)
    );
    expect(readRedditFixtureOperation(provider, "reddit.read.authors")).toEqual(
      readRedditFixtureAuthors(provider)
    );
  });
});
