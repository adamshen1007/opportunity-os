import {
  candidateFixtureConfidenceAggregation,
  candidateFixtureEvidenceCompleteness,
  candidateFixtureOpportunity
} from "@opportunity-os/opportunity-candidates";
import {
  opportunityFixtureConfidence,
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis,
  type OpportunityId
} from "@opportunity-os/opportunity-engine";
import { opportunityPipelineFixtureProvenance } from "@opportunity-os/opportunity-pipeline";
import {
  GENERATION_EVIDENCE_ASSEMBLY_STATUSES,
  type GenerationEvidenceAssemblyId,
  type GenerationEvidenceToHypothesisAssembly
} from "../assembly/index.js";
import {
  GENERATION_CONFIDENCE_AGGREGATION_STATUSES,
  type GenerationConfidenceAggregation
} from "../confidence/index.js";
import {
  GENERATION_ERROR_CATEGORIES,
  GENERATION_ERROR_CODES,
  OpportunityGenerationError,
  type OpportunityGenerationErrorSafeDetails
} from "../errors/index.js";
import {
  GENERATION_EVENT_NAMES,
  type GenerationEventEnvelope
} from "../events/index.js";
import {
  OPPORTUNITY_GENERATION_MODES,
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  OPPORTUNITY_GENERATION_STAGES,
  type GeneratedOpportunity,
  type OpportunityGenerationInput,
  type OpportunityGenerationOutput,
  type OpportunityGenerationOutputId,
  type OpportunityGenerationRequestId,
  type OpportunityGenerationRunId,
  type OpportunityGenerationSafeMetadata,
  type OpportunityGenerationTimestamp,
  type OpportunityGenerationVersion
} from "../generation/index.js";
import {
  GENERATION_RESULT_STATUSES,
  type GenerationResult
} from "../results/index.js";
import {
  GENERATION_VALIDATION_ISSUE_CODES,
  type GenerationCandidateValidationFailure,
  type GenerationCandidateValidationSuccess
} from "../validation/index.js";

export const OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP =
  "2026-01-01T00:00:00.000Z" as OpportunityGenerationTimestamp;

export const OPPORTUNITY_GENERATION_FIXTURE_IDS = {
  runId: "generation-run-fixture-1" as OpportunityGenerationRunId,
  requestId: "generation-request-fixture-1" as OpportunityGenerationRequestId,
  outputId: "generation-output-fixture-1" as OpportunityGenerationOutputId,
  assemblyId: "generation-assembly-fixture-1" as GenerationEvidenceAssemblyId,
  opportunityId: "generation-opportunity-fixture-1" as OpportunityId
} as const;

export const opportunityGenerationFixtureSafeMetadata = {
  fixture: true,
  synthetic: true
} as const satisfies OpportunityGenerationSafeMetadata;

export const opportunityGenerationFixtureInput: OpportunityGenerationInput = {
  requestId: OPPORTUNITY_GENERATION_FIXTURE_IDS.requestId,
  candidate: candidateFixtureOpportunity,
  evidenceCompleteness: candidateFixtureEvidenceCompleteness,
  confidenceAggregation: candidateFixtureConfidenceAggregation,
  provenance: [opportunityPipelineFixtureProvenance],
  context: {
    requestedAt: OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP,
    requestedBy: "test",
    mode: OPPORTUNITY_GENERATION_MODES.deterministic,
    version: "generation-v1" as OpportunityGenerationVersion,
    safeMetadata: opportunityGenerationFixtureSafeMetadata
  }
};

export const opportunityGenerationFixtureAssembly: GenerationEvidenceToHypothesisAssembly = {
  assemblyId: OPPORTUNITY_GENERATION_FIXTURE_IDS.assemblyId,
  status: GENERATION_EVIDENCE_ASSEMBLY_STATUSES.assembled,
  candidateId: candidateFixtureOpportunity.candidateId,
  evidence: [opportunityFixtureEvidence],
  hypotheses: [opportunityFixtureHypothesis],
  provenance: [opportunityPipelineFixtureProvenance],
  assembledAt: OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP,
  safeMetadata: opportunityGenerationFixtureSafeMetadata
};

export const opportunityGenerationFixtureValidationSuccess: GenerationCandidateValidationSuccess = {
  valid: true,
  input: {
    candidate: candidateFixtureOpportunity,
    assembly: opportunityGenerationFixtureAssembly,
    safeMetadata: opportunityGenerationFixtureSafeMetadata
  }
};

