import { describe, expect, it } from "vitest";
import {
  createConnectorError,
  sanitizeConnectorErrorMessage
} from "../index.js";

describe("connector SDK security contracts", () => {
  it("redacts sensitive failure details from safe errors", () => {
    const rawValues = [
      "sk-proj-secret123",
      "token=token-value",
      "authorization=Bearer raw-token",
      "credential=credential-value",
      "provider_key=provider-secret",
      "dsn=https://secret@sentry.example/1",
      "database_url=postgresql://user:password@localhost:5432/db",
      "raw_config=config-secret",
      "response_payload=payload-secret",
      "dependency_details=dependency-secret",
      "redis://user:password@localhost:6379"
    ];
    const error = createConnectorError({
      message: `Failure ${rawValues.join(" ")}`,
      cause: new Error("stack cause token=hidden")
    });
    const serialized = JSON.stringify(error);

    for (const rawValue of rawValues) {
      expect(serialized).not.toContain(rawValue);
    }
    expect(serialized).not.toContain("stack cause token=hidden");
    expect(serialized).not.toContain("stack");
    expect(serialized).toContain("[REDACTED]");
  });

  it("sanitizes direct message text for local and CI output", () => {
    const sanitized = sanitizeConnectorErrorMessage(
      [
        "api_key=abc123",
        "password=secret",
        "Bearer raw-token",
        "postgresql://user:password@localhost:5432/db",
        "dependency_details=raw-internals"
      ].join(" ")
    );

    expect(sanitized).toBe(
      "[REDACTED] [REDACTED] [REDACTED] [REDACTED] [REDACTED]"
    );
  });
});
