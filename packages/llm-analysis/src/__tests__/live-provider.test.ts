import { describe, expect, it } from "vitest";
import {
  createGeminiLiveLlmProviderAdapter,
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

  it("keeps live provider disabled by default while accepting Gemini config", () => {
    const result = createLiveLlmProviderConfigFromEnv({
      LLM_PROVIDER: "gemini",
      GEMINI_MODEL: "gemini-2.5-flash",
      GEMINI_API_KEY: "gemini-secret-test-key"
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.enabled).toBe(false);
    expect(result.config.provider).toBe("gemini");
    expect(result.config.model).toBe("gemini-2.5-flash");
    expect(JSON.stringify(result)).not.toContain("gemini-secret-test-key");
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

  it("maps injected Gemini provider responses into analysis results", async () => {
    const configResult = createLiveLlmProviderConfigFromEnv({
      LLM_PROVIDER: "gemini",
      GEMINI_MODEL: "gemini-2.5-flash",
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      GEMINI_API_KEY: "gemini-secret-test-key"
    });

    expect(configResult.ok).toBe(true);
    if (!configResult.ok) return;

    const requestedUrls: string[] = [];
    const adapter = createGeminiLiveLlmProviderAdapter({
      config: configResult.config,
      now: () => "2026-07-07T00:00:00.000Z",
      fetch: async (input, init) => {
        requestedUrls.push(String(input));
        expect(init?.headers).toMatchObject({
          "content-type": "application/json",
          "x-goog-api-key": "gemini-secret-test-key"
        });

        return new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: "{\"summary\":\"Gemini synthetic analysis\",\"confidence\":0.78}"
                    }
                  ]
                }
              }
            ],
            usageMetadata: {
              promptTokenCount: 12,
              candidatesTokenCount: 8,
              totalTokenCount: 20
            }
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" }
          }
        );
      }
    });

    const result = await adapter.analyze(llmAnalysisFixtureRequest);

    expect(requestedUrls).toEqual([
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    ]);
    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.response.output?.values.summary).toBe("Gemini synthetic analysis");
    expect(result.response.metadata.usage?.totalUnits).toBe(20);
    expect(JSON.stringify(result)).not.toContain("gemini-secret-test-key");
  });
});
