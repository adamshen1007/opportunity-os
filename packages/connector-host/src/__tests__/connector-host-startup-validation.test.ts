import { describe, expect, it } from "vitest";
import {
  CONNECTOR_HOST_STARTUP_CHECK_KINDS,
  CONNECTOR_HOST_STARTUP_ISSUE_CODES,
  CONNECTOR_HOST_STARTUP_RESULT_STATUSES,
  type ConnectorHostStartupValidationResult
} from "../index.js";

describe("connector host startup validation contracts", () => {
  it("defines startup validation vocabularies", () => {
    expect(CONNECTOR_HOST_STARTUP_RESULT_STATUSES).toEqual([
      "valid",
      "invalid"
    ]);
    expect(CONNECTOR_HOST_STARTUP_CHECK_KINDS).toContain("configuration");
    expect(CONNECTOR_HOST_STARTUP_ISSUE_CODES).toContain(
      "missing-logger-binding"
    );
  });

  it("models safe startup validation failures", () => {
    const result: ConnectorHostStartupValidationResult = {
      status: "invalid",
      checks: [
        {
          id: "logger-binding",
          kind: "logger-binding",
          required: true,
          safeDescription: "Structured logger binding is required."
        }
      ],
      issues: [
        {
          code: "missing-logger-binding",
          checkId: "logger-binding",
          safeMessage: "Structured logger binding is missing.",
          correlationId: "correlation-1"
        }
      ]
    };

    expect(result.status).toBe("invalid");
    expect(result.issues[0]?.safeMessage).not.toContain("secret");
  });
});
