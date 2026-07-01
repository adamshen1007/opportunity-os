import {
  REDDIT_FAKE_CONFIG,
  REDDIT_FAKE_HOST_CONTEXT
} from "../testing/index.js";
import {
  createRedditFixtureProvider
} from "./fixture-provider.js";
import {
  createRedditRuntimeConnector,
  type RedditRuntimeConnector
} from "./reddit-runtime.js";
import {
  mapRedditRuntimeSuccess,
  type RedditRuntimeReadResult
} from "./runtime-result.js";
import type { RedditOperationName } from "../operations/index.js";

export type RedditRuntimeFakeClock = {
  readonly now: () => string;
};

export type RedditRuntimeFakeContext = typeof REDDIT_FAKE_HOST_CONTEXT;

export type RedditRuntimeHarness = {
  readonly clock: RedditRuntimeFakeClock;
  readonly context: RedditRuntimeFakeContext;
  readonly connector: RedditRuntimeConnector;
  readonly read: (operationName: RedditOperationName) => RedditRuntimeReadResult;
};

export const REDDIT_RUNTIME_FAKE_CLOCK = {
  now: () => "2026-07-01T00:00:00.000Z"
} as const satisfies RedditRuntimeFakeClock;

export function createRedditRuntimeHarness(): RedditRuntimeHarness {
  const connector = createRedditRuntimeConnector({
    config: REDDIT_FAKE_CONFIG,
    provider: createRedditFixtureProvider()
  });

  return {
    clock: REDDIT_RUNTIME_FAKE_CLOCK,
    context: REDDIT_FAKE_HOST_CONTEXT,
    connector,
    read: (operationName) =>
      mapRedditRuntimeSuccess(connector.read(operationName), {
        operationName,
        correlationId: REDDIT_FAKE_HOST_CONTEXT.correlationId,
        requestId: REDDIT_FAKE_HOST_CONTEXT.requestId
      })
  };
}
