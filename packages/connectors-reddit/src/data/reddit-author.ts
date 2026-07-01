import type {
  RedditSafePublicMetadata,
  RedditStableId,
  RedditTimestamp
} from "./reddit-shared.js";

export type RedditAuthorReference = {
  readonly id?: RedditStableId;
  readonly username: string;
  readonly displayName?: string;
};

export type RedditAuthorAccountAgeMetadata = {
  readonly createdAt?: RedditTimestamp;
  readonly accountAgeDays?: number;
};

export type RedditAuthor = {
  readonly id?: RedditStableId;
  readonly username: string;
  readonly displayName?: string;
  readonly profilePermalink: string;
  readonly accountAge: RedditAuthorAccountAgeMetadata;
  readonly publicMetadata: RedditSafePublicMetadata;
};
