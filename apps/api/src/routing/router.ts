import type { ApiRouteDefinition } from "./route-definition.js";

export interface ApiRouter {
  readonly routes: readonly ApiRouteDefinition[];
  readonly duplicateRouteKeys: readonly string[];
}

export function createApiRouter(routes: readonly ApiRouteDefinition[]): ApiRouter {
  const seenRouteKeys = new Set<string>();
  const duplicateRouteKeys: string[] = [];

  for (const route of routes) {
    const routeKey = createRouteKey(route);
    if (seenRouteKeys.has(routeKey)) {
      duplicateRouteKeys.push(routeKey);
    }
    seenRouteKeys.add(routeKey);
  }

  return {
    routes: [...routes],
    duplicateRouteKeys
  };
}

export function createRouteKey(route: Pick<ApiRouteDefinition, "method" | "path">): string {
  return `${route.method} ${route.path}`;
}
