import { parseApiFilterQuery, validateApiFilterFields, type RawApiFilterQuery } from "../../filtering/index.js";
import { parseApiPaginationQuery, type ApiPaginationQuery } from "../../pagination/index.js";
import type { ApiValidationResult } from "../../validation/index.js";

export const API_OPPORTUNITY_FILTER_FIELDS = ["status", "sourceType"] as const;
const API_OPPORTUNITY_QUERY_FIELDS = [...API_OPPORTUNITY_FILTER_FIELDS, "limit", "cursor", "direction"] as const;

export interface ParsedOpportunityQuery {
  readonly pagination: ApiPaginationQuery;
  readonly filters: Readonly<Record<string, string>>;
}

export function parseOpportunityListQuery(query: RawApiFilterQuery): ApiValidationResult<ParsedOpportunityQuery> {
  const filterValidation = validateApiFilterFields(query, API_OPPORTUNITY_QUERY_FIELDS);
  if (!filterValidation.valid) {
    return filterValidation;
  }

  const pagination = parseApiPaginationQuery(query, { defaultLimit: 25, maxLimit: 100 });
  if (!pagination.valid) {
    return pagination;
  }

  return {
    valid: true,
    value: {
      pagination: pagination.value,
      filters: parseApiFilterQuery(query, API_OPPORTUNITY_FILTER_FIELDS).filters
    }
  };
}
