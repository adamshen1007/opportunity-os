import { describe, expect, it } from "vitest";
import {
  ANALYSIS_VALIDATION_ISSUE_CODES,
  REDACTION_TARGET_KINDS,
  SAFETY_CLASSIFICATIONS,
  type AnalysisValidationFailure,
  type AnalysisValidationSuccess,
  type RedactionPolicy,
  type SafeAnalysisPayload
} from "../index.js";

describe("validation and safety contracts", () => {
  it("define validation success and failure shapes", () => {
    const success: AnalysisValidationSuccess = {
      valid: true,
      issues: []
    };
    const failure: AnalysisValidationFailure = {
      valid: false,
      issues: [
        {
          code: ANALYSIS_VALIDATION_ISSUE_CODES.missingPromptInput,
          path: ["input", "variables"],
          message: "A required safe input key is missing.",
          safeMetadata: {
            key: "canonicalText"
          }
        }
      ]
    };

    expect(success.valid).toBe(true);
    expect(failure.issues[0]?.code).toBe("missing-prompt-input");
  });

  it("define redaction policy and safe payload contracts", () => {
    const policy: RedactionPolicy = {
      policyName: "fixture-policy",
      policyVersion: "1.0.0",
      classification: SAFETY_CLASSIFICATIONS.sensitive,
      targetKinds: [
        REDACTION_TARGET_KINDS.credential,
        REDACTION_TARGET_KINDS.token,
        REDACTION_TARGET_KINDS.rawPayload
      ],
      replacement: "[REDACTED]"
    };
    const payload: SafeAnalysisPayload = {
      values: {
        summary: "Synthetic safe output."
      },
      safety: {
        classification: SAFETY_CLASSIFICATIONS.internal,
        redactionRequired: true,
        allowedFields: ["summary"]
      },
      redacted: true
    };

    expect(policy.replacement).toBe("[REDACTED]");
    expect(payload.redacted).toBe(true);
  });
});
