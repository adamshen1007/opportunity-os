export const HTML_CLEANING_RULES = [
  "remove-tags",
  "decode-safe-entities",
  "preserve-link-text",
  "preserve-list-boundaries",
  "preserve-table-cell-boundaries",
  "drop-script-style-content"
] as const;

export type HtmlCleaningRule = (typeof HTML_CLEANING_RULES)[number];

export type HtmlCleaningOptions = {
  readonly enabledRules: readonly HtmlCleaningRule[];
  readonly preserveLinkText: boolean;
  readonly preserveStructuralBreaks: boolean;
};

export type HtmlCleaningContract = {
  readonly stage: "html-cleaning";
  readonly options: HtmlCleaningOptions;
};
