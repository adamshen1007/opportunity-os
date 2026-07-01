import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_POST,
  REDDIT_FIXTURE_PROVIDER_SNAPSHOT,
  createRedditFakeProvider,
  createRedditFixtureProvider
} from "../index.js";

describe("Reddit fake provider", () => {
  it("creates a deterministic fixture provider", () => {
    const provider = createRedditFixtureProvider();

    expect(provider.kind).toBe("reddit-fake-provider");
    expect(provider.getSnapshot()).toEqual(REDDIT_FIXTURE_PROVIDER_SNAPSHOT);
  });

  it("does not mutate the stored provider snapshot when callers mutate copies", () => {
    const provider = createRedditFakeProvider({
      posts: [REDDIT_FAKE_POST],
      comments: [],
      subreddits: [],
      authors: []
    });

    const snapshot = provider.getSnapshot();
    const mutatedPosts = [...snapshot.posts];
    mutatedPosts.pop();

    expect(provider.getSnapshot().posts).toHaveLength(1);
  });
});
