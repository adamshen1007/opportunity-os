import type { RedditRateLimitMetadata } from "../data/index.js";
import type { RedditTransportHeader } from "./transport.js";

export const REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS = [
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset"
] as const;

export type RedditProviderRateLimitHeaderKey =
  (typeof REDDIT_PROVIDER_RATE_LIMIT_HEADER_KEYS)[number];

export type RedditProviderRateLimitInput = {
  readonly headers?: readonly RedditTransportHeader[];
  readonly limit?: number | string;
  readonly remaining?: number | string;
  readonly resetAfterSeconds?: number | string;
  readonly resetAt?: string;
  readonly checkedAt: string;
};

function readHeader(
  headers: readonly RedditTransportHeader[] | undefined,
  name: RedditProviderRateLimitHeaderKey
): string | undefined {
  return headers?.find((header) => header.name.toLowerCase() === name)?.value;
}

function parseFiniteNumber(value: number | string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function addSeconds(timestamp: string, seconds: number | undefined): string | undefined {
  if (seconds === undefined) return undefined;
  const baseTime = Date.parse(timestamp);

  if (!Number.isFinite(baseTime)) return undefined;

  return new Date(baseTime + seconds * 1000).toISOString();
}

export function parseRedditProviderRateLimitMetadata(
  input: RedditProviderRateLimitInput
): RedditRateLimitMetadata {
  const limit = parseFiniteNumber(input.limit ?? readHeader(input.headers, "x-ratelimit-limit"));
  const remaining = parseFiniteNumber(
    input.remaining ?? readHeader(input.headers, "x-ratelimit-remaining")
  );
  const resetAfterSeconds = parseFiniteNumber(
    input.resetAfterSeconds ?? readHeader(input.headers, "x-ratelimit-reset")
  );
  const resetAt = input.resetAt ?? addSeconds(input.checkedAt, resetAfterSeconds);
  const usedFallback =
    limit === undefined || remaining === undefined || resetAt === undefined;

  return {
    limit,
    remaining,
    resetAt,
    window: {
      windowName: usedFallback ? "unknown" : "provider-window",
      windowSeconds: resetAfterSeconds
    },
    safeSourceMetadata: {
      source: "provider-rate-limit",
      fallback: usedFallback
    }
  };
}
