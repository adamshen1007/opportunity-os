export type InfrastructureSuccess<TValue = void> = {
  readonly ok: true;
  readonly value: TValue;
};

export type InfrastructureFailure<TError = unknown> = {
  readonly ok: false;
  readonly error: TError;
};

export type InfrastructureResult<TValue = void, TError = unknown> =
  | InfrastructureSuccess<TValue>
  | InfrastructureFailure<TError>;

export function infrastructureSuccess<TValue>(
  value: TValue
): InfrastructureSuccess<TValue> {
  return {
    ok: true,
    value
  };
}

export function infrastructureFailure<TError>(
  error: TError
): InfrastructureFailure<TError> {
  return {
    ok: false,
    error
  };
}
