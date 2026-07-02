import { describe, expect, it } from "vitest";
import {
  AnalysisError,
  ANALYSIS_ERROR_CATEGORIES,
  ANALYSIS_ERROR_CODES,
  llmAnalysisFixtureCompletedEvent,
  llmAnalysisFixturePromptInput,
  llmAnalysisFixturePromptOutput,
  llmAnalysisFixtureRequest,
  llmAnalysisFixtureSafePayload,
  llmAnalysisFixtureValidationSuccess
} from "../index.js";

const unsafePatterns = [
  /api[_-]?key/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /authorization/i,
  /bearer\s+[a-z0-9._-]+/i,
  /client[_-]?secret/i,
  /database_url/i,
  /raw provider/i,
  /provider payload/i,
  /stack/i,
  /cause/i
] as const;

describe("LLM analysis security", () => {
  it("keeps fixtures and contract outputs secret-safe", () => {
    const serialized = JSON.stringify({
      llmAnalysisFixtureCompletedEvent,
      llmAnalysisFixturePromptInput,
      llmAnalysisFixturePromptOutput,
      llmAnalysisFixtureRequest,
      llmAnalysisFixtureSafePayload,
      llmAnalysisFixtureValidationSuccess
    });

    for (const pattern of unsafePatterns) {
      expect(serialized).not.toMatch(pattern);
    }
  });

  it("serializes errors without stack traces or raw causes", () => {
    const error = new AnalysisError({
      code: ANALYSIS_ERROR_CODES.unsafePayload,
      category: ANALYSIS_ERROR_CATEGORIES.safety,
      message: "Payload failed safety checks.",
      correlationId: "correlation-1",
      requestId: "request-1"
    });

    const serialized = JSON.stringify(error);

    expect(serialized).toContain("analysis.unsafe_payload");
    for (const pattern of unsafePatterns) {
      expect(serialized).not.toMatch(pattern);
    }
  });
});
