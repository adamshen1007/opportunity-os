import type { OpportunityEvidenceReference } from "@opportunity-os/opportunity-engine";
import type {
  CandidateOpportunityId,
  CandidateOpportunitySafeMetadata,
  CandidateOpportunityTimestamp
} from "../candidate/index.js";

export const CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES = {
  complete: "complete",
  incomplete: "incomplete",
  unknown: "unknown"
} as const;

export type CandidateEvidenceCompletenessStatus =
  (typeof CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES)[keyof typeof CANDIDATE_EVIDENCE_COMPLETENESS_STATUSES];

export const CANDIDATE_EVIDENCE_REQUIREMENT_KINDS = {
  source: "source",
  painSignal: "pain-signal",
  supportingAnalysis: "supporting-analysis",
  confidenceSupport: "confidence-support"
} as const;

export type CandidateEvidenceRequirementKind =
  (typeof CANDIDATE_EVIDENCE_REQUIREMENT_KINDS)[keyof typeof CANDIDATE_EVIDENCE_REQUIREMENT_KINDS];

export type CandidateEvidenceRequirement = {
  readonly kind: CandidateEvidenceRequirementKind;
  readonly required: boolean;
  readonly description: string;
};

export type CandidateEvidenceCompletenessIssue = {
  readonly requirement: CandidateEvidenceRequirementKind;
  readonly message: string;
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

export type CandidateEvidenceCompleteness = {
  readonly candidateId: CandidateOpportunityId;
  readonly status: CandidateEvidenceCompletenessStatus;
  readonly checkedAt: CandidateOpportunityTimestamp;
  readonly requirements: readonly CandidateEvidenceRequirement[];
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly issues: readonly CandidateEvidenceCompletenessIssue[];
  readonly safeMetadata?: CandidateOpportunitySafeMetadata;
};

