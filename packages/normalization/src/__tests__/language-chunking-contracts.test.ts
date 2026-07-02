import { describe, expect, it } from "vitest";
import {
  LANGUAGE_CONFIDENCE_LEVELS,
  LANGUAGE_DETECTION_METHODS,
  TEXT_CHUNK_STRATEGIES,
  type LanguageDetectionContract,
  type TextChunkingContract
} from "../index.js";

describe("language and chunking contracts", () => {
  it("locks language detection vocabularies", () => {
    expect(LANGUAGE_DETECTION_METHODS).toEqual([
      "declared-metadata",
      "unicode-script",
      "dictionary-profile",
      "manual-annotation"
    ]);
    expect(LANGUAGE_CONFIDENCE_LEVELS).toEqual([
      "unknown",
      "low",
      "medium",
      "high"
    ]);
  });

  it("locks text chunking strategies", () => {
    expect(TEXT_CHUNK_STRATEGIES).toEqual([
      "fixed-character-window",
      "paragraph-boundary",
      "segment-boundary",
      "source-boundary"
    ]);
  });

  it("models language detection and chunking without executing either", () => {
    const language: LanguageDetectionContract = {
      stage: "language-detection",
      inputTextId: "canonical-text.fixture",
      detectedLanguages: [
        {
          languageTag: "en",
          confidence: "high",
          method: "declared-metadata"
        }
      ],
      primaryLanguage: {
        languageTag: "en",
        confidence: "high",
        method: "declared-metadata"
      }
    };

    const chunking: TextChunkingContract = {
      stage: "text-chunking",
      canonicalTextId: "canonical-text.fixture",
      options: {
        strategy: "paragraph-boundary",
        maxCharacters: 2000,
        overlapCharacters: 0,
        preserveSegmentBoundaries: true
      },
      chunks: [
        {
          id: "chunk.fixture.1",
          canonicalTextId: "canonical-text.fixture",
          order: 0,
          text: "Fixture text",
          range: {
            start: 0,
            end: 12
          },
          sourceSegmentIds: [],
          strategy: "paragraph-boundary"
        }
      ]
    };

    expect(language.primaryLanguage?.languageTag).toBe("en");
    expect(chunking.chunks[0]?.strategy).toBe("paragraph-boundary");
  });
});
