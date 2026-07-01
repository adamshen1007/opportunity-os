import { describe, expect, it } from "vitest";
import {
  createConnectorRuntimeError,
  type ConnectorRuntimeCheckpoint,
  type ConnectorRuntimeExecutionMetrics,
  type ConnectorRuntimeExecutionResultAggregation,
  type ConnectorRuntimeTelemetryEvent
} from "../index.js";

const forbiddenValues = [
  "raw-secret",
  "raw-token",
  "raw-auth-header",
  "raw-provider-key",
  "raw-credential",
  "postgres://user:password@localhost:5432/db",
  "https://example.test/callback?token=raw-token",
  "raw-config-value",
  "raw-response-payload",
  "stack trace line",
  "cause detail",
  "dependency internals"
];

function expectSecretSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  for (const forbidden of forbiddenValues) {
    expect(serialized).not.toContain(forbidden);
  }
}

describe("connector runtime security contracts", () => {
  it("redacts runtime failure messages and omits unsafe error internals", () => {
    const error = createConnectorRuntimeError({
      message:
        "Failed token=raw-token password=raw-secret Authorization=Bearer raw-auth-header provider_key=raw-provider-key database=postgres://user:password@localhost:5432/db",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause: new Error("stack trace line cause detail")
    });

    expectSecretSafe(error.toSafeDetails());
    expect(Object.keys(error.toSafeDetails()).sort()).toEqual([
      "category",
      "code",
      "correlationId",
      "message",
      "requestId"
    ]);
  });

  it("keeps telemetry output limited to safe structured fields", () => {
    const telemetry: ConnectorRuntimeTelemetryEvent = {
      kind: "pipeline.failed",
      timestamp: "2026-07-01T00:00:00.000Z",
      correlationId: "correlation-1",
      eventName: "connector-runtime.pipeline.failed",
      safeMessage: "Pipeline failed with safe runtime details.",
      payload: {
        processed: 1,
        failed: 1
      }
    };

    expectSecretSafe(telemetry);
  });

  it("keeps metrics, checkpoints, and aggregation output secret-safe", () => {
    const metrics: ConnectorRuntimeExecutionMetrics = {
      counts: {
        processed: 1,
        succeeded: 0,
        failed: 1
      },
      durations: {
        totalMs: 10
      },
      attempts: {
        attempts: 1
      },
      failures: {
        failureCount: 1,
        issueCodes: ["safe-policy-failure"]
      }
    };
    const checkpoint: ConnectorRuntimeCheckpoint = {
      id: "checkpoint-1",
      cursor: {
        value: "safe-cursor"
      },
      stateSnapshot: {
        state: "failed",
        metadata: {
          processed: 1
        }
      },
      createdAt: "2026-07-01T00:00:00.000Z",
      readiness: {
        replayable: false,
        resumable: true,
        safeMessage: "Resume from safe checkpoint metadata."
      }
    };
    const safeError = createConnectorRuntimeError({
      message: "Runtime failed token=raw-token",
      correlationId: "correlation-1"
    }).toSafeDetails();
    const aggregate: ConnectorRuntimeExecutionResultAggregation = {
      status: "failed",
      connectorResults: [
        {
          ok: false,
          metadata: {
            connectorId: "generic-source",
            correlationId: "correlation-1"
          },
          error: safeError
        }
      ],
      metrics,
      checkpoints: [checkpoint],
      validationIssues: [
        {
          code: "dependency-invalid",
          target: "dependency",
          safeMessage: "Dependency failed safe validation."
        }
      ],
      errors: [safeError]
    };

    expectSecretSafe(metrics);
    expectSecretSafe(checkpoint);
    expectSecretSafe(aggregate);
    expect(JSON.stringify(aggregate.connectorResults)).not.toContain("value");
  });
});
