import { describe, expect, it } from "vitest";
import {
  RawContentError,
  rawContentFixtureDeduplicationDecision,
  rawContentFixturePostEnvelope,
  rawContentFixtureValidationSuccess,
  redactRawContentErrorValue
} from "../index.js";

const forbiddenSecretPattern =
  /access_token|refresh_token|authorization|bearer secret-token|client_secret|raw_provider_payload|provider response|stack trace|super-secret/iu;

describe("raw content security contracts", () => {
  it("keeps deterministic fixtures free of secrets and raw provider payloads", () => {
    const serialized = JSON.stringify({
      envelope: rawContentFixturePostEnvelope,
      validation: rawContentFixtureValidationSuccess,
      deduplication: rawContentFixtureDeduplicationDecision
    });

    expect(serialized).not.toMatch(forbiddenSecretPattern);
    expect(serialized).toContain("\"redacted\":true");
    expect(serialized).toContain("\"payloadStored\":false");
  });

  it("redacts secret-like values from safe raw-content errors", () => {
    const error = new RawContentError({
      code: "RAW_CONTENT_VALIDATION_FAILED",
      category: "validation",
      message:
        "Validation failed access_token=super-secret authorization=Bearer secret-token client_secret=super-secret",
      correlationId: "corr_raw_content",
      requestId: "request_raw_content",
      cause: new Error("provider response with raw_provider_payload and stack trace")
    });

    const serialized = JSON.stringify(error);

    expect(serialized).toContain("RAW_CONTENT_VALIDATION_FAILED");
    expect(serialized).not.toMatch(forbiddenSecretPattern);
    expect(serialized).not.toContain("cause");
    expect(serialized).not.toContain("stack");
  });

  it("redacts standalone secret-like strings deterministically", () => {
    expect(
      redactRawContentErrorValue("password=super-secret token=super-secret api_key=super-secret")
    ).toBe("[REDACTED] [REDACTED] [REDACTED]");
  });
});
