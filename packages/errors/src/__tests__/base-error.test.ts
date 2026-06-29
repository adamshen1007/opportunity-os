import { describe, expect, it } from "vitest";

import { ERROR_CATEGORIES, ERROR_CODES, OpportunityError } from "../index.js";

describe("OpportunityError", () => {
  it("includes safe error fields and preserves stack traces", () => {
    const error = new OpportunityError({
      code: ERROR_CODES.validationFailed,
      category: ERROR_CATEGORIES.validation,
      message: "Invalid input",
      correlationId: "correlation-123",
      requestId: "request-456"
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("OpportunityError");
    expect(error.code).toBe("VALIDATION_FAILED");
    expect(error.category).toBe("validation");
    expect(error.message).toBe("Invalid input");
    expect(error.correlationId).toBe("correlation-123");
    expect(error.requestId).toBe("request-456");
    expect(error.stack).toContain("OpportunityError");
  });

  it("preserves the original cause", () => {
    const cause = new Error("Database connection detail");
    const error = new OpportunityError({
      code: ERROR_CODES.infrastructureUnavailable,
      category: ERROR_CATEGORIES.infrastructure,
      message: "Infrastructure unavailable",
      cause
    });

    expect(error.cause).toBe(cause);
  });

  it("serializes safe details without stack or cause by default", () => {
    const cause = new Error("Sensitive implementation detail");
    const error = new OpportunityError({
      code: ERROR_CODES.internalSystemFailure,
      category: ERROR_CATEGORIES.internalSystem,
      message: "Internal system failure",
      correlationId: "correlation-abc",
      requestId: "request-def",
      cause
    });

    expect(error.toSafeDetails()).toEqual({
      code: "INTERNAL_SYSTEM_FAILURE",
      category: "internal_system",
      message: "Internal system failure",
      correlationId: "correlation-abc",
      requestId: "request-def"
    });

    const serialized = JSON.parse(JSON.stringify(error)) as Record<string, unknown>;
    expect(serialized).toEqual(error.toSafeDetails());
    expect(serialized).not.toHaveProperty("stack");
    expect(serialized).not.toHaveProperty("cause");
  });
});
