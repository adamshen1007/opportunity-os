import {
  embeddingFixtureChunkEmbedding,
  embeddingFixtureVector
} from "@opportunity-os/embeddings";
import { normalizationFixtureOutput } from "@opportunity-os/normalization";
import { rawContentFixtureProvenance } from "@opportunity-os/raw-content";
import type { AnalysisRequest, AnalysisRequestId } from "../analysis/index.js";
import type { AnalysisErrorSafeDetails } from "../errors/index.js";
import type { AnalysisEventEnvelope } from "../events/index.js";
import type { LlmModelId, LlmProviderContract, LlmProviderId } from "../provider/index.js";
import type {
  PromptContract,
  PromptId,
  PromptInput,
  PromptOutput,
  PromptTemplate,
  PromptVersion
} from "../prompts/index.js";
import type { AnalysisResult } from "../results/index.js";
import type { SafeAnalysisPayload } from "../safety/index.js";
import type { StructuredOutputContract } from "../structured-output/index.js";
import type { AnalysisValidationResult } from "../validation/index.js";

export const LLM_ANALYSIS_FIXTURE_TIMESTAMP = "2026-07-02T00:00:00.000Z" as const;

export const LLM_ANALYSIS_FIXTURE_IDS = {
  analysisRequestId: "analysis_request_fixture_001",
  analysisOutputId: "analysis_output_fixture_001",
  correlationId: "corr_llm_analysis_fixture_001",
  eventId: "event_llm_analysis_fixture_001",
  modelId: "fixture-analysis-model",
  promptId: "prompt_fixture_analysis",
  providerId: "fixture-analysis-provider",
  requestId: "request_llm_analysis_fixture_001",
  templateId: "template_fixture_analysis"
} as const;

export const llmAnalysisFixtureProvider: LlmProviderContract = {
  metadata: {
    id: LLM_ANALYSIS_FIXTURE_IDS.providerId as LlmProviderId,
    name: "Fixture Analysis Provider",
    version: "0.0.0",
    description: "Deterministic contract-only analysis provider fixture.",
    stability: "experimental",
    capabilities: ["text-analysis", "structured-output", "safety-classification"],
    models: [
      {
        id: LLM_ANALYSIS_FIXTURE_IDS.modelId as LlmModelId,
        name: "Fixture Analysis Model",
        contextWindowTokens: 512,
        supportedCapabilities: ["text-analysis", "structured-output"]
      }
    ]
  },
  supportsStructuredOutput: true,
  supportsSafetyClassification: true
};

export const llmAnalysisFixtureStructuredOutput: StructuredOutputContract = {
  schemaName: "FixtureAnalysisOutput",
  schemaVersion: "1.0.0",
  fields: [
    {
      name: "summary",
      kind: "string",
      required: true,
      description: "Synthetic summary field for analysis contracts.",
      validationMetadata: {
        minLength: 1,
        maxLength: 280
      }
    },
    {
      name: "confidence",
      kind: "number",
      required: false,
      description: "Synthetic confidence field for analysis contracts.",
      validationMetadata: {}
    }
  ],
  requiredFields: ["summary"],
  optionalFields: ["confidence"],
  validationMetadata: {
    allowAdditionalFields: false,
    issueCodes: ["missing-prompt-input", "invalid-prompt-output"]
  }
};

export const llmAnalysisFixturePrompt: PromptContract = {
  id: LLM_ANALYSIS_FIXTURE_IDS.promptId as PromptId,
  name: "Fixture Analysis Contract",
  version: "1.0.0" as PromptVersion,
  purpose: "Define a deterministic analysis contract fixture.",
  inputShape: {
    schemaName: "FixtureAnalysisInput",
    schemaVersion: "1.0.0",
    requiredKeys: ["canonicalText"],
    optionalKeys: ["embeddingReferences", "safeMetadata"]
  },
  outputShape: {
    schema: llmAnalysisFixtureStructuredOutput
  },
  safetyClassification: "internal"
};

export const llmAnalysisFixtureTemplate: PromptTemplate = {
  promptId: LLM_ANALYSIS_FIXTURE_IDS.promptId as PromptId,
  version: "1.0.0" as PromptVersion,
  templateId: LLM_ANALYSIS_FIXTURE_IDS.templateId,
  placeholders: ["canonical_text", "embedding_summary"],
  variables: [
    {
      name: "canonicalText",
      placeholder: "canonical_text",
      kind: "text",
      required: true,
      safetyClassification: "internal",
      description: "Synthetic canonical text supplied by normalization contracts."
    },
    {
      name: "embeddingSummary",
      placeholder: "embedding_summary",
      kind: "object",
      required: false,
      safetyClassification: "internal",
      description: "Synthetic embedding metadata supplied by embedding contracts."
    }
  ],
  safetyMetadata: {
    classification: "internal",
    redactionRequired: true,
    allowedInputKeys: ["canonicalText", "embeddingSummary"]
  }
};

