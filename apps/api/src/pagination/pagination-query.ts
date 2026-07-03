import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationResult
} from "../validation/index.js";

export const API_PAGINATION_DIRECTIONS = {
  backward: "backward",
  forward: "forward"
} as const;

export type ApiPaginationDirection = (typeof API_PAGINATION_DIRECTIONS)[keyof typeof API_PAGINATION_DIRECTIONS];

export interface ApiPaginationQuery {
  readonly limit: number;
  readonly cursor?: string;
  readonly direction: ApiPaginationDirection;
}

export interface RawApiPaginationQuery {
  readonly limit?: string | number;
  readonly cursor?: string;
  readonly direction?: string;
}

export function parseApiPaginationQuery(
  query: RawApiPaginationQuery,
  options: { readonly defaultLimit: number; readonly maxLimit: number }
): ApiValidationResult<ApiPaginationQuery> {
  const limit = query.limit === undefined ? options.defaultLimit : Number(query.limit);
  const direction = query.direction ?? API_PAGINATION_DIRECTIONS.forward;

  if (!Number.isInteger(limit) || limit < 1 || limit > options.maxLimit) {
    return createApiValidationFailure([
      {
        code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
        field: "limit",
        message: `limit must be an integer between 1 and ${options.maxLimit}.`
      }
    ]);
  }

  if (!Object.values(API_PAGINATION_DIRECTIONS).includes(direction as ApiPaginationDirection)) {
    return createApiValidationFailure([
      {
        code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
        field: "direction",
        message: "direction must be forward or backward."
      }
    ]);
  }

  return createApiValidationSuccess({
    limit,
    cursor: query.cursor,
    direction: direction as ApiPaginationDirection
  });
}
