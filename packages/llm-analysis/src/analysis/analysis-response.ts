import type { LlmProviderMetadata } from "../provider/index.js";
import type { PromptOutput } from "../prompts/index.js";
import type { AnalysisValidationIssue } from "../validation/index.js";

export const ANALYSIS_RESPONSE_STATUSES = {
  accepted: "accepted",
  rejected: "rejected",
  failed: "failed"
} as const;

export type AnalysisResponseStatus =
  (typeof ANALYSIS_RESPONSE_STATUSES)[keyof typeof ANALYSIS_RESPONSE_STATUSES];

export type AnalysisUsageMetadata = {
  readonly inputUnits?: number;
  readonly outputUnits?: number;
  readonly totalUnits?: number;
};

export type AnalysisResponseMetadata = {
  readonly provider: LlmProviderMetadata;
  readonly modelName?: string;
  readonly usage?: AnalysisUsageMetadata;
  readonly validationIssues: readonly AnalysisValidationIssue[];
  readonly executionVersions?: {
    readonly prompt: string;
    readonly schema: string;
    readonly validator: string;
  };
};

export type AnalysisResponse = {
  readonly status: AnalysisResponseStatus;
  readonly output?: PromptOutput;
  readonly metadata: AnalysisResponseMetadata;
};