export const llmAnalysisFixturePromptInput: PromptInput = {
  inputId: "prompt_input_fixture_001",
  references: {
    normalizedContent: normalizationFixtureOutput,
    embeddingReferences: [embeddingFixtureChunkEmbedding.chunk],
    provenance: rawContentFixtureProvenance,
    safeMetadata: {
      fixture: true,
      synthetic: true
    }
  },
  variables: {
    canonicalText: normalizationFixtureOutput.canonicalText.text,
    embeddingSummary: {
      dimensions: embeddingFixtureVector.length,
      synthetic: true
    }
  }
};

export const llmAnalysisFixturePromptOutput: PromptOutput = {
  outputId: LLM_ANALYSIS_FIXTURE_IDS.analysisOutputId,
  schemaName: llmAnalysisFixtureStructuredOutput.schemaName,
  schemaVersion: llmAnalysisFixtureStructuredOutput.schemaVersion,
  values: {
    summary: "Synthetic structured analysis output.",
    confidence: 0.75
  },
  warnings: []
};

export const llmAnalysisFixtureRequest: AnalysisRequest = {
  id: LLM_ANALYSIS_FIXTURE_IDS.analysisRequestId as AnalysisRequestId,
  prompt: llmAnalysisFixturePrompt,
  input: llmAnalysisFixturePromptInput,
  source: {
    normalizedContent: normalizationFixtureOutput,
    embeddingReferences: [embeddingFixtureChunkEmbedding.chunk],
    provenance: rawContentFixtureProvenance,
    safeMetadata: {
      fixture: true,
      synthetic: true
    }
  },
  provider: llmAnalysisFixtureProvider.metadata,
  context: {
    correlationId: LLM_ANALYSIS_FIXTURE_IDS.correlationId,
    requestId: LLM_ANALYSIS_FIXTURE_IDS.requestId
  },
  safetyClassification: "internal"
};

export const llmAnalysisFixtureValidationSuccess: AnalysisValidationResult = {
  valid: true,
  issues: []
};

export const llmAnalysisFixtureSafePayload: SafeAnalysisPayload = {
  values: llmAnalysisFixturePromptOutput.values,
  safety: {
    classification: "internal",
    redactionRequired: true,
    allowedFields: ["summary", "confidence"]
  },
  redacted: true
};

export const llmAnalysisFixtureResult: AnalysisResult = {
  status: "success",
  response: {
    status: "accepted",
    output: llmAnalysisFixturePromptOutput,
    metadata: {
      provider: llmAnalysisFixtureProvider.metadata,
      modelName: "Fixture Analysis Model",
      usage: {
        inputUnits: 10,
        outputUnits: 5,
        totalUnits: 15
      },
      validationIssues: []
    }
  }
};

export const llmAnalysisFixtureSafeError: AnalysisErrorSafeDetails = {
  code: "analysis.unsafe_payload",
  category: "safety",
  message: "Analysis payload failed safety checks.",
  correlationId: LLM_ANALYSIS_FIXTURE_IDS.correlationId,
  requestId: LLM_ANALYSIS_FIXTURE_IDS.requestId,
  safeMetadata: {
    fixture: true
  }
};

export const llmAnalysisFixtureCompletedEvent: AnalysisEventEnvelope = {
  metadata: {
    eventId: LLM_ANALYSIS_FIXTURE_IDS.eventId,
    eventName: "llm-analysis.completed",
    category: "integration",
    version: "v1",
    timestamp: LLM_ANALYSIS_FIXTURE_TIMESTAMP,
    source: "@opportunity-os/llm-analysis",
    correlationId: LLM_ANALYSIS_FIXTURE_IDS.correlationId,
    requestId: LLM_ANALYSIS_FIXTURE_IDS.requestId
  },
  payload: {
    requestId: LLM_ANALYSIS_FIXTURE_IDS.analysisRequestId as AnalysisRequestId,
    status: "success",
    safeMetadata: {
      fixture: true
    }
  }
};
