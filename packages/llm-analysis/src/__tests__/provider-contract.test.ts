import { describe, expect, it } from "vitest";
import {
  LLM_PROVIDER_CAPABILITIES,
  LLM_PROVIDER_STABILITY_STATUSES,
  type LlmProviderContract,
  type LlmProviderId,
  type LlmModelId
} from "../index.js";

describe("LLM provider contracts", () => {
  it("define provider-independent capability and stability vocabularies", () => {
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
  });

  it("describe providers without naming concrete vendors or clients", () => {
    const contract: LlmProviderContract = {
      metadata: {
        id: "fixture-provider" as LlmProviderId,
        name: "Fixture Provider",
        version: "1.0.0",
        description: "Deterministic provider contract fixture.",
        stability: LLM_PROVIDER_STABILITY_STATUSES.experimental,
        capabilities: [
          LLM_PROVIDER_CAPABILITIES.textAnalysis,
          LLM_PROVIDER_CAPABILITIES.structuredOutput
        ],
        models: [
          {
            id: "fixture-model" as LlmModelId,
            name: "Fixture Model",
            contextWindowTokens: 1024,
            supportedCapabilities: [LLM_PROVIDER_CAPABILITIES.textAnalysis]
          }
        ]
      },
      supportsStructuredOutput: true,
      supportsSafetyClassification: true
    };

    expect(contract.metadata.capabilities).toContain("structured-output");
    expect(JSON.stringify(contract)).not.toMatch(/api\.|accessToken|refreshToken|secret/i);
  });
});
