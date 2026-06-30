import { describe, expect, test } from "vitest";
import {
  DomainError,
  createDomainError,
  redactDomainErrorText
} from "../errors/index.js";

describe("domain error safety", () => {
  test("serializes safe details without stack traces or causes", () => {
    const error = createDomainError({
      message: "Rejected token=abc123 password=hunter2 payload={private}",
      correlationId: "correlation-token=hidden",
      requestId: "request-password=hidden",
      cause: new Error("provider_key=raw")
    });

    const safeDetails = error.toSafeDetails();

    expect(error).toBeInstanceOf(DomainError);
    expect(safeDetails.message).toContain("[REDACTED]");
    expect(JSON.stringify(safeDetails)).not.toContain("abc123");
    expect(JSON.stringify(safeDetails)).not.toContain("hunter2");
    expect(JSON.stringify(safeDetails)).not.toContain("private");
    expect(JSON.stringify(safeDetails)).not.toContain("provider_key=raw");
    expect(JSON.stringify(safeDetails)).not.toContain("stack");
    expect(JSON.stringify(safeDetails)).not.toContain("cause");
  });

  test("redacts common sensitive text shapes", () => {
    const safeText = redactDomainErrorText(
      "authorization=Bearer secret provider_key=abc credential=pass dsn=https://private"
    );

    expect(safeText).toContain("[REDACTED]");
    expect(safeText).not.toContain("secret");
    expect(safeText).not.toContain("abc");
    expect(safeText).not.toContain("pass");
    expect(safeText).not.toContain("private");
  });
});
