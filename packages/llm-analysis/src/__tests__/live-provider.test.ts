import { describe, expect, it } from "vitest";
import {
  createLiveLlmProviderConfigFromEnv,
  createLiveLlmPromptBoundary,
  createOpenAiLiveLlmProviderAdapter,
  llmAnalysisFixtureRequest
} from "../index.js";

describe("live LLM provider", () => {
  it("keeps live provider disabled by default while accepting OpenAI config", () => {
    const result = createLiveLlmProviderConfigFromEnv({
      LLM_PROVIDER: "openai",
      LLM_MODEL: "gpt-4.1-mini",
      OPENAI_API_KEY: "sk-secret-test-key"
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.enabled).toBe(false);
    expect(result.config.provider).toBe("openai");
    expect(result.config.model).toBe("gpt-4.1-mini");
    expect(JSON.stringify(result)).not.toContain("sk-secret-test-key");
  });

  it("builds a secret-safe prompt boundary", () => {
    const boundary = createLiveLlmPromptBoundary({
      ...llmAnalysisFixtureRequest,
      input: {
        ...llmAnalysisFixtureRequest.input,
        variables: {
          ...llmAnalysisFixtureRequest.input.variables,
          apiKey: "sk-secret-test-key"
        }
      }
    });

    expect(boundary.redacted).toBe(true);
    expect(boundary.schemaFields.map((field) => field.name)).toContain("summary");
    expect(JSON.stringify(boundary)).not.toContain("sk-secret-test-key");
  });

  it("maps injected provider responses into analysis results", async () => {
    const configResult = createLiveLlmProviderConfigFromEnv({
      LLM_PROVIDER: "openai",
      LLM_MODEL: "gpt-4.1-mini",
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      OPENAI_API_KEY: "sk-secret-test-key"
    });

    expect(configResult.ok).toBe(true);
    if (!configResult.ok) return;

    const adapter = createOpenAiLiveLlmProviderAdapter({
      config: configResult.config,
      now: () => "2026-07-07T00:00:00.000Z",
      fetch: async () =>
        new Response(
          JSON.stringify({
            output_text: "{\"summary\":\"Live synthetic analysis\",\"confidence\":0.82}",
            usage: {
              input_tokens: 11,
              output_tokens: 7,
              total_tokens: 18
            }
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" }
          }
        )
    });

    const result = await adapter.analyze(llmAnalysisFixtureRequest);

    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.response.output?.values.summary).toBe("Live synthetic analysis");
    expect(result.response.metadata.usage?.totalUnits).toBe(18);
    expect(JSON.stringify(result)).not.toContain("sk-secret-test-key");
  });
});
