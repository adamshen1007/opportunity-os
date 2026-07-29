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

export function createLiveLlmPromptBoundary(request: AnalysisRequest): LiveLlmPromptBoundary {
  const schemaFields = request.prompt.outputShape.schema.fields.map((field) => ({
    name: field.name,
    kind: field.kind,
    required: field.required
  }));
  const safeVariables = redactSecretishValues(request.input.variables);
  const serializedVariables = JSON.stringify(safeVariables);
  const safePreview = `[REDACTED INPUT: ${serializedVariables.length} characters]`;
  const fieldContract = request.prompt.outputShape.schema.fields
    .map((field) => `${field.name}:${field.kind}:${field.required ? "required" : "optional"}`)
    .join(", ");
  const citationContract = Array.isArray(request.input.variables.evidenceCatalog)
    ? "The claims field must be an array of objects shaped exactly as {text:string,citationIds:string[],assumption:boolean}. Factual claims require supplied citation IDs; unsupported statements must set assumption=true."
    : "Do not add a claims field unless it is present in the allowed output fields.";

  return {
    systemInstruction:
      "You analyze normalized public source content for Opportunity OS. Return exactly one JSON object with no markdown or code fences. Use only the allowed output fields and match every declared field type. Do not add explanatory fields. Every factual claim must cite one or more supplied evidence IDs when evidence is supplied. Unsupported statements must be marked as assumptions. Never invent citations. Do not include secrets, credentials, raw provider payloads, stack traces, prompts, or hidden reasoning.",
    userInstruction: [
      `Prompt purpose: ${request.prompt.purpose}`,
      `Output schema: ${request.prompt.outputShape.schema.schemaName} ${request.prompt.outputShape.schema.schemaVersion}`,
      `Allowed fields and types: ${fieldContract}`,
      `Required fields: ${request.prompt.outputShape.schema.requiredFields.join(", ")}`,
      `Additional fields allowed: ${request.prompt.outputShape.schema.validationMetadata.allowAdditionalFields ? "yes" : "no"}`,
      citationContract,
      `Input variables: ${serializedVariables}`
    ].join("\n"),
    schemaFields,
    safePreview,
    redacted: true
  };
}
