import type { ApiOwnershipScope } from "../ownership/index.js";

export interface ApiRequestContext {
  readonly correlationId: string;
  readonly requestId?: string;
  readonly sessionId?: string;
  readonly ownership?: ApiOwnershipScope;
  readonly method: string;
  readonly path: string;
}

export interface ApiRequest<TBody = unknown, TQuery = Record<string, unknown>, TParams = Record<string, unknown>> {
  readonly context: ApiRequestContext;
  readonly body?: TBody;
  readonly query?: TQuery;
  readonly params?: TParams;
}
