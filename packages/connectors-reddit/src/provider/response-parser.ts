import type {
  RedditAuthor,
  RedditComment,
  RedditDataEnvelope,
  RedditDataEnvelopeKind,
  RedditPost,
  RedditRateLimitMetadata,
  RedditSubreddit
} from "../data/index.js";
import {
  createRedditProviderPaginationMetadata,
  type RedditProviderPaginationInput
} from "./pagination-transport.js";
import {
  parseRedditProviderRateLimitMetadata,
  type RedditProviderRateLimitInput
} from "./rate-limit-parser.js";

type SafeMetadata = Readonly<Record<string, string | number | boolean | null>>;

export type RedditProviderSafePost = Omit<RedditPost, "rawMetadata"> & {
  readonly safeMetadata?: SafeMetadata;
};

export type RedditProviderSafeComment = Omit<RedditComment, "metadata"> & {
  readonly safeMetadata?: SafeMetadata;
};

export type RedditProviderSafeSubreddit = RedditSubreddit;

export type RedditProviderSafeAuthor = RedditAuthor;

export type RedditProviderResponseInput =
  | {
      readonly kind: "posts";
      readonly items: readonly RedditProviderSafePost[];
      readonly pagination?: RedditProviderPaginationInput;
      readonly rateLimit?: RedditProviderRateLimitInput;
    }
  | {
      readonly kind: "comments";
      readonly items: readonly RedditProviderSafeComment[];
      readonly pagination?: RedditProviderPaginationInput;
      readonly rateLimit?: RedditProviderRateLimitInput;
    }
  | {
      readonly kind: "subreddits";
      readonly items: readonly RedditProviderSafeSubreddit[];
      readonly pagination?: RedditProviderPaginationInput;
      readonly rateLimit?: RedditProviderRateLimitInput;
    }
  | {
      readonly kind: "authors";
      readonly items: readonly RedditProviderSafeAuthor[];
      readonly pagination?: RedditProviderPaginationInput;
      readonly rateLimit?: RedditProviderRateLimitInput;
    };

export type RedditProviderParseIssueCode =
  | "reddit-provider-response-malformed"
  | "reddit-provider-response-kind-unsupported"
  | "reddit-provider-response-items-invalid";

export type RedditProviderParseIssue = {
  readonly code: RedditProviderParseIssueCode;
  readonly path: readonly string[];
  readonly safeMessage: string;
};

export type RedditProviderParseResult =
  | {
      readonly ok: true;
      readonly envelope: RedditDataEnvelope;
    }
  | {
      readonly ok: false;
      readonly issues: readonly RedditProviderParseIssue[];
    };

function safeRawMetadata(fields: SafeMetadata | undefined) {
  return {
    kind: "safe-raw-metadata-placeholder",
    redacted: true,
    source: "reddit-public-metadata",
    fields
  } as const;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSupportedKind(value: unknown): value is RedditDataEnvelopeKind {
  return value === "posts" || value === "comments" || value === "subreddits" || value === "authors";
}

function malformed(path: readonly string[], safeMessage: string): RedditProviderParseIssue {
  return {
    code: "reddit-provider-response-malformed",
    path,
    safeMessage
  };
}

function buildMetadata(input: {
  readonly pagination?: RedditProviderPaginationInput;
  readonly rateLimit?: RedditProviderRateLimitInput;
}) {
  return {
    pagination: input.pagination
      ? createRedditProviderPaginationMetadata(input.pagination)
      : undefined,
    rateLimit: input.rateLimit
      ? parseRedditProviderRateLimitMetadata(input.rateLimit)
      : ({
          window: {
            windowName: "unknown"
          },
          safeSourceMetadata: {
            source: "provider-rate-limit",
            fallback: true
          }
        } satisfies RedditRateLimitMetadata),
    safeSourceMetadata: {
      source: "provider-response",
      persisted: false
    }
  };
}

function hasRequiredTextFields(
  item: Readonly<Record<string, unknown>>,
  fields: readonly string[]
): boolean {
  return fields.every((field) => typeof item[field] === "string" && item[field] !== "");
}

function parsePosts(input: Extract<RedditProviderResponseInput, { readonly kind: "posts" }>): RedditDataEnvelope {
  return {
    kind: "posts",
    items: input.items.map((item) => ({
      ...item,
      rawMetadata: safeRawMetadata(item.safeMetadata)
    })),
    metadata: buildMetadata(input)
  };
}

function parseComments(input: Extract<RedditProviderResponseInput, { readonly kind: "comments" }>): RedditDataEnvelope {
  return {
    kind: "comments",
    items: input.items.map((item) => ({
      ...item,
      metadata: safeRawMetadata(item.safeMetadata)
    })),
    metadata: buildMetadata(input)
  };
}

export function parseRedditProviderResponse(
  input: unknown
): RedditProviderParseResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [malformed([], "Provider response must be an object.")]
    };
  }

  if (!isSupportedKind(input.kind)) {
    return {
      ok: false,
      issues: [
        {
          code: "reddit-provider-response-kind-unsupported",
          path: ["kind"],
          safeMessage: "Provider response kind is not supported."
        }
      ]
    };
  }

  if (!Array.isArray(input.items)) {
    return {
      ok: false,
      issues: [
        {
          code: "reddit-provider-response-items-invalid",
          path: ["items"],
          safeMessage: "Provider response items must be an array."
        }
      ]
    };
  }

  if (!input.items.every((item) => isRecord(item))) {
    return {
      ok: false,
      issues: [malformed(["items"], "Provider response items must be safe objects.")]
    };
  }

  if (
    (input.kind === "posts" &&
      !input.items.every((item) => hasRequiredTextFields(item, ["id", "title", "permalink"]))) ||
    (input.kind === "comments" &&
      !input.items.every((item) => hasRequiredTextFields(item, ["id", "bodyText", "permalink"]))) ||
    (input.kind === "subreddits" &&
      !input.items.every((item) => hasRequiredTextFields(item, ["id", "name", "displayName"]))) ||
    (input.kind === "authors" &&
      !input.items.every((item) => hasRequiredTextFields(item, ["username", "profilePermalink"])))
  ) {
    return {
      ok: false,
      issues: [malformed(["items"], "Provider response items are missing required safe fields.")]
    };
  }

  const responseInput = input as RedditProviderResponseInput;

  if (responseInput.kind === "posts") return { ok: true, envelope: parsePosts(responseInput) };
  if (responseInput.kind === "comments") return { ok: true, envelope: parseComments(responseInput) };

  return {
    ok: true,
    envelope: {
      kind: responseInput.kind,
      items: responseInput.items,
      metadata: buildMetadata(responseInput)
    } as RedditDataEnvelope
  };
}
