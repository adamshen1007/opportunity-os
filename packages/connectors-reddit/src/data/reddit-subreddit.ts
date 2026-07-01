import type {
  RedditSafePublicMetadata,
  RedditStableId,
  RedditTimestamp
} from "./reddit-shared.js";

export type RedditSubredditReference = {
  readonly id: RedditStableId;
  readonly name: string;
  readonly displayName?: string;
};

export type RedditSubredditDescriptionMetadata = {
  readonly title?: string;
  readonly publicDescription?: string;
  readonly safeDescriptionMetadata?: RedditSafePublicMetadata;
};

export type RedditSubredditPublicStatusMetadata = {
  readonly isPublic?: boolean;
  readonly visibility?: "public" | "restricted" | "private" | "unknown";
  readonly isNsfw?: boolean;
};

export type RedditSubredditSubscriberCountMetadata = {
  readonly subscribers?: number;
  readonly activeUsers?: number;
};

export type RedditSubreddit = {
  readonly id: RedditStableId;
  readonly name: string;
  readonly displayName: string;
  readonly title?: string;
  readonly description: RedditSubredditDescriptionMetadata;
  readonly publicStatus: RedditSubredditPublicStatusMetadata;
  readonly subscriberCount: RedditSubredditSubscriberCountMetadata;
  readonly timestamps: {
    readonly createdAt?: RedditTimestamp;
    readonly updatedAt?: RedditTimestamp;
  };
};
