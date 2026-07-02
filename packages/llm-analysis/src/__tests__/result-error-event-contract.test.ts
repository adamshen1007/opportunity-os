import { describe, expect, it } from "vitest";
import {
  ANALYSIS_ERROR_CATEGORIES,
  ANALYSIS_ERROR_CODES,
  ANALYSIS_EVENT_NAMES,
  ANALYSIS_RESULT_STATUSES,
  AnalysisError,
  type AnalysisEventPayload,
  type AnalysisRequestId,
  type AnalysisResultFailure
} from "../index.js";

describe("result, error, and event contracts", () => {
  it("define analysis failure result shapes", () => {
    const failure: AnalysisResultFailure = {
      status: ANALYSIS_RESULT_STATUSES.validationFailure,
      issues: [
        {
          code: "missing-prompt-input",
          path: ["input"],
          message: "A required safe input key is missing."
        }
      ]
    };

    expect(failure.status).toBe("validation-failure");
    expect(failure.issues).toHaveLength(1);
  });

  it("serializes analysis errors into safe details", () => {
    const error = new AnalysisError({
      code: ANALYSIS_ERROR_CODES.unsafePayload,
      category: ANALYSIS_ERROR_CATEGORIES.safety,
      message: "Payload failed safety checks.",
      correlationId: "correlation-1",
      requestId: "request-1",
      safeMetadata: {
        field: "summary"
      }
    });

    expect(error.toJSON()).toEqual({
      code: "analysis.unsafe_payload",
      category: "safety",
      message: "Payload failed safety checks.",
      correlationId: "correlation-1",
      requestId: "request-1",
      safeMetadata: {
        field: "summary"
      }
    });
    expect(JSON.stringify(error)).not.toMatch(/stack|cause|secret/i);
  });

  it("defines analysis event payload contracts", () => {
    const payload: AnalysisEventPayload = {
      requestId: "analysis-request-1" as AnalysisRequestId,
      status: ANALYSIS_RESULT_STATUSES.success,
      safeMetadata: {
        eventName: ANALYSIS_EVENT_NAMES.completed
      }
    };

    expect(ANALYSIS_EVENT_NAMES).toEqual({
      requested: "llm-analysis.requested",
      validated: "llm-analysis.validated",
      completed: "llm-analysis.completed",
      failed: "llm-analysis.failed",
      rejected: "llm-analysis.rejected"
    });
    expect(payload.status).toBe("success");
  });
});
