import type {
  RawContentSourceObjectKind,
  RawContentSourcePlatform
} from "./source-platform.js";

export type RawContentSourceObjectId = string;
export type RawContentSourceUrl = string;
export type RawContentTimestamp = string;

export type RawContentSafeMetadata = Readonly<
  Record<string, string | number | boolean | null>
>;

export type RawContentSafeProviderMetadata = {
  readonly kind: "safe-provider-metadata";
  readonly redacted: true;
  readonly source: RawContentSourcePlatform;
  readonly fields?: RawContentSafeMetadata;
};

export type RawContentSourceMetadata = {
  readonly platform: RawContentSourcePlatform;
  readonly objectKind: RawContentSourceObjectKind;
  readonly objectId: RawContentSourceObjectId;
  readonly url?: RawContentSourceUrl;
  readonly collectedAt?: RawContentTimestamp;
  readonly publishedAt?: RawContentTimestamp;
  readonly updatedAt?: RawContentTimestamp;
  readonly safeProviderMetadata: RawContentSafeProviderMetadata;
};
