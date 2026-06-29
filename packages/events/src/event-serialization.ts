import { EVENT_ERROR_CODES, createEventError, type EventError } from "./event-error.js";
import type { EventEnvelope } from "./event-envelope.js";
import type { EventMetadata } from "./event-metadata.js";
import { eventFailure, eventSuccess, type EventResult } from "./event-result.js";

export function serializeEventEnvelope<TPayload>(
  envelope: EventEnvelope<TPayload>
): string {
  return stringifyStable(envelope);
}

export function deserializeEventEnvelope<TPayload = unknown>(
  serializedEnvelope: string
): EventResult<EventEnvelope<TPayload>, EventError> {
  try {
    const parsed = JSON.parse(serializedEnvelope) as unknown;

    if (!isEventEnvelopeLike(parsed)) {
      return eventFailure(
        createEventError({
          code: EVENT_ERROR_CODES.invalidEventEnvelope,
          message: "Serialized event envelope is missing required fields"
        })
      );
    }

    return eventSuccess({
      metadata: parsed.metadata,
      payload: parsed.payload as TPayload
    });
  } catch {
    return eventFailure(
      createEventError({
        code: EVENT_ERROR_CODES.invalidSerializedEvent,
        message: "Serialized event is not valid JSON"
      })
    );
  }
}

function stringifyStable(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stringifyStable(item)).join(",")}]`;
  }

  return `{${Object.entries(value)
    .filter(([, entryValue]) => entryValue !== undefined)
    .toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, entryValue]) => `${JSON.stringify(key)}:${stringifyStable(entryValue)}`)
    .join(",")}}`;
}

function isEventEnvelopeLike(value: unknown): value is EventEnvelope<unknown> {
  if (!isRecord(value) || !isRecord(value.metadata) || !("payload" in value)) {
    return false;
  }

  return isEventMetadataLike(value.metadata);
}

function isEventMetadataLike(value: unknown): value is EventMetadata {
  if (!isRecord(value)) {
    return false;
  }

  return [
    "eventId",
    "eventName",
    "category",
    "version",
    "timestamp",
    "source",
    "correlationId"
  ].every((key) => typeof value[key] === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
