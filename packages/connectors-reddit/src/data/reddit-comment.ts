import type { RedditAuthorReference } from "./reddit-author.js";
import type {
  RedditSafeRawMetadataPlaceholder,
  RedditStableId,
  RedditTimestamp
} from "./reddit-shared.js";

export type RedditPostReference = {
  readonly id: RedditStableId;
  readonly permalink?: string;
};

export type RedditCommentReference = {
  readonly id: RedditStableId;
  readonly permalink?: string;
};

export type RedditComment = {
  readonly id: RedditStableId;
  readonly post: RedditPostReference;
  readonly parentComment?: RedditCommentReference;
  readonly author: RedditAuthorReference;
  readonly bodyText: string;
  readonly permalink: string;
  readonly score: {
    readonly score?: number;
    readonly isScoreHidden?: boolean;
  };
  readonly timestamps: {
    readonly createdAt?: RedditTimestamp;
    readonly updatedAt?: RedditTimestamp;
    readonly editedAt?: RedditTimestamp;
  };
  readonly metadata: RedditSafeRawMetadataPlaceholder;
};
