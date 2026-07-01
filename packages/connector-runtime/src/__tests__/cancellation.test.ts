import { describe, expect, it } from "vitest";
import {
  CONNECTOR_RUNTIME_CANCELLATION_REASON_CODES,
  CONNECTOR_RUNTIME_CANCELLATION_STATES,
  type ConnectorRuntimeCancellationRequest,
  type ConnectorRuntimeCancellationResult
} from "../index.js";

describe("connector runtime cancellation contracts", () => {
  it("defines cancellation states and reason codes", () => {
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
  });

  it("models requested and completed cancellation data", () => {
    const request: ConnectorRuntimeCancellationRequest = {
      state: "requested",
      reasonCode: "user-requested",
      safeMessage: "Cancellation was requested.",
      metadata: {
        correlationId: "correlation-1",
        requestId: "request-1",
        connectorId: "generic-source",
        requestedAt: "2026-07-01T00:00:00.000Z"
      }
    };
    const result: ConnectorRuntimeCancellationResult = {
      state: "cancelled",
      reasonCode: request.reasonCode,
      safeMessage: "Cancellation is recorded.",
      metadata: {
        ...request.metadata,
        cancelledAt: "2026-07-01T00:00:01.000Z"
      }
    };

    expect(result.state).toBe("cancelled");
    expect(result.metadata?.connectorId).toBe("generic-source");
  });
});
