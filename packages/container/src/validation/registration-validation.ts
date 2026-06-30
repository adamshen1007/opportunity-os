import type { ContainerLifetime } from "../lifetime/index.js";
import type { DependencyToken } from "../tokens/index.js";

export const REGISTRATION_VALIDATION_ISSUE_CODES = [
  "duplicate-token",
  "missing-dependency",
  "unsupported-lifetime"
] as const;

export type RegistrationValidationIssueCode =
  (typeof REGISTRATION_VALIDATION_ISSUE_CODES)[number];

export type DuplicateTokenIssue = {
  readonly code: "duplicate-token";
  readonly token: DependencyToken;
  readonly message: string;
};

export type MissingDependencyIssue = {
  readonly code: "missing-dependency";
  readonly token: DependencyToken;
  readonly dependency: DependencyToken;
  readonly message: string;
};

export type UnsupportedLifetimeIssue = {
  readonly code: "unsupported-lifetime";
  readonly token: DependencyToken;
  readonly lifetime: string;
  readonly supportedLifetimes: readonly ContainerLifetime[];
  readonly message: string;
};

export type RegistrationValidationIssue =
  | DuplicateTokenIssue
  | MissingDependencyIssue
  | UnsupportedLifetimeIssue;

export type RegistrationValidationSuccess = {
  readonly valid: true;
  readonly issues: readonly [];
};

export type RegistrationValidationFailure = {
  readonly valid: false;
  readonly issues: readonly RegistrationValidationIssue[];
};

export type RegistrationValidationResult =
  | RegistrationValidationSuccess
  | RegistrationValidationFailure;
