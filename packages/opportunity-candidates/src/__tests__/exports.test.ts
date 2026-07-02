import { describe, expect, it } from "vitest";
import * as candidateExports from "../index.js";

describe("candidate opportunity export stability", () => {
  it("exposes approved contracts from the package root", () => {
    expect(candidateExports.OPPORTUNITY_CANDIDATES_PACKAGE_NAME).toBe("@opportunity-os/opportunity-candidates");
    expect(candidateExports.CANDIDATE_OPPORTUNITY_STATUSES.validationReady).toBe("validation-ready");
    expect(candidateExports.CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES.complete).toBe("complete");
    expect(candidateExports.CANDIDATE_CONFIDENCE_AGGREGATION_STATUSES.ready).toBe("ready");
    expect(candidateExports.CANDIDATE_VALIDATION_ISSUE_CODES.incompleteEvidence).toBe("candidate.incomplete_evidence");
    expect(candidateExports.CANDIDATE_RESULT_STATUSES.validationFailure).toBe("validation-failure");
    expect(candidateExports.CANDIDATE_ERROR_CODES.validationFailed).toBe("candidate.validation_failed");
    expect(candidateExports.CANDIDATE_EVENT_NAMES.validated).toBe("candidate.validated");
    expect(candidateExports.CANDIDATE_FIXTURE_IDS.candidateId).toBe("candidate-fixture-1");
  });
});
