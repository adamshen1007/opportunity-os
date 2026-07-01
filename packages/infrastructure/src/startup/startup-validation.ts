import type { InfrastructureModuleId } from "../modules/index.js";

export const STARTUP_VALIDATION_CHECK_KINDS = [
  "configuration",
  "dependency-graph",
  "health",
  "package-registration"
] as const;

export const STARTUP_VALIDATION_STATUSES = [
  "valid",
  "invalid"
] as const;

export type StartupValidationCheckKind =
  (typeof STARTUP_VALIDATION_CHECK_KINDS)[number];

export type StartupValidationStatus =
  (typeof STARTUP_VALIDATION_STATUSES)[number];

export type StartupValidationIssueCode =
  | "missing-required-module"
  | "invalid-dependency-graph"
  | "invalid-configuration"
  | "failed-health-check"
  | "unsafe-message";

export type StartupValidationCheck = {
  readonly id: string;
  readonly kind: StartupValidationCheckKind;
  readonly moduleId?: InfrastructureModuleId;
  readonly description?: string;
  readonly required?: boolean;
};

export type StartupValidationIssue = {
  readonly code: StartupValidationIssueCode;
  readonly checkId?: string;
  readonly moduleId?: InfrastructureModuleId;
  readonly safeMessage: string;
  readonly path?: readonly string[];
};

export type StartupValidationSuccess = {
  readonly status: "valid";
  readonly checks: readonly StartupValidationCheck[];
  readonly issues: readonly [];
};

export type StartupValidationFailure = {
  readonly status: "invalid";
  readonly checks: readonly StartupValidationCheck[];
  readonly issues: readonly StartupValidationIssue[];
};

export type StartupValidationResult =
  | StartupValidationSuccess
  | StartupValidationFailure;
