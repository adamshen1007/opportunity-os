export const EVENT_ERROR_CODES = {
  invalidSerializedEvent: "INVALID_SERIALIZED_EVENT",
  invalidEventEnvelope: "INVALID_EVENT_ENVELOPE",
  serializationFailed: "SERIALIZATION_FAILED"
} as const;

export type EventErrorCode =
  (typeof EVENT_ERROR_CODES)[keyof typeof EVENT_ERROR_CODES];

export type EventError = {
  readonly code: EventErrorCode;
  readonly message: string;
  readonly details?: Record<string, string>;
};

export type EventErrorInput = EventError;

const REDACTED_EVENT_VALUE = "[REDACTED]";
const secretLikePattern =
  /\b(authorization|bearer|token|api[_-]?key|provider[_-]?key|password|secret|jwt|dsn|credential)\s*[:=]\s*("[^"]*"|'[^']*'|[^\s,;]+)/giu;
const bearerValuePattern = /\bbearer\s+("[^"]*"|'[^']*'|[^\s,;]+)/giu;
const basicValuePattern = /\bbasic\s+("[^"]*"|'[^']*'|[^\s,;]+)/giu;
const credentialUrlPattern =
  /\b([a-z][a-z0-9+.-]*:\/\/)([^:\s/@]+):([^@\s/]+)@([^\s,;]+)/giu;

export function createEventError(input: EventErrorInput): EventError {
  return {
    code: input.code,
    message: redactEventErrorText(input.message),
    ...(input.details === undefined
      ? {}
      : { details: redactEventErrorDetails(input.details) })
  };
}

export function redactEventErrorText(value: string): string {
  return value
    .replace(
      secretLikePattern,
      (_match, key: string) => `${key}=${REDACTED_EVENT_VALUE}`
    )
    .replace(bearerValuePattern, `Bearer ${REDACTED_EVENT_VALUE}`)
    .replace(basicValuePattern, `Basic ${REDACTED_EVENT_VALUE}`)
    .replace(
      credentialUrlPattern,
      (_match, protocol: string, _user: string, _password: string, hostAndPath: string) =>
        `${protocol}${REDACTED_EVENT_VALUE}@${hostAndPath}`
    );
}

function redactEventErrorDetails(
  details: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(details).map(([key, value]) => [
      key,
      redactEventErrorText(value)
    ])
  );
}
