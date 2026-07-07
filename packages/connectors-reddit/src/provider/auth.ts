export const REDDIT_AUTH_SENSITIVE_FIELD_KEYS = [
  "clientId",
  "clientSecret",
  "accessToken",
  "refreshToken"
] as const;

export type RedditAuthSensitiveFieldKey =
  (typeof REDDIT_AUTH_SENSITIVE_FIELD_KEYS)[number];

export type RedditSensitiveAuthValue = {
  readonly value: string;
  readonly sensitive: true;
  readonly toJSON?: () => {
    readonly value: "[REDACTED]";
    readonly sensitive: true;
  };
};

export type RedditOAuthCredentials = {
  readonly clientId: RedditSensitiveAuthValue;
  readonly clientSecret?: RedditSensitiveAuthValue;
  readonly refreshToken?: RedditSensitiveAuthValue;
  readonly userAgent: string;
  readonly scopes?: readonly string[];
};

export type RedditOAuthToken = {
  readonly tokenType: "bearer";
  readonly accessToken: RedditSensitiveAuthValue;
  readonly refreshToken?: RedditSensitiveAuthValue;
  readonly issuedAt?: string;
  readonly expiresAt?: string;
  readonly scopes?: readonly string[];
};

export type RedditOAuthExpiration = {
  readonly issuedAt?: string;
  readonly expiresAt?: string;
  readonly expiresInSeconds?: number;
  readonly refreshAfter?: string;
};

export type RedditAuthStateStatus =
  | "anonymous"
  | "configured"
  | "token-valid"
  | "token-expired"
  | "refresh-required"
  | "invalid";

export type RedditAuthState = {
  readonly status: RedditAuthStateStatus;
  readonly credentials?: RedditOAuthCredentials;
  readonly token?: RedditOAuthToken;
  readonly expiration?: RedditOAuthExpiration;
  readonly safeMessage?: string;
};

export type RedditAuthRefreshRequest = {
  readonly credentials: RedditOAuthCredentials;
  readonly currentToken?: RedditOAuthToken;
  readonly requestedAt: string;
  readonly correlationId: string;
  readonly requestId?: string;
};

export type RedditAuthRefreshResult =
  | {
      readonly ok: true;
      readonly token: RedditOAuthToken;
      readonly expiration?: RedditOAuthExpiration;
    }
  | {
      readonly ok: false;
      readonly safeMessage: string;
      readonly reason: "missing-credentials" | "token-not-refreshable" | "refresh-not-available";
    };
