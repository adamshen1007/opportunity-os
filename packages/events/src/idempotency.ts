import type { EventId, IdempotencyKey } from "./event-metadata.js";

export const IDEMPOTENCY_STATUSES = {
  new: "new",
  processed: "processed",
  duplicate: "duplicate",
  conflict: "conflict"
} as const;

export type IdempotencyStatus =
  (typeof IDEMPOTENCY_STATUSES)[keyof typeof IDEMPOTENCY_STATUSES];

export type IdempotencyRecord = {
  readonly idempotencyKey: IdempotencyKey;
  readonly eventId: EventId;
  readonly status: IdempotencyStatus;
};

export type IdempotencyCheck = {
  readonly idempotencyKey?: IdempotencyKey;
  readonly status: IdempotencyStatus;
};
