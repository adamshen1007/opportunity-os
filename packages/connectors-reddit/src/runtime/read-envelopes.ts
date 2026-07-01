import type {
  RedditAuthor,
  RedditComment,
  RedditDataEnvelope,
  RedditDataEnvelopeMetadata,
  RedditPost,
  RedditSubreddit
} from "../data/index.js";
import {
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_RATE_LIMIT
} from "../testing/index.js";
import type { RedditFakeProvider } from "./fake-provider.js";

export const REDDIT_FIXTURE_ENVELOPE_METADATA = {
  pagination: REDDIT_FAKE_PAGINATION,
  rateLimit: REDDIT_FAKE_RATE_LIMIT,
  safeSourceMetadata: {
    source: "fixture"
  }
} as const satisfies RedditDataEnvelopeMetadata;

export function readRedditFixturePosts(
  provider: RedditFakeProvider
): Extract<RedditDataEnvelope, { readonly kind: "posts" }> {
  return {
    kind: "posts",
    items: provider.getSnapshot().posts as readonly RedditPost[],
    metadata: REDDIT_FIXTURE_ENVELOPE_METADATA
  };
}

export function readRedditFixtureComments(
  provider: RedditFakeProvider
): Extract<RedditDataEnvelope, { readonly kind: "comments" }> {
  return {
    kind: "comments",
    items: provider.getSnapshot().comments as readonly RedditComment[],
    metadata: REDDIT_FIXTURE_ENVELOPE_METADATA
  };
}

export function readRedditFixtureSubreddits(
  provider: RedditFakeProvider
): Extract<RedditDataEnvelope, { readonly kind: "subreddits" }> {
  return {
    kind: "subreddits",
    items: provider.getSnapshot().subreddits as readonly RedditSubreddit[],
    metadata: REDDIT_FIXTURE_ENVELOPE_METADATA
  };
}

export function readRedditFixtureAuthors(
  provider: RedditFakeProvider
): Extract<RedditDataEnvelope, { readonly kind: "authors" }> {
  return {
    kind: "authors",
    items: provider.getSnapshot().authors as readonly RedditAuthor[],
    metadata: REDDIT_FIXTURE_ENVELOPE_METADATA
  };
}
