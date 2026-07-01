import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_BACKOFF_KINDS,
  CONNECTOR_RUNTIME_RETRY_DECISIONS,
  type ConnectorRuntimeRetryDecision,
  type ConnectorRuntimeRetryPolicy
} from "../index.js";

describe("connector runtime retry policy contracts", () => {
  it("defines retry vocabularies and policy metadata", () => {
    const policy: ConnectorRuntimeRetryPolicy = {
      maxAttempts: 3,
      backoff: {
        kind: "exponential",
        delayMs: 100,
        maxDelayMs: 1000,
        multiplier: 2
      },
      retryableIssueCodes: ["temporary-failure"]
    };

    expect(CONNECTOR_RUNTIME_BACKOFF_KINDS).toEqual([
      "fixed",
      "linear",
      "exponential"
    ]);
    expect(CONNECTOR_RUNTIME_RETRY_DECISIONS).toEqual([
      "retry",
      "do-not-retry"
    ]);
    expect(policy.maxAttempts).toBe(3);
  });

  it("models retry decisions without a runner", () => {
    const decision: ConnectorRuntimeRetryDecision = {
      decision: "retry",
      attempt: 1,
      maxAttempts: 3,
      nextDelayMs: 100,
      safeMessage: "Retry is permitted by policy."
    };

    expect(decision.decision).toBe("retry");
  });
});
