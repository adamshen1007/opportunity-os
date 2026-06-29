import type { ValidationIssue } from "./validation-issue.js";

export type ValidationSuccess<Value> = {
  readonly success: true;
  readonly value: Value;
  readonly issues?: readonly [];
};

export type ValidationFailure = {
  readonly success: false;
  readonly issues: readonly ValidationIssue[];
};

export type ValidationResult<Value> =
  | ValidationSuccess<Value>
  | ValidationFailure;

export type ValidationResultMetadata = {
  readonly validatedAt?: string;
  readonly source?: string;
  readonly [key: string]: unknown;
};
