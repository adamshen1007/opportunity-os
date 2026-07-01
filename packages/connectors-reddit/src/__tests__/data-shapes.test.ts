import { describe, expect, it } from "vitest";
import type {
  RedditAuthor,
  RedditComment,
  RedditDataEnvelope,
  RedditPaginationMetadata,
  RedditPost,
  RedditRateLimitMetadata,
  RedditSubreddit
} from "../index.js";

const safeRawMetadata = {
  kind: "safe-raw-metadata-placeholder",
  redacted: true,
  source: "reddit-public-metadata",
  fields: {
    flairText: "discussion"
  }
} as const;

describe("reddit data shape contracts", () => {
  it("defines post contracts with stable references and safe raw metadata", () => {
    const post: RedditPost = {
      id: "post_123",
      subreddit: {
        id: "sub_123",
        name: "opportunity",
        displayName: "Opportunity"
      },
      author: {
        id: "author_123",
        username: "reader",
        displayName: "Reader"
      },
      title: "Found signal",
      bodyText: "Optional body text.",
      permalink: "/r/opportunity/comments/post_123/found_signal/",
      score: {
        score: 42,
        upvoteRatio: 0.91,
        isScoreHidden: false
      },
      timestamps: {
        createdAt: "2026-07-01T00:00:00.000Z",
        updatedAt: "2026-07-01T01:00:00.000Z"
      },
      rawMetadata: safeRawMetadata
    };

    expect(post.rawMetadata.redacted).toBe(true);
    expect(Object.keys(post)).toEqual([
      "id",
      "subreddit",
      "author",
      "title",
      "bodyText",
      "permalink",
      "score",
      "timestamps",
      "rawMetadata"
    ]);
  });

  it("defines comment contracts with optional parent comment references", () => {
    const comment: RedditComment = {
      id: "comment_123",
      post: {
        id: "post_123",
        permalink: "/r/opportunity/comments/post_123/found_signal/"
      },
      parentComment: {
        id: "comment_parent"
      },
      author: {
        username: "commenter"
      },
      bodyText: "Useful comment text.",
      permalink: "/r/opportunity/comments/post_123/found_signal/comment_123/",
      score: {
        score: 7
      },
      timestamps: {
        createdAt: "2026-07-01T00:30:00.000Z"
      },
      metadata: safeRawMetadata
    };

    expect(comment.parentComment?.id).toBe("comment_parent");
    expect(comment.metadata.redacted).toBe(true);
  });

  it("defines subreddit and author public metadata contracts", () => {
    const subreddit: RedditSubreddit = {
      id: "sub_123",
      name: "opportunity",
      displayName: "Opportunity",
      title: "Opportunity Signals",
      description: {
        title: "Opportunity Signals",
        publicDescription: "Public community description.",
        safeDescriptionMetadata: {
          language: "en"
        }
      },
      publicStatus: {
        isPublic: true,
        visibility: "public",
        isNsfw: false
      },
      subscriberCount: {
        subscribers: 1000,
        activeUsers: 25
      },
      timestamps: {
        createdAt: "2020-01-01T00:00:00.000Z"
      }
    };

    const author: RedditAuthor = {
      id: "author_123",
      username: "reader",
      displayName: "Reader",
      profilePermalink: "/user/reader/",
      accountAge: {
        createdAt: "2020-01-01T00:00:00.000Z",
        accountAgeDays: 2373
      },
      publicMetadata: {
        profileVisible: true
      }
    };

    expect(subreddit.publicStatus.visibility).toBe("public");
    expect(author.publicMetadata).toEqual({ profileVisible: true });
  });

  it("defines replay-safe pagination and safe rate-limit metadata", () => {
    const pagination: RedditPaginationMetadata = {
      cursor: {
        nextCursor: {
          value: "opaque-page-token",
          replaySafe: true,
          source: "reddit-pagination"
        },
        createdAt: "2026-07-01T00:00:00.000Z"
      },
      direction: "forward",
      limit: {
        requestedLimit: 50,
        returnedCount: 25,
        maximumLimit: 100
      },
      page: {
        direction: "forward",
        hasNextPage: true,
        hasPreviousPage: false,
        itemCount: 25
      },
      safeSourceMetadata: {
        listing: "public"
      }
    };

    const rateLimit: RedditRateLimitMetadata = {
      limit: 100,
      remaining: 99,
      resetAt: "2026-07-01T00:10:00.000Z",
      window: {
        windowSeconds: 600,
        windowName: "read-contract-window"
      },
      safeSourceMetadata: {
        source: "headers-redacted"
      }
    };

    expect(pagination.cursor.nextCursor?.replaySafe).toBe(true);
    expect(JSON.stringify(pagination)).not.toMatch(/secret|token=|password|authorization/iu);
    expect(rateLimit.safeSourceMetadata).toEqual({ source: "headers-redacted" });
  });

  it("defines data envelopes for supported Reddit data kinds", () => {
    const envelope: RedditDataEnvelope = {
      kind: "posts",
      items: [],
      metadata: {
        pagination: {
          cursor: {},
          direction: "forward",
          limit: {
            requestedLimit: 25,
            returnedCount: 0
          },
          page: {
            direction: "forward",
            hasNextPage: false,
            hasPreviousPage: false,
            itemCount: 0
          }
        }
      }
    };

    expect(Object.keys(envelope)).toEqual(["kind", "items", "metadata"]);
    expect(envelope.kind).toBe("posts");
  });
});
