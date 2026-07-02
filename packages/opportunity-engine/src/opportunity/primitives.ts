export type OpportunityId = string & { readonly __brand: "OpportunityId" };

export type OpportunityVersion = string & { readonly __brand: "OpportunityVersion" };

export type OpportunityTimestamp = string & { readonly __brand: "OpportunityTimestamp" };

export type OpportunityFieldPath = string & { readonly __brand: "OpportunityFieldPath" };

export const OPPORTUNITY_STATUSES = {
  draft: "draft",
  candidate: "candidate",
  validated: "validated",
  archived: "archived"
} as const;

export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[keyof typeof OPPORTUNITY_STATUSES];

export const OPPORTUNITY_SOURCE_KINDS = {
  rawContent: "raw-content",
  normalizedContent: "normalized-content",
  embedding: "embedding",
  llmAnalysis: "llm-analysis",
  structuredAnalysis: "structured-analysis"
} as const;

export type OpportunitySourceKind =
  (typeof OPPORTUNITY_SOURCE_KINDS)[keyof typeof OPPORTUNITY_SOURCE_KINDS];

export type OpportunitySafeMetadata = Readonly<Record<string, string | number | boolean | null>>;

export type OpportunityLifecycleMetadata = {
  readonly createdAt: OpportunityTimestamp;
  readonly updatedAt?: OpportunityTimestamp;
  readonly version: OpportunityVersion;
  readonly status: OpportunityStatus;
};
