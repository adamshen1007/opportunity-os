export type RedditStableId = string;

export type RedditTimestamp = string;

export type RedditSafePublicMetadata = Readonly<
  Record<string, string | number | boolean | null>
>;

export type RedditSafeRawMetadataPlaceholder = {
  readonly kind: "safe-raw-metadata-placeholder";
  readonly redacted: true;
  readonly source: "reddit-public-metadata";
  readonly fields?: RedditSafePublicMetadata;
};
