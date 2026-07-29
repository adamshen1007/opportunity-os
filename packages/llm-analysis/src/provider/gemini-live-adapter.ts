import type { AnalysisRequest } from "../analysis/index.js";
import {
  ANALYSIS_ERROR_CATEGORIES,
  ANALYSIS_ERROR_CODES,
  AnalysisError
} from "../errors/index.js";
import {
  ANALYSIS_RESULT_STATUSES,
  type AnalysisResult
} from "../results/index.js";
import type { StructuredOutputValue } from "../structured-output/index.js";
import { createLiveLlmPromptBoundary } from "./live-prompt-boundary.js";
import { LIVE_LLM_VALIDATION_VERSIONS, validateLiveLlmOutput } from "./live-output-validation.js";
import type { LiveLlmFetch } from "./openai-live-adapter.js";
import type { LiveLlmProviderConfig } from "./live-config.js";

export type GeminiLiveLlmProviderAdapter = {
  readonly analyze: (request: AnalysisRequest) => Promise<AnalysisResult>;
};

export type GeminiLiveLlmProviderAdapterOptions = {
  readonly config: LiveLlmProviderConfig;
  readonly fetch?: LiveLlmFetch;
  readonly now?: () => string;
};

type GeminiResponseBody = {
  readonly candidates?: readonly {
    readonly content?: {
      readonly parts?: readonly {
        readonly text?: unknown;
      }[];
    };
  }[];
  readonly usageMetadata?: {
    readonly promptTokenCount?: unknown;
    readonly candidatesTokenCount?: unknown;
    readonly totalTokenCount?: unknown;
  };
};

const unsafePattern =
  /(sk-[a-z0-9_-]+|api[_-]?key|bearer\s+[a-z0-9._-]+|authorization|raw provider|stack trace|raw cause)/iu;

function createSafeProviderError(
  message: string,
  request: AnalysisRequest,
  safeMetadata?: Readonly<Record<string, string | number | boolean | null>>
): AnalysisResult {
  const error = new AnalysisError({
    code: ANALYSIS_ERROR_CODES.providerUnavailable,
    category: ANALYSIS_ERROR_CATEGORIES.infrastructure,
    message,
    correlationId: request.context.correlationId,
    requestId: request.context.requestId,
    ...(safeMetadata === undefined ? {} : { safeMetadata })
  });

  return {
    status: ANALYSIS_RESULT_STATUSES.providerUnavailable,
    issues: [],
    error: error.toSafeDetails()
  };
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function extractOutputText(body: GeminiResponseBody): string | undefined {
  for (const candidate of body.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (typeof part.text === "string") {
        return part.text;
      }
    }
  }

  return undefined;
}

function parseJsonObject(text: string): Readonly<Record<string, StructuredOutputValue>> | undefined {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
    return parsed as Readonly<Record<string, StructuredOutputValue>>;
  } catch {
    return undefined;
  }
}

function createRequestBody(request: AnalysisRequest): string {
  const boundary = createLiveLlmPromptBoundary(request);

  return JSON.stringify({
    systemInstruction: {
      parts: [{ text: boundary.systemInstruction }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: boundary.userInstruction }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
}

function createGeminiEndpoint(config: LiveLlmProviderConfig): string {
  return `${config.endpoint}/models/${encodeURIComponent(config.model)}:generateContent`;
}

export function createGeminiLiveLlmProviderAdapter(
  options: GeminiLiveLlmProviderAdapterOptions
): GeminiLiveLlmProviderAdapter {
  const fetchImpl = options.fetch ?? globalThis.fetch.bind(globalThis);
  const now = options.now ?? (() => new Date().toISOString());

  return {
    analyze: async (request) => {
      if (!options.config.enabled) {
        return createSafeProviderError("Live LLM analysis is disabled.", request, {
          provider: options.config.provider,
          enabled: false
        });
      }

      if (!options.config.apiKey) {
        return createSafeProviderError("Live LLM analysis is missing provider credentials.", request, {
          provider: options.config.provider
        });
      }

      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), options.config.timeoutMs);

      try {
        const response = await fetchImpl(createGeminiEndpoint(options.config), {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-goog-api-key": options.config.apiKey.value
          },
          body: createRequestBody(request),
          signal: abortController.signal
        });

        if (!response.ok) {
          return createSafeProviderError("Live LLM provider returned an unsafe or unsuccessful response.", request, {
            provider: options.config.provider,
            status: response.status
          });
        }

        const body = (await response.json()) as GeminiResponseBody;
        const outputText = extractOutputText(body);
        const values = outputText ? parseJsonObject(outputText) : undefined;

        const validation = values ? validateLiveLlmOutput(values, request) : undefined;
        if (!values || !validation?.valid || unsafePattern.test(JSON.stringify(values))) {
          return {
            status: ANALYSIS_RESULT_STATUSES.unsafeOutput,
            issues: validation && !validation.valid ? validation.issues : [
              {
                code: "unsafe-payload",
                path: ["provider", "output"],
                message: "Live LLM provider output was missing, invalid, or unsafe.",
                safeMetadata: {
                  provider: options.config.provider
                }
              }
            ]
          };
        }

        return {
          status: ANALYSIS_RESULT_STATUSES.success,
          response: {
            status: "accepted",
            output: {
              outputId: `live_llm_output_${now()}`,
              schemaName: request.prompt.outputShape.schema.schemaName,
              schemaVersion: request.prompt.outputShape.schema.schemaVersion,
              values,
              warnings: []
            },
            metadata: {
              provider: request.provider,
              modelName: options.config.model,
              usage: {
                inputUnits: numberOrUndefined(body.usageMetadata?.promptTokenCount),
                outputUnits: numberOrUndefined(body.usageMetadata?.candidatesTokenCount),
                totalUnits: numberOrUndefined(body.usageMetadata?.totalTokenCount)
              },
              validationIssues: [],
              executionVersions: LIVE_LLM_VALIDATION_VERSIONS
            }
          }
        };
      } catch (error) {
        return createSafeProviderError(
          error instanceof DOMException && error.name === "AbortError"
            ? "Live LLM provider request timed out before a safe response was received."
            : "Live LLM provider request failed before a safe response was received.",
          request,
          {
            provider: options.config.provider
          }
        );
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}
