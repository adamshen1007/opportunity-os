import { describe, expect, it } from "vitest";
import {
  RedditRuntimeError,
  createRedditRuntimeError
} from "../index.js";

describe("Reddit runtime errors", () => {
  it("serializes safe runtime error details", () => {
    const error = createRedditRuntimeError({
      message: "authorization: bearer secret-token token=raw-token",
      correlationId: "corr_fixture",
      requestId: "req_fixture",
      cause: new Error("cause with secret-token")
    });

    expect(error).toBeInstanceOf(RedditRuntimeError);
    expect(error.toRedditRuntimeSafeDetails()).toEqual({
      code: "REDDIT_CONNECTOR_OPERATION_INVALID",
      category: "external dependency",
      message: "[REDACTED] [REDACTED]",
      correlationId: "corr_fixture",
      requestId: "req_fixture"
    });
    expect(JSON.stringify(error.toRedditRuntimeSafeDetails())).not.toContain("secret-token");
    expect(JSON.stringify(error.toRedditRuntimeSafeDetails())).not.toContain("cause");
    expect(JSON.stringify(error.toRedditRuntimeSafeDetails())).not.toContain("stack");
  });
});
