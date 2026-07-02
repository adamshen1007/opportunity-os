import type { RawContentProvenance, RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { StructuredAnalysisId, StructuredAnalysisTimestamp } from "../analysis/index.js";
import type { StructuredAnalysisEvidenceReference } from "../evidence/index.js";

export const STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES = {
  llmOutput: "llm-output",
  structuredAnalysisContract: "structured-analysis-contract",
  normalizedStructuredOutput: "normalized-structured-output"
} as const;

export type StructuredAnalysisProvenanceBoundary =
  (typeof STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES)[keyof typeof STRUCTURED_ANALYSIS_PROVENANCE_BOUNDARIES];

export type StructuredAnalysisProvenance = {
  readonly analysisId: StructuredAnalysisId;
  readonly source: RawContentProvenance;
  readonly boundary: StructuredAnalysisProvenanceBoundary;
  readonly evidence: readonly StructuredAnalysisEvidenceReference[];
  readonly recordedAt: StructuredAnalysisTimestamp;
  readonly safeMetadata?: RawContentSafeMetadata;
};

