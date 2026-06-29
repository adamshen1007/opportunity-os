import { OpportunityError } from "@opportunity-os/errors";
import {
  DEFAULT_REDACTION,
  redactSecretLikeText,
  redactValue
} from "@opportunity-os/utils";

import type { LogEntry, LogEntryContext } from "./log-entry.js";

const SENSITIVE_CONTEXT_KEY_PATTERN =
  /(api[_-]?key|auth|authorization|bearer|credential|dsn|password|provider[_-]?key|secret|token)/iu;
const providerKeyAssignmentPattern =
  /\b(provider[_-]?key)\s*[:=]\s*("[^"]*"|'[^']*'|[^\s,;]+)/giu;

export type SafeLogValue =
  | null
  | string
  | number
  | boolean
  | readonly SafeLogValue[]
  | { readonly [key: string]: SafeLogValue };

export type SafeLogEntry = Omit<LogEntry, "context"> & {
  readonly context?: {
    readonly [key: string]: SafeLogValue;
  };
};

export type SafeLogError = {
  readonly name: string;
  readonly message: string;
  readonly code?: string;
  readonly category?: string;
  readonly correlationId?: string;
  readonly requestId?: string;
};

export function normalizeLogEntry(
  entry: LogEntry,
  baseContext?: LogEntryContext
): SafeLogEntry {
  const context = normalizeContext({
    ...(baseContext ?? {}),
    ...(entry.context ?? {}),
    ...(entry.error === undefined ? {} : { error: normalizeLogError(entry.error) })
  });

  return {
    timestamp: entry.timestamp,
    service: redactLogText(entry.service),
    environment: redactLogText(entry.environment),
    severity: entry.severity,
    correlationId: redactLogText(entry.correlationId),
    ...(entry.requestId === undefined
      ? {}
      : { requestId: redactLogText(entry.requestId) }),
    eventName: redactLogText(entry.eventName),
    message: redactLogText(entry.message),
    ...(Object.keys(context).length === 0 ? {} : { context })
  };
}

export function normalizeLogError(error: unknown): SafeLogError {
  if (error instanceof OpportunityError) {
    const safeDetails = error.toSafeDetails();

    return {
      name: error.name,
      message: redactLogText(safeDetails.message),
      code: safeDetails.code,
      category: safeDetails.category,
      ...(safeDetails.correlationId === undefined
        ? {}
        : { correlationId: redactLogText(safeDetails.correlationId) }),
      ...(safeDetails.requestId === undefined
        ? {}
        : { requestId: redactLogText(safeDetails.requestId) })
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: redactLogText(error.message)
    };
  }

  return {
    name: "UnknownError",
    message: redactLogText(String(error))
  };
}

function normalizeContext(
  context: LogEntryContext
): NonNullable<SafeLogEntry["context"]> {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      normalizeLogValue(value, key)
    ])
  );
}

function normalizeLogValue(value: unknown, key?: string): SafeLogValue {
  if (key !== undefined && SENSITIVE_CONTEXT_KEY_PATTERN.test(key)) {
    return redactValue(value == null ? "" : String(value));
  }

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return redactLogText(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: redactLogText(value.message)
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeLogValue(item));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([nestedKey, nestedValue]) => [
        nestedKey,
        normalizeLogValue(nestedValue, nestedKey)
      ])
    );
  }

  return DEFAULT_REDACTION;
}

function redactLogText(value: string): string {
  return redactSecretLikeText(value).replace(
    providerKeyAssignmentPattern,
    (_match, key: string) => `${key}=[REDACTED]`
  );
}
