import { describe, expect, it } from "vitest";
import {
  InfrastructureError,
  createInfrastructureError,
  sanitizeInfrastructureErrorMessage
} from "../index.js";

describe("infrastructure error contracts", () => {
  it("serializes safe error details", () => {
    const error = createInfrastructureError({
      message:
        "Failed with token=abc123 and postgres://user:password@localhost:5432/app",
      correlationId: "corr-1",
      requestId: "req-1",
      cause: new Error("cause with api_key=secret")
    });

    expect(error).toBeInstanceOf(InfrastructureError);
    expect(error.toJSON()).toEqual({
      code: "INFRASTRUCTURE_UNAVAILABLE",
      category: "infrastructure",
      message: "Failed with [REDACTED] and [REDACTED]",
      correlationId: "corr-1",
      requestId: "req-1"
    });
    expect(JSON.stringify(error)).not.toContain("password");
    expect(JSON.stringify(error)).not.toContain("api_key");
  });

  it("sanitizes secret-like values and connection strings", () => {
    expect(
      sanitizeInfrastructureErrorMessage(
        "authorization=Bearer abc redis://:password@localhost:6379"
      )
    ).toBe("[REDACTED] [REDACTED]");
  });
});
