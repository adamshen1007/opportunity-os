import type { StructuredAnalysisFieldPath } from "../analysis/index.js";

export type StructuredAnalysisConfidenceScore = number & { readonly __brand: "StructuredAnalysisConfidenceScore" };

export const STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS = {
  low: "low",
  medium: "medium",
  high: "high",
  unknown: "unknown"
} as const;

export type StructuredAnalysisConfidenceLevel =
  (typeof STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS)[keyof typeof STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS];

export type StructuredAnalysisConfidence = {
  readonly level: StructuredAnalysisConfidenceLevel;
  readonly score?: StructuredAnalysisConfidenceScore;
  readonly fieldPath?: StructuredAnalysisFieldPath;
  readonly rationale?: string;
};

export type StructuredAnalysisConfidenceSummary = {
  readonly overall: StructuredAnalysisConfidence;
  readonly fields: readonly StructuredAnalysisConfidence[];
};

