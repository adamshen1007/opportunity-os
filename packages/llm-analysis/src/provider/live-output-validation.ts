import type { AnalysisRequest } from "../analysis/index.js";
import type { StructuredOutputValue } from "../structured-output/index.js";
import type { AnalysisValidationIssue } from "../validation/index.js";

export const LIVE_LLM_VALIDATION_VERSIONS = {
  prompt: "opportunity-analysis-prompt-v2",
  schema: "opportunity-analysis-schema-v2",
  validator: "citation-validator-v1"
} as const;

export const PILOT_LLM_PROVIDER = "gemini" as const;
export const PILOT_LLM_MODEL = "gemini-2.5-flash" as const;

export type LiveLlmOutputValidationResult =
  | { readonly valid: true; readonly issues: readonly [] }
  | { readonly valid: false; readonly issues: readonly AnalysisValidationIssue[] };

const kindMatches = (value: StructuredOutputValue, kind: string): boolean => {
  if (kind === "array") return Array.isArray(value);
  if (kind === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  return typeof value === kind;
};

function issue(path: readonly string[], message: string): AnalysisValidationIssue {
  return { code: "invalid-prompt-output", path, message };
}

function citationCatalog(request: AnalysisRequest): ReadonlySet<string> | undefined {
  const value = request.input.variables.evidenceCatalog;
  if (!Array.isArray(value)) return undefined;
  return new Set(value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const evidenceId = (entry as { evidenceId?: unknown }).evidenceId;
    return typeof evidenceId === "string" && evidenceId.length > 0 ? [evidenceId] : [];
  }));
}

function validateClaims(
  values: Readonly<Record<string, StructuredOutputValue>>,
  catalog: ReadonlySet<string>
): readonly AnalysisValidationIssue[] {
  const claims = values.claims;
  if (!Array.isArray(claims) || claims.length === 0) {
    return [issue(["output", "claims"], "Structured live analysis requires at least one cited claim.")];
  }

  return claims.flatMap((claim, index) => {
    if (!claim || typeof claim !== "object" || Array.isArray(claim)) {
      return [issue(["output", "claims", String(index)], "Each claim must be a structured object.")];
    }
    const value = claim as { readonly text?: StructuredOutputValue; readonly citationIds?: StructuredOutputValue; readonly assumption?: StructuredOutputValue };
    const issues: AnalysisValidationIssue[] = [];
    if (typeof value.text !== "string" || value.text.trim().length === 0) {
      issues.push(issue(["output", "claims", String(index), "text"], "Claim text is required."));
    }
    if (typeof value.assumption !== "boolean") {
      issues.push(issue(["output", "claims", String(index), "assumption"], "Claim assumption status is required."));
    }
    const citationIds = Array.isArray(value.citationIds)
      ? value.citationIds.filter((id): id is string => typeof id === "string")
      : [];
    if (value.assumption === false && citationIds.length === 0) {
      issues.push(issue(["output", "claims", String(index), "citationIds"], "Factual claims require supplied evidence citations."));
    }
    if (citationIds.some((id) => !catalog.has(id))) {
      issues.push(issue(["output", "claims", String(index), "citationIds"], "Claim citations must resolve to supplied evidence."));
    }
    return issues;
  });
}

export function validateLiveLlmOutput(
  values: Readonly<Record<string, StructuredOutputValue>>,
  request: AnalysisRequest
): LiveLlmOutputValidationResult {
  const schema = request.prompt.outputShape.schema;
  const issues: AnalysisValidationIssue[] = [];
  const fields = new Map(schema.fields.map((field) => [field.name, field]));

  for (const required of schema.requiredFields) {
    if (!(required in values)) issues.push(issue(["output", required], "Required structured output field is missing."));
  }
  if (!schema.validationMetadata.allowAdditionalFields) {
    for (const key of Object.keys(values)) {
      if (!fields.has(key)) issues.push(issue(["output", key], "Additional structured output fields are not allowed."));
    }
  }
  for (const [key, value] of Object.entries(values)) {
    const field = fields.get(key);
    if (!field) continue;
    if (!kindMatches(value, field.kind)) {
      issues.push(issue(["output", key], `Structured output field must have kind ${field.kind}.`));
      continue;
    }
    if (typeof value === "string") {
      if (field.validationMetadata.minLength !== undefined && value.length < field.validationMetadata.minLength) {
        issues.push(issue(["output", key], "Structured output string is shorter than allowed."));
      }
      if (field.validationMetadata.maxLength !== undefined && value.length > field.validationMetadata.maxLength) {
        issues.push(issue(["output", key], "Structured output string is longer than allowed."));
      }
    }
  }

  const catalog = citationCatalog(request);
  if (catalog) issues.push(...validateClaims(values, catalog));

  return issues.length === 0 ? { valid: true, issues: [] } : { valid: false, issues };
}
