import type { ApiRouteDefinition } from "../routing/index.js";
import type { ApiAuthorizationPolicy } from "./authorization-policy.js";

export function createRouteAuthorizationPolicy(
  route: ApiRouteDefinition,
  requiredPermissions: readonly string[] = []
): ApiAuthorizationPolicy {
  return {
    policyId: `${route.operationId}.policy`,
    requiresAuthentication: route.requiresAuthentication,
    requiredPermissions: [...requiredPermissions]
  };
}
