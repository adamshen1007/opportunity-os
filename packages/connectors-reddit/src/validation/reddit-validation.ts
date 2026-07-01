import type {
  ConnectorId,
  ConnectorValidationIssueCode
} from "@opportunity-os/connectors";

export const REDDIT_VALIDATION_ISSUE_CODES = [
  "reddit-metadata-invalid",
  "reddit-capability-invalid",
  "reddit-config-invalid",
  "reddit-lifecycle-not-ready",
  "reddit-dependency-not-ready",
  "reddit-data-shape-incompatible"
] as const;

export const REDDIT_VALIDATION_TARGETS = [
  "metadata",
  "capability",
  "config",
  "lifecycle",
  "dependency",
  "data-shape"
] as const;

export type RedditValidationIssueCode =
  (typeof REDDIT_VALIDATION_ISSUE_CODES)[number];

export type RedditValidationTarget =
  (typeof REDDIT_VALIDATION_TARGETS)[number];

export type RedditValidationIssue = {
  readonly code: RedditValidationIssueCode;
  readonly target: RedditValidationTarget;
  readonly safeMessage: string;
  readonly path?: readonly string[];
  readonly connectorId?: ConnectorId;
  readonly genericCode?: ConnectorValidationIssueCode;
};

export type RedditValidationSuccess = {
  readonly ok: true;
  readonly issues: readonly [];
};

export type RedditValidationFailure = {
  readonly ok: false;
  readonly issues: readonly RedditValidationIssue[];
};

export type RedditValidationResult =
  | RedditValidationSuccess
  | RedditValidationFailure;
