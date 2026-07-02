import {
  opportunityFixtureConfidence,
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis,
  opportunityFixtureSafeMetadata,
  opportunityFixtureScore,
  opportunityFixtureSource,
  OPPORTUNITY_FIXTURE_IDS
} from "@opportunity-os/opportunity-engine";
import {
  OPPORTUNITY_PIPELINE_EVENT_NAMES,
  type OpportunityPipelineEventEnvelope
} from "../events/index.js";
import {
  OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES,
  OPPORTUNITY_PIPELINE_STAGE_KINDS,
  OPPORTUNITY_PIPELINE_STAGE_STATUSES,
  OPPORTUNITY_PIPELINE_STATUSES,
  type OpportunityPipelineId,
  type OpportunityPipelineMetadata,
  type OpportunityPipelineProvenanceReference,
  type OpportunityPipelineRunId,
  type OpportunityPipelineStageId,
  type OpportunityPipelineTimestamp,
  type OpportunityPipelineVersion
} from "../pipeline/index.js";
import {
  OPPORTUNITY_PIPELINE_RESULT_STATUSES,
  type OpportunityPipelineResult
} from "../results/index.js";
import {
  PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES,
  PIPELINE_EVIDENCE_AGGREGATION_STATUSES,
  PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES,
  type PipelineCandidateOpportunity,
  type PipelineCandidateOpportunityId,
  type PipelineEvidenceAggregation,
  type PipelineEvidenceAggregationId,
  type PipelineHypothesisAssembly,
  type PipelineHypothesisAssemblyId
} from "../assembly/index.js";
import {
  OPPORTUNITY_PIPELINE_ERROR_CATEGORIES,
  OPPORTUNITY_PIPELINE_ERROR_CODES,
  type OpportunityPipelineErrorSafeDetails
} from "../errors/index.js";
import {
  OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES,
  type OpportunityPipelineValidationFailure,
  type OpportunityPipelineValidationSuccess
} from "../validation/index.js";

export const OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP =
  "2026-01-01T00:00:00.000Z" as OpportunityPipelineTimestamp;

export const OPPORTUNITY_PIPELINE_FIXTURE_IDS = {
  pipelineId: "opportunity-pipeline-fixture-1" as OpportunityPipelineId,
  runId: "opportunity-pipeline-run-fixture-1" as OpportunityPipelineRunId,
  evidenceStageId: "opportunity-pipeline-stage-evidence-fixture-1" as OpportunityPipelineStageId,
  hypothesisStageId: "opportunity-pipeline-stage-hypothesis-fixture-1" as OpportunityPipelineStageId,
  candidateStageId: "opportunity-pipeline-stage-candidate-fixture-1" as OpportunityPipelineStageId,
  aggregationId: "opportunity-pipeline-aggregation-fixture-1" as PipelineEvidenceAggregationId,
  assemblyId: "opportunity-pipeline-assembly-fixture-1" as PipelineHypothesisAssemblyId,
  candidateId: "opportunity-pipeline-candidate-fixture-1" as PipelineCandidateOpportunityId
} as const;

export const opportunityPipelineFixtureSafeMetadata = {
  fixture: true,
  synthetic: true
} as const;

export const opportunityPipelineFixtureProvenance: OpportunityPipelineProvenanceReference = {
  runId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.runId,
  stageId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.evidenceStageId,
  boundary: OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES.opportunityPipeline,
  recordedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
  upstream: {
    opportunitySource: opportunityFixtureSource.provenance
  },
  opportunitySources: [opportunityFixtureSource],
  opportunityEvidence: [opportunityFixtureEvidence],
  hypothesisIds: [opportunityFixtureHypothesis.hypothesisId],
  safeMetadata: opportunityPipelineFixtureSafeMetadata
};

