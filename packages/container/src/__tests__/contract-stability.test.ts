import { describe, expect, it } from "vitest";
import {
  COMPOSITION_RESULT_STATUSES,
  CONTAINER_ERROR_CODES,
  CONTAINER_LIFETIMES,
  REGISTRATION_VALIDATION_ISSUE_CODES,
  SERVICE_REGISTRATION_KINDS,
  createContainerError,
  createDependencyToken
} from "../index.js";

describe("container contract stability", () => {
  it("keeps token, lifetime, and registration constants stable", () => {
    expect(createDependencyToken("contract.token")).toEqual({
      id: "contract.token"
    });
    expect(CONTAINER_LIFETIMES).toEqual([
      "singleton",
      "scoped",
      "transient"
    ]);
    expect(SERVICE_REGISTRATION_KINDS).toEqual([
      "class",
      "factory",
      "value"
    ]);
  });

  it("keeps composition and validation shapes stable", () => {
    expect(COMPOSITION_RESULT_STATUSES).toEqual([
      "success",
      "failure"
    ]);
    expect(REGISTRATION_VALIDATION_ISSUE_CODES).toEqual([
      "duplicate-token",
      "missing-dependency",
      "unsupported-lifetime"
    ]);
  });

  it("keeps safe container error shapes stable", () => {
    expect(CONTAINER_ERROR_CODES).toEqual({
      validationFailed: "VALIDATION_FAILED",
      dependencyUnavailable: "INFRASTRUCTURE_UNAVAILABLE",
      compositionFailed: "INTERNAL_SYSTEM_FAILURE"
    });

    const error = createContainerError({
      code: CONTAINER_ERROR_CODES.validationFailed,
      message: "Validation failed for password=secret token=secret-token"
    });

    expect(error.toSafeDetails()).toEqual({
      code: "VALIDATION_FAILED",
      category: "infrastructure",
      message: "Validation failed for [REDACTED] [REDACTED]",
      correlationId: undefined,
      requestId: undefined
    });
  });
});
