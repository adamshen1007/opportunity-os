import type { DomainError } from "../errors/index.js";

export type DomainValidationIssue = {
  readonly path: readonly string[];
  readonly code: string;
  readonly message: string;
};

export type DomainValidationSuccess<TValue> = {
  readonly valid: true;
  readonly value: TValue;
};

export type DomainValidationFailure = {
  readonly valid: false;
  readonly issues: readonly DomainValidationIssue[];
  readonly error?: DomainError;
};

export type DomainValidationResult<TValue> =
  | DomainValidationSuccess<TValue>
  | DomainValidationFailure;
