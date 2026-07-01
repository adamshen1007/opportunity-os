import { describe, expect, it } from "vitest";
import {
  ConnectorError,
  createConnectorError,
  sanitizeConnectorErrorMessage
} from "../index.js";

describe("connector error contracts", () => {
  it("uses safe external dependency error details", () => {
    const error = createConnectorError({
      message: "Connector operation failed.",
      correlationId: "correlation-1",
      requestId: "request-1",
      cause: new Error("unsafe cause")
    });

    expect(error).toBeInstanceOf(ConnectorError);
    expect(error.toJSON()).toEqual({
      code: "EXTERNAL_DEPENDENCY_FAILED",
      category: "external_dependency",
      message: "Connector operation failed.",
      correlationId: "correlation-1",
      requestId: "request-1"
    });
  });

  it("does not include raw secret-like values in safe output", () => {
    const secretValues = [
      "sk-proj-secret123",
      "token=token-value",
      "authorization=Bearer raw-token",
      "credential=credential-value",
      "provider_key=provider-secret",
      "dsn=https://secret@sentry.example/1",
      "raw_config=config-secret",
      "response_payload=payload-secret",
      "postgresql://user:password@localhost:5432/db"
    ];
    const error = createConnectorError({
      message: `Failure details ${secretValues.join(" ")}`,
      cause: new Error("cause includes payload-secret")
    });
    const serialized = JSON.stringify(error);

    for (const secret of secretValues) {
      expect(serialized).not.toContain(secret);
    }
    expect(serialized).not.toContain("cause includes payload-secret");
    expect(serialized).not.toContain("stack");
    expect(serialized).toContain("[REDACTED]");
  });

  it("sanitizes message text deterministically", () => {
    expect(
      sanitizeConnectorErrorMessage(
        "token=abc bearer xyz https://user:pass@example.invalid/path"
      )
    ).toBe("[REDACTED] [REDACTED] [REDACTED]");
  });
});
