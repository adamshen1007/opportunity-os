export type UseCaseSuccess<TValue> = {
  readonly success: true;
  readonly value: TValue;
};

export type UseCaseFailure<TError = unknown> = {
  readonly success: false;
  readonly error: TError;
};

export type UseCaseResult<TValue, TError = unknown> =
  | UseCaseSuccess<TValue>
  | UseCaseFailure<TError>;

export function useCaseSuccess<TValue>(value: TValue): UseCaseSuccess<TValue> {
  return {
    success: true,
    value
  };
}

export function useCaseFailure<TError>(error: TError): UseCaseFailure<TError> {
  return {
    success: false,
    error
  };
}
