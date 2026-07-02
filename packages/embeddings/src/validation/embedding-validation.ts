export const EMBEDDING_VALIDATION_ISSUE_CODES = [
  "missing-input",
  "empty-text",
  "invalid-dimensions",
  "unsupported-provider-capability",
  "unsupported-model",
  "input-too-large",
  "invalid-chunk-reference",
  "unsafe-metadata"
] as const;

export type EmbeddingValidationIssueCode = typeof EMBEDDING_VALIDATION_ISSUE_CODES[number];

export type EmbeddingValidationIssue = {
  readonly code: EmbeddingValidationIssueCode;
  readonly path: readonly string[];
  readonly message: string;
  readonly safeMetadata?: Readonly<Record<string, unknown>>;
};

export type EmbeddingValidationSuccess = {
  readonly valid: true;
};

export type EmbeddingValidationFailure = {
  readonly valid: false;
  readonly issues: readonly EmbeddingValidationIssue[];
};

export type EmbeddingValidationResult =
  | EmbeddingValidationSuccess
  | EmbeddingValidationFailure;

export type EmbeddingValidationContract<TInput = unknown> = {
  readonly input: TInput;
  readonly result: EmbeddingValidationResult;
};
