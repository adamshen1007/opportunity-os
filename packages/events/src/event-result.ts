import type { EventError } from "./event-error.js";

export type EventSuccess<TValue> = {
  readonly success: true;
  readonly value: TValue;
};

export type EventFailure<TError = EventError> = {
  readonly success: false;
  readonly error: TError;
};

export type EventResult<TValue, TError = EventError> =
  | EventSuccess<TValue>
  | EventFailure<TError>;

export function eventSuccess<TValue>(value: TValue): EventSuccess<TValue> {
  return {
    success: true,
    value
  };
}

export function eventFailure<TError>(error: TError): EventFailure<TError> {
  return {
    success: false,
    error
  };
}
