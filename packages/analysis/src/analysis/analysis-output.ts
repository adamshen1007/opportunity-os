import type { StructuredOutputValue } from "@opportunity-os/llm-analysis";
import type {
  StructuredAnalysisId,
  StructuredAnalysisPrimitiveValue,
  StructuredAnalysisTimestamp,
  StructuredAnalysisVersion
} from "./primitives.js";
import type { StructuredAnalysisSchemaContract } from "./schema.js";

export const STRUCTURED_ANALYSIS_OUTPUT_STATUSES = {
  accepted: "accepted",
  rejected: "rejected",
  normalized: "normalized"
} as const;

export type StructuredAnalysisOutputStatus =
  (typeof STRUCTURED_ANALYSIS_OUTPUT_STATUSES)[keyof typeof STRUCTURED_ANALYSIS_OUTPUT_STATUSES];

export type StructuredAnalysisOutputMetadata = {
  readonly schema: StructuredAnalysisSchemaContract;
  readonly producedAt: StructuredAnalysisTimestamp;
  readonly warnings: readonly string[];
};

export type StructuredAnalysisOutput = {
  readonly analysisId: StructuredAnalysisId;
  readonly version: StructuredAnalysisVersion;
  readonly status: StructuredAnalysisOutputStatus;
  readonly values: Readonly<Record<string, StructuredAnalysisPrimitiveValue | StructuredOutputValue>>;
  readonly metadata: StructuredAnalysisOutputMetadata;
};

