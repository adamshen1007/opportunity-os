import { describe, expect, it } from "vitest";
import * as opportunityPipeline from "../index.js";

describe("Opportunity Pipeline public exports", () => {
  it("exports approved package, model, assembly, and fixture contracts from the root", () => {
    expect(opportunityPipeline.OPPORTUNITY_PIPELINE_PACKAGE_NAME).toBe("@opportunity-os/opportunity-pipeline");
    expect(opportunityPipeline.OPPORTUNITY_PIPELINE_FOUNDATION_PHASE).toBe("phase-2-milestone-22");
    expect(opportunityPipeline.OPPORTUNITY_PIPELINE_STAGE_KINDS.evidenceAggregation).toBe("evidence-aggregation");
    expect(opportunityPipeline.PIPELINE_EVIDENCE_AGGREGATION_STATUSES.assembled).toBe("assembled");
    expect(opportunityPipeline.OPPORTUNITY_PIPELINE_RESULT_STATUSES.success).toBe("success");
    expect(opportunityPipeline.OPPORTUNITY_PIPELINE_EVENT_NAMES.completed).toBe("opportunity_pipeline.completed");
    expect(opportunityPipeline.OPPORTUNITY_PIPELINE_FIXTURE_IDS.pipelineId).toBe("opportunity-pipeline-fixture-1");
  });
});
