import { describe, expect, it } from "vitest";
import * as rawContent from "../index.js";

describe("raw content export stability", () => {
  it("exports approved runtime constants and fixture helpers from the package root", () => {
    expect(Object.keys(rawContent).sort()).toEqual([
      "RAW_CONTENT_DEDUPLICATION_STATUSES",
      "RAW_CONTENT_ENVELOPE_VERSION",
      "RAW_CONTENT_ERROR_CODES",
      "RAW_CONTENT_EVENT_NAMES",
      "RAW_CONTENT_FINGERPRINT_ALGORITHMS",
      "RAW_CONTENT_FIXTURE_IDS",
      "RAW_CONTENT_FIXTURE_TIMESTAMP",
      "RAW_CONTENT_FOUNDATION_PHASE",
      "RAW_CONTENT_KINDS",
      "RAW_CONTENT_NORMALIZATION_BOUNDARY_STAGES",
      "RAW_CONTENT_PACKAGE_NAME",
      "RAW_CONTENT_SOURCE_PLATFORMS",
      "RAW_CONTENT_VALIDATION_ISSUE_CODES",
      "REDDIT_RAW_CONTENT_MAPPING_TARGETS",
      "RawContentError",
      "rawContentFixtureAuthor",
      "rawContentFixtureAuthorSource",
      "rawContentFixtureComment",
      "rawContentFixtureCommentSource",
      "rawContentFixtureCommunity",
      "rawContentFixtureCommunitySource",
      "rawContentFixtureDeduplicationDecision",
      "rawContentFixtureFingerprint",
      "rawContentFixtureIngestion",
      "rawContentFixturePost",
      "rawContentFixturePostEnvelope",
      "rawContentFixturePostSource",
      "rawContentFixtureProvenance",
      "rawContentFixtureValidationSuccess",
      "redactRawContentErrorValue"
    ]);
  });

  it("locks raw-content contract vocabularies", () => {
    expect(rawContent.RAW_CONTENT_ERROR_CODES).toEqual([
      "RAW_CONTENT_VALIDATION_FAILED",
      "RAW_CONTENT_MAPPING_FAILED",
      "RAW_CONTENT_DEDUPLICATION_FAILED",
      "RAW_CONTENT_STORAGE_PORT_FAILED",
      "RAW_CONTENT_INTERNAL_FAILURE"
    ]);
    expect(rawContent.RAW_CONTENT_FIXTURE_TIMESTAMP).toBe("2026-07-02T00:00:00.000Z");
    expect(rawContent.RAW_CONTENT_FIXTURE_IDS).toMatchObject({
      ingestionId: "ingestion_fixture_001",
      correlationId: "corr_raw_content_fixture_001",
      postId: "raw_post_fixture_001"
    });
  });
});
