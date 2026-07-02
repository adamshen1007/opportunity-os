import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_CONFIDENCE_LEVELS,
  OPPORTUNITY_ENGINE_ERROR_CODES,
  OPPORTUNITY_ENGINE_FOUNDATION_PHASE,
  OPPORTUNITY_ENGINE_PACKAGE_NAME,
  OPPORTUNITY_EVENT_NAMES,
  OPPORTUNITY_EVIDENCE_KINDS,
  OPPORTUNITY_FIXTURE_IDS,
  OPPORTUNITY_HYPOTHESIS_STATUSES,
  OPPORTUNITY_RANKING_STATUSES,
  OPPORTUNITY_RESULT_STATUSES,
  OPPORTUNITY_SCORE_DIMENSIONS,
  OPPORTUNITY_SOURCE_KINDS,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_VALIDATION_ISSUE_CODES,
  opportunityFixtureResult
} from "../index.js";

describe("opportunity engine public exports", () => {
  it("routes approved contracts and fixtures through the package root", () => {
    expect(OPPORTUNITY_ENGINE_PACKAGE_NAME).toBe("@opportunity-os/opportunity-engine");
    expect(OPPORTUNITY_ENGINE_FOUNDATION_PHASE).toBe("phase-2-milestone-21");
    expect(OPPORTUNITY_FIXTURE_IDS.opportunityId).toBe("opportunity-fixture-1");
    expect(OPPORTUNITY_STATUSES.validated).toBe("validated");
    expect(OPPORTUNITY_SOURCE_KINDS.structuredAnalysis).toBe("structured-analysis");
    expect(OPPORTUNITY_EVIDENCE_KINDS.structuredAnalysis).toBe("structured-analysis");
    expect(OPPORTUNITY_HYPOTHESIS_STATUSES.supported).toBe("supported");
    expect(OPPORTUNITY_SCORE_DIMENSIONS.evidenceStrength).toBe("evidence-strength");
    expect(OPPORTUNITY_CONFIDENCE_LEVELS.high).toBe("high");
    expect(OPPORTUNITY_RANKING_STATUSES.included).toBe("included");
    expect(OPPORTUNITY_VALIDATION_ISSUE_CODES.missingEvidence).toBe("opportunity.missing_evidence");
    expect(OPPORTUNITY_RESULT_STATUSES.success).toBe("success");
    expect(OPPORTUNITY_ENGINE_ERROR_CODES.validationFailed).toBe("opportunity.validation_failed");
    expect(OPPORTUNITY_EVENT_NAMES.completed).toBe("opportunity.completed");
    expect(opportunityFixtureResult.status).toBe("success");
  });
});
