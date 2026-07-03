import type { ApiAuthContext } from "../auth/index.js";

export const API_AUTHORIZATION_DECISIONS = {
  allowed: "allowed",
  denied: "denied"
} as const;

export type ApiAuthorizationDecision =
  (typeof API_AUTHORIZATION_DECISIONS)[keyof typeof API_AUTHORIZATION_DECISIONS];

export interface ApiAuthorizationPolicy {
  readonly policyId: string;
  readonly requiresAuthentication: boolean;
  readonly requiredPermissions?: readonly string[];
}

export interface ApiAuthorizationInput {
  readonly auth: ApiAuthContext;
  readonly policy: ApiAuthorizationPolicy;
}

export function hasRequiredPermissions(auth: ApiAuthContext, requiredPermissions: readonly string[]): boolean {
  if (requiredPermissions.length === 0) {
    return true;
  }

  const granted = new Set(auth.principal?.permissions ?? []);
  return requiredPermissions.every((permission) => granted.has(permission));
}
