import type {
  RedditAuthor,
  RedditComment,
  RedditPost,
  RedditSubreddit
} from "../data/index.js";
import type { RedditProviderResponseInput } from "./response-parser.js";
import type { RedditTransportHeader } from "./transport.js";

export type RedditLiveListingKind = "posts" | "comments" | "subreddits" | "authors";

export type RedditLiveResponseMapInput = {
  readonly kind: RedditLiveListingKind;
  readonly body: unknown;
  readonly headers?: readonly RedditTransportHeader[];
  readonly checkedAt: string;
  readonly requestedLimit: number;
};

export type RedditLiveResponseMapResult =
  | {
      readonly ok: true;
      readonly response: RedditProviderResponseInput;
    }
  | {
      readonly ok: false;
      readonly safeMessage: string;
    };

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function timestampFromUtc(value: unknown): string | undefined {
  const seconds = numberValue(value);

  return seconds === undefined ? undefined : new Date(seconds * 1000).toISOString();
}

function listingChildren(body: unknown): readonly Readonly<Record<string, unknown>>[] | undefined {
  if (!isRecord(body) || !isRecord(body.data) || !Array.isArray(body.data.children)) {
    return undefined;
  }

  return body.data.children.filter(isRecord);
}

function listingCursor(body: unknown, key: "after" | "before"): string | undefined {
  if (!isRecord(body) || !isRecord(body.data)) return undefined;
  const value = body.data[key];

  return typeof value === "string" && value !== "" ? value : undefined;
}

function childData(child: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  return isRecord(child.data) ? child.data : {};
}

function mapPost(child: Readonly<Record<string, unknown>>): Omit<RedditPost, "rawMetadata"> & {
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
} {
  const data = childData(child);
  const id = text(data.name, text(data.id, "unknown-post"));
  const subredditName = text(data.subreddit, "unknown");
  const authorName = text(data.author, "unknown");

  return {
    id,
    subreddit: {
      id: text(data.subreddit_id, subredditName),
      name: subredditName,
      displayName: subredditName
    },
    author: {
      id: text(data.author_fullname, undefined),
      username: authorName,
      displayName: authorName
    },
    title: text(data.title, "Untitled Reddit post"),
    bodyText: text(data.selftext, undefined),
    permalink: text(data.permalink, `/comments/${id}`),
    score: {
      score: numberValue(data.score),
      upvoteRatio: numberValue(data.upvote_ratio),
      isScoreHidden: data.hide_score === true
    },
    timestamps: {
      createdAt: timestampFromUtc(data.created_utc),
      editedAt: timestampFromUtc(data.edited)
    },
    safeMetadata: {
      redditKind: text(child.kind, "t3"),
      isOriginalContent: data.is_original_content === true,
      over18: data.over_18 === true
    }
  };
}

function mapComment(child: Readonly<Record<string, unknown>>): Omit<RedditComment, "metadata"> & {
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
} {
  const data = childData(child);
  const id = text(data.name, text(data.id, "unknown-comment"));
  const parentId = text(data.parent_id, undefined);

  return {
    id,
    post: {
      id: text(data.link_id, "unknown-post"),
      permalink: text(data.permalink, undefined)
    },
    parentComment: parentId?.startsWith("t1_") ? { id: parentId } : undefined,
    author: {
      id: text(data.author_fullname, undefined),
      username: text(data.author, "unknown"),
      displayName: text(data.author, undefined)
    },
    bodyText: text(data.body, ""),
    permalink: text(data.permalink, `/comments/${id}`),
    score: {
      score: numberValue(data.score),
      isScoreHidden: data.score_hidden === true
    },
    timestamps: {
      createdAt: timestampFromUtc(data.created_utc),
      editedAt: timestampFromUtc(data.edited)
    },
    safeMetadata: {
      redditKind: text(child.kind, "t1")
    }
  };
}

function mapSubreddit(child: Readonly<Record<string, unknown>>): RedditSubreddit {
  const data = childData(child);
  const displayName = text(data.display_name, text(data.display_name_prefixed, "unknown"));

  return {
    id: text(data.name, text(data.id, displayName)),
    name: displayName,
    displayName,
    title: text(data.title, undefined),
    description: {
      title: text(data.title, undefined),
      publicDescription: text(data.public_description, undefined),
      safeDescriptionMetadata: {
        over18: data.over18 === true
      }
    },
    publicStatus: {
      isPublic: data.subreddit_type === "public",
      visibility: data.subreddit_type === "public" ? "public" : "unknown",
      isNsfw: data.over18 === true
    },
    subscriberCount: {
      subscribers: numberValue(data.subscribers),
      activeUsers: numberValue(data.active_user_count)
    },
    timestamps: {
      createdAt: timestampFromUtc(data.created_utc)
    }
  };
}

function mapAuthor(child: Readonly<Record<string, unknown>>): RedditAuthor {
  const data = childData(child);
  const username = text(data.name, "unknown");

  return {
    id: text(data.id, undefined),
    username,
    displayName: username,
    profilePermalink: `/user/${username}`,
    accountAge: {
      createdAt: timestampFromUtc(data.created_utc)
    },
    publicMetadata: {
      redditKind: text(child.kind, "t2"),
      isEmployee: data.is_employee === true
    }
  };
}

export function mapRedditLiveListingResponse(
  input: RedditLiveResponseMapInput
): RedditLiveResponseMapResult {
  const children = listingChildren(input.body);

  if (!children) {
    return {
      ok: false,
      safeMessage: "Reddit live response was not a supported listing shape."
    };
  }

  const pagination = {
    cursor: { value: listingCursor(input.body, "before") },
    previousCursor: { value: listingCursor(input.body, "before") },
    nextCursor: { value: listingCursor(input.body, "after") },
    direction: "forward" as const,
    requestedLimit: input.requestedLimit,
    returnedCount: children.length,
    maximumLimit: 100,
    hasNextPage: listingCursor(input.body, "after") !== undefined,
    hasPreviousPage: listingCursor(input.body, "before") !== undefined,
    createdAt: input.checkedAt
  };
  const rateLimit = {
    headers: input.headers,
    checkedAt: input.checkedAt
  };

  if (input.kind === "posts") {
    return {
      ok: true,
      response: {
        kind: "posts",
        items: children.map(mapPost),
        pagination,
        rateLimit
      }
    };
  }

  if (input.kind === "comments") {
    return {
      ok: true,
      response: {
        kind: "comments",
        items: children.map(mapComment),
        pagination,
        rateLimit
      }
    };
  }

  if (input.kind === "subreddits") {
    return {
      ok: true,
      response: {
        kind: "subreddits",
        items: children.map(mapSubreddit),
        pagination,
        rateLimit
      }
    };
  }

  return {
    ok: true,
    response: {
      kind: "authors",
      items: children.map(mapAuthor),
      pagination,
      rateLimit
    }
  };
}
