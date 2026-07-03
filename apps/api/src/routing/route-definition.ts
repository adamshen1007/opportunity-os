export const API_HTTP_METHODS = {
  delete: "DELETE",
  get: "GET",
  patch: "PATCH",
  post: "POST",
  put: "PUT"
} as const;

export type ApiHttpMethod = (typeof API_HTTP_METHODS)[keyof typeof API_HTTP_METHODS];

export interface ApiRouteDefinition {
  readonly method: ApiHttpMethod;
  readonly path: string;
  readonly operationId: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly requiresAuthentication: boolean;
}

export function createApiRouteDefinition(route: ApiRouteDefinition): ApiRouteDefinition {
  return {
    method: route.method,
    path: normalizeRoutePath(route.path),
    operationId: route.operationId,
    summary: route.summary,
    tags: [...route.tags],
    requiresAuthentication: route.requiresAuthentication
  };
}

export function normalizeRoutePath(path: string): string {
  const trimmed = path.trim();
  if (trimmed.length === 0) {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/{2,}/gu, "/");
}
