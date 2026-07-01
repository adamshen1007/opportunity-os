import { describe, expect, it } from "vitest";
import {
  CONNECTOR_VALIDATION_ISSUE_CODES,
  type ConnectorValidationResult
} from "../index.js";

describe("connector validation contracts", () => {
  it("covers config, metadata, capability, lifecycle, and dependency issues", () => {
    expect(CONNECTOR_VALIDATION_ISSUE_CODES).toEqual([
      "config-invalid",
      "metadata-invalid",
      "capability-invalid",
      "lifecycle-invalid",
      "dependency-invalid"
    ]);
  });

  it("models validation failures with safe issue messages", () => {
    const result: ConnectorValidationResult = {
      ok: false,
      issues: [
        {
          code: "dependency-invalid",
          target: "dependency",
          safeMessage: "Required dependency contract is missing.",
          path: ["dependencies", "logger"],
          connectorId: "generic-source"
        }
      ]
    };

    expect(result.issues[0]?.safeMessage).toBe(
      "Required dependency contract is missing."
    );
  });
});
