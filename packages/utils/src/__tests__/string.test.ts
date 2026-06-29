import { describe, expect, it } from "vitest";

import {
  DEFAULT_REDACTION,
  normalizeWhitespace,
  redactSecretLikeText,
  redactValue
} from "../index.js";

describe("string utilities", () => {
  it("normalizes whitespace deterministically", () => {
    expect(normalizeWhitespace("  one\n\t two   three  ")).toBe("one two three");
  });

  it("redacts whole values without returning raw input", () => {
    expect(redactValue("raw-secret")).toBe(DEFAULT_REDACTION);
    expect(redactValue("raw-secret", "[hidden]")).toBe("[hidden]");
    expect(redactValue("")).toBe("");
    expect(redactValue(null)).toBe("");
    expect(redactValue(undefined)).toBe("");
  });

  it("redacts API keys, tokens, passwords, and authorization values", () => {
    const unsafe =
      "apiKey=raw-api-key token:raw-token password=raw-password authorization=raw-auth Bearer raw-bearer Basic raw-basic";

    const safe = redactSecretLikeText(unsafe);

    expect(safe).toBe(
      `apiKey=${DEFAULT_REDACTION} token=${DEFAULT_REDACTION} password=${DEFAULT_REDACTION} authorization=${DEFAULT_REDACTION} Bearer ${DEFAULT_REDACTION} Basic ${DEFAULT_REDACTION}`
    );
    expect(safe).not.toContain("raw-api-key");
    expect(safe).not.toContain("raw-token");
    expect(safe).not.toContain("raw-password");
    expect(safe).not.toContain("raw-auth");
    expect(safe).not.toContain("raw-bearer");
    expect(safe).not.toContain("raw-basic");
  });

  it("redacts DSNs and credential-bearing URLs", () => {
    const unsafe =
      "dsn=postgres://user:pass@example.test/database url postgres://admin:secret@example.test/database";

    const safe = redactSecretLikeText(unsafe);

    expect(safe).toBe(
      `dsn=${DEFAULT_REDACTION} url postgres://${DEFAULT_REDACTION}@example.test/database`
    );
    expect(safe).not.toContain("user:pass");
    expect(safe).not.toContain("admin:secret");
  });

  it("handles empty and non-secret text without false redaction", () => {
    expect(redactSecretLikeText("")).toBe("");
    expect(redactSecretLikeText(null)).toBe("");
    expect(redactSecretLikeText(undefined)).toBe("");
    expect(redactSecretLikeText("plain status message")).toBe(
      "plain status message"
    );
  });
});
