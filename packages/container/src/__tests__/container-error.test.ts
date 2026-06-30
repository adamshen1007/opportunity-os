import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CONTAINER_ERROR_CODES,
  ContainerError,
  createContainerError,
  type ContainerErrorCode,
  type SafeContainerErrorDetails
} from "../index.js";

describe("container error contracts", () => {
  it("defines stable container error codes from approved infrastructure errors", () => {
    expect(CONTAINER_ERROR_CODES).toEqual({
      validationFailed: "VALIDATION_FAILED",
      dependencyUnavailable: "INFRASTRUCTURE_UNAVAILABLE",
      compositionFailed: "INTERNAL_SYSTEM_FAILURE"
    });
    expectTypeOf<ContainerErrorCode>().toEqualTypeOf<
      | "VALIDATION_FAILED"
      | "INFRASTRUCTURE_UNAVAILABLE"
      | "INTERNAL_SYSTEM_FAILURE"
    >();
  });

  it("serializes container errors safely", () => {
    const error = createContainerError({
      code: CONTAINER_ERROR_CODES.compositionFailed,
      message: "Composition failed for api_key=sk-test-secret token=raw-token",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause: new Error("password=raw-password")
    });
    const safeDetails = error.toSafeDetails();
    const serialized = JSON.stringify(error);

    expect(error).toBeInstanceOf(ContainerError);
    expect(safeDetails).toEqual({
      code: "INTERNAL_SYSTEM_FAILURE",
      category: "infrastructure",
      message: "Composition failed for [REDACTED] [REDACTED]",
      correlationId: "correlation-1",
      requestId: "request-1"
    });
    expect(serialized).not.toContain("sk-test-secret");
    expect(serialized).not.toContain("raw-token");
    expect(serialized).not.toContain("raw-password");
    expect(serialized).not.toContain("stack");
    expect(serialized).not.toContain("cause");
    expectTypeOf(safeDetails).toEqualTypeOf<SafeContainerErrorDetails>();
  });
});
