import { describe, expect, it } from "vitest";
import * as normalization from "../index.js";

const REQUIRED_ROOT_EXPORTS = [
  "NORMALIZATION_PACKAGE_NAME",
  "NORMALIZATION_FOUNDATION_PHASE",
  "NORMALIZATION_STAGES",
  "CANONICAL_TEXT_VERSION",
  "MARKDOWN_CLEANING_RULES",
  "HTML_CLEANING_RULES",
  "UNICODE_NORMALIZATION_FORMS",
  "WHITESPACE_NORMALIZATION_RULES",
  "URL_NORMALIZATION_RULES",
  "LANGUAGE_DETECTION_METHODS",
  "LANGUAGE_CONFIDENCE_LEVELS",
  "TEXT_CHUNK_STRATEGIES",
  "METADATA_PRESERVATION_POLICIES",
  "PROVENANCE_PRESERVATION_POLICIES",
  "NORMALIZATION_VALIDATION_ISSUE_CODES",
  "NORMALIZATION_RESULT_STATUSES",
  "NORMALIZATION_EVENT_NAMES",
  "NORMALIZATION_FIXTURE_IDS",
  "NORMALIZATION_FIXTURE_TIMESTAMP",
  "normalizationFixtureCanonicalText",
  "normalizationFixtureInput",
  "normalizationFixtureOutput",
  "normalizationFixtureResult",
  "normalizationFixtureRequestedEvent"
] as const;

describe("normalization public exports", () => {
  it("keeps approved contracts importable from the package root", () => {
    for (const exportName of REQUIRED_ROOT_EXPORTS) {
      expect(Object.hasOwn(normalization, exportName)).toBe(true);
    }
  });
});
