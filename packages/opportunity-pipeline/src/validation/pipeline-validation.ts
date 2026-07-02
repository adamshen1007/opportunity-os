import type { RawContentSafeMetadata } from "@opportunity-os/raw-content";
import type { PipelineCandidateOpportunity } from "../assembly/index.js";
import type { OpportunityPipelineFieldPath } from "../pipeline/index.js";

export const OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES = {
  missingEvidence: "pipeline.missing_evidence",
  missingHypothesis: "pipeline.missing_hypothesis",
  unsupportedProvenance: "pipeline.unsupported_provenance",
  invalidCandidate: "pipeline.invalid_candidate",
  unsafeMetadata: "pipeline.unsafe_metadata"
} as const;

export type OpportunityPipelineValidationIssueCode =
  (typeof OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES)[keyof typeof OPPORTUNITY_PIPELINE_VALIDATION_ISSUE_CODES];

export type OpportunityPipelineValidationIssue = {
  readonly code: OpportunityPipelineValidationIssueCode;
  readonly message: string;
  readonly fieldPath?: OpportunityPipelineFieldPath;
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type OpportunityPipelineValidationInput = {
  readonly candidates: readonly PipelineCandidateOpportunity[];
  readonly safeMetadata?: RawContentSafeMetadata;
};

export type OpportunityPipelineValidationSuccess = {
  readonly valid: true;
  readonly input: OpportunityPipelineValidationInput;
};

export type OpportunityPipelineValidationFailure = {
  readonly valid: false;
  readonly issues: readonly OpportunityPipelineValidationIssue[];
};

export type OpportunityPipelineValidationResult =
  | OpportunityPipelineValidationSuccess
  | OpportunityPipelineValidationFailure;

export type OpportunityPipelineValidationContract = {
  readonly input: OpportunityPipelineValidationInput;
  readonly result: OpportunityPipelineValidationResult;
};
