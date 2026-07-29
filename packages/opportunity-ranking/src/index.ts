/**
 * Opportunity Ranking Engine public export boundary.
 *
 * Phase 3 Milestone 25 defines the Opportunity Ranking Engine package boundary.
 */
export const OPPORTUNITY_RANKING_PACKAGE_NAME = "@opportunity-os/opportunity-ranking" as const;

export const OPPORTUNITY_RANKING_FOUNDATION_PHASE = "phase-3-milestone-25" as const;

export type OpportunityRankingPackageBoundary = {
  readonly packageName: typeof OPPORTUNITY_RANKING_PACKAGE_NAME;
  readonly phase: typeof OPPORTUNITY_RANKING_FOUNDATION_PHASE;
  readonly ownership: "opportunity-ranking-engine";
};

export {
  OPPORTUNITY_RANKING_MODES,
  OPPORTUNITY_RANKING_OUTPUT_STATUSES,
  OPPORTUNITY_RANKING_STAGES,
  OPPORTUNITY_RANKING_ERROR_CODES,
  OPPORTUNITY_RANKING_EVENT_NAMES,
  OPPORTUNITY_RANKING_RESULT_STATUSES,
  OPPORTUNITY_RANKING_VALIDATION_ISSUE_CODES,
  OpportunityRankingError,
  calculateOpportunityRankingScore,
  compareOpportunityRankingReferences,
  createOpportunityRankingExplanation,
  explainOpportunityRankingTieBreak,
  EVIDENCE_RANKING_SIGNAL_IDS,
  EVIDENCE_RANKING_VERSIONS,
  rankEvidenceDerivedOpportunities,
  rankOpportunities,
  validateOpportunityRankingInput
} from "./ranking/index.js";
export type {
  OpportunityRankingErrorCode,
  OpportunityRankingEvent,
  OpportunityRankingEventName,
  OpportunityRankPosition,
  OpportunityRankingExplanationSummary,
  OpportunityRankingFieldPath,
  OpportunityRankingInput,
  OpportunityRankingInputContext,
  OpportunityRankingInputContract,
  OpportunityRankingMode,
  OpportunityRankingOutput,
  OpportunityRankingOutputContract,
  OpportunityRankingOutputStatus,
  OpportunityRankingPipelineOptions,
  OpportunityRankingRequestId,
  OpportunityRankingResult,
  OpportunityRankingResultStatus,
  OpportunityRankingRunId,
  OpportunityRankingSafeMetadata,
  OpportunityRankingScoreCalculation,
  OpportunityRankingScoreContribution,
  OpportunityRankingScoreValue,
  OpportunityRankingStage,
  OpportunityRankingTimestamp,
  OpportunityRankingTieBreakDecision,
  OpportunityRankingUpstreamReference,
  OpportunityRankingValidationIssue,
  OpportunityRankingValidationIssueCode,
  OpportunityRankingValidationResult,
  OpportunityRankingVersion,
  RankedOpportunity,
  RankedOpportunityId,
  EvidenceDerivedRankedOpportunity,
  EvidenceDerivedRankingExplanation,
  EvidenceDerivedRankingResult,
  EvidenceDerivedSignal,
  EvidenceRankingEvidence,
  EvidenceRankingOpportunity,
  EvidenceRankingSignalId,
  SafeOpportunityRankingError
} from "./ranking/index.js";
export {
  OPPORTUNITY_RANKING_SIGNAL_IDS,
  OPPORTUNITY_RANKING_SIGNAL_SOURCES
} from "./signals/index.js";
export type {
  OpportunityRankingSignal,
  OpportunityRankingSignalId,
  OpportunityRankingSignalIdValue,
  OpportunityRankingSignalSet,
  OpportunityRankingSignalSource
} from "./signals/index.js";
export {
  OPPORTUNITY_RANKING_FACTOR_IDS,
  OPPORTUNITY_RANKING_FACTOR_KINDS
} from "./factors/index.js";
export type {
  OpportunityRankingFactor,
  OpportunityRankingFactorId,
  OpportunityRankingFactorIdValue,
  OpportunityRankingFactorInput,
  OpportunityRankingFactorKind,
  OpportunityRankingFactorSet
} from "./factors/index.js";
export {
  DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET
} from "./weights/index.js";
export type {
  OpportunityRankingWeight,
  OpportunityRankingWeightSet,
  OpportunityRankingWeightSetId,
  OpportunityRankingWeightValue
} from "./weights/index.js";
export {
  SYNTHETIC_OPPORTUNITY_RANKING_FACTORS,
  SYNTHETIC_OPPORTUNITY_RANKING_INPUT,
  SYNTHETIC_OPPORTUNITY_RANKING_OPTIONS,
  SYNTHETIC_OPPORTUNITY_RANKING_SIGNALS,
  SYNTHETIC_OPPORTUNITY_RANKING_UPSTREAM_REFERENCES,
  createSyntheticOpportunityRankingInput
} from "./fixtures/index.js";
