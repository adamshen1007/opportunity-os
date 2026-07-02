import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_PIPELINE_ERROR_CATEGORIES,
  OPPORTUNITY_PIPELINE_ERROR_CODES,
  OPPORTUNITY_PIPELINE_EVENT_NAMES,
  OPPORTUNITY_PIPELINE_RESULT_STATUSES,
  OPPORTUNITY_PIPELINE_STATUSES,
  OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES,
  OpportunityPipelineError,
  PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES,
  PIPELINE_EVIDENCE_AGGREGATION_STATUSES,
  PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES
} from "../index.js";
import type {
  OpportunityPipelineId,
  OpportunityPipelineMetadata,
  OpportunityPipelineResult,
  OpportunityPipelineRunId,
  OpportunityPipelineTimestamp,
  OpportunityPipelineValidationFailure,
  PipelineEvidenceAggregation
} from "../index.js";

describe("Opportunity Pipeline assembly contracts", () => {
  it("defines stable assembly status vocabularies", () => {
    expect(PIPELINE_EVIDENCE_AGGREGATION_STATUSES).toEqual({
      pending: "pending",
      assembled: "assembled",
      invalid: "invalid"
    });
    expect(PIPELINE_HYPOTHESIS_ASSEMBLY_STATUSES).toEqual({
      pending: "pending",
      assembled: "assembled",
      invalid: "invalid"
    });
    expect(PIPELINE_CANDIDATE_OPPORTUNITY_STATUSES).toEqual({
      proposed: "proposed",
      validated: "validated",
      rejected: "rejected"
    });
  });

  it("models evidence aggregation as a declarative contract", () => {
    const aggregation: PipelineEvidenceAggregation = {
      aggregationId: "aggregation.synthetic" as never,
      status: PIPELINE_EVIDENCE_AGGREGATION_STATUSES.assembled,
      evidence: [],
      provenance: [],
      safeMetadata: {
        fixture: true
      }
    };

    expect(aggregation.status).toBe("assembled");
    expect(aggregation.evidence).toEqual([]);
  });

  it("defines validation issue contracts without process behavior", () => {
    const validation: OpportunityPipelineValidationFailure = {
      valid: false,
      issues: [
        {
          code: OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES.missingEvidence,
          message: "Synthetic evidence is required."
        }
      ]
    };

    expect(validation.valid).toBe(false);
    expect(validation.issues[0]?.code).toBe("pipeline.missing_evidence");
  });

  it("models pipeline result shapes", () => {
    const timestamp = "2026-01-01T00:00:00.000Z" as OpportunityPipelineTimestamp;
    const metadata: OpportunityPipelineMetadata = {
      definition: {
        pipelineId: "pipeline.synthetic" as OpportunityPipelineId,
        name: "Synthetic pipeline",
        version: "1.0.0" as never,
        lifecycle: {
          createdAt: timestamp,
          version: "1.0.0" as never,
          status: OPPORTUNITY_PIPELINE_STATUSES.ready
        }
      },
      run: {
        runId: "run.synthetic" as OpportunityPipelineRunId,
        pipelineId: "pipeline.synthetic" as OpportunityPipelineId,
        stages: []
      }
    };

    const result: OpportunityPipelineResult = {
      status: OPPORTUNITY_PIPELINE_RESULT_STATUSES.success,
      metadata,
      candidates: []
    };

    expect(result.status).toBe("success");
    expect(result.candidates).toEqual([]);
  });

  it("serializes pipeline errors safely", () => {
    const error = new OpportunityPipelineError({
      code: OPPORTUNITY_PIPELINE_ERROR_CODES.validationFailed,
      category: OPPORTUNITY_PIPELINE_ERROR_CATEGORIES.validation,
      message: "Pipeline validation failed.",
      correlationId: "correlation.synthetic",
      cause: new Error("secret-token")
    });

    expect(error.toSafeDetails()).toEqual({
      code: "pipeline.validation_failed",
      category: "validation",
      message: "Pipeline validation failed.",
      correlationId: "correlation.synthetic"
    });
    expect(JSON.stringify(error)).not.toContain("secret-token");
    expect(JSON.stringify(error)).not.toContain("stack");
  });

  it("defines stable pipeline event names", () => {
    expect(OPPORTUNITY_PIPELINE_EVENT_NAMES).toEqual({
      evidenceAggregated: "opportunity_pipeline.evidence_aggregated",
      hypothesisAssembled: "opportunity_pipeline.hypothesis_assembled",
      candidatePrepared: "opportunity_pipeline.candidate_prepared",
      validated: "opportunity_pipeline.validated",
      completed: "opportunity_pipeline.completed",
      failed: "opportunity_pipeline.failed"
    });
  });
});
