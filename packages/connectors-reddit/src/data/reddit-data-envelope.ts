import type { RedditAuthor } from "./reddit-author.js";
import type { RedditComment } from "./reddit-comment.js";
import type { RedditPaginationMetadata } from "./reddit-pagination.js";
import type { RedditPost } from "./reddit-post.js";
import type { RedditRateLimitMetadata } from "./reddit-rate-limit.js";
import type { RedditSafePublicMetadata } from "./reddit-shared.js";
import type { RedditSubreddit } from "./reddit-subreddit.js";

export type RedditDataEnvelopeKind =
  | "posts"
  | "comments"
  | "subreddits"
  | "authors";

export type RedditDataEnvelopeMetadata = {
  readonly pagination?: RedditPaginationMetadata;
  readonly rateLimit?: RedditRateLimitMetadata;
  readonly safeSourceMetadata?: RedditSafePublicMetadata;
};

export type RedditDataEnvelope =
  | {
      readonly kind: "posts";
      readonly items: readonly RedditPost[];
      readonly metadata: RedditDataEnvelopeMetadata;
    }
  | {
      readonly kind: "comments";
      readonly items: readonly RedditComment[];
      readonly metadata: RedditDataEnvelopeMetadata;
    }
  | {
      readonly kind: "subreddits";
      readonly items: readonly RedditSubreddit[];
      readonly metadata: RedditDataEnvelopeMetadata;
    }
  | {
      readonly kind: "authors";
      readonly items: readonly RedditAuthor[];
      readonly metadata: RedditDataEnvelopeMetadata;
    };
