import type { AnalysisRequest } from "../analysis/index.js";
import type { StructuredOutputField } from "../structured-output/index.js";

export type LiveLlmPromptBoundary = {
  readonly systemInstruction: string;
  readonly userInstruction: string;
  readonly schemaFields: readonly Pick<StructuredOutputField, "name" | "kind" | "required">[];
  readonly safePreview: string;
  readonly redacted: true;
};

const SECRETISH_KEY_PATTERN =
  /(api[_-]?key|token|authorization|auth[_-]?header|password|secret|credential|dsn|database[_-]?url)/iu;

function redactSecretishValues(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactSecretishValues(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        SECRETISH_KEY_PATTERN.test(key) ? "[REDACTED]" : redactSecretishValues(item)
      ])
    );
  }

  return value;
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}...`;
}

export function createLiveLlmPromptBoundary(request: AnalysisRequest): LiveLlmPromptBoundary {
  const schemaFields = request.prompt.outputShape.schema.fields.map((field) => ({
    name: field.name,
    kind: field.kind,
    required: field.required
  }));
  const safeVariables = redactSecretishValues(request.input.variables);
  const safePreview = truncate(JSON.stringify(safeVariables), 600);

  return {
    systemInstruction:
      "You analyze normalized public source content for Opportunity OS. Return concise JSON only. Do not include secrets, credentials, raw provider payloads, stack traces, or hidden reasoning.",
    userInstruction: [
      `Prompt purpose: ${request.prompt.purpose}`,
      `Output schema: ${request.prompt.outputShape.schema.schemaName} ${request.prompt.outputShape.schema.schemaVersion}`,
      `Required fields: ${request.prompt.outputShape.schema.requiredFields.join(", ")}`,
      `Safe input variables: ${safePreview}`
    ].join("\n"),
    schemaFields,
    safePreview,
    redacted: true
  };
}
