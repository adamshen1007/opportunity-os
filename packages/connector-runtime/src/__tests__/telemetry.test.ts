import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS,
  type ConnectorRuntimeTelemetryEvent
} from "../index.js";

describe("connector runtime telemetry contracts", () => {
  it("defines safe structured telemetry event kinds", () => {
    expect(CONNECTOR_RUNTIME_TELEMETRY_EVENT_KINDS).toEqual([
      "pipeline.started",
      "pipeline.completed",
      "pipeline.failed",
      "policy.decision",
      "checkpoint.created"
    ]);
  });

  it("references logging and event concepts without emitters", () => {
    const event: ConnectorRuntimeTelemetryEvent = {
      kind: "pipeline.completed",
      timestamp: "2026-07-01T00:00:00.000Z",
      correlationId: "correlation-1",
      requestId: "request-1",
      eventName: "connector-runtime.pipeline.completed",
      safeMessage: "Pipeline completed.",
      payload: {
        processed: 1
      },
      logEntry: {
        severity: "info",
        correlationId: "correlation-1",
        requestId: "request-1",
        eventName: "connector-runtime.pipeline.completed",
        message: "Pipeline completed."
      },
      eventEnvelope: {
        metadata: {
          eventId: "event-1",
          eventName: "connector-runtime.pipeline.completed",
          category: "observability",
          version: "v1",
          timestamp: "2026-07-01T00:00:00.000Z",
          source: "connector-runtime",
          correlationId: "correlation-1"
        }
      }
    };

    expect(event.payload?.processed).toBe(1);
  });
});
