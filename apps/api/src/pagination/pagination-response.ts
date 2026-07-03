import type { ApiPaginationDirection } from "./pagination-query.js";

export interface ApiPaginationMeta {
  readonly limit: number;
  readonly direction: ApiPaginationDirection;
  readonly nextCursor?: string;
  readonly previousCursor?: string;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}
