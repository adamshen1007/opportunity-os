import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_RESULT_STATUSES,
  type ConnectorHostResult
} from "../index.js";

describe("connector host result contracts", () => {
  it("defines result statuses", () => {
    expect(CONNECTOR_HOST_RESULT_STATUSES).toEqual([
      "succeeded",
      "partially-succeeded",
      "failed",
      "validation-failed",
      "shutdown-failed"
    ]);
  });

  it("models validation and shutdown failure results safely", () => {
    const validationResult: ConnectorHostResult = {
      status: "validation-failed",
      metadata: {
        hostId: "host-1",
        correlationId: "correlation-1"
      },
      validationIssues: [
        {
          code: "config-invalid",
          target: "config",
          safeMessage: "Connector configuration is invalid."
        }
      ],
      errors: [
        {
          code: "VALIDATION_FAILED",
          category: "validation",
          message: "Connector host validation failed.",
          correlationId: "correlation-1"
        }
      ]
    };

    const shutdownResult: ConnectorHostResult = {
      status: "shutdown-failed",
      metadata: {
        hostId: "host-1",
        correlationId: "correlation-1"
      },
      shutdown: {
        status: "failed",
        plan: {
          participants: []
        },
        failures: [
          {
            participantId: "runtime",
            code: "shutdown-failed",
            safeMessage: "Runtime boundary failed.",
            correlationId: "correlation-1"
          }
        ]
      },
      errors: [
        {
          code: "INFRASTRUCTURE_UNAVAILABLE",
          category: "infrastructure",
          message: "Connector host shutdown failed.",
          correlationId: "correlation-1"
        }
      ]
    };

    expect(validationResult.status).toBe("validation-failed");
    expect(shutdownResult.status).toBe("shutdown-failed");
  });
});
