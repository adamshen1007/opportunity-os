import { describe, expect, it } from "vitest";
import {
  normalizationFixtureCanonicalText,
  normalizationFixtureInput,
  normalizationFixtureMetadataPreservation,
  normalizationFixtureOutput,
  normalizationFixtureRequestedEvent,
  normalizationFixtureResult,
  type NormalizationFailureResult
} from "../index.js";

const unsafePattern =
  /access_token|refresh_token|authorization|bearer|client_secret|password|credential|api[_-]?key|raw_provider_payload|raw response|stack|cause/iu;

describe("normalization security contracts", () => {
  it("does not leak secrets or raw provider payloads from fixtures", () => {
    const serialized = JSON.stringify({
      normalizationFixtureCanonicalText,
      normalizationFixtureInput,
      normalizationFixtureMetadataPreservation,
      normalizationFixtureOutput,
      normalizationFixtureRequestedEvent,
      normalizationFixtureResult
    });

    expect(serialized).not.toMatch(unsafePattern);
  });

  it("models safe failure output without stack or raw cause details", () => {
    const failure: NormalizationFailureResult = {
      ok: false,
      status: "failure",
      failure: {
        code: "normalization.safe_failure",
        safeMessage: "Normalization failed with a safe contract error.",
        issues: [
          {
            code: "unsafe-metadata",
            path: ["safeMetadata"],
            safeMessage: "Unsafe metadata must be excluded."
          }
        ]
      }
    };

    expect(JSON.stringify(failure)).not.toMatch(unsafePattern);
  });
});
