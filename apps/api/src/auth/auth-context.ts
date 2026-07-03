export const API_AUTH_STATES = {
  anonymous: "anonymous",
  authenticated: "authenticated",
  invalid: "invalid"
} as const;

export type ApiAuthState = (typeof API_AUTH_STATES)[keyof typeof API_AUTH_STATES];

export interface ApiAuthPrincipal {
  readonly principalId: string;
  readonly displayName?: string;
  readonly permissions: readonly string[];
}

export interface ApiAuthContext {
  readonly state: ApiAuthState;
  readonly principal?: ApiAuthPrincipal;
  readonly safeReason?: string;
}

export function createAnonymousAuthContext(): ApiAuthContext {
  return {
    state: API_AUTH_STATES.anonymous
  };
}

export function createAuthenticatedAuthContext(principal: ApiAuthPrincipal): ApiAuthContext {
  return {
    state: API_AUTH_STATES.authenticated,
    principal: {
      principalId: principal.principalId,
      displayName: principal.displayName,
      permissions: [...principal.permissions]
    }
  };
}
