/**
 * Opportunity Pipeline Foundation public export boundary.
 *
 * Phase 2 Milestone 22 Slice A defines the package boundary only.
 */
export const OPPORTUNITY_PIPELINE_PACKAGE_NAME = "@opportunity-os/opportunity-pipeline" as const;

export const OPPORTUNITY_PIPELINE_FOUNDATION_PHASE = "phase-2-milestone-22" as const;

export type OpportunityPipelinePackageBoundary = {
  readonly packageName: typeof OPPORTUNITY_PIPELINE_PACKAGE_NAME;
  readonly phase: typeof OPPORTUNITY_PIPELINE_FOUNDATION_PHASE;
  readonly ownership: "opportunity-pipeline-foundation";
};

export {
  OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES,
  OPPORTUNITY_PIPELINE_STAGE_KINDS,
  OPPORTUNITY_PIPELINE_STAGE_STATUSES,
  OPPORTUNITY_PIPELINE_STATUSES
} from "./pipeline/index.js";
export type {
  OpportunityPipelineDefinitionMetadata,
  OpportunityPipelineFieldPath,
  OpportunityPipelineId,
  OpportunityPipelineLifecycleMetadata,
  OpportunityPipelineMetadata,
  OpportunityPipelineProvenanceBoundary,
  OpportunityPipelineProvenanceReference,
  OpportunityPipelineRunId,
  OpportunityPipelineRunMetadata,
  OpportunityPipelineSafeMetadata,
  OpportunityPipelineStageDefinition,
  OpportunityPipelineStageDependency,
  OpportunityPipelineStageId,
  OpportunityPipelineStageKind,
  OpportunityPipelineStageRecord,
  OpportunityPipelineStageStatus,
  OpportunityPipelineStatus,
  OpportunityPipelineTimestamp,
  OpportunityPipelineUpstreamProvenance,
  OpportunityPipelineVersion
} from "./pipeline/index.js";
export {
  PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES,
  PIPELINE_EVIDENCE_AGGREGATION_STATUSES,
  PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES
} from "./assembly/index.js";
export type {
  PipelineCandidateOpportunity,
  PipelineCandidateOpportunityContract,
  PipelineCandidateOpportunityId,
  PipelineCandidateOpportunityInput,
  PipelineCandidateOpportunityStatus,
  PipelineEvidenceAggregation,
  PipelineEvidenceAggregationContract,
  PipelineEvidenceAggregationId,
  PipelineEvidenceAggregationInput,
  PipelineEvidenceAggregationStatus,
  PipelineHypothesisAssembly,
  PipelineHypothesisAssemblyContract,
  PipelineHypothesisAssemblyId,
  PipelineHypothesisAssemblyInput,
  PipelineHypothesisAssemblyStatus
} from "./assembly/index.js";
export {
  OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  OpportunityPipelineValidationContract,
  OpportunityPipelineValidationFailure,
  OpportunityPipelineValidationInput,
  OpportunityPipelineValidationIssue,
  OpportunityPipelineValidationIssueCode,
  OpportunityPipelineValidationResult,
  OpportunityPipelineValidationSuccess
} from "./validation/index.js";
export {
  OPPORTUNITY_PIPELINE_ERROR_CATEGORIES,
  OPPORTUNITY_PIPELINE_ERROR_CODES,
  OpportunityPipelineError
} from "./errors/index.js";
export type {
  OpportunityPipelineErrorCategory,
  OpportunityPipelineErrorCode,
  OpportunityPipelineErrorOptions,
  OpportunityPipelineErrorSafeDetails
} from "./errors/index.js";
export {
  OPPORTUNITY_PIPELINE_RESULT_STATUSES
} from "./results/index.js";
export type {
  OpportunityPipelineResult,
  OpportunityPipelineResultFailure,
  OpportunityPipelineResultStatus,
  OpportunityPipelineResultSuccess
} from "./results/index.js";
export {
  OPPORTUNITY_PIPELINE_EVENT_NAMES
} from "./events/index.js";
export type {
  OpportunityPipelineEventEnvelope,
  OpportunityPipelineEventName,
  OpportunityPipelineEventPayload
} from "./events/index.js";
export {
  OPPORTUNITY_PIPELINE_FIXTURE_IDS,
  OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
  opportunityPipelineFixtureCandidate,
  opportunityPipelineFixtureCompletedEvent,
  opportunityPipelineFixtureError,
  opportunityPipelineFixtureEvidenceAggregation,
  opportunityPipelineFixtureHypothesisAssembly,
  opportunityPipelineFixtureMetadata,
  opportunityPipelineFixtureProvenance,
  opportunityPipelineFixtureResult,
  opportunityPipelineFixtureSafeMetadata,
  opportunityPipelineFixtureValidationFailure,
  opportunityPipelineFixtureValidationSuccess
} from "./fixtures/index.js";
export {
  DETERMINISTIC_EVIDENCE_CLUSTERING_RULES,
  EVIDENCE_CLUSTERING_RULE_VERSION,
  EVIDENCE_STANCES,
  clusterEvidence
} from "./intelligence/index.js";
export type {
  EvidenceCluster,
  EvidenceClusterMember,
  EvidenceClusterSynthesisProfile,
  EvidenceClusteringInput,
  EvidenceStance
} from "./intelligence/index.js";
