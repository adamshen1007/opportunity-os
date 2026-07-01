import type { ConnectorId } from "../metadata/index.js";

export const CONNECTOR_VALIDATION_ISSUE_CODES = [
  "config-invalid",
  "metadata-invalid",
  "capability-invalid",
  "lifecycle-invalid",
  "dependency-invalid"
] as const;

export type ConnectorValidationIssueCode =
  (typeof CONNECTOR_VALIDATION_ISSUE_CODES)[number];

export type ConnectorValidationIssueTarget =
  | "config"
  | "metadata"
  | "capability"
  | "lifecycle"
  | "dependency";

export type ConnectorValidationIssue = {
  readonly code: ConnectorValidationIssueCode;
  readonly target: ConnectorValidationIssueTarget;
  readonly safeMessage: string;
  readonly path?: readonly string[];
  readonly connectorId?: ConnectorId;
};

export type ConnectorValidationSuccess = {
  readonly ok: true;
  readonly issues: readonly [];
};

export type ConnectorValidationFailure = {
  readonly ok: false;
  readonly issues: readonly ConnectorValidationIssue[];
};

export type ConnectorValidationResult =
  | ConnectorValidationSuccess
  | ConnectorValidationFailure;
