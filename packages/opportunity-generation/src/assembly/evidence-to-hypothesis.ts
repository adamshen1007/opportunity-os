import type { CandidateOpportunity } from "@opportunity-os/opportunity-candidates";
import type {
  OpportunityEvidenceReference,
  OpportunityHypothesis
} from "@opportunity-os/opportunity-engine";
import type { OpportunityPipelineProvenanceReference } from "@opportunity-os/opportunity-pipeline";
import type {
  OpportunityGenerationRunId,
  OpportunityGenerationSafeMetadata,
  OpportunityGenerationTimestamp
} from "../generation/index.js";

export type GenerationEvidenceAssemblyId = string & {
  readonly __brand: "GenerationEvidenceAssemblyId";
};

export const GENERATION_EVIDENCE_ASSEMBLY_STATUSES = {
  pending: "pending",
  assembled: "assembled",
  incomplete: "incomplete",
  invalid: "invalid"
} as const;

export type GenerationEvidenceAssemblyStatus =
  (typeof GENERATION_EVIDENCE_ASSEMBLY_STATUSES)[keyof typeof GENERATION_EVIDENCE_ASSEMBLY_STATUSES];

export type GenerationEvidenceToHypothesisInput = {
  readonly runId: OpportunityGenerationRunId;
  readonly candidate: CandidateOpportunity;
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly hypotheses: readonly OpportunityHypothesis[];
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type GenerationEvidenceToHypothesisAssembly = {
  readonly assemblyId: GenerationEvidenceAssemblyId;
  readonly status: GenerationEvidenceAssemblyStatus;
  readonly candidateId: CandidateOpportunity["candidateId"];
  readonly evidence: readonly OpportunityEvidenceReference[];
  readonly hypotheses: readonly OpportunityHypothesis[];
  readonly provenance: readonly OpportunityPipelineProvenanceReference[];
  readonly assembledAt: OpportunityGenerationTimestamp;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type GenerationEvidenceToHypothesisContract = {
  readonly input: GenerationEvidenceToHypothesisInput;
  readonly output: GenerationEvidenceToHypothesisAssembly;
  readonly deterministic: true;
};
