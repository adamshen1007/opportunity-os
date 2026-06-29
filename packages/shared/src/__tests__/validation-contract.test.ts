import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  ValidationFailure,
  ValidationIssue,
  ValidationIssueMetadata,
  ValidationIssueSeverity,
  ValidationResult,
  ValidationResultMetadata,
  ValidationSuccess
} from "../index.js";

describe("validation contracts", () => {
  it("defines validation issue metadata without domain rules", () => {
    const metadata = {
      expected: "non-empty string",
      received: ""
    } satisfies ValidationIssueMetadata;

    const issue = {
      code: "REQUIRED",
      message: "Value is required.",
      path: ["configuration", "APP_NAME"],
      severity: "error",
      metadata
    } satisfies ValidationIssue;

    expect(issue).toEqual({
      code: "REQUIRED",
      message: "Value is required.",
      path: ["configuration", "APP_NAME"],
      severity: "error",
      metadata: {
        expected: "non-empty string",
        received: ""
      }
    });
  });

  it("defines validation success contracts", () => {
    const result = {
      success: true,
      value: {
        name: "Opportunity OS"
      }
    } satisfies ValidationSuccess<{ readonly name: string }>;

    expect(result).toEqual({
      success: true,
      value: {
        name: "Opportunity OS"
      }
    });
  });

  it("defines validation failure contracts", () => {
    const result = {
      success: false,
      issues: [
        {
          code: "INVALID_FORMAT",
          message: "Value has an invalid format.",
          severity: "error"
        }
      ]
    } satisfies ValidationFailure;

    expect(result).toEqual({
      success: false,
      issues: [
        {
          code: "INVALID_FORMAT",
          message: "Value has an invalid format.",
          severity: "error"
        }
      ]
    });
  });

  it("supports generic validation result and metadata types", () => {
    expectTypeOf<ValidationIssueSeverity>().toEqualTypeOf<
      "error" | "warning"
    >();
    expectTypeOf<ValidationResult<{ readonly ok: true }>>().toMatchTypeOf<
      | {
          readonly success: true;
          readonly value: { readonly ok: true };
          readonly issues?: readonly [];
        }
      | {
          readonly success: false;
          readonly issues: readonly ValidationIssue[];
        }
    >();
    expectTypeOf<ValidationResultMetadata>().toMatchTypeOf<{
      readonly validatedAt?: string;
      readonly source?: string;
      readonly [key: string]: unknown;
    }>();
  });
});
