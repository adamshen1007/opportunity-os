import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS,
  type ConnectorRuntimeRateLimitDecision,
  type ConnectorRuntimeRateLimitPolicy
} from "../index.js";

describe("connector runtime rate-limit policy contracts", () => {
  it("defines allow, defer, and reject decisions", () => {
    expect(CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS).toEqual([
      "allow",
      "defer",
      "reject"
    ]);
  });

  it("references connector limit metadata", () => {
    const policy: ConnectorRuntimeRateLimitPolicy = {
      operationName: "list",
      limits: {
        rateLimit: {
          connectorId: "generic-source",
          operationName: "list",
          requests: {
            limit: 100,
            remaining: 0,
            resetAt: "2026-07-01T01:00:00.000Z",
            windowSeconds: 3600
          }
        }
      }
    };
    const decision: ConnectorRuntimeRateLimitDecision = {
      decision: "defer",
      limits: policy.limits,
      deferUntil: "2026-07-01T01:00:00.000Z",
      safeMessage: "Limit metadata recommends deferral."
    };

    expect(decision.decision).toBe("defer");
    expect(decision.limits.rateLimit?.requests?.remaining).toBe(0);
  });
});
