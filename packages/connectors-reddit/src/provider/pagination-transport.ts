import type {
  RedditCursorValue,
  RedditLimitMetadata,
  RedditPageResultMetadata,
  RedditPaginationDirection,
  RedditPaginationMetadata
} from "../data/index.js";
import {
  createRedditProviderRequestDescription,
  type RedditProviderRequestBuilderInput,
  type RedditProviderRequestDescription
} from "./request-builder.js";

export type RedditProviderCursorInput = {
  readonly value?: string;
};

export type RedditProviderCursorOutput = {
  readonly cursor?: RedditCursorValue;
  readonly previousCursor?: RedditCursorValue;
  readonly nextCursor?: RedditCursorValue;
};

export type RedditProviderPaginationInput = {
  readonly cursor?: RedditProviderCursorInput;
  readonly previousCursor?: RedditProviderCursorInput;
  readonly nextCursor?: RedditProviderCursorInput;
  readonly direction: RedditPaginationDirection;
  readonly requestedLimit: number;
  readonly returnedCount: number;
  readonly maximumLimit?: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly createdAt?: string;
};

export type RedditProviderNextPageRequest = {
  readonly cursor: RedditCursorValue;
  readonly direction: RedditPaginationDirection;
  readonly description: RedditProviderRequestDescription;
};

const sensitiveCursorPattern =
  /(authorization|bearer|token|secret|credential|password|api[_-]?key|provider[_-]?key)/iu;

export function createRedditProviderCursor(
  input: RedditProviderCursorInput | undefined
): RedditCursorValue | undefined {
  const value = input?.value?.trim();

  if (!value) return undefined;

  return {
    value: sensitiveCursorPattern.test(value) ? "[REDACTED-CURSOR]" : value,
    replaySafe: true,
    source: "reddit-pagination"
  };
}

export function createRedditProviderPaginationMetadata(
  input: RedditProviderPaginationInput
): RedditPaginationMetadata {
  const limit: RedditLimitMetadata = {
    requestedLimit: input.requestedLimit,
    returnedCount: input.returnedCount,
    maximumLimit: input.maximumLimit
  };
  const page: RedditPageResultMetadata = {
    direction: input.direction,
    hasNextPage: input.hasNextPage,
    hasPreviousPage: input.hasPreviousPage,
    itemCount: input.returnedCount
  };

  return {
    cursor: {
      cursor: createRedditProviderCursor(input.cursor),
      previousCursor: createRedditProviderCursor(input.previousCursor),
      nextCursor: createRedditProviderCursor(input.nextCursor),
      createdAt: input.createdAt
    },
    direction: input.direction,
    limit,
    page,
    safeSourceMetadata: {
      source: "provider-pagination",
      replaySafe: true
    }
  };
}

export function createRedditProviderNextPageRequest(
  input: RedditProviderRequestBuilderInput & {
    readonly cursor: RedditCursorValue;
    readonly direction: RedditPaginationDirection;
  }
): RedditProviderNextPageRequest {
  return {
    cursor: input.cursor,
    direction: input.direction,
    description: createRedditProviderRequestDescription({
      ...input,
      pagination: {
        ...input.pagination,
        cursor: input.cursor
      }
    })
  };
}
