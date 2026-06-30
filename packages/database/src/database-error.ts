const REDACTED_DATABASE_VALUE = "[REDACTED]";

const SECRET_PATTERNS = [
  /\bDATABASE_URL\s*=\s*[^\s,;)}]+/giu,
  /postgres(?:ql)?:\/\/[^\s"')]+/giu,
  /\bpassword\s*=\s*[^\s,;)}]+/giu,
  /\btoken\s*=\s*[^\s,;)}]+/giu,
  /\bapi[_-]?key\s*=\s*[^\s,;)}]+/giu,
  /\bauthorization\s*:\s*[^\n\r]+/giu,
  /\bselect\s+.+?\s+from\s+.+?(?=$|[.;])/giu,
  /\binsert\s+into\s+.+?(?=$|[.;])/giu,
  /\bupdate\s+.+?\s+set\s+.+?(?=$|[.;])/giu,
  /\bdelete\s+from\s+.+?(?=$|[.;])/giu,
  /\bprisma\.[a-z0-9_.$-]+/giu
];

export const DATABASE_ERROR_CODES = {
  configurationInvalid: "DATABASE_CONFIGURATION_INVALID",
  connectionFailed: "DATABASE_CONNECTION_FAILED",
  queryFailed: "DATABASE_QUERY_FAILED",
  transactionFailed: "DATABASE_TRANSACTION_FAILED",
  migrationFailed: "DATABASE_MIGRATION_FAILED",
  healthCheckFailed: "DATABASE_HEALTH_CHECK_FAILED",
  seedFailed: "DATABASE_SEED_FAILED",
  unknown: "DATABASE_UNKNOWN_ERROR"
} as const;

export type DatabaseErrorCode = typeof DATABASE_ERROR_CODES[keyof typeof DATABASE_ERROR_CODES];

export type SafeDatabaseErrorDetails = Readonly<{
  code: DatabaseErrorCode;
  category: "infrastructure";
  message: string;
  operation?: string;
}>;

export type DatabaseErrorOptions = Readonly<{
  code: DatabaseErrorCode;
  message: string;
  operation?: string;
  cause?: unknown;
}>;

export class DatabaseError extends Error {
  public readonly code: DatabaseErrorCode;
  public readonly category = "infrastructure";
  public readonly operation?: string;

  public constructor(options: DatabaseErrorOptions) {
    super(sanitizeDatabaseErrorMessage(options.message), { cause: options.cause });
    this.name = "DatabaseError";
    this.code = options.code;
    this.operation = options.operation;
  }

  public toJSON(): SafeDatabaseErrorDetails {
    return this.toSafeDetails();
  }

  public toSafeDetails(): SafeDatabaseErrorDetails {
    return {
      code: this.code,
      category: this.category,
      message: this.message,
      ...(this.operation === undefined ? {} : { operation: this.operation })
    };
  }
}

export function toSafeDatabaseErrorDetails(
  error: unknown,
  fallback: Partial<Pick<SafeDatabaseErrorDetails, "code" | "message" | "operation">> = {}
): SafeDatabaseErrorDetails {
  if (error instanceof DatabaseError) {
    return error.toSafeDetails();
  }

  return {
    code: fallback.code ?? DATABASE_ERROR_CODES.unknown,
    category: "infrastructure",
    message: sanitizeDatabaseErrorMessage(fallback.message ?? "Database operation failed."),
    ...(fallback.operation === undefined ? {} : { operation: fallback.operation })
  };
}

export function sanitizeDatabaseErrorMessage(message: string): string {
  return SECRET_PATTERNS.reduce(
    (currentMessage, pattern) => currentMessage.replace(pattern, REDACTED_DATABASE_VALUE),
    message
  );
}
