import type { ApiPaginationMeta, ApiPaginationQuery } from "../pagination/index.js";
import type { ApiOpportunityDto } from "../resources/index.js";

export interface ApiOpportunityListInput {
  readonly pagination: ApiPaginationQuery;
  readonly filters: Readonly<Record<string, string>>;
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiOpportunityListOutput {
  readonly opportunities: readonly ApiOpportunityDto[];
  readonly pagination: ApiPaginationMeta;
  readonly totalCount?: number;
}

export interface ApiOpportunityGetInput {
  readonly opportunityId: string;
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiOpportunityQueryPort {
  listOpportunities(input: ApiOpportunityListInput): Promise<ApiOpportunityListOutput>;
  getOpportunity(input: ApiOpportunityGetInput): Promise<ApiOpportunityDto | undefined>;
}
