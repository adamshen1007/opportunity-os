import { describe, expect, it } from "vitest";
import {
  createRedditProviderCursor,
  createRedditProviderNextPageRequest,
  createRedditProviderPaginationMetadata
} from "../index.js";

describe("reddit provider pagination transport contracts", () => {
  it("creates replay-safe cursor metadata without exposing sensitive cursor values", () => {
    const cursor = createRedditProviderCursor({
      value: "bearer raw-token-value"
    });
    const metadata = createRedditProviderPaginationMetadata({
      cursor: { value: "cursor_current" },
      nextCursor: { value: "cursor_next" },
      direction: "forward",
      requestedLimit: 25,
      returnedCount: 10,
      maximumLimit: 100,
      hasNextPage: true,
      hasPreviousPage: false,
      createdAt: "2026-07-01T00:00:00.000Z"
    });

    expect(cursor).toEqual({
      value: "[REDACTED-CURSOR]",
      replaySafe: true,
      source: "reddit-pagination"
    });
    expect(metadata.cursor.nextCursor).toEqual({
      value: "cursor_next",
      replaySafe: true,
      source: "reddit-pagination"
    });
    expect(metadata.page).toEqual({
      direction: "forward",
      hasNextPage: true,
      hasPreviousPage: false,
      itemCount: 10
    });
  });

  it("describes the next-page request shape without executing it", () => {
    const cursor = createRedditProviderCursor({ value: "cursor_next" });

    expect(cursor).toBeDefined();

    const nextPage = createRedditProviderNextPageRequest({
      endpoint: "posts",
      baseUrl: "https://provider.example",
      cursor: cursor!,
      direction: "forward",
      correlationId: "corr_next_page"
    });

    expect(nextPage.description.url).toBe(
      "https://provider.example/posts?after=cursor_next"
    );
    expect(nextPage.description.operationName).toBe("reddit.read.posts");
  });
});
