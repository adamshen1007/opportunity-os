export const RAW_CONTENT_SOURCE_PLATFORMS = [
  "reddit"
] as const;

export type RawContentSourcePlatform =
  (typeof RAW_CONTENT_SOURCE_PLATFORMS)[number];

export type RawContentSourceObjectKind =
  | "post"
  | "comment"
  | "author"
  | "community";
