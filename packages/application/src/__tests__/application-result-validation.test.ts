import { describe, expect, expectTypeOf, it } from "vitest";
import {
  applicationFailure,
  applicationSuccess,
  applicationValidationFailure,
  applicationValidationSuccess,
  type ApplicationFailure,
  type ApplicationResult,
  type ApplicationValidationIssue,
  type ApplicationValidationResult
} from "../index.js";

describe("application result and validation contracts", () => {
  it("defines generic result success and failure shapes", () => {
    const success = applicationSuccess({ value: "ok" });
    const failure = applicationFailure("token=secret failed");

    expect(success).toEqual({
      success: true,
      value: { value: "ok" }
    });
    expect(failure).toEqual({
      success: false,
      error: "[REDACTED] failed"
    });
    expectTypeOf(success).toMatchTypeOf<
      ApplicationResult<{ readonly value: string }, string>
    >();
    expectTypeOf(failure).toMatchTypeOf<ApplicationFailure<string>>();
  });

  it("defines validation outcomes and redacts issue messages", () => {
    const issue: ApplicationValidationIssue = {
      path: ["input", "secret"],
      code: "invalid",
      message: "password=raw-secret is invalid",
      metadata: {
        reason: "generic"
      }
    };

    const success = applicationValidationSuccess({ valid: true });
    const failure = applicationValidationFailure([issue]);

    expect(success).toEqual({
      valid: true,
      value: { valid: true }
    });
    expect(failure).toEqual({
      valid: false,
      issues: [
        {
          path: ["input", "secret"],
          code: "invalid",
          message: "[REDACTED] is invalid",
          metadata: {
            reason: "generic"
          }
        }
      ]
    });
    expectTypeOf(success).toMatchTypeOf<
      ApplicationValidationResult<{ readonly valid: boolean }>
    >();
  });
});
