import type { EventName } from "./event-metadata.js";
import type { EventVersion } from "./event-version.js";

export type EventSchemaIssue = {
  readonly path: readonly string[];
  readonly message: string;
  readonly code: string;
};

export type EventSchemaValidationSuccess<TPayload> = {
  readonly success: true;
  readonly payload: TPayload;
};

export type EventSchemaValidationFailure = {
  readonly success: false;
  readonly issues: readonly EventSchemaIssue[];
};

export type EventSchemaValidationResult<TPayload> =
  | EventSchemaValidationSuccess<TPayload>
  | EventSchemaValidationFailure;

export type EventSchema<TPayload = unknown> = {
  readonly eventName: EventName;
  readonly version: EventVersion;
  readonly validate: (payload: unknown) => EventSchemaValidationResult<TPayload>;
};
