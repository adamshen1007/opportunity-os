import { describe, expect, it } from "vitest";
import {
  createRedditFixtureProvider,
  mapRedditRuntimeFailure,
  mapRedditRuntimeSuccess,
  readRedditFixturePosts
} from "../index.js";

describe("Reddit runtime result mapping", () => {
  it("maps fixture read output to a connector success result", () => {
    const envelope = readRedditFixturePosts(createRedditFixtureProvider());

    expect(
      mapRedditRuntimeSuccess(envelope, {
        operationName: "reddit.read.posts",
        correlationId: "corr_fixture",
        requestId: "req_fixture"
      })
    ).toEqual({
      ok: true,
      value: envelope,
      metadata: {
        connectorId: "reddit",
        operationName: "reddit.read.posts",
        correlationId: "corr_fixture",
        requestId: "req_fixture"
      }
    });
  });

  it("maps failures to secret-safe error details", () => {
    const result = mapRedditRuntimeFailure(
      "token=secret-value provider response stack cause",
      {
        operationName: "reddit.read.posts",
        correlationId: "corr_fixture"
      }
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(JSON.stringify(result.error)).not.toContain("secret-value");
      expect(JSON.stringify(result.error)).not.toContain("stack");
      expect(JSON.stringify(result.error)).not.toContain("cause");
      expect(result.metadata?.operationName).toBe("reddit.read.posts");
    }
  });
});
