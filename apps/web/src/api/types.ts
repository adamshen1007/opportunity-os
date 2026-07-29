export interface DashboardApiResponseMeta {
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface DashboardApiErrorResponseBody {
  readonly code: string;
  readonly statusCode: number;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly details?: readonly string[];
}

export interface DashboardApiSuccessResponse<TData> {
  readonly ok: true;
  readonly data: TData;
  readonly meta: DashboardApiResponseMeta;
}

export interface DashboardApiFailureResponse<TError> {
  readonly ok: false;
  readonly error: TError;
  readonly meta: DashboardApiResponseMeta;
}

export type DashboardApiResponse<TData, TError> =
  | DashboardApiSuccessResponse<TData>
  | DashboardApiFailureResponse<TError>;

export interface DashboardApiSessionDto {
  readonly status: "active" | "expired" | "revoked";
  readonly principal: {
    readonly principalId: string;
    readonly displayName?: string;
    readonly permissions: readonly string[];
  };
  readonly createdAt: string;
  readonly expiresAt: string;
}

export interface DashboardApiLogoutDto {
  readonly loggedOut: true;
}

export interface DashboardApiOpportunityEvidenceDto {
  readonly evidenceId: string;
  readonly sourceType: string;
  readonly summary: string;
  readonly confidence?: number;
}

export interface DashboardApiOpportunityDto {
  readonly opportunityId: string;
  readonly title: string;
  readonly summary: string;
  readonly status: "candidate" | "generated" | "ranked" | "validated";
  readonly confidence: number;
  readonly evidence: readonly DashboardApiOpportunityEvidenceDto[];
  readonly source: {
    readonly sourceId: string;
    readonly sourceType: string;
  };
  readonly rank?: {
    readonly position: number;
    readonly score: number;
  };
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface DashboardApiOpportunityCollectionDto {
  readonly opportunities: readonly DashboardApiOpportunityDto[];
  readonly totalCount?: number;
}

export interface DashboardApiRankingFactorExplanationDto {
  readonly factor: string;
  readonly weight: number;
  readonly contribution: number;
  readonly reason: string;
}

export interface DashboardApiRankingExplanationDto {
  readonly summary: string;
  readonly factors: readonly DashboardApiRankingFactorExplanationDto[];
}

export interface DashboardApiRankedOpportunityDto {
  readonly opportunityId: string;
  readonly position: number;
  readonly score: number;
  readonly explanation: DashboardApiRankingExplanationDto;
}

export interface DashboardApiRankingDto {
  readonly rankingId: string;
  readonly status: "ranked";
  readonly rankedOpportunities: readonly DashboardApiRankedOpportunityDto[];
  readonly generatedAt: string;
}

export type DashboardApiFeedbackStatus = "saved" | "dismissed" | "rated" | "reason-provided";

export type DashboardApiFeedbackReasonCategory =
  | "irrelevant"
  | "duplicate"
  | "low-confidence"
  | "weak-evidence"
  | "poor-ranking"
  | "already-solved"
  | "not-actionable"
  | "other";

export type DashboardApiFeedbackRatingTarget = "usefulness" | "evidence-quality" | "ranking-quality";

export type DashboardApiFeedbackRatingValue = 1 | 2 | 3 | 4 | 5;

export interface DashboardApiFeedbackRatingDto {
  readonly target: DashboardApiFeedbackRatingTarget;
  readonly value: DashboardApiFeedbackRatingValue;
}

export interface DashboardApiFeedbackDto {
  readonly feedbackId: string;
  readonly opportunityId: string;
  readonly status: DashboardApiFeedbackStatus;
  readonly reasonCategories: readonly DashboardApiFeedbackReasonCategory[];
  readonly ratings: readonly DashboardApiFeedbackRatingDto[];
  readonly createdAt: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface DashboardApiFeedbackCollectionDto {
  readonly feedback: readonly DashboardApiFeedbackDto[];
  readonly totalCount: number;
}

export interface DashboardApiCreateFeedbackRequestBody {
  readonly opportunityId: string;
  readonly status: DashboardApiFeedbackStatus;
  readonly reasonCategories?: readonly DashboardApiFeedbackReasonCategory[];
  readonly ratings?: readonly DashboardApiFeedbackRatingDto[];
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export type DashboardApiBugReportSeverity = "low" | "medium" | "high";

export type DashboardApiBugReportStatus = "open" | "acknowledged" | "closed";

export interface DashboardApiBugReportDto {
  readonly bugReportId: string;
  readonly title: string;
  readonly safeDescription: string;
  readonly severity: DashboardApiBugReportSeverity;
  readonly status: DashboardApiBugReportStatus;
  readonly createdAt: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface DashboardApiCreateBugReportRequestBody {
  readonly title: string;
  readonly safeDescription: string;
  readonly severity: DashboardApiBugReportSeverity;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export type DashboardApiScanMode = "fixture" | "live";
export type DashboardApiScanSource = "reddit" | "stack-exchange";

export interface DashboardApiScanRequestBody {
  readonly source: DashboardApiScanSource;
  readonly subreddit?: string;
  readonly site?: string;
  readonly query?: string;
  readonly tags?: readonly string[];
  readonly limit?: number;
  readonly mode?: DashboardApiScanMode;
}

export type DashboardApiScanJobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface DashboardApiScanJobDto {
  readonly jobId: string;
  readonly status: DashboardApiScanJobStatus;
  readonly request: DashboardApiScanRequestBody;
  readonly requestedAt: string;
  readonly updatedAt: string;
  readonly resultScanId?: string;
  readonly safeMessage: string;
  readonly result?: DashboardApiScanResultDto;
}

export interface DashboardApiRedditScanRequestBody {
  readonly subreddit?: string;
  readonly query?: string;
  readonly limit?: number;
  readonly mode?: DashboardApiScanMode;
}

export type DashboardApiScanStageName =
  | "source"
  | "raw-content"
  | "normalization"
  | "llm-analysis"
  | "candidate-generation"
  | "opportunity-generation"
  | "ranking";

export type DashboardApiScanStageStatus = "completed" | "skipped";

export interface DashboardApiScanStageDto {
  readonly name: DashboardApiScanStageName;
  readonly status: DashboardApiScanStageStatus;
  readonly safeMessage: string;
}

export interface DashboardApiScanEvidenceDto {
  readonly evidenceId: string;
  readonly sourceType: DashboardApiScanSource;
  readonly summary: string;
  readonly permalink?: string;
  readonly confidence: number;
  readonly stance: "supporting" | "contradictory" | "excluded";
  readonly observedAt: string;
  readonly connectorId: string;
  readonly provenance: {
    readonly sourcePlatform: DashboardApiScanSource;
    readonly sourceId: string;
    readonly sourceUrl?: string;
    readonly rawContentId: string;
    readonly normalizedContentId: string;
    readonly analysisRequestId: string;
  };
}

export interface DashboardApiScanCitedClaimDto {
  readonly text: string;
  readonly citationIds: readonly string[];
}

export interface DashboardApiScanOpportunityDto {
  readonly opportunityId: string;
  readonly title: string;
  readonly summary: string;
  readonly confidence: number;
  readonly rank: {
    readonly position: number;
    readonly score: number;
    readonly explanation: string;
  };
  readonly synthesis: {
    readonly synthesisId: string;
    readonly clusterId: string;
    readonly clusterFingerprint: string;
    readonly ruleId: string;
    readonly title: string;
    readonly targetUser: DashboardApiScanCitedClaimDto;
    readonly pain: DashboardApiScanCitedClaimDto;
    readonly context: DashboardApiScanCitedClaimDto;
    readonly currentWorkaround: DashboardApiScanCitedClaimDto;
    readonly desiredOutcome: DashboardApiScanCitedClaimDto;
    readonly supportingEvidenceIds: readonly string[];
    readonly contradictoryEvidenceIds: readonly string[];
    readonly excludedEvidenceIds: readonly string[];
    readonly assumptions: readonly string[];
    readonly limitations: readonly string[];
    readonly exploratory: boolean;
  };
  readonly evidence: readonly DashboardApiScanEvidenceDto[];
  readonly trust?: {
    readonly evidenceCount: number;
    readonly confidenceBand: "low" | "moderate" | "high";
    readonly limitations: readonly string[];
    readonly rankingFactors: readonly { readonly label: string; readonly contribution: string }[];
  };
  readonly provenance: {
    readonly scanId: string;
    readonly clusterId: string;
    readonly clusterFingerprint: string;
    readonly sourceItemId: string;
    readonly sourceItemIds: readonly string[];
    readonly redditPostId?: string;
    readonly rawContentId: string;
    readonly rawContentIds: readonly string[];
    readonly normalizedContentId: string;
    readonly normalizedContentIds: readonly string[];
    readonly analysisRequestId: string;
    readonly analysisRequestIds: readonly string[];
    readonly candidateId: string;
    readonly generationOutputId: string;
    readonly rankingRunId: string;
  };
}

export interface DashboardApiScanResultDto {
  readonly scanId: string;
  readonly mode: DashboardApiScanMode;
  readonly status: "completed";
  readonly source: {
    readonly provider: DashboardApiScanSource;
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
  readonly stages: readonly DashboardApiScanStageDto[];
  readonly opportunities: readonly DashboardApiScanOpportunityDto[];
  readonly validationMetrics: {
    readonly retrievedItems: number;
    readonly generatedOpportunities: number;
    readonly evidenceBackedOpportunities: number;
    readonly evidenceCoverage: number;
    readonly averageConfidence: number;
    readonly reviewStatus: "ready-for-human-review" | "no-results";
  };
  readonly safeMetadata: {
    readonly deterministic: boolean;
    readonly liveEnabled: boolean;
    readonly rawProviderPayloadStored: false;
    readonly rejectedSourceItems?: number;
    readonly duplicateSourceItems?: number;
    readonly evidenceClusterCount: number;
    readonly exploratoryClusterCount: number;
    readonly rejectedClusterCount: number;
  };
}
