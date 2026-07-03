export const API_OPPORTUNITY_STATUSES = {
  candidate: "candidate",
  generated: "generated",
  ranked: "ranked",
  validated: "validated"
} as const;

export type ApiOpportunityStatus =
  (typeof API_OPPORTUNITY_STATUSES)[keyof typeof API_OPPORTUNITY_STATUSES];

export interface ApiOpportunityEvidenceDto {
  readonly evidenceId: string;
  readonly sourceType: string;
  readonly summary: string;
  readonly confidence?: number;
}

export interface ApiOpportunityDto {
  readonly opportunityId: string;
  readonly title: string;
  readonly summary: string;
  readonly status: ApiOpportunityStatus;
  readonly confidence: number;
  readonly evidence: readonly ApiOpportunityEvidenceDto[];
  readonly source: {
    readonly sourceId: string;
    readonly sourceType: string;
  };
  readonly rank?: {
    readonly position: number;
    readonly score: number;
  };
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ApiOpportunityCollectionDto {
  readonly opportunities: readonly ApiOpportunityDto[];
  readonly totalCount?: number;
}
