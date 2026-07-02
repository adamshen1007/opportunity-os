import type { NormalizationInput } from "./normalization-input.js";
import type { NormalizationOutput } from "./normalization-output.js";

export type NormalizationOperationName = "normalization-contract";

export type NormalizationOperationContract = {
  readonly name: NormalizationOperationName;
  readonly input: NormalizationInput;
  readonly output: NormalizationOutput;
};
