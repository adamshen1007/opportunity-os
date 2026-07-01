import { describe, expect, it } from "vitest";
import { createConnectorRuntimeError } from "../index.js";

describe("connector runtime error contracts", () => {
  it("serializes safe runtime error details", () => {
    const error = createConnectorRuntimeError({
      message: "Runtime policy failed.",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause: new Error("internal stack detail")
    });

    expect(error.toSafeDetails()).toEqual({
      code: "INFRASTRUCTURE_UNAVAILABLE",
      category: "infrastructure",
      message: "Runtime policy failed.",
      correlationId: "correlation-1",
      requestId: "request-1"
    });
    expect(JSON.stringify(error.toSafeDetails())).not.toContain("stack");
    expect(JSON.stringify(error.toSafeDetails())).not.toContain("cause");
  });

  it("redacts secret-like values from messages", () => {
    const error = createConnectorRuntimeError({
      message:
        "Failed with token=raw-token password=raw-password Authorization=Bearer raw-auth",
      correlationId: "correlation-1"
    });
    const safeDetails = JSON.stringify(error.toSafeDetails());

    expect(safeDetails).toContain("[REDACTED]");
    expect(safeDetails).not.toContain("raw-token");
    expect(safeDetails).not.toContain("raw-password");
    expect(safeDetails).not.toContain("raw-auth");
  });
});
