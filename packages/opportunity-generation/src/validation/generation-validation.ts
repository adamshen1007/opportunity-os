import type {
  CandidateOpportunity,
  CandidateValidationIssue
} from "@opportunity-os/opportunity-candidates";
import type {
  OpportunityGenerationFieldPath,
  OpportunityGenerationSafeMetadata
} from "../generation/index.js";
import type { GenerationEvidenceToHypothesisAssembly } from "../assembly/index.js";

export const GENERATION_VALIDATION_ISSUE_CODES = {
  missingCandidate: "generation.missing_candidate",
  missingHypothesis: "generation.missing_hypothesis",
  missingEvidence: "generation.missing_evidence",
  candidateInvalid: "generation.candidate_invalid",
  confidenceUnavailable: "generation.confidence_unavailable",
  unsupportedProvenance: "generation.unsupported_provenance",
  unsafeMetadata: "generation.unsafe_metadata"
} as const;

export type GenerationValidationIssueCode =
  (typeof GENERATION_VALIDATION_ISSUE_CODES)[keyof typeof GENERATION_VALIDATION_ISSUE_CODES];

export type GenerationValidationIssue = {
  readonly code: GenerationValidationIssueCode;
  readonly message: string;
  readonly fieldPath?: OpportunityGenerationFieldPath;
  readonly candidateIssues?: readonly CandidateValidationIssue[];
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type GenerationCandidateValidationInput = {
  readonly candidate: CandidateOpportunity;
  readonly assembly?: GenerationEvidenceToHypothesisAssembly;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type GenerationCandidateValidationSuccess = {
  readonly valid: true;
  readonly input: GenerationCandidateValidationInput;
};

export type GenerationCandidateValidationFailure = {
  readonly valid: false;
  readonly issues: readonly GenerationValidationIssue[];
};

export type GenerationCandidateValidationResult =
  | GenerationCandidateValidationSuccess
  | GenerationCandidateValidationFailure;

export type GenerationCandidateValidationContract = {
  readonly input: GenerationCandidateValidationInput;
  readonly result: GenerationCandidateValidationResult;
  readonly deterministic: true;
};
