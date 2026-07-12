import { describe, expect, it } from "vitest";
import {
  createGeminiLiveLlmProviderAdapter,
  createLiveLlmProviderConfigFromEnv,
  createOpenAiLiveLlmProviderAdapter,
  llmAnalysisFixtureRequest
} from "../index.js";

const unsafePattern =
  /sk-secret-test-key|gemini-secret-test-key|bearer\s+sk-|authorization|x-goog-api-key|raw provider response|stack trace|raw cause/iu;

describe("live LLM provider security", () => {
  it("does not leak credentials when config is serialized", () => {
    const result = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: "openai",
      OPENAI_MODEL: "gpt-4.1-mini",
      OPENAI_API_KEY: "sk-secret-test-key"
    });

    expect(result.ok).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(unsafePattern);
  });

  it("does not leak raw provider failures, stacks, or auth values", async () => {
    const configResult = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: "openai",
      LLM_MODEL: "gpt-4.1-mini",
      OPENAI_API_KEY: "sk-secret-test-key"
    });

    expect(configResult.ok).toBe(true);
    if (!configResult.ok) return;

    const adapter = createOpenAiLiveLlmProviderAdapter({
      config: configResult.config,
      fetch: async () => {
        throw new Error("sk-secret-test-key raw provider response stack trace raw cause");
      }
    });

    const result = await adapter.analyze(llmAnalysisFixtureRequest);

    expect(result.status).toBe("provider-unavailable");
    expect(JSON.stringify(result)).not.toMatch(unsafePattern);
  });

  it("rejects unsafe provider output without returning the unsafe payload", async () => {
    const configResult = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: "openai",
      LLM_MODEL: "gpt-4.1-mini",
      OPENAI_API_KEY: "sk-secret-test-key"
    });

    expect(configResult.ok).toBe(true);
    if (!configResult.ok) return;

    const adapter = createOpenAiLiveLlmProviderAdapter({
      config: configResult.config,
      fetch: async () =>
        new Response(
          JSON.stringify({
            output_text: "{\"summary\":\"Bearer sk-secret-test-key raw provider response\"}"
          }),
          { status: 200 }
        )
    });

    const result = await adapter.analyze(llmAnalysisFixtureRequest);

    expect(result.status).toBe("unsafe-output");
    expect(JSON.stringify(result)).not.toMatch(unsafePattern);
  });

  it("does not leak Gemini credentials or raw provider failures", async () => {
    const configResult = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: "gemini",
      GEMINI_MODEL: "gemini-2.5-flash",
      GEMINI_API_KEY: "gemini-secret-test-key"
    });

    expect(configResult.ok).toBe(true);
    if (!configResult.ok) return;
    expect(JSON.stringify(configResult)).not.toMatch(unsafePattern);

    const adapter = createGeminiLiveLlmProviderAdapter({
      config: configResult.config,
      fetch: async () => {
        throw new Error("gemini-secret-test-key raw provider response stack trace raw cause");
      }
    });

    const result = await adapter.analyze(llmAnalysisFixtureRequest);

    expect(result.status).toBe("provider-unavailable");
    expect(JSON.stringify(result)).not.toMatch(unsafePattern);
  });
});
