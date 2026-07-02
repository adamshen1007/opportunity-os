export const URL_NORMALIZATION_RULES = [
  "trim-url",
  "normalize-scheme-host-case",
  "remove-default-port",
  "preserve-path-case",
  "sort-query-parameters",
  "drop-fragment"
] as const;

export type UrlNormalizationRule = (typeof URL_NORMALIZATION_RULES)[number];

export type UrlNormalizationOptions = {
  readonly enabledRules: readonly UrlNormalizationRule[];
  readonly allowedSchemes: readonly ("http" | "https")[];
  readonly preserveTrackingParameters: boolean;
};

export type UrlNormalizationContract = {
  readonly stage: "url-normalization";
  readonly options: UrlNormalizationOptions;
};
