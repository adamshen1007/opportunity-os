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
import type { LiveLlmProviderConfig } from "./live-config.js";

export type LiveLlmFetch = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export type OpenAiLiveLlmProviderAdapter = {
  readonly analyze: (request: AnalysisRequest) => Promise<AnalysisResult>;
};

export type OpenAiLiveLlmProviderAdapterOptions = {
  readonly config: LiveLlmProviderConfig;
  readonly fetch?: LiveLlmFetch;
  readonly now?: () => string;
};

type OpenAiResponseBody = {
  readonly output_text?: unknown;
  readonly output?: readonly {
    readonly content?: readonly {
      readonly type?: string;
      readonly text?: unknown;
    }[];
  }[];
  readonly usage?: {
    readonly input_tokens?: unknown;
    readonly output_tokens?: unknown;
    readonly total_tokens?: unknown;
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

function extractOutputText(body: OpenAiResponseBody): string | undefined {
  if (typeof body.output_text === "string") return body.output_text;

  for (const output of body.output ?? []) {
    for (const content of output.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
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

function createRequestBody(request: AnalysisRequest, config: LiveLlmProviderConfig): string {
  const boundary = createLiveLlmPromptBoundary(request);
  return JSON.stringify({
    model: config.model,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: boundary.systemInstruction }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: boundary.userInstruction }]
      }
    ],
    text: {
      format: {
        type: "json_object"
      }
    }
  });
}

export function createOpenAiLiveLlmProviderAdapter(
  options: OpenAiLiveLlmProviderAdapterOptions
): OpenAiLiveLlmProviderAdapter {
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
        const response = await fetchImpl(options.config.endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${options.config.apiKey.value}`
          },
          body: createRequestBody(request, options.config),
          signal: abortController.signal
        });

        if (!response.ok) {
          return createSafeProviderError("Live LLM provider returned an unsafe or unsuccessful response.", request, {
            provider: options.config.provider,
            status: response.status
          });
        }

        const body = (await response.json()) as OpenAiResponseBody;
        const outputText = extractOutputText(body);
        const values = outputText ? parseJsonObject(outputText) : undefined;

        if (!values || unsafePattern.test(JSON.stringify(values))) {
          return {
            status: ANALYSIS_RESULT_STATUSES.unsafeOutput,
            issues: [
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
                inputUnits: numberOrUndefined(body.usage?.input_tokens),
                outputUnits: numberOrUndefined(body.usage?.output_tokens),
                totalUnits: numberOrUndefined(body.usage?.total_tokens)
              },
              validationIssues: []
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
