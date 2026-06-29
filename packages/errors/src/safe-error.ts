import type { SafeErrorDetails } from "./base-error.js";
import type { ErrorCategory } from "./error-categories.js";
import type { ErrorCode } from "./error-codes.js";

export const REDACTED_ERROR_VALUE = "[REDACTED]";

export type SafeErrorSource = {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  readonly message: string;
  readonly correlationId?: string;
  readonly requestId?: string;
};

const secretLikePatterns: readonly RegExp[] = [
  /\b(authorization|bearer|token|api[_-]?key|provider[_-]?key|password|secret|jwt|dsn)\s*[:=]\s*[^\s,;]+/gi,
  /\b(sk-proj-[A-Za-z0-9_-]+|sk-[A-Za-z0-9_-]+|xox[baprs]-[A-Za-z0-9-]+)\b/g,
  /\b[A-Za-z0-9_-]*?(?:token|secret|password|api[_-]?key)[A-Za-z0-9_-]*\b\s*[:=]\s*[^\s,;]+/gi
];

export function redactSecretLikeValues(value: string): string {
  return secretLikePatterns.reduce(
    (safeValue, pattern) => safeValue.replace(pattern, REDACTED_ERROR_VALUE),
    value
  );
}

export function toSafeErrorDetails(error: SafeErrorSource): SafeErrorDetails {
  return {
    code: error.code,
    category: error.category,
    message: redactSecretLikeValues(error.message),
    correlationId: error.correlationId
      ? redactSecretLikeValues(error.correlationId)
      : undefined,
    requestId: error.requestId ? redactSecretLikeValues(error.requestId) : undefined
  };
}
