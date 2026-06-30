import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CONTAINER_LIFETIMES,
  REGISTRATION_VALIDATION_ISSUE_CODES,
  createDependencyToken,
  type DuplicateTokenIssue,
  type MissingDependencyIssue,
  type RegistrationValidationFailure,
  type RegistrationValidationResult,
  type RegistrationValidationSuccess,
  type UnsupportedLifetimeIssue
} from "../index.js";

describe("registration validation contracts", () => {
  it("defines stable registration validation issue codes", () => {
    expect(REGISTRATION_VALIDATION_ISSUE_CODES).toEqual([
      "duplicate-token",
      "missing-dependency",
      "unsupported-lifetime"
    ]);
  });

  it("represents duplicate token issues", () => {
    const token = createDependencyToken("duplicate.token");
    const issue: DuplicateTokenIssue = {
      code: "duplicate-token",
      token,
      message: "A dependency token is registered more than once."
    };

    expect(issue.token).toBe(token);
    expectTypeOf(issue).toMatchTypeOf<RegistrationValidationFailure["issues"][number]>();
  });

  it("represents missing dependency and unsupported lifetime issues", () => {
    const token = createDependencyToken("service.token");
    const dependency = createDependencyToken("dependency.token");
    const missingDependency: MissingDependencyIssue = {
      code: "missing-dependency",
      token,
      dependency,
      message: "A dependency token is not registered."
    };
    const unsupportedLifetime: UnsupportedLifetimeIssue = {
      code: "unsupported-lifetime",
      token,
      lifetime: "request",
      supportedLifetimes: CONTAINER_LIFETIMES,
      message: "The requested lifetime is not supported."
    };

    expect(missingDependency.dependency).toBe(dependency);
    expect(unsupportedLifetime.supportedLifetimes).toEqual(CONTAINER_LIFETIMES);
  });

  it("defines validation success and failure results", () => {
    const success: RegistrationValidationSuccess = {
      valid: true,
      issues: []
    };
    const failure: RegistrationValidationFailure = {
      valid: false,
      issues: [
        {
          code: "duplicate-token",
          token: createDependencyToken("duplicate.token"),
          message: "A dependency token is registered more than once."
        }
      ]
    };

    expect(success.valid).toBe(true);
    expect(failure.valid).toBe(false);
    expectTypeOf(success).toMatchTypeOf<RegistrationValidationResult>();
    expectTypeOf(failure).toMatchTypeOf<RegistrationValidationResult>();
  });
});
