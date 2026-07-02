import { describe, expect, it } from "vitest";
import {
  METADATA_PRESERVATION_POLICIES,
  NORMALIZATION_EVENT_NAMES,
  NORMALIZATION_RESULT_STATUSES,
  NORMALIZATION_VALIDATION_ISSUE_CODES,
  PROVENANCE_PRESERVATION_POLICIES,
  type MetadataPreservationContract,
  type NormalizationEventEnvelope,
  type NormalizationFailureResult,
  type NormalizationValidationFailure,
  type ProvenancePreservationContract
} from "../index.js";
import {
  rawContentFixturePostEnvelope,
  rawContentFixtureProvenance
} from "@opportunity-os/raw-content";

describe("normalization preservation, validation, result, and event contracts", () => {
  it("locks preservation, validation, result, and event vocabularies", () => {
    expect(METADATA_PRESERVATION_POLICIES).toEqual([
      "preserve-safe-source-metadata",
      "preserve-ingestion-metadata",
      "preserve-public-provider-reference",
      "drop-unsafe-provider-payload"
    ]);
    expect(PROVENANCE_PRESERVATION_POLICIES).toEqual([
      "preserve-source-reference",
      "preserve-ingestion-reference",
      "preserve-transform-boundary",
      "append-normalization-boundary"
    ]);
    expect(NORMALIZATION_VALIDATION_ISSUE_CODES).toEqual([
      "missing-canonical-text",
      "missing-source-provenance",
      "empty-normalized-text",
      "invalid-text-range",
      "unsafe-metadata",
      "stage-incomplete",
      "chunk-boundary-invalid",
      "language-tag-invalid"
    ]);
    expect(NORMALIZATION_RESULT_STATUSES).toEqual([
      "success",
      "partial-success",
      "validation-failure",
      "failure"
    ]);
    expect(NORMALIZATION_EVENT_NAMES).toEqual([
      "normalization.requested",
      "normalization.completed",
      "normalization.rejected"
    ]);
  });

  it("models metadata and provenance preservation without persistence", () => {
    const metadata: MetadataPreservationContract = {
      stage: "metadata-preservation",
      records: [
        {
          policy: "preserve-safe-source-metadata",
          sourcePath: ["content", "source"],
          targetPath: ["canonicalText", "source"],
          preserved: true,
          safeMessage: "Safe source metadata preserved."
        }
      ]
    };

    const provenance: ProvenancePreservationContract = {
      stage: "provenance-preservation",
      sourceProvenance: rawContentFixtureProvenance,
      normalizedProvenance: {
        ...rawContentFixtureProvenance,
        normalizationBoundary: "normalization-contract"
      },
      records: [
        {
          policy: "append-normalization-boundary",
          preserved: true
        }
      ]
    };

    expect(metadata.records[0]?.preserved).toBe(true);
    expect(provenance.normalizedProvenance.normalizationBoundary).toBe(
      "normalization-contract"
    );
  });

  it("keeps validation failures and results safe", () => {
    const validation: NormalizationValidationFailure = {
      ok: false,
      issues: [
        {
          code: "empty-normalized-text",
          path: ["canonicalText", "text"],
          safeMessage: "Normalized text must not be empty."
        }
      ]
    };

    const result: NormalizationFailureResult = {
      ok: false,
      status: "validation-failure",
      failure: {
        code: "normalization.validation_failed",
        safeMessage: "Normalization contract validation failed.",
        issues: validation.issues
      }
    };

    const serialized = JSON.stringify(result);
    expect(result.failure.issues).toHaveLength(1);
    expect(serialized).not.toMatch(/token|secret|authorization|stack|cause/iu);
  });

  it("models normalization events without an event bus", () => {
    const event: NormalizationEventEnvelope = {
      metadata: {
        eventId: "event.normalization.requested",
        eventName: "normalization.requested",
        category: "infrastructure",
        version: "v1",
        timestamp: "2026-01-01T00:00:00.000Z",
        source: "@opportunity-os/normalization",
        correlationId: "corr_normalization_fixture"
      },
      payload: {
        input: {
          envelope: rawContentFixturePostEnvelope,
          requestedStages: ["canonical-text-model", "validation"]
        }
      }
    };

    expect(event.metadata.eventName).toBe("normalization.requested");
    expect(JSON.stringify(event)).not.toMatch(/access_token|refresh_token/iu);
  });
});
