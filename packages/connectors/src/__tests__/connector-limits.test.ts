import { describe, expect, it } from "vitest";
import type {
  ConnectorLimitMetadata,
  ConnectorQuotaMetadata,
  ConnectorRateLimitMetadata
} from "../index.js";

describe("connector limit contracts", () => {
  it("models rate-limit metadata without behavior", () => {
    const rateLimit: ConnectorRateLimitMetadata = {
      connectorId: "generic-source",
      operationName: "list",
      requests: {
        limit: 100,
        remaining: 50,
        resetAt: "2026-07-01T01:00:00.000Z",
        windowSeconds: 3600
      }
    };

    expect(rateLimit.requests?.remaining).toBe(50);
  });

  it("models quota metadata independently from rate limits", () => {
    const quota: ConnectorQuotaMetadata = {
      connectorId: "generic-source",
      daily: {
        limit: 1000,
        used: 10,
        resetsAt: "2026-07-02T00:00:00.000Z",
        unit: "records"
      }
    };
    const limits: ConnectorLimitMetadata = {
      quota
    };

    expect(limits.quota?.daily?.unit).toBe("records");
  });
});
