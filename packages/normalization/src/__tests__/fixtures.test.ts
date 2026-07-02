import { describe, expect, it } from "vitest";
import {
  NORMALIZATION_FIXTURE_IDS,
  NORMALIZATION_FIXTURE_TIMESTAMP,
  normalizationFixtureCanonicalText,
  normalizationFixtureChunking,
  normalizationFixtureInput,
  normalizationFixtureOutput,
  normalizationFixtureRequestedEvent,
  normalizationFixtureResult
} from "../index.js";

describe("normalization fixtures", () => {
  it("provides deterministic fixture identifiers and timestamps", () => {
    expect(NORMALIZATION_FIXTURE_TIMESTAMP).toBe("2026-07-02T00:00:00.000Z");
    expect(NORMALIZATION_FIXTURE_IDS).toEqual({
      canonicalTextId: "canonical_text_fixture_001",
      segmentId: "text_segment_fixture_001",
      chunkId: "text_chunk_fixture_001",
      correlationId: "corr_normalization_fixture_001",
      eventId: "event_normalization_fixture_001"
    });
  });

  it("models a complete fixture pipeline without execution behavior", () => {
    expect(normalizationFixtureInput.requestedStages).toContain("validation");
    expect(normalizationFixtureOutput.canonicalText.id).toBe(
      normalizationFixtureCanonicalText.id
    );
    expect(normalizationFixtureChunking.chunks[0]?.canonicalTextId).toBe(
      normalizationFixtureCanonicalText.id
    );
    expect(normalizationFixtureResult.ok).toBe(true);
    expect(normalizationFixtureRequestedEvent.metadata.eventName).toBe(
      "normalization.requested"
    );
  });
});
