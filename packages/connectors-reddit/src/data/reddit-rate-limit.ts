import type {
  RedditSafePublicMetadata,
  RedditTimestamp
} from "./reddit-shared.js";

export type RedditRateLimitWindowMetadata = {
  readonly windowSeconds?: number;
  readonly windowName?: string;
};

export type RedditRateLimitMetadata = {
  readonly limit?: number;
  readonly remaining?: number;
  readonly resetAt?: RedditTimestamp;
  readonly window: RedditRateLimitWindowMetadata;
  readonly safeSourceMetadata?: RedditSafePublicMetadata;
};
