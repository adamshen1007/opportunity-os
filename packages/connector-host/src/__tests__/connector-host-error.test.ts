import { describe, expect, it } from "vitest";
import {
  ConnectorHostError,
  createConnectorHostError,
  sanitizeConnectorHostErrorMessage
} from "../index.js";

describe("connector host error contracts", () => {
  it("serializes safe host errors without unsafe details", () => {
    const error = createConnectorHostError({
      message: "provider_key=abc123 token=xyz postgresql://user:pass@localhost/db",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause: new Error("raw cause with password=secret")
    });

    const safe = error.toSafeDetails();

    expect(error).toBeInstanceOf(ConnectorHostError);
    expect(safe.code).toBe("INFRASTRUCTURE_UNAVAILABLE");
    expect(safe.category).toBe("infrastructure");
    expect(safe.correlationId).toBe("correlation-1");
    expect(JSON.stringify(safe)).not.toContain("abc123");
    expect(JSON.stringify(safe)).not.toContain("postgresql://");
    expect(JSON.stringify(safe)).not.toContain("raw cause");
    expect(JSON.stringify(safe)).not.toContain("stack");
  });

  it("redacts common unsafe message fragments", () => {
    expect(
      sanitizeConnectorHostErrorMessage(
        "Bearer abc.token password=pw https://example.test?token=value"
      )
    ).toBe("Bearer [REDACTED] password=[REDACTED] [REDACTED_URL]");
  });
});
