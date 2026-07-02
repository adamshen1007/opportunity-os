import type { AnalysisRequest } from "../analysis/index.js";
import type { AnalysisResponse } from "../analysis/index.js";
import type { AnalysisValidationIssue } from "./analysis-validation-issue.js";

export type AnalysisValidationSuccess = {
  readonly valid: true;
  readonly issues: readonly [];
};

export type AnalysisValidationFailure = {
  readonly valid: false;
  readonly issues: readonly AnalysisValidationIssue[];
};

export type AnalysisValidationResult =
  | AnalysisValidationSuccess
  | AnalysisValidationFailure;

export type AnalysisValidationContract = {
  readonly validateRequest: (request: AnalysisRequest) => AnalysisValidationResult;
  readonly validateResponse: (response: AnalysisResponse) => AnalysisValidationResult;
};
