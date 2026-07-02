import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { TextCharacterRange } from "../text/index.js";

export const LANGUAGE_DETECTION_METHODS = [
  "declared-metadata",
  "unicode-script",
  "dictionary-profile",
  "manual-annotation"
] as const;

export const LANGUAGE_CONFIDENCE_LEVELS = [
  "unknown",
  "low",
  "medium",
  "high"
] as const;

export type LanguageDetectionMethod =
  (typeof LANGUAGE_DETECTION_METHODS)[number];

export type LanguageConfidenceLevel =
  (typeof LANGUAGE_CONFIDENCE_LEVELS)[number];

export type LanguageTag = string;

export type DetectedLanguage = {
  readonly languageTag: LanguageTag;
  readonly confidence: LanguageConfidenceLevel;
  readonly method: LanguageDetectionMethod;
  readonly range?: TextCharacterRange;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type LanguageDetectionContract = {
  readonly stage: "language-detection";
  readonly inputTextId: string;
  readonly detectedLanguages: readonly DetectedLanguage[];
  readonly primaryLanguage?: DetectedLanguage;
  readonly safeMetadata?: RawContentSafeMetadata;
};
