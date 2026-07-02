import { describe, expect, it } from "vitest";
import {
  ANALYSIS_ERROR_CATEGORIES,
  ANALYSIS_ERROR_CODES,
  ANALYSIS_EVENT_NAMES,
  ANALYSIS_RESPONSE_STATUSES,
  ANALYSIS_RESULT_STATUSES,
  ANALYSIS_VALIDATION_ISSUE_CODES,
  LLM_PROVIDER_CAPABILITIES,
  LLM_PROVIDER_STABILITY_STATUSES,
  PROMPT_SAFETY_CLASSIFICATIONS,
  PROMPT_TEMPLATE_VARIABLE_KINDS,
  REDACTION_TARGET_KINDS,
  SAFETY_CLASSIFICATIONS,
  STRUCTURED_OUTPUT_FIELD_KINDS,
  llmAnalysisFixtureSafeError
} from "../index.js";

describe("contract stability", () => {
  it("locks provider, prompt, structured output, and safety vocabularies", () => {
    expect(LLM_PROVIDER_CAPABILITIES).toEqual({
      textAnalysis: "text-analysis",
      structuredOutput: "structured-output",
      safetyClassification: "safety-classification"
    });
    expect(LLM_PROVIDER_STABILITY_STATUSES).toEqual({
      experimental: "experimental",
      stable: "stable",
      deprecated: "deprecated"
    });
    expect(PROMPT_SAFETY_CLASSIFICATIONS).toEqual({
      public: "public",
      internal: "internal",
      sensitive: "sensitive"
    });
    expect(PROMPT_TEMPLATE_VARIABLE_KINDS).toEqual({
      text: "text",
      number: "number",
      boolean: "boolean",
      object: "object",
      list: "list"
    });
    expect(STRUCTURED_OUTPUT_FIELD_KINDS).toEqual({
      string: "string",
      number: "number",
      boolean: "boolean",
      object: "object",
      array: "array"
    });
    expect(SAFETY_CLASSIFICATIONS).toEqual({
      public: "public",
      internal: "internal",
      sensitive: "sensitive",
      restricted: "restricted"
    });
    expect(REDACTION_TARGET_KINDS).toEqual({
      credential: "credential",
      token: "token",
      authHeader: "auth-header",
      providerKey: "provider-key",
      rawPayload: "raw-payload",
      personalData: "personal-data"
    });
  });

  it("locks analysis statuses, issue codes, event names, and safe error shape", () => {
    expect(ANALYSIS_RESPONSE_STATUSES).toEqual({
      accepted: "accepted",
      rejected: "rejected",
      failed: "failed"
    });
    expect(ANALYSIS_VALIDATION_ISSUE_CODES).toEqual({
      missingPromptInput: "missing-prompt-input",
      invalidPromptOutput: "invalid-prompt-output",
      unsafePayload: "unsafe-payload",
      unsupportedStructuredOutput: "unsupported-structured-output",
      missingProvenance: "missing-provenance"
    });
    expect(ANALYSIS_RESULT_STATUSES).toEqual({
      success: "success",
      validationFailure: "validation-failure",
      providerUnavailable: "provider-unavailable",
      unsafeOutput: "unsafe-output",
      failed: "failed"
    });
    expect(ANALYSIS_ERROR_CODES).toEqual({
      validationFailed: "analysis.validation_failed",
      unsafePayload: "analysis.unsafe_payload",
      providerUnavailable: "analysis.provider_unavailable",
      internalFailure: "analysis.internal_failure"
    });
    expect(ANALYSIS_ERROR_CATEGORIES).toEqual({
      validation: "validation",
      safety: "safety",
      infrastructure: "infrastructure",
      internal: "internal"
    });
    expect(ANALYSIS_EVENT_NAMES).toEqual({
      requested: "llm-analysis.requested",
      validated: "llm-analysis.validated",
      completed: "llm-analysis.completed",
      failed: "llm-analysis.failed",
      rejected: "llm-analysis.rejected"
    });
    expect(Object.keys(llmAnalysisFixtureSafeError)).toEqual([
      "code",
      "category",
      "message",
      "correlationId",
      "requestId",
      "safeMetadata"
    ]);
  });
});
