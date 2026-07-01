import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES,
  type ConnectorRuntimeExecutionResultAggregation
} from "../index.js";

describe("connector runtime execution result aggregation contracts", () => {
  it("combines connector results, metrics, checkpoints, validation issues, and safe errors", () => {
    const aggregate: ConnectorRuntimeExecutionResultAggregation = {
      status: "partially-succeeded",
      connectorResults: [
        {
          ok: true,
          metadata: {
            connectorId: "generic-source",
            operationName: "list",
            correlationId: "correlation-1"
          }
        }
      ],
      metrics: {
        counts: {
          processed: 1,
          succeeded: 1,
          failed: 0
        },
        durations: {
          totalMs: 10
        },
        attempts: {
          attempts: 1
        }
      },
      checkpoints: [
        {
          id: "checkpoint-1",
          stateSnapshot: {
            state: "succeeded"
          },
          createdAt: "2026-07-01T00:00:00.000Z",
          readiness: {
            replayable: true,
            resumable: false
          }
        }
      ],
      validationIssues: [],
      errors: []
    };

    expect(CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES).toContain(
      aggregate.status
    );
  });
});
