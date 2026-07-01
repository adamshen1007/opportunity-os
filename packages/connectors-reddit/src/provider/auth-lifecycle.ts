export const REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES = [
  "unauthenticated",
  "configured",
  "token-valid",
  "token-expiring",
  "refresh-required",
  "failed",
  "revoked"
] as const;

export type RedditProviderAuthLifecycleState =
  (typeof REDDIT_PROVIDER_AUTH_LIFECYCLE_STATES)[number];

export type RedditProviderAuthLifecycleSnapshot = {
  readonly state: RedditProviderAuthLifecycleState;
  readonly checkedAt: string;
  readonly expiresAt?: string;
  readonly refreshAfter?: string;
  readonly safeMessage?: string;
};

export function createRedditProviderAuthLifecycleSnapshot(
  snapshot: RedditProviderAuthLifecycleSnapshot
): RedditProviderAuthLifecycleSnapshot {
  return {
    state: snapshot.state,
    checkedAt: snapshot.checkedAt,
    expiresAt: snapshot.expiresAt,
    refreshAfter: snapshot.refreshAfter,
    safeMessage: snapshot.safeMessage
  };
}
