/**
 * Candidate Opportunity Engine public export boundary.
 *
 * Phase 2 Milestone 23 defines the Candidate Opportunity Engine package boundary and contracts.
 */
export const OPPORTUNITY_CANDIDATES_PACKAGE_NAME = "@opportunity-os/opportunity-candidates" as const;

export const OPPORTUNITY_CANDIDATES_FOUNDATION_PHASE = "phase-2-milestone-23" as const;

export type OpportunityCandidatesPackageBoundary = {
  readonly packageName: typeof OPPORTUNITY_CANDIDATES_PACKAGE_NAME;
  readonly phase: typeof OPPORTUNITY_CANDIDATES_FOUNDATION_PHASE;
  readonly ownership: "candidate-opportunity-engine";
};

export {
  CANDIDATE_OPPORTUNITY_STATUSES
} from "./candidate/index.js";
export type {
  CandidateOpportunity,
  CandidateOpportunityContract,
  CandidateOpportunityFieldPath,
  CandidateOpportunityId,
  CandidateOpportunityInput,
  CandidateOpportunitySafeMetadata,
  CandidateOpportunityStatus,
  CandidateOpportunityTimestamp,
  CandidateOpportunityVersion
} from "./candidate/index.js";
export {
  CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES
} from "./lifecycle/index.js";
export type {
  CandidateOpportunityLifecycle,
  CandidateOpportunityLifecycleState,
  CandidateOpportunityLifecycleTransition
} from "./lifecycle/index.js";
export type {
  CandidateOpportunityMetadata,
  CandidateOpportunitySourceMetadata
} from "./metadata/index.js";
export {
  CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES
} from "./provenance/index.js";
export type {
  CandidateOpportunityProvenance,
  CandidateOpportunityProvenanceBoundary,
  CandidateOpportunityUpstreamReferences
} from "./provenance/index.js";
export {
  CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES,
  CANDIDATE_EVIDENCE_REQUIREMENT_KINDS
} from "./evidence/index.js";
export type {
  CandidateEvidenceCompleteness,
  CandidateEvidenceCompletenessIssue,
  CandidateEvidenceCompletenessStatus,
  CandidateEvidenceRequirement,
  CandidateEvidenceRequirementKind
} from "./evidence/index.js";
export {
  CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES
} from "./confidence/index.js";
export type {
  CandidateConfidenceAggregation,
  CandidateConfidenceAggregationStatus,
  CandidateConfidenceSignal
} from "./confidence/index.js";
export {
  CANDIDATE_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  CandidateValidationContract,
  CandidateValidationFailure,
  CandidateValidationInput,
  CandidateValidationIssue,
  CandidateValidationIssueCode,
  CandidateValidationResult,
  CandidateValidationSuccess
} from "./validation/index.js";
export {
  CANDIDATE_ERROR_CATEGORIES,
  CANDIDATE_ERROR_CODES,
  CandidateOpportunityError
} from "./errors/index.js";
export type {
  CandidateErrorCategory,
  CandidateErrorCode,
  CandidateErrorOptions,
  CandidateErrorSafeDetails
} from "./errors/index.js";
export {
  CANDIDATE_RESULT_STATUSES
} from "./results/index.js";
export type {
  CandidateResult,
  CandidateResultFailure,
  CandidateResultStatus,
  CandidateResultSuccess
} from "./results/index.js";
export {
  CANDIDATE_EVENT_NAMES
} from "./events/index.js";
export type {
  CandidateEventEnvelope,
  CandidateEventName,
  CandidateEventPayload
} from "./events/index.js";
export {
  CANDIDATE_FIXTURE_IDS,
  CANDIDATE_FIXTURE_TIMESTAMP,
  candidateFixtureConfidenceAggregation,
  candidateFixtureError,
  candidateFixtureEvent,
  candidateFixtureEvidenceCompleteness,
  candidateFixtureLifecycle,
  candidateFixtureMetadata,
  candidateFixtureOpportunity,
  candidateFixtureProvenance,
  candidateFixtureResult,
  candidateFixtureRuntimeError,
  candidateFixtureSafeMetadata,
  candidateFixtureValidationFailure,
  candidateFixtureValidationSuccess
} from "./fixtures/index.js";
