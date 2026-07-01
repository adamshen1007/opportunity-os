import type { RawContentEnvelope } from "../content/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";
import type { RawContentValidationIssue } from "../validation/index.js";
import type { RawContentFingerprint } from "./fingerprint.js";

export const RAW_CONTENT_DEDUPLICATION_STATUSES = [
  "unique",
  "possible-duplicate",
  "duplicate",
  "undetermined"
] as const;

export type RawContentDeduplicationStatus =
  (typeof RAW_CONTENT_DEDUPLICATION_STATUSES)[number];

export type RawContentDuplicateCandidate = {
  readonly envelope: RawContentEnvelope;
  readonly fingerprint: RawContentFingerprint;
  readonly matchedEnvelopeId?: string;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentDeduplicationDecision = {
  readonly status: RawContentDeduplicationStatus;
  readonly candidate: RawContentDuplicateCandidate;
  readonly issues: readonly RawContentValidationIssue[];
  readonly decidedAt: string;
  readonly safeMetadata?: RawContentSafeMetadata;
};
