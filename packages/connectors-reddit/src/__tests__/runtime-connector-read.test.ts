import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_CONFIG,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_RATE_LIMIT,
  createRedditRuntimeConnector
} from "../index.js";

describe("Reddit runtime connector reads", () => {
  it("exposes deterministic fixture reads through the connector", () => {
    const connector = createRedditRuntimeConnector({
      config: REDDIT_FAKE_CONFIG
    });

    const posts = connector.read("reddit.read.posts");
    const comments = connector.read("reddit.read.comments");
    const subreddits = connector.read("reddit.read.subreddits");
    const authors = connector.read("reddit.read.authors");

    expect(posts.kind).toBe("posts");
    expect(comments.kind).toBe("comments");
    expect(subreddits.kind).toBe("subreddits");
    expect(authors.kind).toBe("authors");
    expect(posts.metadata.pagination).toEqual(REDDIT_FAKE_PAGINATION);
    expect(posts.metadata.rateLimit).toEqual(REDDIT_FAKE_RATE_LIMIT);
  });
});
