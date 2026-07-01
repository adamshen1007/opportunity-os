import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_CONFIG,
  REDDIT_FAKE_HOST_CONTEXT,
  REDDIT_LIFECYCLE_READINESS_STATES
} from "../index.js";
import type {
  RedditConnectorFactoryInput,
  RedditHostValidationContract,
  RedditLifecycleReadiness
} from "../index.js";

describe("reddit lifecycle, factory, and host contracts", () => {
  it("maps Reddit readiness to generic connector lifecycle concepts", () => {
    const readiness: RedditLifecycleReadiness = {
      states: [
        {
          phase: "validate",
          ready: true,
          redditState: "config-ready",
          safeMessage: "Reddit config contract is ready."
        }
      ]
    };

    expect(REDDIT_LIFECYCLE_READINESS_STATES).toEqual([
      "metadata-ready",
      "config-ready",
      "host-context-ready",
      "operation-contracts-ready",
      "not-ready"
    ]);
    expect(readiness.states[0]?.phase).toBe("validate");
  });

  it("defines factory input with explicit config and host context", () => {
    const input = {
      metadata: {
        id: "reddit",
        name: "Reddit",
        version: "0.0.0",
        description: "Fixture metadata.",
        provider: "reddit",
        category: "source",
        tags: ["reddit"],
        stability: "experimental"
      },
      config: REDDIT_FAKE_CONFIG,
      context: {
        correlationId: "corr_factory",
        logger: {} as RedditConnectorFactoryInput["context"]["logger"],
        config: REDDIT_FAKE_CONFIG,
        execution: {
          connectorId: "reddit"
        }
      },
      hostContext: REDDIT_FAKE_HOST_CONTEXT
    } satisfies RedditConnectorFactoryInput;

    expect(input.config.fields.some((field) => field.sensitive)).toBe(true);
    expect(input.hostContext.correlationId).toBe("corr_reddit_fixture");
  });

  it("defines host validation contracts without startup behavior", () => {
    const validation: RedditHostValidationContract = {
      startupValidation: {
        status: "invalid",
        checks: [],
        issues: []
      },
      redditValidation: {
        ok: true,
        issues: []
      }
    };

    expect(validation.startupValidation.status).toBe("invalid");
    expect(validation.redditValidation.ok).toBe(true);
  });
});
