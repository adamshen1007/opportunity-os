import { API_AUTH_STATES, type ApiAuthContext } from "./auth-context.js";

export const API_AUTH_FAILURE_REASONS = {
  invalidCredentials: "invalid_credentials",
  missingCredentials: "missing_credentials",
  unsupportedCredentials: "unsupported_credentials"
} as const;

export type ApiAuthFailureReason = (typeof API_AUTH_FAILURE_REASONS)[keyof typeof API_AUTH_FAILURE_REASONS];

export interface ApiAuthSuccessResult {
  readonly authenticated: true;
  readonly context: ApiAuthContext;
}

export interface ApiAuthFailureResult {
  readonly authenticated: false;
  readonly context: ApiAuthContext;
  readonly reason: ApiAuthFailureReason;
  readonly safeMessage: string;
}

export type ApiAuthResult = ApiAuthSuccessResult | ApiAuthFailureResult;

export function createApiAuthFailure(reason: ApiAuthFailureReason, safeMessage: string): ApiAuthFailureResult {
  return {
    authenticated: false,
    context: {
      state: API_AUTH_STATES.invalid,
      safeReason: safeMessage
    },
    reason,
    safeMessage
  };
}
