import { describe, expect, it } from "vitest";
import {
  CANONICAL_TEXT_VERSION,
  type CanonicalText,
  type TextSegment
} from "../index.js";

const source = {
  platform: "reddit",
  objectKind: "post",
  objectId: "reddit_post_normalization_1",
  safeProviderMetadata: {
    kind: "safe-provider-metadata",
    redacted: true,
    source: "reddit"
  }
} as const;

describe("canonical text contracts", () => {
  it("models normalized text and source-aligned segments without behavior", () => {
    const segment: TextSegment = {
      id: "segment_1",
      order: 0,
      text: "Example normalized text.",
      range: {
        start: 0,
        end: 24
      },
      sourceRange: {
        start: 0,
        end: 31
      }
    };

    const canonicalText: CanonicalText = {
      id: "canonical_text_1",
      version: CANONICAL_TEXT_VERSION,
      format: "plain-text",
      sourceKind: "post",
      source,
      text: segment.text,
      segments: [segment],
      normalizedAt: "2026-07-02T00:00:00.000Z"
    };

    expect(canonicalText.version).toBe("1.0.0");
    expect(canonicalText.segments[0]?.sourceRange).toEqual({
      start: 0,
      end: 31
    });
  });
});
