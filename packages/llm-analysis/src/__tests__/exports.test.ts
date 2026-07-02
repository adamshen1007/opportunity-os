import { describe, expect, it } from "vitest";
import * as llmAnalysis from "../index.js";

describe("public exports", () => {
  it("exposes approved LLM analysis contracts from the package root", () => {
    expect(llmAnalysis.LLM_ANALYSIS_PACKAGE_NAME).toBe("@opportunity-os/llm-analysis");
    expect(llmAnalysis.LLM_PROVIDER_CAPABILITIES).toBeDefined();
    expect(llmAnalysis.PROMPT_SAFETY_CLASSIFICATIONS).toBeDefined();
    expect(llmAnalysis.STRUCTURED_OUTPUT_FIELD_KINDS).toBeDefined();
    expect(llmAnalysis.ANALYSIS_RESPONSE_STATUSES).toBeDefined();
    expect(llmAnalysis.ANALYSIS_VALIDATION_ISSUE_CODES).toBeDefined();
    expect(llmAnalysis.SAFETY_CLASSIFICATIONS).toBeDefined();
    expect(llmAnalysis.REDACTION_TARGET_KINDS).toBeDefined();
    expect(llmAnalysis.ANALYSIS_RESULT_STATUSES).toBeDefined();
    expect(llmAnalysis.ANALYSIS_ERROR_CODES).toBeDefined();
    expect(llmAnalysis.ANALYSIS_EVENT_NAMES).toBeDefined();
    expect(llmAnalysis.LLM_ANALYSIS_FIXTURE_IDS).toBeDefined();
  });
});
