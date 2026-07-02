import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES,
  OPPORTUNITY_PIPELINE_STAGE_KINDS,
  OPPORTUNITY_PIPELINE_STAGE_STATUSES,
  OPPORTUNITY_PIPELINE_STATUSES
} from "../index.js";
import type {
  OpportunityPipelineId,
  OpportunityPipelineMetadata,
  OpportunityPipelineProvenanceReference,
  OpportunityPipelineRunId,
  OpportunityPipelineStageDefinition,
  OpportunityPipelineStageId,
  OpportunityPipelineTimestamp,
  OpportunityPipelineVersion
} from "../index.js";

describe("Opportunity Pipeline model contracts", () => {
  it("defines stable pipeline status vocabulary", () => {
    expect(OPPORTUNITY_PIPELINE_STATUSES).toEqual({
      draft: "draft",
      ready: "ready",
      completed: "completed",
      failed: "failed",
      archived: "archived"
    });
  });

  it("defines stable stage vocabulary without runtime behavior", () => {
    expect(OPPORTUNITY_PIPELINE_STAGE_KINDS).toEqual({
      evidenceAggregation: "evidence-aggregation",
      hypothesisAssembly: "hypothesis-assembly",
      candidateOpportunity: "candidate-opportunity",
      validation: "validation",
      resultAssembly: "result-assembly"
    });
    expect(OPPORTUNITY_PIPELINE_STAGE_STATUSES).toEqual({
      pending: "pending",
      ready: "ready",
      completed: "completed",
      skipped: "skipped",
      failed: "failed"
    });
  });

  it("models pipeline metadata with stage records and safe metadata", () => {
    const pipelineId = "pipeline.synthetic" as OpportunityPipelineId;
    const runId = "run.synthetic" as OpportunityPipelineRunId;
    const stageId = "stage.evidence" as OpportunityPipelineStageId;
    const timestamp = "2026-01-01T00:00:00.000Z" as OpportunityPipelineTimestamp;
    const version = "1.0.0" as OpportunityPipelineVersion;

    const metadata: OpportunityPipelineMetadata = {
      definition: {
        pipelineId,
        name: "Synthetic Opportunity Pipeline",
        version,
        lifecycle: {
          createdAt: timestamp,
          version,
          status: OPPORTUNITY_PIPELINE_STATUSES.ready
        },
        safeMetadata: {
          fixture: true
        }
      },
      run: {
        runId,
        pipelineId,
        startedAt: timestamp,
        stages: [
          {
            stageId,
            kind: OPPORTUNITY_PIPELINE_STAGE_KINDS.evidenceAggregation,
            status: OPPORTUNITY_PIPELINE_STAGE_STATUSES.ready,
            recordedAt: timestamp
          }
        ]
      }
    };

    expect(metadata.definition.lifecycle.status).toBe("ready");
    expect(metadata.run?.stages[0]?.kind).toBe("evidence-aggregation");
  });

  it("models stage dependencies as declarative contracts", () => {
    const evidenceStageId = "stage.evidence" as OpportunityPipelineStageId;
    const hypothesisStageId = "stage.hypothesis" as OpportunityPipelineStageId;

    const stage: OpportunityPipelineStageDefinition = {
      stageId: hypothesisStageId,
      kind: OPPORTUNITY_PIPELINE_STAGE_KINDS.hypothesisAssembly,
      name: "Synthetic hypothesis assembly",
      dependsOn: [
        {
          stageId: evidenceStageId,
          required: true
        }
      ]
    };

    expect(stage.dependsOn?.[0]?.stageId).toBe(evidenceStageId);
    expect(stage.kind).toBe("hypothesis-assembly");
  });

  it("preserves upstream provenance references without raw provider payloads", () => {
    const provenance: OpportunityPipelineProvenanceReference = {
      runId: "run.synthetic" as OpportunityPipelineRunId,
      stageId: "stage.evidence" as OpportunityPipelineStageId,
      boundary: OPPORTUNITY_PIPELINE_PROVENANCE_BOUNDARIES.opportunityPipeline,
      recordedAt: "2026-01-01T00:00:00.000Z" as OpportunityPipelineTimestamp,
      upstream: {
        llmAnalysisId: "llm-analysis.synthetic" as never
      },
      safeMetadata: {
        source: "synthetic"
      }
    };

    expect(provenance.boundary).toBe("opportunity-pipeline");
    expect(JSON.stringify(provenance)).not.toContain("access_token");
    expect(JSON.stringify(provenance)).not.toContain("provider_response");
  });
});
