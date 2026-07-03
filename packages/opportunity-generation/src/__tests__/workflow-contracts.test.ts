import { describe, expect, it } from "vitest";
import {
  GENERATION_CONFIDENCE_AGGREGATION_STATUSES,
  GENERATION_ERROR_CATEGORIES,
  GENERATION_ERROR_CODES,
  GENERATION_EVENT_NAMES,
  GENERATION_EVIDENCE_ASSEMBLY_STATUSES,
  GENERATION_RESULT_STATUSES,
  GENERATION_VALIDATION_ISSUE_CODES,
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  OPPORTUNITY_GENERATION_STAGES,
  OpportunityGenerationError
} from "../index.js";
import type {
  GenerationCandidateValidationContract,
  GenerationConfidenceAggregation,
  GenerationEvidenceAssemblyId,
  GenerationEvidenceToHypothesisContract,
  GenerationEventEnvelope,
  GeneratedOpportunity,
  GenerationResult,
  GenerationResultSuccess,
  OpportunityGenerationOutput,
  OpportunityGenerationOutputId,
  OpportunityGenerationRunId,
  OpportunityGenerationTimestamp
} from "../index.js";
import {
  candidateFixtureConfidenceAggregation,
  candidateFixtureEvidenceCompleteness,
  candidateFixtureOpportunity
} from "@opportunity-os/opportunity-candidates";
import {
  type OpportunityId,
  opportunityFixtureConfidence,
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis
} from "@opportunity-os/opportunity-engine";
import { opportunityPipelineFixtureProvenance } from "@opportunity-os/opportunity-pipeline";

const timestamp = "2026-07-03T00:00:00.000Z" as OpportunityGenerationTimestamp;
const runId = "generation-run-workflow-1" as OpportunityGenerationRunId;

describe("Opportunity Generation workflow contracts", () => {
  it("models evidence-to-hypothesis assembly without execution behavior", () => {
    const contract: GenerationEvidenceToHypothesisContract = {
      deterministic: true,
      input: {
        runId,
        candidate: candidateFixtureOpportunity,
        evidence: [opportunityFixtureEvidence],
        hypotheses: [opportunityFixtureHypothesis],
        provenance: [opportunityPipelineFixtureProvenance]
      },
      output: {
        assemblyId: "generation-assembly-1" as GenerationEvidenceAssemblyId,
        status: GENERATION_EVIDENCE_ASSEMBLY_STATUSES.assembled,
        candidateId: candidateFixtureOpportunity.candidateId,
        evidence: [opportunityFixtureEvidence],
        hypotheses: [opportunityFixtureHypothesis],
        provenance: [opportunityPipelineFixtureProvenance],
        assembledAt: timestamp
      }
    };

    expect(contract.output.status).toBe(GENERATION_EVIDENCE_ASSEMBLY_STATUSES.assembled);
    expect(contract.output.hypotheses).toHaveLength(1);
  });

  it("models deterministic candidate validation behavior", () => {
    const validation: GenerationCandidateValidationContract = {
      deterministic: true,
      input: {
        candidate: candidateFixtureOpportunity
      },
      result: {
        valid: true,
        input: {
          candidate: candidateFixtureOpportunity
        }
      }
    };

    const failure: GenerationCandidateValidationContract = {
      deterministic: true,
      input: {
        candidate: candidateFixtureOpportunity
      },
      result: {
        valid: false,
        issues: [
          {
            code: GENERATION_VALIDATION_ISSUE_CODES.missingEvidence,
            message: "Generation evidence is missing."
          }
        ]
      }
    };

    expect(validation.result.valid).toBe(true);
    expect(failure.result.valid).toBe(false);
  });

  it("models generation confidence aggregation", () => {
    const aggregation: GenerationConfidenceAggregation = {
      candidateId: candidateFixtureOpportunity.candidateId,
      status: GENERATION_CONFIDENCE_AGGREGATION_STATUSES.ready,
      aggregatedAt: timestamp,
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
      summary: opportunityFixtureConfidence
    };

    expect(aggregation.signals).toHaveLength(3);
    expect(aggregation.status).toBe(GENERATION_CONFIDENCE_AGGREGATION_STATUSES.ready);
  });

  it("models generation results and events", () => {
    const generatedOpportunity: GeneratedOpportunity = {
      opportunityId: "opportunity-workflow-1" as OpportunityId,
      candidate: candidateFixtureOpportunity,
      hypothesis: opportunityFixtureHypothesis,
      evidence: [opportunityFixtureEvidence],
      confidence: opportunityFixtureConfidence,
      generatedAt: timestamp,
      version: "generation-v1" as GeneratedOpportunity["version"]
    };

    const output: OpportunityGenerationOutput = {
      outputId: "generation-output-workflow-1" as OpportunityGenerationOutputId,
      runId,
      status: OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated,
      generatedOpportunity,
      completedStages: [
        OPPORTUNITY_GENERATION_STAGES.evidenceAssembled,
        OPPORTUNITY_GENERATION_STAGES.candidateValidated,
        OPPORTUNITY_GENERATION_STAGES.confidenceAggregated,
        OPPORTUNITY_GENERATION_STAGES.outputPrepared
      ],
      generatedAt: timestamp
    };

    const result: GenerationResultSuccess = {
      status: GENERATION_RESULT_STATUSES.success,
      output,
      generatedOpportunity
    };

    const genericResult: GenerationResult = result;

    const event: GenerationEventEnvelope = {
      eventName: GENERATION_EVENT_NAMES.opportunityGenerated,
      payload: {
        runId,
        outputId: output.outputId,
        candidateId: candidateFixtureOpportunity.candidateId,
        opportunityId: result.generatedOpportunity.opportunityId,
        status: result.status
      }
    };

    expect(genericResult.status).toBe(GENERATION_RESULT_STATUSES.success);
    expect(event.eventName).toBe(GENERATION_EVENT_NAMES.opportunityGenerated);
  });

  it("serializes generation errors safely", () => {
    const error = new OpportunityGenerationError({
      code: GENERATION_ERROR_CODES.validationFailed,
      category: GENERATION_ERROR_CATEGORIES.validation,
      message: "Generation validation failed.",
      correlationId: "correlation-generation-1",
      requestId: "request-generation-1",
      issues: [
        {
          code: GENERATION_VALIDATION_ISSUE_CODES.candidateInvalid,
          message: "Candidate is invalid."
        }
      ],
      cause: new Error("unsafe internal detail")
    });

    const safeDetails = error.toSafeDetails();
    const serialized = JSON.stringify(error);

    expect(safeDetails.code).toBe(GENERATION_ERROR_CODES.validationFailed);
    expect(serialized).not.toContain("unsafe internal detail");
    expect(serialized).not.toContain("stack");
  });
});
