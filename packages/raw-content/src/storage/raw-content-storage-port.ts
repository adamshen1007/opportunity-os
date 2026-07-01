import type { RawContentEnvelope } from "../content/index.js";
import type { RawContentDeduplicationDecision, RawContentFingerprint } from "../deduplication/index.js";
import type { RawContentSafeMetadata } from "../source/index.js";
import type { RawContentValidationResult } from "../validation/index.js";

export type RawContentStoragePortResult<TValue> =
  | {
      readonly ok: true;
      readonly value: TValue;
      readonly safeMetadata?: RawContentSafeMetadata;
    }
  | {
      readonly ok: false;
      readonly reason: "validation-failed" | "not-found" | "conflict" | "unavailable";
      readonly safeMessage: string;
      readonly safeMetadata?: RawContentSafeMetadata;
    };

export type RawContentStorageRecord = {
  readonly envelope: RawContentEnvelope;
  readonly fingerprint: RawContentFingerprint;
  readonly validation: RawContentValidationResult;
  readonly deduplication: RawContentDeduplicationDecision;
};

export type RawContentStorageLookup = {
  readonly fingerprint: RawContentFingerprint;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type RawContentStoragePort = {
  readonly save: (
    record: RawContentStorageRecord
  ) => Promise<RawContentStoragePortResult<RawContentStorageRecord>>;
  readonly saveBatch: (
    records: readonly RawContentStorageRecord[]
  ) => Promise<RawContentStoragePortResult<readonly RawContentStorageRecord[]>>;
  readonly findByFingerprint: (
    lookup: RawContentStorageLookup
  ) => Promise<RawContentStoragePortResult<RawContentStorageRecord | undefined>>;
};
