import type {
  RedditAuthor,
  RedditComment,
  RedditPost,
  RedditSubreddit
} from "../data/index.js";

export type RedditFakeProviderSnapshot = {
  readonly posts: readonly RedditPost[];
  readonly comments: readonly RedditComment[];
  readonly subreddits: readonly RedditSubreddit[];
  readonly authors: readonly RedditAuthor[];
};

export type RedditFakeProvider = {
  readonly kind: "reddit-fake-provider";
  readonly snapshot: RedditFakeProviderSnapshot;
  readonly getSnapshot: () => RedditFakeProviderSnapshot;
};

function cloneSnapshot(
  snapshot: RedditFakeProviderSnapshot
): RedditFakeProviderSnapshot {
  return {
    posts: [...snapshot.posts],
    comments: [...snapshot.comments],
    subreddits: [...snapshot.subreddits],
    authors: [...snapshot.authors]
  };
}

export function createRedditFakeProvider(
  snapshot: RedditFakeProviderSnapshot
): RedditFakeProvider {
  const storedSnapshot = cloneSnapshot(snapshot);

  return {
    kind: "reddit-fake-provider",
    snapshot: cloneSnapshot(storedSnapshot),
    getSnapshot: () => cloneSnapshot(storedSnapshot)
  };
}
