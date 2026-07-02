/**
 * Opportunity Engine Foundation public export boundary.
 *
 * Phase 2 Milestone 21 defines the Opportunity Engine package boundary only.
 */
export const OPPORTUNITY_ENGINE_PACKAGE_NAME = "@opportunity-os/opportunity-engine" as const;

export const OPPORTUNITY_ENGINE_FOUNDATION_PHASE = "phase-2-milestone-21" as const;

export type OpportunityEnginePackageBoundary = {
  readonly packageName: typeof OPPORTUNITY_ENGINE_PACKAGE_NAME;
  readonly phase: typeof OPPORTUNITY_ENGINE_FOUNDATION_PHASE;
  readonly ownership: "opportunity-engine-foundation";
};

export {
  OPPORTUNITY_SOURCE_KINDS,
  OPPORTUNITY_STATUSES
} from "./opportunity/index.js";
export type {
  OpportunityFieldPath,
  OpportunityId,
  OpportunityLifecycleMetadata,
  OpportunitySafeMetadata,
  OpportunitySourceKind,
  OpportunityStatus,
  OpportunityTimestamp,
  OpportunityVersion
} from "./opportunity/index.js";
export type {
  OpportunitySourceId,
  OpportunitySourceProvenance,
  OpportunitySourceReference
} from "./source/index.js";
export {
  OPPORTUNITY_EVIDENCE_KINDS
} from "./evidence/index.js";
export type {
  OpportunityEvidenceId,
  OpportunityEvidenceKind,
  OpportunityEvidenceReference
} from "./evidence/index.js";
export {
  OPPORTUNITY_HYPOTHESIS_STATUSES
} from "./hypothesis/index.js";
export type {
  OpportunityHypothesis,
  OpportunityHypothesisId,
  OpportunityHypothesisStatus
} from "./hypothesis/index.js";
export {
  OPPORTUNITY_SCORE_DIMENSIONS
} from "./scoring/index.js";
export type {
  OpportunityScore,
  OpportunityScoreComponent,
  OpportunityScoreDimension,
  OpportunityScoreValue
} from "./scoring/index.js";
export {
  OPPORTUNITY_CONFIDENCE_LEVELS
} from "./confidence/index.js";
export type {
  OpportunityConfidence,
  OpportunityConfidenceLevel
} from "./confidence/index.js";
export {
  OPPORTUNITY_RANKING_STATUSES
} from "./ranking/index.js";
export type {
  OpportunityRankPosition,
  OpportunityRanking,
  OpportunityRankingInput,
  OpportunityRankingStatus
} from "./ranking/index.js";
export {
  OPPORTUNITY_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  OpportunityValidationContract,
  OpportunityValidationFailure,
  OpportunityValidationInput,
  OpportunityValidationIssue,
  OpportunityValidationIssueCode,
  OpportunityValidationResult,
  OpportunityValidationSuccess
} from "./validation/index.js";
export {
  OPPORTUNITY_ENGINE_ERROR_CATEGORIES,
  OPPORTUNITY_ENGINE_ERROR_CODES,
  OpportunityEngineError
} from "./errors/index.js";
export type {
  OpportunityEngineErrorCategory,
  OpportunityEngineErrorCode,
  OpportunityEngineErrorOptions,
  OpportunityEngineErrorSafeDetails
} from "./errors/index.js";
export {
  OPPORTUNITY_RESULT_STATUSES
} from "./results/index.js";
export type {
  OpportunityResult,
  OpportunityResultFailure,
  OpportunityResultStatus,
  OpportunityResultSuccess
} from "./results/index.js";
export {
  OPPORTUNITY_EVENT_NAMES
} from "./events/index.js";
export type {
  OpportunityEventEnvelope,
  OpportunityEventName,
  OpportunityEventPayload
} from "./events/index.js";
export {
  OPPORTUNITY_FIXTURE_IDS,
  OPPORTUNITY_FIXTURE_TIMESTAMP,
  opportunityFixtureCompletedEvent,
  opportunityFixtureConfidence,
  opportunityFixtureError,
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis,
  opportunityFixtureRanking,
  opportunityFixtureResult,
  opportunityFixtureSafeMetadata,
  opportunityFixtureScore,
  opportunityFixtureSource,
  opportunityFixtureValidationFailure,
  opportunityFixtureValidationSuccess
} from "./fixtures/index.js";
