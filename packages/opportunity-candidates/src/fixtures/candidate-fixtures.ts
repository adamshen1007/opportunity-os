import {
  opportunityFixtureConfidence,
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis,
  type OpportunityHypothesis
} from "@opportunity-os/opportunity-engine";
import {
  OPPORTUNITY_PIPELINE_FIXTURE_IDS,
  opportunityPipelineFixtureCandidate,
  opportunityPipelineFixtureProvenance
} from "@opportunity-os/opportunity-pipeline";
import {
  CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES,
  type CandidateConfidenceAggregation
} from "../confidence/index.js";
import {
  CandidateOpportunityError,
  CANDIDATE_ERROR_CATEGORIES,
  CANDIDATE_ERROR_CODES,
  type CandidateErrorSafeDetails
} from "../errors/index.js";
import {
  CANDIDATE_EVENT_NAMES,
  type CandidateEventEnvelope
} from "../events/index.js";
import {
  CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES,
  CANDIDATE_EVIDENCE_REQUIREMENT_KINDS,
  type CandidateEvidenceCompleteness
} from "../evidence/index.js";
import {
  CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES,
  type CandidateOpportunityLifecycle
} from "../lifecycle/index.js";
import {
  type CandidateOpportunityMetadata
} from "../metadata/index.js";
import {
  CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES,
  type CandidateOpportunityProvenance
} from "../provenance/index.js";
import {
  CANDIDATE_RESULT_STATUSES,
  type CandidateResult
} from "../results/index.js";
import {
  CANDIDATE_VALIDATION_ISSUE_CODES,
  type CandidateValidationFailure,
  type CandidateValidationSuccess
} from "../validation/index.js";
import {
  CANDIDATE_OPPORTUNITY_STATUSES,
  type CandidateOpportunity,
  type CandidateOpportunityId,
  type CandidateOpportunitySafeMetadata,
  type CandidateOpportunityTimestamp,
  type CandidateOpportunityVersion
} from "../candidate/index.js";

export const CANDIDATE_FIXTURE_TIMESTAMP =
  "2026-01-01T00:00:00.000Z" as CandidateOpportunityTimestamp;

export const CANDIDATE_FIXTURE_IDS = {
  candidateId: "candidate-fixture-1" as CandidateOpportunityId
} as const;

export const candidateFixtureSafeMetadata = {
  fixture: true,
  synthetic: true
} as const satisfies CandidateOpportunitySafeMetadata;

export const candidateFixtureLifecycle: CandidateOpportunityLifecycle = {
  state: CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES.validationReady,
  status: CANDIDATE_OPPORTUNITY_STATUSES.validationReady,
  version: "candidate-v1" as CandidateOpportunityVersion,
  createdAt: CANDIDATE_FIXTURE_TIMESTAMP,
  updatedAt: CANDIDATE_FIXTURE_TIMESTAMP
};

export const candidateFixtureMetadata: CandidateOpportunityMetadata = {
  source: {
    pipelineId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.pipelineId,
    runId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.runId
  },
  version: candidateFixtureLifecycle.version,
  createdAt: CANDIDATE_FIXTURE_TIMESTAMP,
  updatedAt: CANDIDATE_FIXTURE_TIMESTAMP,
  safeMetadata: candidateFixtureSafeMetadata
};

export const candidateFixtureProvenance: CandidateOpportunityProvenance = {
  boundary: CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES.opportunityPipeline,
  recordedAt: CANDIDATE_FIXTURE_TIMESTAMP,
  pipelineProvenance: [opportunityPipelineFixtureProvenance],
  upstream: {
    pipelineRunId: OPPORTUNITY_PIPELINE_FIXTURE_IDS.runId,
    pipelineCandidateId: opportunityPipelineFixtureCandidate.candidateId,
    opportunitySources: [opportunityFixtureEvidence.source],
    opportunityEvidence: [opportunityFixtureEvidence],
    hypothesisIds: [opportunityFixtureHypothesis.hypothesisId]
  },
  safeMetadata: candidateFixtureSafeMetadata
};

