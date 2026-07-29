import { describe, expect, it } from "vitest";
import {
  createGeminiLiveLlmProviderAdapter,
  createLiveLlmPromptBoundary,
  createLiveLlmProviderConfigFromEnv,
  LIVE_LLM_VALIDATION_VERSIONS,
  PILOT_LLM_MODEL,
  PILOT_LLM_PROVIDER,
  llmAnalysisFixtureRequest,
  validateLiveLlmOutput
} from "../index.js";

const request = {
  ...llmAnalysisFixtureRequest,
  prompt: {
    ...llmAnalysisFixtureRequest.prompt,
    outputShape: {
      schema: {
        schemaName: "PilotOpportunityAnalysis",
        schemaVersion: "2.0.0",
        fields: [
          { name: "summary", kind: "string" as const, required: true, validationMetadata: { minLength: 1 } },
          { name: "claims", kind: "array" as const, required: true, validationMetadata: {} }
        ],
        requiredFields: ["summary", "claims"],
        optionalFields: [],
        validationMetadata: { allowAdditionalFields: false, issueCodes: ["invalid-prompt-output"] }
      }
    }
  },
  input: {
    ...llmAnalysisFixtureRequest.input,
    variables: { evidenceCatalog: [{ evidenceId: "evidence-1", text: "safe evidence" }] }
  }
};

describe("live LLM output validation", () => {
  it("locks the selected pilot provider, model, and validation versions", () => {
    expect(PILOT_LLM_PROVIDER).toBe("gemini");
    expect(PILOT_LLM_MODEL).toBe("gemini-2.5-flash");
    expect(LIVE_LLM_VALIDATION_VERSIONS.validator).toBe("citation-validator-v1");
  });

  it("tells the provider every allowed field, type, and additional-field rule", () => {
    const boundary = createLiveLlmPromptBoundary(llmAnalysisFixtureRequest);

    expect(boundary.systemInstruction).toContain("exactly one JSON object");
    expect(boundary.userInstruction).toContain("summary:string:required");
    expect(boundary.userInstruction).toContain("confidence:number:optional");
    expect(boundary.userInstruction).toContain("Additional fields allowed: no");
  });

  it("accepts structured factual claims with supplied citations", () => {
    expect(validateLiveLlmOutput({
      summary: "Safe summary",
      claims: [{ text: "Supported fact", citationIds: ["evidence-1"], assumption: false }]
    }, request)).toEqual({ valid: true, issues: [] });
  });

  it.each([
    ["malformed schema", { summary: 42, claims: [] }],
    ["missing citation", { summary: "Safe", claims: [{ text: "Fact", citationIds: [], assumption: false }] }],
    ["fabricated citation", { summary: "Safe", claims: [{ text: "Fact", citationIds: ["missing"], assumption: false }] }],
    ["additional output", { summary: "Safe", claims: [{ text: "Assumption", citationIds: [], assumption: true }], rawProviderResponse: "forbidden" }]
  ])("rejects %s", (_name, values) => {
    expect(validateLiveLlmOutput(values, request).valid).toBe(false);
  });

  it("allows unsupported statements only when explicitly marked as assumptions", () => {
    expect(validateLiveLlmOutput({
      summary: "Safe summary",
      claims: [{ text: "Needs validation", citationIds: [], assumption: true }]
    }, request).valid).toBe(true);
  });

  it.each([
    [429, "quota"],
    [403, "refusal"]
  ])("fails closed for provider %i %s responses", async (status) => {
    const config = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: PILOT_LLM_PROVIDER,
      GEMINI_MODEL: PILOT_LLM_MODEL,
      GEMINI_API_KEY: "synthetic-secret"
    });
    expect(config.ok).toBe(true);
    if (!config.ok) return;
    const result = await createGeminiLiveLlmProviderAdapter({
      config: config.config,
      fetch: async () => new Response("provider payload", { status })
    }).analyze(request);
    expect(result.status).toBe("provider-unavailable");
    expect(JSON.stringify(result)).not.toContain("provider payload");
    expect(JSON.stringify(result)).not.toContain("synthetic-secret");
  });

  it("fails closed on timeout without exposing the cause", async () => {
    const config = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: PILOT_LLM_PROVIDER,
      GEMINI_MODEL: PILOT_LLM_MODEL,
      GEMINI_API_KEY: "synthetic-secret",
      LLM_PROVIDER_TIMEOUT_MS: "1"
    });
    expect(config.ok).toBe(true);
    if (!config.ok) return;
    const result = await createGeminiLiveLlmProviderAdapter({
      config: config.config,
      fetch: async (_input, init) => new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("unsafe cause", "AbortError")));
      })
    }).analyze(request);
    expect(result.status).toBe("provider-unavailable");
    expect(JSON.stringify(result)).not.toContain("unsafe cause");
  });

  it("rejects provider output that omits a structured candidate", async () => {
    const config = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: PILOT_LLM_PROVIDER,
      GEMINI_MODEL: PILOT_LLM_MODEL,
      GEMINI_API_KEY: "synthetic-secret"
    });
    expect(config.ok).toBe(true);
    if (!config.ok) return;
    const result = await createGeminiLiveLlmProviderAdapter({
      config: config.config,
      fetch: async () => new Response(JSON.stringify({ candidates: [] }), { status: 200 })
    }).analyze(request);
    expect(result.status).toBe("unsafe-output");
  });

  it("sends an evidence-constrained JSON schema to Gemini", async () => {
    const config = createLiveLlmProviderConfigFromEnv({
      LLM_LIVE_ANALYSIS_ENABLED: "true",
      LLM_PROVIDER: PILOT_LLM_PROVIDER,
      GEMINI_MODEL: PILOT_LLM_MODEL,
      GEMINI_API_KEY: "synthetic-secret"
    });
    expect(config.ok).toBe(true);
    if (!config.ok) return;

    let requestBody: unknown;
    const result = await createGeminiLiveLlmProviderAdapter({
      config: config.config,
      fetch: async (_input, init) => {
        requestBody = JSON.parse(String(init?.body));
        return new Response(JSON.stringify({
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify({
                  summary: "Safe cited summary",
                  confidence: 0.8,
                  claims: [{ text: "Supported fact", citationIds: ["evidence-1"], assumption: false }],
                  assumptions: []
                })
              }]
            }
          }]
        }), { status: 200 });
      }
    }).analyze({
      ...request,
      prompt: {
        ...request.prompt,
        outputShape: {
          schema: {
            ...request.prompt.outputShape.schema,
            fields: [
              ...request.prompt.outputShape.schema.fields,
              { name: "confidence", kind: "number", required: true, validationMetadata: {} },
              { name: "assumptions", kind: "array", required: true, validationMetadata: {} }
            ],
            requiredFields: ["summary", "claims", "confidence", "assumptions"]
          }
        }
      }
    });

    expect(result.status).toBe("success");
    expect(requestBody).toMatchObject({
      generationConfig: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          required: ["summary", "confidence", "claims", "assumptions"],
          properties: {
            claims: {
              items: {
                properties: {
                  citationIds: { items: { enum: ["evidence-1"] } }
                }
              }
            }
          }
        }
      }
    });
  });
});
