import { describe, expect, it } from "vitest";
import {
  REDDIT_RUNTIME_FAKE_CLOCK,
  createRedditRuntimeHarness
} from "../index.js";

describe("Reddit runtime harness", () => {
  it("uses fake clock, fake context, and fake provider", () => {
    const harness = createRedditRuntimeHarness();

    expect(harness.clock).toEqual(REDDIT_RUNTIME_FAKE_CLOCK);
    expect(harness.clock.now()).toBe("2026-07-01T00:00:00.000Z");
    expect(harness.context).toEqual({
      correlationId: "corr_reddit_fixture",
      requestId: "req_reddit_fixture"
    });
    expect(harness.connector.provider.kind).toBe("reddit-fake-provider");
  });

  it("returns deterministic successful read results", () => {
    const harness = createRedditRuntimeHarness();
    const result = harness.read("reddit.read.posts");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.kind).toBe("posts");
      expect(result.metadata).toEqual({
        connectorId: "reddit",
        operationName: "reddit.read.posts",
        correlationId: "corr_reddit_fixture",
        requestId: "req_reddit_fixture"
      });
    }
  });
});