export const candidateFixtureOpportunity: CandidateOpportunity = {
  candidateId: CANDIDATE_FIXTURE_IDS.candidateId,
  hypothesis: opportunityFixtureHypothesis as OpportunityHypothesis,
  evidence: [opportunityFixtureEvidence],
  lifecycle: candidateFixtureLifecycle,
  metadata: candidateFixtureMetadata,
  provenance: candidateFixtureProvenance,
  safeMetadata: candidateFixtureSafeMetadata
};

export const candidateFixtureEvidenceCompleteness: CandidateEvidenceCompleteness = {
  candidateId: CANDIDATE_FIXTURE_IDS.candidateId,
  status: CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES.complete,
  checkedAt: CANDIDATE_FIXTURE_TIMESTAMP,
  requirements: [
    {
      kind: CANDIDATE_EVIDENCE_REQUIREMENT_KINDS.source,
      required: true,
      description: "Synthetic source reference requirement."
    },
    {
      kind: CANDIDATE_EVIDENCE_REQUIREMENT_KINDS.supportingAnalysis,
      required: true,
      description: "Synthetic analysis reference requirement."
    }
  ],
  evidence: [opportunityFixtureEvidence],
  issues: [],
  safeMetadata: candidateFixtureSafeMetadata
};

export const candidateFixtureConfidenceAggregation: CandidateConfidenceAggregation = {
  candidateId: CANDIDATE_FIXTURE_IDS.candidateId,
  status: CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES.ready,
  aggregatedAt: CANDIDATE_FIXTURE_TIMESTAMP,
  signals: [
    {
      source: "opportunity-engine",
      confidence: opportunityFixtureConfidence,
      safeMetadata: candidateFixtureSafeMetadata
    },
    {
      source: "evidence-completeness",
      completeness: candidateFixtureEvidenceCompleteness,
      safeMetadata: candidateFixtureSafeMetadata
    }
  ],
  safeMetadata: candidateFixtureSafeMetadata
};

export const candidateFixtureValidationSuccess: CandidateValidationSuccess = {
  valid: true,
  input: {
    candidate: candidateFixtureOpportunity,
    evidenceCompleteness: candidateFixtureEvidenceCompleteness,
    confidenceAggregation: candidateFixtureConfidenceAggregation,
    safeMetadata: candidateFixtureSafeMetadata
  }
};

export const candidateFixtureValidationFailure: CandidateValidationFailure = {
  valid: false,
  issues: [
    {
      code: CANDIDATE_VALIDATION_ISSUE_CODES.incompleteEvidence,
      message: "Candidate evidence is incomplete.",
      safeMetadata: candidateFixtureSafeMetadata
    }
  ]
};

export const candidateFixtureError: CandidateErrorSafeDetails = {
  code: CANDIDATE_ERROR_CODES.validationFailed,
  category: CANDIDATE_ERROR_CATEGORIES.validation,
  message: "Candidate validation failed safely.",
  correlationId: "correlation-fixture-1",
  safeMetadata: candidateFixtureSafeMetadata
};

export const candidateFixtureRuntimeError = new CandidateOpportunityError({
  ...candidateFixtureError,
  cause: new Error("synthetic unsafe cause")
});

export const candidateFixtureResult: CandidateResult = {
  status: CANDIDATE_RESULT_STATUSES.success,
  candidate: candidateFixtureOpportunity,
  evidenceCompleteness: candidateFixtureEvidenceCompleteness,
  confidenceAggregation: candidateFixtureConfidenceAggregation
};

export const candidateFixtureEvent: CandidateEventEnvelope = {
  eventName: CANDIDATE_EVENT_NAMES.validated,
  payload: {
    candidateId: CANDIDATE_FIXTURE_IDS.candidateId,
    status: CANDIDATE_RESULT_STATUSES.success,
    safeMetadata: candidateFixtureSafeMetadata
  }
};
