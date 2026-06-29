import { describe, expect, it } from "vitest";

import {
  ERROR_CATEGORIES,
  ERROR_CODES,
  OpportunityError,
  REDACTED_ERROR_VALUE,
  redactSecretLikeValues,
  toSafeErrorDetails
} from "../index.js";

describe("safe error serialization", () => {
  it("includes only safe error fields", () => {
    const cause = new Error("raw provider key sk-secret-should-not-appear");
    const error = new OpportunityError({
      code: ERROR_CODES.externalDependencyFailed,
      category: ERROR_CATEGORIES.externalDependency,
      message: "Provider request failed",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause
    });

    const safeError = toSafeErrorDetails(error);

    expect(safeError).toEqual({
      code: "EXTERNAL_DEPENDENCY_FAILED",
      category: "external_dependency",
      message: "Provider request failed",
      correlationId: "correlation-1",
      requestId: "request-1"
    });
    expect(safeError).not.toHaveProperty("stack");
    expect(safeError).not.toHaveProperty("cause");
  });

  it("redacts common secret-like values from safe messages", () => {
    const unsafeMessage =
      "Failed with apiKey=sk-proj-openai-secret token=raw-token authorization=BearerSecret password=hunter2 dsn=https://user:pass@example.test/1";

    const safeMessage = redactSecretLikeValues(unsafeMessage);

    expect(safeMessage).toContain(REDACTED_ERROR_VALUE);
    expect(safeMessage).not.toContain("sk-proj-openai-secret");
    expect(safeMessage).not.toContain("raw-token");
    expect(safeMessage).not.toContain("BearerSecret");
    expect(safeMessage).not.toContain("hunter2");
    expect(safeMessage).not.toContain("user:pass@example.test");
  });

  it("uses safe serialization for JSON output", () => {
    const error = new OpportunityError({
      code: ERROR_CODES.validationFailed,
      category: ERROR_CATEGORIES.validation,
      message: "Invalid authorization=raw-auth-value",
      correlationId: "correlation-token=raw-correlation-token",
      requestId: "request-secret=raw-request-secret"
    });

    const serialized = JSON.parse(JSON.stringify(error)) as Record<string, unknown>;

    expect(serialized).toEqual({
      code: "VALIDATION_FAILED",
      category: "validation",
      message: `Invalid ${REDACTED_ERROR_VALUE}`,
      correlationId: `correlation-${REDACTED_ERROR_VALUE}`,
      requestId: `request-${REDACTED_ERROR_VALUE}`
    });
    expect(JSON.stringify(serialized)).not.toContain("raw-auth-value");
    expect(JSON.stringify(serialized)).not.toContain("raw-correlation-token");
    expect(JSON.stringify(serialized)).not.toContain("raw-request-secret");
    expect(serialized).not.toHaveProperty("stack");
    expect(serialized).not.toHaveProperty("cause");
  });
});
