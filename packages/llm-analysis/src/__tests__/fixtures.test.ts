import { describe, expect, it } from "vitest";
import {
  LLM_ANALYSIS_FIXTURE_IDS,
  llmAnalysisFixturePrompt,
  llmAnalysisFixturePromptInput,
  llmAnalysisFixturePromptOutput,
  llmAnalysisFixtureRequest,
  llmAnalysisFixtureResult,
  llmAnalysisFixtureStructuredOutput
} from "../index.js";

describe("LLM analysis fixtures", () => {
  it("provide deterministic synthetic prompt, input, output, and request fixtures", () => {
    expect(LLM_ANALYSIS_FIXTURE_IDS.analysisRequestId).toBe("analysis_request_fixture_001");
    expect(llmAnalysisFixturePrompt.id).toBe("prompt_fixture_analysis");
    expect(llmAnalysisFixturePromptInput.variables).toHaveProperty("canonicalText");
    expect(llmAnalysisFixturePromptOutput.values).toEqual({
      summary: "Synthetic structured analysis output.",
      confidence: 0.75
    });
    expect(llmAnalysisFixtureStructuredOutput.requiredFields).toEqual(["summary"]);
    expect(llmAnalysisFixtureRequest.context.correlationId).toBe("corr_llm_analysis_fixture_001");
    expect(llmAnalysisFixtureResult.status).toBe("success");
  });

  it("keeps fixtures free of provider payloads, credentials, and real model material", () => {
    const serialized = JSON.stringify({
      llmAnalysisFixturePrompt,
      llmAnalysisFixturePromptInput,
      llmAnalysisFixturePromptOutput,
      llmAnalysisFixtureRequest
    });

    expect(serialized).not.toMatch(/api[_-]?key|access[_-]?token|refresh[_-]?token|authorization/i);
    expect(serialized).not.toMatch(/raw provider|provider payload|real embedding|real prompt/i);
    expect(serialized).not.toMatch(/https:\/\/api\.|localhost|127\.0\.0\.1/i);
  });
});
