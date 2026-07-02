import type { EventEnvelope } from "@opportunity-os/events";
import type { StructuredAnalysisId } from "../analysis/index.js";
import type { StructuredAnalysisResultStatus } from "../results/index.js";

export const STRUCTURED_ANALYSIS_EVENT_NAMES = {
  validated: "structured-analysis.validated",
  normalized: "structured-analysis.normalized",
  completed: "structured-analysis.completed",
  failed: "structured-analysis.failed"
} as const;

export type StructuredAnalysisEventName =
  (typeof STRUCTURED_ANALYSIS_EVENT_NAMES)[keyof typeof STRUCTURED_ANALYSIS_EVENT_NAMES];

export type StructuredAnalysisEventPayload = {
  readonly analysisId: StructuredAnalysisId;
  readonly status: StructuredAnalysisResultStatus;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
};

export type StructuredAnalysisEventEnvelope = EventEnvelope<StructuredAnalysisEventPayload>;

