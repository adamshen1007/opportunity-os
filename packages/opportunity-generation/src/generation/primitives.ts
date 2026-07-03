export type OpportunityGenerationRunId = string & {
  readonly __brand: "OpportunityGenerationRunId";
};

export type OpportunityGenerationRequestId = string & {
  readonly __brand: "OpportunityGenerationRequestId";
};

export type OpportunityGenerationOutputId = string & {
  readonly __brand: "OpportunityGenerationOutputId";
};

export type OpportunityGenerationTimestamp = string & {
  readonly __brand: "OpportunityGenerationTimestamp";
};

export type OpportunityGenerationVersion = string & {
  readonly __brand: "OpportunityGenerationVersion";
};

export type OpportunityGenerationFieldPath = string & {
  readonly __brand: "OpportunityGenerationFieldPath";
};

export type OpportunityGenerationSafeMetadata =
  Readonly<Record<string, string | number | boolean | null>>;

export const OPPORTUNITY_GENERATION_MODES = {
  deterministic: "deterministic",
  dryRun: "dry-run"
} as const;

export type OpportunityGenerationMode =
  (typeof OPPORTUNITY_GENERATION_MODES)[keyof typeof OPPORTUNITY_GENERATION_MODES];

export const OPPORTUNITY_GENERATION_STAGES = {
  accepted: "accepted",
  inputPrepared: "input-prepared",
  evidenceAssembled: "evidence-assembled",
  candidateValidated: "candidate-validated",
  confidenceAggregated: "confidence-aggregated",
  outputPrepared: "output-prepared"
} as const;

export type OpportunityGenerationStage =
  (typeof OPPORTUNITY_GENERATION_STAGES)[keyof typeof OPPORTUNITY_GENERATION_STAGES];
