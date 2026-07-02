export const WHITESPACE_NORMALIZATION_RULES = [
  "trim-boundaries",
  "collapse-horizontal-whitespace",
  "normalize-line-endings",
  "limit-consecutive-blank-lines",
  "preserve-paragraph-breaks"
] as const;

export type WhitespaceNormalizationRule =
  (typeof WHITESPACE_NORMALIZATION_RULES)[number];

export type WhitespaceNormalizationOptions = {
  readonly enabledRules: readonly WhitespaceNormalizationRule[];
  readonly lineEnding: "lf";
  readonly maxConsecutiveBlankLines: number;
};

export type WhitespaceNormalizationContract = {
  readonly stage: "whitespace-normalization";
  readonly options: WhitespaceNormalizationOptions;
};
