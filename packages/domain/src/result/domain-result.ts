import type { DomainError } from "../errors/index.js";

export type DomainSuccess<TValue> = {
  readonly success: true;
  readonly value: TValue;
};

export type DomainFailure<TError = DomainError> = {
  readonly success: false;
  readonly error: TError;
};

export type DomainResult<TValue, TError = DomainError> =
  | DomainSuccess<TValue>
  | DomainFailure<TError>;

export function domainSuccess<TValue>(value: TValue): DomainSuccess<TValue> {
  return {
    success: true,
    value
  };
}

export function domainFailure<TError>(error: TError): DomainFailure<TError> {
  return {
    success: false,
    error
  };
}
