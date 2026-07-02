export const MARKDOWN_CLEANING_RULES = [
  "strip-frontmatter",
  "normalize-heading-markers",
  "normalize-list-markers",
  "unwrap-link-text",
  "preserve-code-blocks",
  "preserve-inline-code"
] as const;

export type MarkdownCleaningRule = (typeof MARKDOWN_CLEANING_RULES)[number];

export type MarkdownCleaningOptions = {
  readonly enabledRules: readonly MarkdownCleaningRule[];
  readonly preserveCodeBlocks: boolean;
  readonly preserveInlineCode: boolean;
};

export type MarkdownCleaningContract = {
  readonly stage: "markdown-cleaning";
  readonly options: MarkdownCleaningOptions;
};
