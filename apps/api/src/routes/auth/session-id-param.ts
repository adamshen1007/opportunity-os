export interface ApiSessionIdParams {
  readonly sessionId?: string;
}

export function parseApiSessionIdParam(params: ApiSessionIdParams | undefined): string | undefined {
  const sessionId = params?.sessionId;
  return typeof sessionId === "string" && sessionId.trim().length > 0 ? sessionId.trim() : undefined;
}
