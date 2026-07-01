import type { StartupValidationResult } from "@opportunity-os/infrastructure";
import type { CorrelationId, RequestId } from "@opportunity-os/shared";
import type { ConnectorHostBindings } from "../bindings/index.js";

export const CONNECTOR_HOST_STARTUP_CHECK_KINDS = [
  "configuration",
  "dependency-binding",
  "logger-binding",
  "event-publisher-binding",
  "runtime-contract",
  "lifecycle-contract",
  "health-contract"
] as const;

export const CONNECTOR_HOST_STARTUP_RESULT_STATUSES = [
  "valid",
  "invalid"
] as const;

export const CONNECTOR_HOST_STARTUP_ISSUE_CODES = [
  "missing-configuration",
  "invalid-configuration-binding",
  "missing-container-binding",
  "missing-logger-binding",
  "invalid-event-publisher-binding",
  "invalid-runtime-contract",
  "invalid-lifecycle-contract",
  "invalid-health-contract",
  "unsafe-message"
] as const;

export type ConnectorHostStartupCheckKind =
  (typeof CONNECTOR_HOST_STARTUP_CHECK_KINDS)[number];

export type ConnectorHostStartupResultStatus =
  (typeof CONNECTOR_HOST_STARTUP_RESULT_STATUSES)[number];

export type ConnectorHostStartupIssueCode =
  (typeof CONNECTOR_HOST_STARTUP_ISSUE_CODES)[number];

export type ConnectorHostStartupValidationCheck = {
  readonly id: string;
  readonly kind: ConnectorHostStartupCheckKind;
  readonly required: boolean;
  readonly safeDescription?: string;
};

export type ConnectorHostStartupValidationIssue = {
  readonly code: ConnectorHostStartupIssueCode;
  readonly checkId?: string;
  readonly safeMessage: string;
  readonly path?: readonly string[];
  readonly correlationId: CorrelationId;
  readonly requestId?: RequestId;
};

export type ConnectorHostStartupValidationSuccess = {
  readonly status: "valid";
  readonly checks: readonly ConnectorHostStartupValidationCheck[];
  readonly issues: readonly [];
  readonly bindings: ConnectorHostBindings;
  readonly infrastructureValidation?: StartupValidationResult;
};

export type ConnectorHostStartupValidationFailure = {
  readonly status: "invalid";
  readonly checks: readonly ConnectorHostStartupValidationCheck[];
  readonly issues: readonly ConnectorHostStartupValidationIssue[];
  readonly infrastructureValidation?: StartupValidationResult;
};

export type ConnectorHostStartupValidationResult =
  | ConnectorHostStartupValidationSuccess
  | ConnectorHostStartupValidationFailure;
