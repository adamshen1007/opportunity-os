import type { ApiOpportunityDto, ApiOpportunityStatus } from "./opportunity-dto.js";

export interface ApiOpportunitySource {
  readonly opportunityId: string;
  readonly title: string;
  readonly summary: string;
  readonly status: ApiOpportunityStatus;
  readonly confidence: number;
  readonly evidence?: readonly {
    readonly evidenceId: string;
    readonly sourceType: string;
    readonly summary: string;
    readonly confidence?: number;
  }[];
  readonly sourceId: string;
  readonly sourceType: string;
  readonly rankPosition?: number;
  readonly rankScore?: number;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export function mapOpportunityToDto(source: ApiOpportunitySource): ApiOpportunityDto {
  return {
    opportunityId: source.opportunityId,
    title: source.title,
    summary: source.summary,
    status: source.status,
    confidence: source.confidence,
    evidence: (source.evidence ?? []).map((evidence) => ({ ...evidence })),
    source: {
      sourceId: source.sourceId,
      sourceType: source.sourceType
    },
    rank:
      source.rankPosition !== undefined && source.rankScore !== undefined
        ? {
            position: source.rankPosition,
            score: source.rankScore
          }
        : undefined,
    safeMetadata: source.safeMetadata ? { ...source.safeMetadata } : undefined
  };
}
