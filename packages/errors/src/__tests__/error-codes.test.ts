import { describe, expect, expectTypeOf, it } from "vitest";

import { ERROR_CATEGORIES, type ErrorCategory, ERROR_CODES, type ErrorCode } from "../index.js";

describe("canonical error categories and codes", () => {
  it("exports the approved error categories", () => {
    expect(ERROR_CATEGORIES).toEqual({
      validation: "validation",
      business: "business",
      infrastructure: "infrastructure",
      externalDependency: "external_dependency",
      internalSystem: "internal_system"
    });

    expectTypeOf<ErrorCategory>().toEqualTypeOf<
      | "validation"
      | "business"
      | "infrastructure"
      | "external_dependency"
      | "internal_system"
    >();
  });

  it("exports stable generic error codes", () => {
    expect(ERROR_CODES).toEqual({
      validationFailed: "VALIDATION_FAILED",
      businessRuleRejected: "BUSINESS_RULE_REJECTED",
      infrastructureUnavailable: "INFRASTRUCTURE_UNAVAILABLE",
      externalDependencyFailed: "EXTERNAL_DEPENDENCY_FAILED",
      internalSystemFailure: "INTERNAL_SYSTEM_FAILURE"
    });

    expectTypeOf<ErrorCode>().toEqualTypeOf<
      | "VALIDATION_FAILED"
      | "BUSINESS_RULE_REJECTED"
      | "INFRASTRUCTURE_UNAVAILABLE"
      | "EXTERNAL_DEPENDENCY_FAILED"
      | "INTERNAL_SYSTEM_FAILURE"
    >();
  });

  it("keeps business errors as shared vocabulary only", () => {
    expect(ERROR_CATEGORIES.business).toBe("business");
    expect(ERROR_CODES.businessRuleRejected).toBe("BUSINESS_RULE_REJECTED");
  });
});
