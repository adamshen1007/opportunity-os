import type { RawContentValidationIssue } from "../validation/index.js";

export const RAW_CONTENT_ERROR_CODES = [
  "RAW_CONTENT_VALIDATION_FAILED",
  "RAW_CONTENT_MAPPING_FAILED",
  "RAW_CONTENT_DEDUPLICATION_FAILED",
  "RAW_CONTENT_STORAGE_PORT_FAILED",
  "RAW_CONTENT_INTERNAL_FAILURE"
] as const;

export type RawContentErrorCode = (typeof RAW_CONTENT_ERROR_CODES)[number];

export type RawContentErrorCategory =
  | "validation"
  | "mapping"
  | "deduplication"
  | "storage"
  | "internal";

export type RawContentSafeErrorDetails = {
  readonly code: RawContentErrorCode;
  readonly category: RawContentErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly RawContentValidationIssue[];
};

export type RawContentErrorOptions = RawContentSafeErrorDetails & {
  readonly cause?: unknown;
};

const secretPatterns: readonly RegExp[] = [
  /\b(authorization|bearer|token|api[_-]?key|provider[_-]?key|password|secret|credential|jwt|dsn)\s*[:=]\s*[^\s,;]+/giu,
  /\b(access[_-]?token|refresh[_-]?token|client[_-]?secret)\s*[:=]\s*[^\s,;]+/giu,
  /\b(sk-proj-[A-Za-z0-9_-]+|sk-[A-Za-z0-9_-]+)\b/gu
];

export function redactRawContentErrorValue(value: string): string {
  return secretPatterns.reduce(
    (safeValue, pattern) => safeValue.replace(pattern, "[REDACTED]"),
    value
  );
}

export class RawContentError extends Error {
  readonly code: RawContentErrorCode;
  readonly category: RawContentErrorCategory;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly issues?: readonly RawContentValidationIssue[];

  constructor(options: RawContentErrorOptions) {
    super(redactRawContentErrorValue(options.message), { cause: options.cause });
    this.name = "RawContentError";
    this.code = options.code;
    this.category = options.category;
    this.correlationId = options.correlationId
      ? redactRawContentErrorValue(options.correlationId)
      : undefined;
    this.requestId = options.requestId
      ? redactRawContentErrorValue(options.requestId)
      : undefined;
    this.issues = options.issues;
  }

  toJSON(): RawContentSafeErrorDetails {
    return this.toSafeDetails();
  }

  toSafeDetails(): RawContentSafeErrorDetails {
    return {
      code: this.code,
      category: this.category,
      message: redactRawContentErrorValue(this.message),
      correlationId: this.correlationId,
      requestId: this.requestId,
      issues: this.issues
    };
  }
}
