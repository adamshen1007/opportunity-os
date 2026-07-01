import { describe, expect, it } from "vitest";
import type { ConnectorRuntimeExecutionMetrics } from "../index.js";

describe("connector runtime execution metrics contracts", () => {
  it("models counts, durations, attempts, records, failures, and limits", () => {
    const metrics: ConnectorRuntimeExecutionMetrics = {
      counts: {
        processed: 10,
        succeeded: 8,
        failed: 2
      },
      durations: {
        totalMs: 1250,
        stageDurationsMs: {
          validate: 50,
          process: 1200
        }
      },
      attempts: {
        attempts: 2,
        maxAttempts: 3,
        retryableFailures: 1
      },
      records: {
        recordsRead: 10,
        recordsWritten: 8,
        recordsSkipped: 2
      },
      failures: {
        failureCount: 2,
        issueCodes: ["temporary-failure"]
      },
      limits: {
        quota: {
          connectorId: "generic-source",
          daily: {
            limit: 1000,
            used: 10,
            unit: "requests"
          }
        }
      }
    };

    expect(metrics.counts.processed).toBe(10);
    expect(metrics.limits?.quota?.daily?.used).toBe(10);
  });
});
