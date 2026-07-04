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
  readonly sessionId: string;
  readonly title: string;
  readonly safeDescription: string;
  readonly severity: DashboardApiBugReportSeverity;
  readonly status: DashboardApiBugReportStatus;
  readonly createdAt: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface DashboardApiCreateBugReportRequestBody {
  readonly sessionId: string;
  readonly title: string;
  readonly safeDescription: string;
  readonly severity: DashboardApiBugReportSeverity;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}
