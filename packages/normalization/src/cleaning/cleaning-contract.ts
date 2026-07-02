import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { NormalizationStage } from "../pipeline/index.js";
import type { CanonicalText, TextCharacterRange } from "../text/index.js";

export type CleaningIssueSeverity = "info" | "warning" | "error";

export type CleaningIssue = {
  readonly code: string;
  readonly stage: NormalizationStage;
  readonly severity: CleaningIssueSeverity;
  readonly safeMessage: string;
  readonly range?: TextCharacterRange;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type CleaningContractInput<TOptions extends object = object> = {
  readonly canonicalText: CanonicalText;
  readonly options: TOptions;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type CleaningContractOutput = {
  readonly canonicalText: CanonicalText;
  readonly changed: boolean;
  readonly issues: readonly CleaningIssue[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type DeterministicCleaningContract<TOptions extends object = object> = {
  readonly stage: NormalizationStage;
  readonly input: CleaningContractInput<TOptions>;
  readonly output: CleaningContractOutput;
};
