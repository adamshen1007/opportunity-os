import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES,
  CONNECTOR_RUNTIME_BACKOFF_KINDS,
  CONNECTOR_RUNTIME_CANCELLATION_REASON_CODES,
  CONNECTOR_RUNTIME_CANCELLATION_STATES,
  CONNECTOR_RUNTIME_EXECUTION_STATES,
  CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS,
  CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS,
  CONNECTOR_RUNTIME_RETRY_DECISIONS,
  CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS,
  CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES,
  CONNECTOR_RUNTIME_TIMEOUT_SCOPES,
  CONNECTOR_RUNTIME_TRANSITION_KINDS,
  type ConnectorRuntimeExecutionMetrics,
  type ConnectorRuntimeExecutionResultAggregation,
  type SafeConnectorRuntimeErrorDetails
} from "../index.js";

describe("connector runtime contract stability", () => {
  it("locks state, transition, pipeline, cancellation, and policy vocabularies", () => {
    expect(CONNECTOR_RUNTIME_EXECUTION_STATES).toEqual([
      "created",
      "ready",
      "running",
      "paused",
      "succeeded",
      "failed",
      "cancelled",
      "timed-out"
    ]);
    expect(CONNECTOR_RUNTIME_TRANSITION_KINDS).toEqual([
      "start",
      "pause",
      "resume",
      "succeed",
      "fail",
      "cancel",
      "time-out"
    ]);
    expect(CONNECTOR_RUNTIME_PIPELINE_STAGE_KINDS).toEqual([
      "prepare",
      "validate",
      "process",
      "finalize"
    ]);
    expect(CONNECTOR_RUNTIME_CANCELLATION_STATES).toEqual([
      "not-requested",
      "requested",
      "cancelled"
    ]);
    expect(CONNECTOR_RUNTIME_CANCELLATION_REASON_CODES).toEqual([
      "user-requested",
      "superseded",
      "policy-requested",
      "runtime-shutdown"
    ]);
    expect(CONNECTOR_RUNTIME_BACKOFF_KINDS).toEqual([
      "fixed",
      "linear",
      "exponential"
    ]);
    expect(CONNECTOR_RUNTIME_RETRY_DECISIONS).toEqual([
      "retry",
      "do-not-retry"
    ]);
    expect(CONNECTOR_RUNTIME_TIMEOUT_SCOPES).toEqual([
      "pipeline",
      "stage",
      "operation"
    ]);
    expect(CONNECTOR_RUNTIME_TIMEOUT_RESULT_STATUSES).toEqual([
      "within-limit",
      "timed-out"
    ]);
    expect(CONNECTOR_RUNTIME_RATE_LIMIT_DECISIONS).toEqual([
      "allow",
      "defer",
      "reject"
    ]);
  });

  it("locks telemetry event names and aggregate result statuses", () => {
    expect(CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS).toEqual([
      "pipeline.started",
      "pipeline.completed",
      "pipeline.failed",
      "policy.decision",
      "checkpoint.created"
    ]);
    expect(CONNECTOR_RUNTIME_AGGREGATE_RESULT_STATUSES).toEqual([
      "succeeded",
      "partially-succeeded",
      "failed",
      "cancelled"
    ]);
  });

  it("locks metric, result, and safe error shapes", () => {
    const metrics: ConnectorRuntimeExecutionMetrics = {
      counts: {
        processed: 1,
        succeeded: 1,
        failed: 0
      },
      durations: {
        totalMs: 5
      },
      attempts: {
        attempts: 1
      }
    };
    const error: SafeConnectorRuntimeErrorDetails = {
      code: "INFRASTRUCTURE_UNAVAILABLE",
      category: "infrastructure",
      message: "Safe failure.",
      correlationId: "correlation-1",
      requestId: "request-1"
    };
    const aggregate: ConnectorRuntimeExecutionResultAggregation = {
      status: "failed",
      connectorResults: [
        {
          ok: false,
          error
        }
      ],
      metrics,
      checkpoints: [],
      validationIssues: [],
      errors: [error]
    };

    expect(Object.keys(metrics).sort()).toEqual([
      "attempts",
      "counts",
      "durations"
    ]);
    expect(Object.keys(aggregate).sort()).toEqual([
      "checkpoints",
      "connectorResults",
      "errors",
      "metrics",
      "status",
      "validationIssues"
    ]);
    expect(Object.keys(error).sort()).toEqual([
      "category",
      "code",
      "correlationId",
      "message",
      "requestId"
    ]);
  });
});
