import { describe, expect, it } from "vitest";
import {
  ANALYSIS_RESPONSE_STATUSES,
  LLM_PROVIDER_CAPABILITIES,
  LLM_PROVIDER_STABILITY_STATUSES,
  PROMPT_SAFETY_CLASSIFICATIONS,
  SAFETY_CLASSIFICATIONS,
  STRUCTURED_OUTPUT_FIELD_KINDS,
  type AnalysisRequest,
  type AnalysisRequestId,
  type AnalysisResponse,
  type LlmModelId,
  type LlmProviderId,
  type PromptId,
  type PromptVersion
} from "../index.js";

const provider = {
  id: "fixture-provider" as LlmProviderId,
  name: "Fixture Provider",
  version: "1.0.0",
  description: "Deterministic analysis contract provider.",
  stability: LLM_PROVIDER_STABILITY_STATUSES.experimental,
  capabilities: [
    LLM_PROVIDER_CAPABILITIES.textAnalysis,
    LLM_PROVIDER_CAPABILITIES.structuredOutput
  ],
  models: [
    {
      id: "fixture-model" as LlmModelId,
      name: "Fixture Model",
      supportedCapabilities: [LLM_PROVIDER_CAPABILITIES.textAnalysis]
    }
  ]
};

const prompt = {
  id: "prompt.fixture.analysis" as PromptId,
  name: "Fixture Analysis Prompt",
  version: "1.0.0" as PromptVersion,
  purpose: "Describe a generic analysis contract.",
  inputShape: {
    schemaName: "FixtureInput",
    schemaVersion: "1.0.0",
    requiredKeys: ["canonicalText"],
    optionalKeys: ["safeMetadata"]
  },
  outputShape: {
    schema: {
      schemaName: "FixtureOutput",
      schemaVersion: "1.0.0",
      fields: [
        {
          name: "summary",
          kind: STRUCTURED_OUTPUT_FIELD_KINDS.string,
          required: true,
          validationMetadata: {}
        }
      ],
      requiredFields: ["summary"],
      optionalFields: [],
      validationMetadata: {
        allowAdditionalFields: false,
        issueCodes: []
      }
    }
  },
  safetyClassification: PROMPT_SAFETY_CLASSIFICATIONS.internal
};

const provenance = {
  source: {
    platform: "reddit",
    objectKind: "post",
    objectId: "source-1",
    collectedAt: "2026-01-01T00:00:00.000Z",
    safeProviderMetadata: {
      kind: "safe-provider-metadata",
      redacted: true,
      source: "reddit"
    }
  },
  ingestion: {
    ingestionId: "ingestion-1",
    collectedAt: "2026-01-01T00:00:00.000Z",
    correlationId: "correlation-1",
    connector: {
      connectorId: "connector-1",
      connectorName: "Fixture Connector",
      connectorVersion: "1.0.0"
    }
  },
  providerReference: {
    platform: "reddit",
    objectId: "source-1"
  },
  collectedThrough: "reddit-provider-transport",
  transformBoundary: "raw-content-contract",
  recordedAt: "2026-01-01T00:00:00.000Z"
} as const;

describe("analysis contracts", () => {
  it("define requests with prompt, source, provider, context, and safety metadata", () => {
    const request: AnalysisRequest = {
      id: "analysis-request-1" as AnalysisRequestId,
      prompt,
      input: {
        inputId: "input-1",
        references: {
          embeddingReferences: [],
          provenance,
          safeMetadata: {
            label: "safe"
          }
        },
        variables: {
          canonicalText: "Synthetic canonical text."
        }
      },
      source: {
        embeddingReferences: [],
        provenance,
        safeMetadata: {
          label: "safe"
        }
      },
      provider,
      context: {
        correlationId: "correlation-1",
        requestId: "request-1"
      },
      safetyClassification: SAFETY_CLASSIFICATIONS.internal
    };

    expect(request.context.correlationId).toBe("correlation-1");
    expect(request.source.provenance.source.objectKind).toBe("post");
  });

  it("define responses with structured output and safe metadata", () => {
    const response: AnalysisResponse = {
      status: ANALYSIS_RESPONSE_STATUSES.accepted,
      output: {
        outputId: "output-1",
        schemaName: "FixtureOutput",
        schemaVersion: "1.0.0",
        values: {
          summary: "Synthetic structured output."
        },
        warnings: []
      },
      metadata: {
        provider,
        modelName: "Fixture Model",
        usage: {
          inputUnits: 10,
          outputUnits: 5,
          totalUnits: 15
        },
        validationIssues: []
      }
    };

    expect(response.status).toBe("accepted");
    expect(response.metadata.validationIssues).toEqual([]);
  });
});
