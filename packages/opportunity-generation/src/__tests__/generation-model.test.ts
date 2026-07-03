import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_GENERATION_MODES,
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  OPPORTUNITY_GENERATION_STAGES
} from "../index.js";
import type {
  DeterministicOpportunityGenerationServiceContract,
  OpportunityGenerationInput,
  OpportunityGenerationInputContract,
  OpportunityGenerationOutput,
  OpportunityGenerationOutputContract,
  OpportunityGenerationOutputId,
  OpportunityGenerationRequestId,
  OpportunityGenerationRunId,
  OpportunityGenerationServiceContext,
  OpportunityGenerationTimestamp,
  OpportunityGenerationVersion
} from "../index.js";
import {
  CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES,
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

const generatedAt = "2026-07-03T00:00:00.000Z" as OpportunityGenerationTimestamp;
const version = "generation-v1" as OpportunityGenerationVersion;

describe("Opportunity Generation model contracts", () => {
  it("defines stable deterministic vocabularies", () => {
    expect(OPPORTUNITY_GENERATION_MODES.deterministic).toBe("deterministic");
    expect(OPPORTUNITY_GENERATION_STAGES.candidateValidated).toBe("candidate-validated");
    expect(OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated).toBe("generated");
  });

  it("models explicit provider-independent generation input", () => {
    const input: OpportunityGenerationInput = {
      requestId: "generation-request-1" as OpportunityGenerationRequestId,
      candidate: candidateFixtureOpportunity,
      evidenceCompleteness: candidateFixtureEvidenceCompleteness,
      confidenceAggregation: candidateFixtureConfidenceAggregation,
      provenance: [opportunityPipelineFixtureProvenance],
      context: {
        requestedAt: generatedAt,
        requestedBy: "test",
        mode: OPPORTUNITY_GENERATION_MODES.deterministic,
        version,
        safeMetadata: {
          fixture: true
        }
      }
    };

    const contract: OpportunityGenerationInputContract = {
      input,
      explicitInputsOnly: true,
      providerIndependent: true
    };

    expect(contract.input.requestId).toBe("generation-request-1");
    expect(contract.input.context.mode).toBe(OPPORTUNITY_GENERATION_MODES.deterministic);
    expect(contract.explicitInputsOnly).toBe(true);
  });

  it("models deterministic generated opportunity output", () => {
    const output: OpportunityGenerationOutput = {
      outputId: "generation-output-1" as OpportunityGenerationOutputId,
      runId: "generation-run-1" as OpportunityGenerationRunId,
      status: OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated,
      generatedOpportunity: {
        opportunityId: "opportunity-1" as OpportunityId,
        candidate: candidateFixtureOpportunity,
        hypothesis: opportunityFixtureHypothesis,
        evidence: [opportunityFixtureEvidence],
        confidence: opportunityFixtureConfidence,
        generatedAt,
        version,
        safeMetadata: {
          fixture: true
        }
      },
      evidenceCompleteness: candidateFixtureEvidenceCompleteness,
      confidenceAggregation: {
        ...candidateFixtureConfidenceAggregation,
        status: CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES.ready
      },
      completedStages: [
        OPPORTUNITY_GENERATION_STAGES.inputPrepared,
        OPPORTUNITY_GENERATION_STAGES.evidenceAssembled,
        OPPORTUNITY_GENERATION_STAGES.candidateValidated,
        OPPORTUNITY_GENERATION_STAGES.confidenceAggregated,
        OPPORTUNITY_GENERATION_STAGES.outputPrepared
      ],
      generatedAt,
      safeMetadata: {
        fixture: true
      }
    };

    const contract: OpportunityGenerationOutputContract = {
      output,
      deterministic: true,
      providerIndependent: true
    };

    expect(contract.output.status).toBe(OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated);
    expect(contract.output.completedStages).toContain(OPPORTUNITY_GENERATION_STAGES.outputPrepared);
    expect(contract.deterministic).toBe(true);
  });

  it("defines a deterministic service contract without implementing a runtime engine", async () => {
    const input: OpportunityGenerationInput = {
      requestId: "generation-request-2" as OpportunityGenerationRequestId,
      candidate: candidateFixtureOpportunity,
      provenance: [opportunityPipelineFixtureProvenance],
      context: {
        requestedAt: generatedAt,
        requestedBy: "test",
        mode: OPPORTUNITY_GENERATION_MODES.dryRun,
        version
      }
    };

    const context: OpportunityGenerationServiceContext = {
      runId: "generation-run-2" as OpportunityGenerationRunId,
      startedAt: generatedAt,
      correlationId: "correlation-generation-1",
      requestId: "request-generation-1"
    };

    const serviceContract: DeterministicOpportunityGenerationServiceContract = {
      deterministic: true,
      explicitInputsOnly: true,
      providerIndependent: true,
      service: {
        generate: (generationInput, generationContext) => ({
          input: generationInput,
          context: generationContext,
          output: {
            outputId: "generation-output-2" as OpportunityGenerationOutputId,
            runId: generationContext.runId,
            status: OPPORTUNITY_GENERATION_OUTPUT_STATUSES.validationFailed,
            completedStages: [OPPORTUNITY_GENERATION_STAGES.inputPrepared],
            generatedAt
          }
        })
      }
    };

    const result = await serviceContract.service.generate(input, context);

    expect(serviceContract.explicitInputsOnly).toBe(true);
    expect(result.output.runId).toBe(context.runId);
    expect(result.output.status).toBe(OPPORTUNITY_GENERATION_OUTPUT_STATUSES.validationFailed);
  });
});
