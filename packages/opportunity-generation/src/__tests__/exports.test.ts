import { describe, expect, it } from "vitest";
import * as generationExports from "../index.js";

describe("Opportunity Generation export stability", () => {
  it("exposes approved Slice B contracts from the package root", () => {
    expect(generationExports.OPPORTUNITY_GENERATION_PACKAGE_NAME).toBe("@opportunity-os/opportunity-generation");
    expect(generationExports.OPPORTUNITY_GENERATION_FOUNDATION_PHASE).toBe("phase-2-milestone-24");
    expect(generationExports.OPPORTUNITY_GENERATION_MODES.deterministic).toBe("deterministic");
    expect(generationExports.OPPORTUNITY_GENERATION_STAGES.outputPrepared).toBe("output-prepared");
    expect(generationExports.OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated).toBe("generated");
    expect(generationExports.GENERATION_EVIDENCE_ASSEMBLY_STATUSES.assembled).toBe("assembled");
    expect(generationExports.GENERATION_VALIDATION_ISSUE_CODES.candidateInvalid).toBe("generation.candidate_invalid");
    expect(generationExports.GENERATION_CONFIDENCE_AGGREGATION_STATUSES.ready).toBe("ready");
    expect(generationExports.GENERATION_RESULT_STATUSES.success).toBe("success");
    expect(generationExports.GENERATION_ERROR_CODES.validationFailed).toBe("generation.validation_failed");
    expect(generationExports.GENERATION_EVENT_NAMES.opportunityGenerated).toBe("generation.opportunity_generated");
    expect(generationExports.OPPORTUNITY_GENERATION_FIXTURE_IDS.runId).toBe("generation-run-fixture-1");
  });
});
