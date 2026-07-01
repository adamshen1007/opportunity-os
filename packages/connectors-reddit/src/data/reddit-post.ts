import type { RedditAuthorReference } from "./reddit-author.js";
import type {
  RedditSafeRawMetadataPlaceholder,
  RedditStableId,
  RedditTimestamp
} from "./reddit-shared.js";
import type { RedditSubredditReference } from "./reddit-subreddit.js";

export type RedditPostScoreMetadata = {
  readonly score?: number;
  readonly upvoteRatio?: number;
  readonly isScoreHidden?: boolean;
};

export type RedditPost = {
  readonly id: RedditStableId;
  readonly subreddit: RedditSubredditReference;
  readonly author: RedditAuthorReference;
  readonly title: string;
  readonly bodyText?: string;
  readonly permalink: string;
  readonly score: RedditPostScoreMetadata;
  readonly timestamps: {
    readonly createdAt?: RedditTimestamp;
    readonly updatedAt?: RedditTimestamp;
    readonly editedAt?: RedditTimestamp;
  };
  readonly rawMetadata: RedditSafeRawMetadataPlaceholder;
};
