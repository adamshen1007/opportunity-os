/**
 * LLM Analysis Foundation public export boundary.
 *
 * Phase 2 Milestone 19 defines the LLM Analysis package boundary only.
 */
export const LLM_ANALYSIS_PACKAGE_NAME = "@opportunity-os/llm-analysis" as const;

export const LLM_ANALYSIS_FOUNDATION_PHASE = "phase-2-milestone-19" as const;

export type LlmAnalysisPackageBoundary = {
  readonly packageName: typeof LLM_ANALYSIS_PACKAGE_NAME;
  readonly phase: typeof LLM_ANALYSIS_FOUNDATION_PHASE;
  readonly ownership: "llm-analysis-foundation";
};

export {
  ANALYSIS_RESPONSE_STATUSES
} from "./analysis/index.js";
export type {
  AnalysisRequest,
  AnalysisRequestId,
  AnalysisRequestSource,
  AnalysisResponse,
  AnalysisResponseMetadata,
  AnalysisResponseStatus,
  AnalysisUsageMetadata
} from "./analysis/index.js";
export {
  ANALYSIS_ERROR_CATEGORIES,
  ANALYSIS_ERROR_CODES,
  AnalysisError
} from "./errors/index.js";
export type {
  AnalysisErrorCategory,
  AnalysisErrorCode,
  AnalysisErrorOptions,
  AnalysisErrorSafeDetails
} from "./errors/index.js";
export {
  ANALYSIS_EVENT_NAMES
} from "./events/index.js";
export type {
  AnalysisEventEnvelope,
  AnalysisEventName,
  AnalysisEventPayload
} from "./events/index.js";
export {
  LLM_ANALYSIS_FIXTURE_IDS,
  LLM_ANALYSIS_FIXTURE_TIMESTAMP,
  llmAnalysisFixtureCompletedEvent,
  llmAnalysisFixturePrompt,
  llmAnalysisFixturePromptInput,
  llmAnalysisFixturePromptOutput,
  llmAnalysisFixtureProvider,
  llmAnalysisFixtureRequest,
  llmAnalysisFixtureResult,
  llmAnalysisFixtureSafeError,
  llmAnalysisFixtureSafePayload,
  llmAnalysisFixtureStructuredOutput,
  llmAnalysisFixtureTemplate,
  llmAnalysisFixtureValidationSuccess
} from "./fixtures/index.js";
export {
  LIVE_LLM_PROVIDER_ENV_KEYS,
  LIVE_LLM_PROVIDER_NAMES,
  LLM_PROVIDER_CAPABILITIES,
  LLM_PROVIDER_STABILITY_STATUSES,
  createGeminiLiveLlmProviderAdapter,
  createLiveLlmProviderConfigFromEnv,
  createLiveLlmPromptBoundary,
  createOpenAiLiveLlmProviderAdapter
} from "./provider/index.js";
export type {
  GeminiLiveLlmProviderAdapter,
  GeminiLiveLlmProviderAdapterOptions,
  LiveLlmFetch,
  LiveLlmPromptBoundary,
  LiveLlmProviderConfig,
  LiveLlmProviderConfigResult,
  LiveLlmProviderEnvKey,
  LiveLlmProviderName,
  LiveLlmSensitiveValue,
  LlmModelId,
  LlmProviderCapability,
  LlmProviderContract,
  LlmProviderId,
  LlmProviderMetadata,
  LlmProviderModel,
  LlmProviderStabilityStatus,
  OpenAiLiveLlmProviderAdapter,
  OpenAiLiveLlmProviderAdapterOptions
} from "./provider/index.js";
export {
  PROMPT_SAFETY_CLASSIFICATIONS,
  PROMPT_TEMPLATE_VARIABLE_KINDS
} from "./prompts/index.js";
export type {
  PromptContract,
  PromptId,
  PromptInput,
  PromptInputReference,
  PromptInputShape,
  PromptOutput,
  PromptOutputShape,
  PromptSafetyClassification,
  PromptTemplate,
  PromptTemplateVariable,
  PromptTemplateVariableKind,
  PromptVersion
} from "./prompts/index.js";
export {
  ANALYSIS_RESULT_STATUSES
} from "./results/index.js";
export type {
  AnalysisResult,
  AnalysisResultFailure,
  AnalysisResultStatus,
  AnalysisResultSuccess
} from "./results/index.js";
export {
  REDACTION_TARGET_KINDS,
  SAFETY_CLASSIFICATIONS
} from "./safety/index.js";
export type {
  RedactionPolicy,
  RedactionTargetKind,
  SafeAnalysisPayload,
  SafetyClassification,
  SafetyMetadata
} from "./safety/index.js";
export {
  STRUCTURED_OUTPUT_FIELD_KINDS
} from "./structured-output/index.js";
export type {
  StructuredOutputContract,
  StructuredOutputField,
  StructuredOutputFieldKind,
  StructuredOutputValue
} from "./structured-output/index.js";
export {
  ANALYSIS_VALIDATION_ISSUE_CODES
} from "./validation/index.js";
export type {
  AnalysisValidationContract,
  AnalysisValidationFailure,
  AnalysisValidationIssue,
  AnalysisValidationIssueCode,
  AnalysisValidationResult,
  AnalysisValidationSuccess
} from "./validation/index.js";
