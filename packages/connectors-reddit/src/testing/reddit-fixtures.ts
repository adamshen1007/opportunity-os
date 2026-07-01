import type { ConnectorHostBindingContext } from "@opportunity-os/connector-host";
import type {
  RedditAuthor,
  RedditComment,
  RedditConnectorConfig,
  RedditPaginationMetadata,
  RedditPost,
  RedditRateLimitMetadata,
  RedditSubreddit
} from "../index.js";

export type RedditFakeConfig = RedditConnectorConfig;

export type RedditFakeHostContext = ConnectorHostBindingContext;

export type RedditAssertionHelper = {
  readonly assertSafeMetadata: (value: unknown) => void;
  readonly assertDeterministicFixture: (value: unknown) => void;
};

export const REDDIT_FAKE_CONFIG = {
  fields: [
    {
      key: "userAgent",
      kind: "string",
      required: true,
      sensitive: false,
      value: "opportunity-os-test",
      description: "Deterministic fixture user agent."
    },
    {
      key: "readOnlyMode",
      kind: "boolean",
      required: true,
      sensitive: false,
      value: true,
      description: "Deterministic fixture read-only mode."
    },
    {
      key: "clientSecret",
      kind: "secret",
      required: false,
      sensitive: true,
      value: "[REDACTED]",
      description: "Placeholder credential contract."
    }
  ]
} as const satisfies RedditFakeConfig;

export const REDDIT_FAKE_HOST_CONTEXT = {
  correlationId: "corr_reddit_fixture",
  requestId: "req_reddit_fixture"
} as const satisfies RedditFakeHostContext;

export const REDDIT_FAKE_POST = {
  id: "post_fixture",
  subreddit: {
    id: "sub_fixture",
    name: "opportunity",
    displayName: "Opportunity"
  },
  author: {
    id: "author_fixture",
    username: "fixture-author",
    displayName: "Fixture Author"
  },
  title: "Fixture post",
  bodyText: "Fixture body.",
  permalink: "/r/opportunity/comments/post_fixture/fixture_post/",
  score: {
    score: 10,
    upvoteRatio: 0.9,
    isScoreHidden: false
  },
  timestamps: {
    createdAt: "2026-07-01T00:00:00.000Z"
  },
  rawMetadata: {
    kind: "safe-raw-metadata-placeholder",
    redacted: true,
    source: "reddit-public-metadata",
    fields: {
      fixture: true
    }
  }
} as const satisfies RedditPost;

export const REDDIT_FAKE_COMMENT = {
  id: "comment_fixture",
  post: {
    id: "post_fixture"
  },
  author: {
    username: "fixture-commenter"
  },
  bodyText: "Fixture comment.",
  permalink: "/r/opportunity/comments/post_fixture/fixture_post/comment_fixture/",
  score: {
    score: 2
  },
  timestamps: {
    createdAt: "2026-07-01T00:01:00.000Z"
  },
  metadata: {
    kind: "safe-raw-metadata-placeholder",
    redacted: true,
    source: "reddit-public-metadata"
  }
} as const satisfies RedditComment;

export const REDDIT_FAKE_SUBREDDIT = {
  id: "sub_fixture",
  name: "opportunity",
  displayName: "Opportunity",
  title: "Opportunity",
  description: {
    publicDescription: "Fixture public description."
  },
  publicStatus: {
    isPublic: true,
    visibility: "public",
    isNsfw: false
  },
  subscriberCount: {
    subscribers: 100,
    activeUsers: 5
  },
  timestamps: {
    createdAt: "2020-01-01T00:00:00.000Z"
  }
} as const satisfies RedditSubreddit;

export const REDDIT_FAKE_AUTHOR = {
  id: "author_fixture",
  username: "fixture-author",
  displayName: "Fixture Author",
  profilePermalink: "/user/fixture-author/",
  accountAge: {
    createdAt: "2020-01-01T00:00:00.000Z",
    accountAgeDays: 2373
  },
  publicMetadata: {
    fixture: true
  }
} as const satisfies RedditAuthor;

export const REDDIT_FAKE_PAGINATION = {
  cursor: {
    nextCursor: {
      value: "fixture-cursor",
      replaySafe: true,
      source: "reddit-pagination"
    }
  },
  direction: "forward",
  limit: {
    requestedLimit: 25,
    returnedCount: 1,
    maximumLimit: 100
  },
  page: {
    direction: "forward",
    hasNextPage: false,
    hasPreviousPage: false,
    itemCount: 1
  }
} as const satisfies RedditPaginationMetadata;

export const REDDIT_FAKE_RATE_LIMIT = {
  limit: 100,
  remaining: 99,
  resetAt: "2026-07-01T00:10:00.000Z",
  window: {
    windowSeconds: 600,
    windowName: "fixture-window"
  },
  safeSourceMetadata: {
    source: "fixture"
  }
} as const satisfies RedditRateLimitMetadata;

export type RedditFixtureSet = {
  readonly post: typeof REDDIT_FAKE_POST;
  readonly comment: typeof REDDIT_FAKE_COMMENT;
  readonly subreddit: typeof REDDIT_FAKE_SUBREDDIT;
  readonly author: typeof REDDIT_FAKE_AUTHOR;
  readonly pagination: typeof REDDIT_FAKE_PAGINATION;
  readonly rateLimit: typeof REDDIT_FAKE_RATE_LIMIT;
  readonly config: typeof REDDIT_FAKE_CONFIG;
  readonly hostContext: typeof REDDIT_FAKE_HOST_CONTEXT;
};
