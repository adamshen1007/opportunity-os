import { describe, expect, it } from "vitest";
import {
  INFRASTRUCTURE_BOOTSTRAP_STATUSES,
  type InfrastructureBootstrapInput,
  type InfrastructureBootstrapValidationResult,
  type InfrastructureComposedContainerResult
} from "../index.js";

describe("infrastructure bootstrap contracts", () => {
  it("defines stable bootstrap statuses", () => {
    expect(INFRASTRUCTURE_BOOTSTRAP_STATUSES).toEqual([
      "ready",
      "invalid"
    ]);
  });

  it("accepts explicit bootstrap input without ambient state", () => {
    const input: InfrastructureBootstrapInput = {
      modules: [
        {
          id: "configuration",
          kind: "configuration"
        }
      ]
    };

    expect(input.modules[0]?.id).toBe("configuration");
  });

  it("represents validation success and failure results", () => {
    const success: InfrastructureBootstrapValidationResult = {
      valid: true,
      issues: []
    };
    const failure: InfrastructureBootstrapValidationResult = {
      valid: false,
      issues: [
        {
          code: "missing-module",
          message: "Required module is not registered.",
          path: ["modules", "logging"]
        }
      ]
    };

    expect(success.valid).toBe(true);
    expect(failure.issues[0]?.code).toBe("missing-module");
  });

  it("separates composed container success from invalid bootstrap output", () => {
    const invalid: InfrastructureComposedContainerResult = {
      status: "invalid",
      validation: {
        valid: false,
        issues: [
          {
            code: "composition-failed",
            message: "Container composition failed."
          }
        ]
      }
    };

    expect(invalid.status).toBe("invalid");
    expect(invalid.validation.valid).toBe(false);
  });
});
