import type { EventEnvelope } from "@opportunity-os/events";
import type { AnalysisRequestId } from "../analysis/index.js";
import type { AnalysisResultStatus } from "../results/index.js";

export const ANALYSIS_EVENT_NAMES = {
  requested: "llm-analysis.requested",
  validated: "llm-analysis.validated",
  completed: "llm-analysis.completed",
  failed: "llm-analysis.failed",
  rejected: "llm-analysis.rejected"
} as const;

export type AnalysisEventName =
  (typeof ANALYSIS_EVENT_NAMES)[keyof typeof ANALYSIS_EVENT_NAMES];

export type AnalysisEventPayload = {
  readonly requestId: AnalysisRequestId;
  readonly status: AnalysisResultStatus;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean | null>>;
};

export type AnalysisEventEnvelope = EventEnvelope<AnalysisEventPayload>;
