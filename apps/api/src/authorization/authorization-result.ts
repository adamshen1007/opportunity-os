import {
  API_AUTH_STATES,
  type ApiAuthContext
} from "../auth/index.js";
import {
  API_AUTHORIZATION_DECISIONS,
  hasRequiredPermissions,
  type ApiAuthorizationDecision,
  type ApiAuthorizationInput
} from "./authorization-policy.js";

export interface ApiAuthorizationResult {
  readonly decision: ApiAuthorizationDecision;
  readonly safeReason?: string;
}

export function authorizeApiRequest(input: ApiAuthorizationInput): ApiAuthorizationResult {
  if (!input.policy.requiresAuthentication) {
    return { decision: API_AUTHORIZATION_DECISIONS.allowed };
  }

  if (!isAuthenticated(input.auth)) {
    return {
      decision: API_AUTHORIZATION_DECISIONS.denied,
      safeReason: "Authentication is required."
    };
  }

  if (!hasRequiredPermissions(input.auth, input.policy.requiredPermissions ?? [])) {
    return {
      decision: API_AUTHORIZATION_DECISIONS.denied,
      safeReason: "Permission is required."
    };
  }

  return { decision: API_AUTHORIZATION_DECISIONS.allowed };
}

function isAuthenticated(auth: ApiAuthContext): boolean {
  return auth.state === API_AUTH_STATES.authenticated && auth.principal !== undefined;
}
