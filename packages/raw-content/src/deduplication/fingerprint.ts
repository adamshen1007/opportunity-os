import type { RawContentEnvelope } from "../content/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";

export const RAW_CONTENT_FINGERPRINT_ALGORITHMS = [
  "source-object-v1",
  "content-text-v1"
] as const;

export type RawContentFingerprintAlgorithm =
  (typeof RAW_CONTENT_FINGERPRINT_ALGORITHMS)[number];

export type RawContentFingerprintValue = string;

export type RawContentFingerprintInput = {
  readonly envelope: RawContentEnvelope;
  readonly includeFields: readonly string[];
  readonly algorithm: RawContentFingerprintAlgorithm;
};

export type RawContentFingerprint = {
  readonly value: RawContentFingerprintValue;
  readonly algorithm: RawContentFingerprintAlgorithm;
  readonly inputKind: RawContentEnvelope["kind"];
  readonly sourceObjectId: string;
  readonly safeMetadata?: RawContentSafeMetadata;
};
