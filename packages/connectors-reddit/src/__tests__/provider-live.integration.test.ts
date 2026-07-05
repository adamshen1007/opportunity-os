import { describe, expect, it } from "vitest";
import {
  createRedditLiveHttpTransport,
  createRedditLiveProviderConfigFromEnv,
  fetchRedditLivePublicPosts
} from "../index.js";
import { REDDIT_FAKE_HOST_CONTEXT } from "../testing/index.js";

const configResult = createRedditLiveProviderConfigFromEnv(process.env);
const describeLive =
  configResult.ok && configResult.config.enabled ? describe : describe.skip;

describeLive("reddit live provider integration", () => {
  it("fetches public subreddit posts with configured Reddit credentials", async () => {
    expect(configResult.ok).toBe(true);
    if (!configResult.ok) return;

    const result = await fetchRedditLivePublicPosts({
      credentials: configResult.config.credentials,
      transport: createRedditLiveHttpTransport(),
      subreddit: configResult.config.subreddit,
      limit: configResult.config.limit,
      tokenEndpoint: configResult.config.tokenEndpoint,
      apiBaseUrl: configResult.config.apiBaseUrl,
      requestedAt: new Date().toISOString(),
      runtimeContext: {
        ...REDDIT_FAKE_HOST_CONTEXT,
        correlationId: "corr_reddit_live_integration",
        requestId: "req_reddit_live_integration"
      },
      timeoutMs: 10000
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.envelope.kind).toBe("posts");
    }
  });
});
