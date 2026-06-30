import { redactApplicationErrorText } from "../errors/index.js";

export type ApplicationSuccess<TValue> = {
  readonly success: true;
  readonly value: TValue;
};

export type ApplicationFailure<TError = unknown> = {
  readonly success: false;
  readonly error: TError;
};

export type ApplicationResult<TValue, TError = unknown> =
  | ApplicationSuccess<TValue>
  | ApplicationFailure<TError>;

export function applicationSuccess<TValue>(
  value: TValue
): ApplicationSuccess<TValue> {
  return {
    success: true,
    value
  };
}

export function applicationFailure<TError>(
  error: TError
): ApplicationFailure<TError> {
  return {
    success: false,
    error: typeof error === "string"
      ? (redactApplicationErrorText(error) as TError)
      : error
  };
}
