import { REDDIT_FAKE_HOST_CONTEXT } from "../testing/index.js";
import { createRedditLiveProviderConfigFromEnv } from "./live-config.js";
import { fetchRedditLivePublicPosts } from "./live-execution.js";
import { createRedditLiveHttpTransport } from "./live-http-transport.js";

async function main() {
  const configResult = createRedditLiveProviderConfigFromEnv(process.env);

  if (!configResult.ok) {
    console.error(configResult.safeMessage);
    console.error(`Missing keys: ${configResult.missingKeys.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  if (!configResult.config.enabled) {
    console.error("Set REDDIT_LIVE_TEST_ENABLED=true before running the live Reddit dev fetch command.");
    process.exitCode = 1;
    return;
  }

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
      correlationId: "corr_reddit_live_dev_fetch",
      requestId: "req_reddit_live_dev_fetch"
    },
    timeoutMs: 10000
  });

  if (!result.ok) {
    console.error(JSON.stringify(result.error.toJSON(), null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(`Fetched ${result.envelope.items.length} public Reddit posts from r/${configResult.config.subreddit}.`);
  for (const item of result.envelope.items.slice(0, 5)) {
    if ("title" in item && "permalink" in item) {
      console.log(`- ${item.title} (${item.permalink})`);
    }
  }
}

void main();
