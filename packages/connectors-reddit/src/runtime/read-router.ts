import type { RedditDataEnvelope } from "../data/index.js";
import type { RedditOperationName } from "../operations/index.js";
import type { RedditFakeProvider } from "./fake-provider.js";
import {
  readRedditFixtureAuthors,
  readRedditFixtureComments,
  readRedditFixturePosts,
  readRedditFixtureSubreddits
} from "./read-envelopes.js";

export function readRedditFixtureOperation(
  provider: RedditFakeProvider,
  operationName: RedditOperationName
): RedditDataEnvelope {
  switch (operationName) {
    case "reddit.read.posts":
      return readRedditFixturePosts(provider);
    case "reddit.read.comments":
      return readRedditFixtureComments(provider);
    case "reddit.read.subreddits":
      return readRedditFixtureSubreddits(provider);
    case "reddit.read.authors":
      return readRedditFixtureAuthors(provider);
  }
}
