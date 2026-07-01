import { describe, expect, expectTypeOf, it } from "vitest";
import {
  STARTUP_VALIDATION_CHECK_KINDS,
  STARTUP_VALIDATION_STATUSES,
  type StartupValidationCheckKind,
  type StartupValidationResult,
  type StartupValidationStatus
} from "../index.js";

describe("startup validation contracts", () => {
  it("defines stable validation checks and statuses", () => {
    expect(STARTUP_VALIDATION_CHECK_KINDS).toEqual([
      "configuration",
      "dependency-graph",
      "health",
      "package-registration"
    ]);
    expect(STARTUP_VALIDATION_STATUSES).toEqual(["valid", "invalid"]);
  });

  it("represents safe startup validation failures", () => {
    const result: StartupValidationResult = {
      status: "invalid",
      checks: [
        {
          id: "configuration-required",
          kind: "configuration",
          required: true
        }
      ],
      issues: [
        {
          code: "invalid-configuration",
          checkId: "configuration-required",
          safeMessage: "Required configuration is unavailable.",
          path: ["configuration"]
        }
      ]
    };

    expect(result.issues[0]?.safeMessage).toBe(
      "Required configuration is unavailable."
    );
  });

  it("exports literal unions from stable constants", () => {
    expectTypeOf<StartupValidationCheckKind>().toEqualTypeOf<
      (typeof STARTUP_VALIDATION_CHECK_KINDS)[number]
    >();
    expectTypeOf<StartupValidationStatus>().toEqualTypeOf<
      (typeof STARTUP_VALIDATION_STATUSES)[number]
    >();
  });
});
