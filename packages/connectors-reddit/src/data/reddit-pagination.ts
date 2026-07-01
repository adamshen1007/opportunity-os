import type {
  RedditSafePublicMetadata,
  RedditTimestamp
} from "./reddit-shared.js";

export type RedditPaginationDirection = "forward" | "backward";

export type RedditCursorValue = {
  readonly value: string;
  readonly replaySafe: true;
  readonly source: "reddit-pagination";
};

export type RedditCursorMetadata = {
  readonly cursor?: RedditCursorValue;
  readonly previousCursor?: RedditCursorValue;
  readonly nextCursor?: RedditCursorValue;
  readonly createdAt?: RedditTimestamp;
};

export type RedditLimitMetadata = {
  readonly requestedLimit: number;
  readonly returnedCount: number;
  readonly maximumLimit?: number;
};

export type RedditPageResultMetadata = {
  readonly direction: RedditPaginationDirection;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly itemCount: number;
};

export type RedditPaginationMetadata = {
  readonly cursor: RedditCursorMetadata;
  readonly direction: RedditPaginationDirection;
  readonly limit: RedditLimitMetadata;
  readonly page: RedditPageResultMetadata;
  readonly safeSourceMetadata?: RedditSafePublicMetadata;
};
