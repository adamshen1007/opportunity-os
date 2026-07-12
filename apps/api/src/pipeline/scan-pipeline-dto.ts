import type { ApiScanValidationMetricsDto } from "./scan-validation-metrics.js";

export const API_SCAN_MODES = {
  fixture: "fixture",
  live: "live"
} as const;

export type ApiScanMode = (typeof API_SCAN_MODES)[keyof typeof API_SCAN_MODES];

export const API_SCAN_SOURCES = {
  reddit: "reddit",
  stackExchange: "stack-exchange"
} as const;

export type ApiScanSource = (typeof API_SCAN_SOURCES)[keyof typeof API_SCAN_SOURCES];

export const API_SCAN_STAGE_STATUSES = {
  completed: "completed",
  skipped: "skipped"
} as const;

export type ApiScanStageStatus =
  (typeof API_SCAN_STAGE_STATUSES)[keyof typeof API_SCAN_STAGE_STATUSES];

export type ApiScanStageDto = {
  readonly name:
    | "source"
    | "raw-content"
    | "normalization"
    | "llm-analysis"
    | "candidate-generation"
    | "opportunity-generation"
    | "ranking";
  readonly status: ApiScanStageStatus;
  readonly safeMessage: string;
};

export type ApiScanEvidenceDto = {
  readonly evidenceId: string;
  readonly sourceType: ApiScanSource;
  readonly summary: string;
  readonly permalink?: string;
  readonly confidence: number;
  readonly provenance: {
    readonly sourcePlatform: ApiScanSource;
    readonly sourceId: string;
    readonly sourceUrl?: string;
    readonly normalizedContentId: string;
    readonly analysisRequestId: string;
  };
};

export type ApiScanOpportunityDto = {
  readonly opportunityId: string;
  readonly title: string;
  readonly summary: string;
  readonly confidence: number;
  readonly rank: {
    readonly position: number;
    readonly score: number;
    readonly explanation: string;
  };
  readonly evidence: readonly ApiScanEvidenceDto[];
  readonly provenance: {
    readonly scanId: string;
    readonly sourceItemId: string;
    readonly redditPostId?: string;
    readonly rawContentId: string;
    readonly normalizedContentId: string;
    readonly analysisRequestId: string;
    readonly candidateId: string;
    readonly generationOutputId: string;
    readonly rankingRunId: string;
  };
};

export type ApiScanResultDto = {
  readonly scanId: string;
  readonly mode: ApiScanMode;
  readonly status: "completed";
  readonly source: {
    readonly provider: ApiScanSource;
    readonly community: string;
    readonly subreddit?: string;
    readonly site?: string;
    readonly query: string;
    readonly attribution: string;
    readonly itemCount: number;
    readonly quota?: {
      readonly remaining?: number;
      readonly maximum?: number;
      readonly backoffSeconds?: number;
      readonly hasMore: boolean;
    };
  };
  readonly stages: readonly ApiScanStageDto[];
  readonly opportunities: readonly ApiScanOpportunityDto[];
  readonly validationMetrics: ApiScanValidationMetricsDto;
  readonly safeMetadata: {
    readonly deterministic: boolean;
    readonly liveEnabled: boolean;
    readonly rawProviderPayloadStored: false;
  };
};
