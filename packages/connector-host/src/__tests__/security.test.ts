import { describe, expect, it } from "vitest";
import {
  createConnectorHostError,
  type ConnectorHostHealthResult,
  type ConnectorHostResult,
  type ConnectorHostShutdownResult,
  type ConnectorHostStartupValidationResult
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
  "raw-payload",
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

describe("connector host security contracts", () => {
  it("keeps startup and health failures secret-safe", () => {
    const startup: ConnectorHostStartupValidationResult = {
      status: "invalid",
      checks: [
        {
          id: "configuration",
          kind: "configuration",
          required: true,
          safeDescription: "Configuration binding is required."
        }
      ],
      issues: [
        {
          code: "invalid-configuration-binding",
          checkId: "configuration",
          safeMessage: "Configuration binding failed safe validation.",
          correlationId: "correlation-1"
        }
      ]
    };
    const health: ConnectorHostHealthResult = {
      status: "unhealthy",
      aggregate: {
        host: {
          hostId: "host-1",
          status: "unhealthy",
          checkedAt: "2026-07-01T00:00:00.000Z",
          correlationId: "correlation-1",
          safeMessage: "Host health is unavailable."
        },
        runtime: {
          status: "unknown",
          checkedAt: "2026-07-01T00:00:00.000Z",
          safeMessage: "Runtime health is unavailable."
        },
        connectors: {
          status: "unknown",
          results: []
        }
      },
      failures: [
        {
          hostId: "host-1",
          status: "unhealthy",
          checkedAt: "2026-07-01T00:00:00.000Z",
          correlationId: "correlation-1",
          safeMessage: "Host health failed safely."
        }
      ]
    };

    expectSecretSafe(startup);
    expectSecretSafe(health);
  });

  it("keeps host errors, results, telemetry bindings, and shutdown failures safe", () => {
    const safeError = createConnectorHostError({
      message:
        "Failed token=raw-token password=raw-secret Authorization=Bearer raw-auth-header provider_key=raw-provider-key database=postgres://user:password@localhost:5432/db",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause: new Error("stack trace line cause detail")
    }).toSafeDetails();
    const result: ConnectorHostResult = {
      status: "failed",
      metadata: {
        hostId: "host-1",
        correlationId: "correlation-1"
      },
      errors: [safeError]
    };
    const telemetryBinding = {
      correlationId: "correlation-1",
      requestId: "request-1",
      safeEventName: "connector-host.safe-event",
      safeMessage: "Telemetry binding is safe."
    };
    const shutdown: ConnectorHostShutdownResult = {
      status: "failed",
      plan: {
        participants: []
      },
      failures: [
        {
          participantId: "host",
          code: "shutdown-failed",
          safeMessage: "Host shutdown failed safely.",
          correlationId: "correlation-1"
        }
      ]
    };

    expectSecretSafe(safeError);
    expectSecretSafe(result);
    expectSecretSafe(telemetryBinding);
    expectSecretSafe(shutdown);
  });
});
