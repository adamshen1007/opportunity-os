import { describe, expect, it } from "vitest";
import type {
  ConnectorHostExecutionOrchestrationContract,
  ConnectorHostExecutionPolicyInput
} from "../index.js";

describe("connector host execution orchestration contracts", () => {
  it("models runtime policy inputs without runtime behavior", () => {
    const policies: ConnectorHostExecutionPolicyInput = {
      retry: {
        maxAttempts: 2,
        backoff: {
          kind: "fixed",
          delayMs: 100
        },
        retryableIssueCodes: ["temporary"]
      },
      timeout: {
        scope: "pipeline",
        duration: {
          timeoutMs: 1000
        }
      },
      rateLimit: {
        limits: {
          rateLimit: {
            connectorId: "generic-source",
            requests: {
              limit: 10,
              remaining: 10,
              resetAt: "2026-07-01T00:00:00.000Z"
            }
          }
        }
      }
    };

    expect(policies.retry?.maxAttempts).toBe(2);
    expect(policies.timeout?.scope).toBe("pipeline");
  });

  it("models safe failure shapes", () => {
    const contract = {
      result: {
        ok: false,
        code: "host-policy-rejected",
        safeMessage: "Host policy rejected the request.",
        correlationId: "correlation-1",
        errors: [
          {
            code: "INFRASTRUCTURE_UNAVAILABLE",
            category: "infrastructure",
            message: "Host policy rejected the request.",
            correlationId: "correlation-1"
          }
        ]
      }
    } satisfies Partial<ConnectorHostExecutionOrchestrationContract>;

    expect(contract.result?.ok).toBe(false);
    expect(JSON.stringify(contract.result)).not.toContain("secret");
  });
});
