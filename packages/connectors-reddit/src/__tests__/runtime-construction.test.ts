import { describe, expect, it } from "vitest";
import {
  REDDIT_CONNECTOR_CAPABILITIES,
  REDDIT_CONNECTOR_METADATA,
  REDDIT_FAKE_CONFIG,
  REDDIT_OPERATION_NAMES,
  createRedditRuntimeConnector
} from "../index.js";

describe("Reddit runtime connector construction", () => {
  it("constructs a fixture-backed connector from existing contracts", () => {
    const connector = createRedditRuntimeConnector({
      config: REDDIT_FAKE_CONFIG
    });

    expect(connector.metadata).toEqual(REDDIT_CONNECTOR_METADATA);
    expect(connector.capabilities.capabilities).toEqual(REDDIT_CONNECTOR_CAPABILITIES);
    expect(connector.operations.map((operation) => operation.name)).toEqual(
      REDDIT_OPERATION_NAMES
    );
    expect(connector.provider.getSnapshot().posts).toHaveLength(1);
  });

  it("returns deterministic validation state", () => {
    const connector = createRedditRuntimeConnector({
      config: REDDIT_FAKE_CONFIG
    });

    expect(connector.validate()).toEqual({
      phase: "configure",
      ready: true,
      redditState: "config-ready",
      safeMessage: "Reddit fixture runtime is ready."
    });
  });
});
