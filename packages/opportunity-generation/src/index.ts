/**
 * Opportunity Generation Workflow public export boundary.
 *
 * Phase 2 Milestone 24 defines the Opportunity Generation Workflow package boundary.
 */
export const OPPORTUNITY_GENERATION_PACKAGE_NAME = "@opportunity-os/opportunity-generation" as const;

export const OPPORTUNITY_GENERATION_FOUNDATION_PHASE = "phase-2-milestone-24" as const;

export type OpportunityGenerationPackageBoundary = {
  readonly packageName: typeof OPPORTUNITY_GENERATION_PACKAGE_NAME;
  readonly phase: typeof OPPORTUNITY_GENERATION_FOUNDATION_PHASE;
  readonly ownership: "opportunity-generation-workflow";
};

export {
  OPPORTUNITY_GENERATION_MODES,
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  OPPORTUNITY_GENERATION_STAGES
} from "./generation/index.js";
export type {
  DeterministicOpportunityGenerationServiceContract,
  GeneratedOpportunity,
  OpportunityGenerationFieldPath,
  OpportunityGenerationInput,
  OpportunityGenerationInputContext,
  OpportunityGenerationInputContract,
  OpportunityGenerationMode,
  OpportunityGenerationOutput,
  OpportunityGenerationOutputContract,
  OpportunityGenerationOutputId,
  OpportunityGenerationOutputStatus,
  OpportunityGenerationRequestId,
  OpportunityGenerationRunId,
  OpportunityGenerationSafeMetadata,
  OpportunityGenerationService,
  OpportunityGenerationServiceContext,
  OpportunityGenerationServiceResult,
  OpportunityGenerationStage,
  OpportunityGenerationTimestamp,
  OpportunityGenerationVersion
} from "./generation/index.js";
export {
  GENERATION_EVIDENCE_ASSEMBLY_STATUSES
} from "./assembly/index.js";
export type {
  GenerationEvidenceAssemblyId,
  GenerationEvidenceAssemblyStatus,
  GenerationEvidenceToHypothesisAssembly,
  GenerationEvidenceToHypothesisContract,
  GenerationEvidenceToHypothesisInput
} from "./assembly/index.js";
export {
  GENERATION_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  GenerationCandidateValidationContract,
  GenerationCandidateValidationFailure,
  GenerationCandidateValidationInput,
  GenerationCandidateValidationResult,
  GenerationCandidateValidationSuccess,
  GenerationValidationIssue,
  GenerationValidationIssueCode
} from "./validation/index.js";
export {
  GENERATION_CONFIDENCE_AGGREGATION_STATUSES
} from "./confidence/index.js";
export type {
  GenerationConfidenceAggregation,
  GenerationConfidenceAggregationContract,
  GenerationConfidenceAggregationStatus,
  GenerationConfidenceSignal
} from "./confidence/index.js";
export {
  GENERATION_RESULT_STATUSES
} from "./results/index.js";
export type {
  GenerationResult,
  GenerationResultFailure,
  GenerationResultStatus,
  GenerationResultSuccess
} from "./results/index.js";
export {
  GENERATION_ERROR_CATEGORIES,
  GENERATION_ERROR_CODES,
  OpportunityGenerationError
} from "./errors/index.js";
export type {
  GenerationErrorCategory,
  GenerationErrorCode,
  OpportunityGenerationErrorOptions,
  OpportunityGenerationErrorSafeDetails
} from "./errors/index.js";
export {
  GENERATION_EVENT_NAMES
} from "./events/index.js";
export type {
  GenerationEventEnvelope,
  GenerationEventName,
  GenerationEventPayload
} from "./events/index.js";
export {
  OPPORTUNITY_GENERATION_FIXTURE_IDS,
  OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP,
  opportunityGenerationFixtureAssembly,
  opportunityGenerationFixtureConfidenceAggregation,
  opportunityGenerationFixtureError,
  opportunityGenerationFixtureEvent,
  opportunityGenerationFixtureGeneratedOpportunity,
  opportunityGenerationFixtureInput,
  opportunityGenerationFixtureOutput,
  opportunityGenerationFixtureResult,
  opportunityGenerationFixtureRuntimeError,
  opportunityGenerationFixtureSafeMetadata,
  opportunityGenerationFixtureValidationFailure,
  opportunityGenerationFixtureValidationSuccess
} from "./fixtures/index.js";
export { synthesizeEvidenceCluster, synthesizeEvidenceClusters } from "./synthesis/index.js";
export type {
  OpportunitySynthesisRejection,
  OpportunitySynthesisResult,
  SynthesizedCitedClaim,
  SynthesizedOpportunity
} from "./synthesis/index.js";
