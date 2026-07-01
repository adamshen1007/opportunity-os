import type { RawContentEnvelope } from "../content/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";

export const RAW_CONTENT_VALIDATION_ISSUE_CODES = [
  "missing-required-field",
  "unsafe-provider-metadata",
  "malformed-source-reference",
  "unsupported-content-kind",
  "provenance-incomplete"
] as const;

export type RawContentValidationIssueCode =
  (typeof RAW_CONTENT_VALIDATION_ISSUE_CODES)[number];

export type RawContentValidationIssue = {
  readonly code: RawContentValidationIssueCode;
  readonly path: readonly string[];
  readonly message: string;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentValidationSuccess<TEnvelope extends RawContentEnvelope = RawContentEnvelope> = {
  readonly ok: true;
  readonly envelope: TEnvelope;
  readonly issues: readonly [];
};

export type RawContentValidationFailure = {
  readonly ok: false;
  readonly issues: readonly RawContentValidationIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentValidationResult<TEnvelope extends RawContentEnvelope = RawContentEnvelope> =
  | RawContentValidationSuccess<TEnvelope>
  | RawContentValidationFailure;

export type RawContentValidationContract = {
  readonly name: "raw-content-validation";
  readonly issueCodes: typeof RAW_CONTENT_VALIDATION_ISSUE_CODES;
};