export const opportunityGenerationFixtureValidationFailure: GenerationCandidateValidationFailure = {
  valid: false,
  issues: [
    {
      code: GENERATION_VALIDATION_ISSUE_CODES.missingEvidence,
      message: "Generation evidence is missing.",
      safeMetadata: opportunityGenerationFixtureSafeMetadata
    }
  ]
};

export const opportunityGenerationFixtureConfidenceAggregation: GenerationConfidenceAggregation = {
  candidateId: candidateFixtureOpportunity.candidateId,
  status: GENERATION_CONFIDENCE_AGGREGATION_STATUSES.ready,
  aggregatedAt: OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP,
  signals: [
    {
      source: "candidate",
      candidateConfidence: candidateFixtureConfidenceAggregation
    },
    {
      source: "evidence",
      evidenceCompleteness: candidateFixtureEvidenceCompleteness
    },
    {
      source: "hypothesis",
      confidence: opportunityFixtureConfidence
    }
  ],
  summary: opportunityFixtureConfidence,
  safeMetadata: opportunityGenerationFixtureSafeMetadata
};

export const opportunityGenerationFixtureGeneratedOpportunity: GeneratedOpportunity = {
  opportunityId: OPPORTUNITY_GENERATION_FIXTURE_IDS.opportunityId,
  candidate: candidateFixtureOpportunity,
  hypothesis: opportunityFixtureHypothesis,
  evidence: [opportunityFixtureEvidence],
  confidence: opportunityFixtureConfidence,
  generatedAt: OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP,
  version: "generation-v1" as OpportunityGenerationVersion,
  safeMetadata: opportunityGenerationFixtureSafeMetadata
};

export const opportunityGenerationFixtureOutput: OpportunityGenerationOutput = {
  outputId: OPPORTUNITY_GENERATION_FIXTURE_IDS.outputId,
  runId: OPPORTUNITY_GENERATION_FIXTURE_IDS.runId,
  status: OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated,
  generatedOpportunity: opportunityGenerationFixtureGeneratedOpportunity,
  evidenceCompleteness: candidateFixtureEvidenceCompleteness,
  confidenceAggregation: candidateFixtureConfidenceAggregation,
  completedStages: [
    OPPORTUNITY_GENERATION_STAGES.inputPrepared,
    OPPORTUNITY_GENERATION_STAGES.evidenceAssembled,
    OPPORTUNITY_GENERATION_STAGES.candidateValidated,
    OPPORTUNITY_GENERATION_STAGES.confidenceAggregated,
    OPPORTUNITY_GENERATION_STAGES.outputPrepared
  ],
  generatedAt: OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP,
  safeMetadata: opportunityGenerationFixtureSafeMetadata
};

export const opportunityGenerationFixtureError: OpportunityGenerationErrorSafeDetails = {
  code: GENERATION_ERROR_CODES.validationFailed,
  category: GENERATION_ERROR_CATEGORIES.validation,
  message: "Generation validation failed safely.",
  correlationId: "correlation-generation-fixture-1",
  requestId: "request-generation-fixture-1",
  issues: opportunityGenerationFixtureValidationFailure.issues,
  safeMetadata: opportunityGenerationFixtureSafeMetadata
};

export const opportunityGenerationFixtureRuntimeError = new OpportunityGenerationError({
  ...opportunityGenerationFixtureError,
  cause: new Error("synthetic unsafe cause")
});

export const opportunityGenerationFixtureResult: GenerationResult = {
  status: GENERATION_RESULT_STATUSES.success,
  output: opportunityGenerationFixtureOutput,
  generatedOpportunity: opportunityGenerationFixtureGeneratedOpportunity
};

export const opportunityGenerationFixtureEvent: GenerationEventEnvelope = {
  eventName: GENERATION_EVENT_NAMES.opportunityGenerated,
  payload: {
    runId: OPPORTUNITY_GENERATION_FIXTURE_IDS.runId,
    outputId: OPPORTUNITY_GENERATION_FIXTURE_IDS.outputId,
    candidateId: candidateFixtureOpportunity.candidateId,
    opportunityId: OPPORTUNITY_GENERATION_FIXTURE_IDS.opportunityId,
    status: GENERATION_RESULT_STATUSES.success,
    safeMetadata: opportunityGenerationFixtureSafeMetadata
  }
};
