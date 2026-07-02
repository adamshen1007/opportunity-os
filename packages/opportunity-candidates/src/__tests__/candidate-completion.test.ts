import { describe, expect, it } from "vitest";
import {
  CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES,
  CANDIDATE_ERROR_CATEGORIES,
  CANDIDATE_ERROR_CODES,
  CANDIDATE_EVENT_NAMES,
  CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES,
  CANDIDATE_EVIDENCE_REQUIREMENT_KINDS,
  CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES,
  CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES,
  CANDIDATE_OPPORTUNITY_STATUSES,
  CANDIDATE_RESULT_STATUSES,
  CANDIDATE_VALIDATION_ISSUE_CODES,
  CandidateOpportunityError
} from "../index.js";
import type {
  CandidateConfidenceAggregation,
  CandidateEventEnvelope,
  CandidateEvidenceCompleteness,
  CandidateOpportunity,
  CandidateOpportunityId,
  CandidateOpportunityMetadata,
  CandidateOpportunityProvenance,
  CandidateOpportunityTimestamp,
  CandidateOpportunityVersion,
  CandidateResult,
  CandidateValidationContract
} from "../index.js";
import type { OpportunityHypothesis } from "@opportunity-os/opportunity-engine";

const candidateId = "candidate-001" as CandidateOpportunityId;
const timestamp = "2026-07-02T00:00:00.000Z" as CandidateOpportunityTimestamp;
const version = "candidate-v1" as CandidateOpportunityVersion;

const metadata: CandidateOpportunityMetadata = {
  source: {
    pipelineId: "pipeline-001" as CandidateOpportunityMetadata["source"]["pipelineId"],
    runId: "run-001" as CandidateOpportunityMetadata["source"]["runId"]
  },
  version,
  createdAt: timestamp
};

const provenance: CandidateOpportunityProvenance = {
  boundary: CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES.opportunityPipeline,
  recordedAt: timestamp,
  pipelineProvenance: [],
  upstream: {
    pipelineRunId: "run-001" as CandidateOpportunityProvenance["upstream"]["pipelineRunId"],
    pipelineCandidateId: "pipeline-candidate-001" as CandidateOpportunityProvenance["upstream"]["pipelineCandidateId"],
    opportunitySources: [],
    opportunityEvidence: [],
    hypothesisIds: []
  }
};

const candidate: CandidateOpportunity = {
  candidateId,
  hypothesis: {
    hypothesisId: "hypothesis-001"
  } as OpportunityHypothesis,
  evidence: [],
  lifecycle: {
    state: CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES.validationReady,
    status: CANDIDATE_OPPORTUNITY_STATUSES.validationReady,
    version,
    createdAt: timestamp
  },
  metadata,
  provenance
};

describe("Candidate Opportunity completion contracts", () => {
  it("models evidence completeness without execution behavior", () => {
    const completeness: CandidateEvidenceCompleteness = {
      candidateId,
      status: CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES.incomplete,
      checkedAt: timestamp,
      requirements: [
        {
          kind: CANDIDATE_EVIDENCE_REQUIREMENT_KINDS.source,
          required: true,
          description: "Synthetic source reference requirement."
        }
      ],
      evidence: [],
      issues: [
        {
          requirement: CANDIDATE_EVIDENCE_REQUIREMENT_KINDS.source,
          message: "Synthetic missing source evidence."
        }
      ]
    };

    expect(completeness.status).toBe("incomplete");
    expect(completeness.issues).toHaveLength(1);
  });

  it("models confidence aggregation metadata without formulas", () => {
    const aggregation: CandidateConfidenceAggregation = {
      candidateId,
      status: CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES.reviewRequired,
      aggregatedAt: timestamp,
      signals: [
        {
          source: "evidence-completeness",
          completeness: {
            candidateId,
            status: CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES.unknown,
            checkedAt: timestamp,
            requirements: [],
            evidence: [],
            issues: []
          }
        }
      ]
    };

    expect(aggregation.signals[0]?.source).toBe("evidence-completeness");
    expect(aggregation.status).toBe("review-required");
  });

  it("models validation, result, and event contracts", () => {
    const validation: CandidateValidationContract = {
      input: {
        candidate
      },
      result: {
        valid: false,
        issues: [
          {
            code: CANDIDATE_VALIDATION_ISSUE_CODES.incompleteEvidence,
            message: "Synthetic evidence is incomplete."
          }
        ]
      }
    };

    const result: CandidateResult = {
      status: CANDIDATE_RESULT_STATUSES.validationFailure,
      candidate,
      issues: validation.result.valid ? [] : validation.result.issues
    };

    const event: CandidateEventEnvelope = {
      eventName: CANDIDATE_EVENT_NAMES.validated,
      payload: {
        candidateId,
        status: result.status
      }
    };

    expect(result.status).toBe("validation-failure");
    expect(event.eventName).toBe("candidate.validated");
  });

  it("serializes candidate errors without unsafe details", () => {
    const error = new CandidateOpportunityError({
      code: CANDIDATE_ERROR_CODES.validationFailed,
      category: CANDIDATE_ERROR_CATEGORIES.validation,
      message: "Candidate validation failed.",
      correlationId: "correlation-001",
      cause: new Error("raw-secret-token")
    });

    expect(error.toSafeDetails()).toEqual({
      code: CANDIDATE_ERROR_CODES.validationFailed,
      category: CANDIDATE_ERROR_CATEGORIES.validation,
      message: "Candidate validation failed.",
      correlationId: "correlation-001"
    });
    expect(JSON.stringify(error)).not.toContain("raw-secret-token");
    expect(JSON.stringify(error)).not.toContain("stack");
  });
});
