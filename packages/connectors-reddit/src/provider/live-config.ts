import type { RedditOAuthCredentials, RedditSensitiveAuthValue } from "./auth.js";

export const REDDIT_LIVE_PROVIDER_ENV_KEYS = [
  "REDDIT_CLIENT_ID",
  "REDDIT_CLIENT_SECRET",
  "REDDIT_REFRESH_TOKEN",
  "REDDIT_USER_AGENT",
  "REDDIT_LIVE_TEST_ENABLED",
  "REDDIT_LIVE_SUBREDDIT",
  "REDDIT_LIVE_LIMIT"
] as const;

export type RedditLiveProviderEnvKey = (typeof REDDIT_LIVE_PROVIDER_ENV_KEYS)[number];

export type RedditLiveProviderConfig = {
  readonly credentials: RedditOAuthCredentials;
  readonly subreddit: string;
  readonly limit: number;
  readonly enabled: boolean;
  readonly tokenEndpoint: string;
  readonly apiBaseUrl: string;
};

export type RedditLiveProviderConfigResult =
  | {
      readonly ok: true;
      readonly config: RedditLiveProviderConfig;
    }
  | {
      readonly ok: false;
      readonly missingKeys: readonly RedditLiveProviderEnvKey[];
      readonly safeMessage: string;
    };

function sensitive(value: string | undefined): RedditSensitiveAuthValue | undefined {
  const trimmed = value?.trim();

  if (!trimmed) return undefined;

  return {
    value: trimmed,
    sensitive: true
  };
}

function readPositiveLimit(value: string | undefined): number {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 && parsed <= 100 ? parsed : 5;
}

export function createRedditLiveProviderConfigFromEnv(
  env: Readonly<Record<string, string | undefined>>
): RedditLiveProviderConfigResult {
  const clientId = sensitive(env.REDDIT_CLIENT_ID);
  const userAgent = env.REDDIT_USER_AGENT?.trim();
  const missingKeys: RedditLiveProviderEnvKey[] = [];

  if (!clientId) missingKeys.push("REDDIT_CLIENT_ID");
  if (!userAgent) missingKeys.push("REDDIT_USER_AGENT");

  if (missingKeys.length > 0 || !clientId || !userAgent) {
    return {
      ok: false,
      missingKeys,
      safeMessage: "Reddit live provider config is missing required environment keys."
    };
  }

  return {
    ok: true,
    config: {
      credentials: {
        clientId,
        clientSecret: sensitive(env.REDDIT_CLIENT_SECRET),
        refreshToken: sensitive(env.REDDIT_REFRESH_TOKEN),
        userAgent
      },
      subreddit: env.REDDIT_LIVE_SUBREDDIT?.trim() || "entrepreneur",
      limit: readPositiveLimit(env.REDDIT_LIVE_LIMIT),
      enabled: env.REDDIT_LIVE_TEST_ENABLED === "true",
      tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
      apiBaseUrl: "https://oauth.reddit.com"
    }
  };
}
