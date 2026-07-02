import type { EmbeddingValidationIssue } from "../validation/index.js";

export const EMBEDDING_ERROR_CODES = [
  "EMBEDDING_VALIDATION_FAILED",
  "EMBEDDING_PROVIDER_FAILED",
  "EMBEDDING_CACHE_FAILED",
  "EMBEDDING_EVENT_FAILED",
  "EMBEDDING_INTERNAL_FAILURE"
] as const;

export type EmbeddingErrorCode = typeof EMBEDDING_ERROR_CODES[number];

export type EmbeddingErrorCategory =
  | "validation"
  | "provider"
  | "cache"
  | "event"
  | "internal";

export type EmbeddingErrorSafeDetails = {
  readonly code: EmbeddingErrorCode;
  readonly category: EmbeddingErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly EmbeddingValidationIssue[];
};

export type EmbeddingErrorOptions = EmbeddingErrorSafeDetails & {
  readonly cause?: unknown;
};

const secretPatterns: readonly RegExp[] = [
  /\bauthorization\s*[:=]\s*bearer\s+[^\s,;]+/giu,
  /\b(authorization|bearer|token|api[_-]?key|provider[_-]?key|password|secret|credential|jwt|dsn)\s*[:=]\s*[^\s,;]+/giu,
  /\b(access[_-]?token|refresh[_-]?token|client[_-]?secret)\s*[:=]\s*[^\s,;]+/giu,
  /\b(sk-proj-[A-Za-z0-9_-]+|sk-[A-Za-z0-9_-]+)\b/gu
];

export function redactEmbeddingErrorValue(value: string): string {
  return secretPatterns.reduce(
    (safeValue, pattern) => safeValue.replace(pattern, "[REDACTED]"),
    value
  );
}

export class EmbeddingError extends Error {
  readonly code: EmbeddingErrorCode;
  readonly category: EmbeddingErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly EmbeddingValidationIssue[];

  constructor(options: EmbeddingErrorOptions) {
    super(redactEmbeddingErrorValue(options.message), { cause: options.cause });
    this.name = "EmbeddingError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId
      ? redactEmbeddingErrorValue(options.correlationId)
      : undefined;
    this.requestId = options.requestId
      ? redactEmbeddingErrorValue(options.requestId)
      : undefined;
    this.issues = options.issues;
  }

  toJSON(): EmbeddingErrorSafeDetails {
    return this.toSafeDetails();
  }

  toSafeDetails(): EmbeddingErrorSafeDetails {
    return {
      code: this.code,
      category: this.category,
      message: redactEmbeddingErrorValue(this.message),
      correlationId: this.correlationId,
      requestId: this.requestId,
      issues: this.issues
    };
  }
}
