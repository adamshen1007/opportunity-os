import {
  REDDIT_FAKE_AUTHOR,
  REDDIT_FAKE_COMMENT,
  REDDIT_FAKE_POST,
  REDDIT_FAKE_SUBREDDIT
} from "../testing/index.js";
import {
  createRedditFakeProvider,
  type RedditFakeProvider,
  type RedditFakeProviderSnapshot
} from "./fake-provider.js";

export const REDDIT_FIXTURE_PROVIDER_SNAPSHOT = {
  posts: [REDDIT_FAKE_POST],
  comments: [REDDIT_FAKE_COMMENT],
  subreddits: [REDDIT_FAKE_SUBREDDIT],
  authors: [REDDIT_FAKE_AUTHOR]
} as const satisfies RedditFakeProviderSnapshot;

export function createRedditFixtureProvider(): RedditFakeProvider {
  return createRedditFakeProvider(REDDIT_FIXTURE_PROVIDER_SNAPSHOT);
}
