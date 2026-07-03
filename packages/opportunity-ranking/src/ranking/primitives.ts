export type OpportunityRankingRunId = string & {
  readonly __brand: "OpportunityRankingRunId";
};

export type OpportunityRankingRequestId = string & {
  readonly __brand: "OpportunityRankingRequestId";
};

export type RankedOpportunityId = string & {
  readonly __brand: "RankedOpportunityId";
};

export type OpportunityRankingTimestamp = string & {
  readonly __brand: "OpportunityRankingTimestamp";
};

export type OpportunityRankingVersion = string & {
  readonly __brand: "OpportunityRankingVersion";
};

export type OpportunityRankingFieldPath = string & {
  readonly __brand: "OpportunityRankingFieldPath";
};

export type OpportunityRankingSafeMetadata =
  Readonly<Record<string, string | number | boolean | null>>;

export type OpportunityRankingUpstreamReference = {
  readonly packageName: string;
  readonly entityKind: string;
  readonly entityId: string;
  readonly version?: string;
};

export type OpportunityRankPosition = number & {
  readonly __brand: "OpportunityRankPosition";
};

export type OpportunityRankingScoreValue = number & {
  readonly __brand: "OpportunityRankingScoreValue";
};

export const OPPORTUNITY_RANKING_MODES = {
  deterministic: "deterministic",
  dryRun: "dry-run"
} as const;

export type OpportunityRankingMode =
  (typeof OPPORTUNITY_RANKING_MODES)[keyof typeof OPPORTUNITY_RANKING_MODES];

export const OPPORTUNITY_RANKING_STAGES = {
  accepted: "accepted",
  inputPrepared: "input-prepared",
  signalsPrepared: "signals-prepared",
  factorsPrepared: "factors-prepared",
  weightsPrepared: "weights-prepared",
  outputPrepared: "output-prepared"
} as const;

export type OpportunityRankingStage =
  (typeof OPPORTUNITY_RANKING_STAGES)[keyof typeof OPPORTUNITY_RANKING_STAGES];

export const OPPORTUNITY_RANKING_OUTPUT_STATUSES = {
  ranked: "ranked",
  validationFailed: "validation-failed",
  insufficientSignals: "insufficient-signals",
  failed: "failed"
} as const;

export type OpportunityRankingOutputStatus =
  (typeof OPPORTUNITY_RANKING_OUTPUT_STATUSES)[keyof typeof OPPORTUNITY_RANKING_OUTPUT_STATUSES];