export const opportunityPipelineFixtureMetadata: OpportunityPipelineMetadata = {
  definition: {
    pipelineId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.pipelineId,
    name: "Synthetic Opportunity Pipeline",
    version: "1.0.0" as OpportunityPipelineVersion,
    lifecycle: {
      createdAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
      updatedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
      version: "1.0.0" as OpportunityPipelineVersion,
      status: OPPORTUNITY_PIPELINE_STATUSES.ready
    },
    safeMetadata: opportunityPipelineFixtureSafeMetadata
  },
  run: {
    runId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.runId,
    pipelineId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.pipelineId,
    startedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
    completedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
    stages: [
      {
        stageId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.evidenceStageId,
        kind: OPPORTUNITY_PIPELINE_STAGE_KINDS.evidenceAggregation,
        status: OPPORTUNITY_PIPELINE_STAGE_STATUSES.completed,
        recordedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP
      },
      {
        stageId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.hypothesisStageId,
        kind: OPPORTUNITY_PIPELINE_STAGE_KINDS.hypothesisAssembly,
        status: OPPORTUNITY_PIPELINE_STAGE_STATUSES.completed,
        recordedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP
      },
      {
        stageId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.candidateStageId,
        kind: OPPORTUNITY_PIPELINE_STAGE_KINDS.candidateOpportunity,
        status: OPPORTUNITY_PIPELINE_STAGE_STATUSES.completed,
        recordedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP
      }
    ],
    safeMetadata: opportunityPipelineFixtureSafeMetadata
  }
};

export const opportunityPipelineFixtureEvidenceAggregation: PipelineEvidenceAggregation = {
  aggregationId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.aggregationId,
  status: PIPELINE_EVIDENCE_AGGREGATION_STATUSES.assembled,
  evidence: [opportunityFixtureEvidence],
  provenance: [opportunityPipelineFixtureProvenance],
  safeMetadata: opportunityPipelineFixtureSafeMetadata
};

export const opportunityPipelineFixtureHypothesisAssembly: PipelineHypothesisAssembly = {
  assemblyId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.assemblyId,
  status: PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES.assembled,
  hypotheses: [opportunityFixtureHypothesis],
  provenance: [opportunityPipelineFixtureProvenance],
  safeMetadata: opportunityPipelineFixtureSafeMetadata
};

export const opportunityPipelineFixtureCandidate: PipelineCandidateOpportunity = {
  candidateId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.candidateId,
  opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
  status: PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES.validated,
  hypothesis: opportunityFixtureHypothesis,
  evidence: [opportunityFixtureEvidence],
  score: opportunityFixtureScore,
  confidence: opportunityFixtureConfidence,
  provenance: [opportunityPipelineFixtureProvenance],
  lifecycle: {
    createdAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
    updatedAt: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
    version: "1.0.0" as OpportunityPipelineVersion,
    status: OPPORTUNITY_PIPELINE_STATUSES.completed
  },
  safeMetadata: opportunityPipelineFixtureSafeMetadata
};

export const opportunityPipelineFixtureValidationSuccess: OpportunityPipelineValidationSuccess = {
  valid: true,
  input: {
    candidates: [opportunityPipelineFixtureCandidate],
    safeMetadata: opportunityPipelineFixtureSafeMetadata
  }
};

export const opportunityPipelineFixtureValidationFailure: OpportunityPipelineValidationFailure = {
  valid: false,
  issues: [
    {
      code: OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES.missingEvidence,
      message: "Evidence is required.",
      safeMetadata: opportunityPipelineFixtureSafeMetadata
    }
  ]
};

export const opportunityPipelineFixtureError: OpportunityPipelineErrorSafeDetails = {
  code: OPPORTUNITY_PIPELINE_ERROR_CODES.validationFailed,
  category: OPPORTUNITY_PIPELINE_ERROR_CATEGORIES.validation,
  message: "Opportunity pipeline validation failed safely.",
  correlationId: "correlation-fixture-1",
  safeMetadata: opportunityPipelineFixtureSafeMetadata
};

export const opportunityPipelineFixtureResult: OpportunityPipelineResult = {
  status: OPPORTUNITY_PIPELINE_RESULT_STATUSES.success,
  metadata: opportunityPipelineFixtureMetadata,
  candidates: [opportunityPipelineFixtureCandidate],
  safeMetadata: opportunityPipelineFixtureSafeMetadata
};

export const opportunityPipelineFixtureCompletedEvent: OpportunityPipelineEventEnvelope = {
  metadata: {
    eventId: "opportunity-pipeline-event-fixture-1",
    eventName: OPPORTUNITY_PIPELINE_EVENT_NAMES.completed,
    category: "infrastructure",
    version: "v1",
    timestamp: OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
    source: "@opportunity-os/opportunity-pipeline",
    correlationId: "correlation-fixture-1"
  },
  payload: {
    pipelineId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.pipelineId,
    runId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.runId,
    status: OPPORTUNITY_PIPELINE_RESULT_STATUSES.success,
    safeMetadata: opportunityPipelineFixtureSafeMetadata
  }
};
