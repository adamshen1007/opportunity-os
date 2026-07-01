import { describe, expect, it } from "vitest";
import * as redditConnectorExports from "../index.js";

describe("reddit connector public exports", () => {
  it("exposes approved runtime values from the package root", () => {
    expect(Object.keys(redditConnectorExports).sort()).toEqual([
      "REDDIT_CONFIG_FIELD_KEYS",
      "REDDIT_CONNECTOR_CAPABILITIES",
      "REDDIT_CONNECTOR_ERROR_CODES",
      "REDDIT_CONNECTOR_METADATA",
      "REDDIT_FAKE_AUTHOR",
      "REDDIT_FAKE_COMMENT",
      "REDDIT_FAKE_CONFIG",
      "REDDIT_FAKE_HOST_CONTEXT",
      "REDDIT_FAKE_PAGINATION",
      "REDDIT_FAKE_POST",
      "REDDIT_FAKE_RATE_LIMIT",
      "REDDIT_FAKE_SUBREDDIT",
      "REDDIT_FIXTURE_ENVELOPE_METADATA",
      "REDDIT_FIXTURE_PROVIDER_SNAPSHOT",
      "REDDIT_LIFECYCLE_READINESS_STATES",
      "REDDIT_OAUTH_CONFIG_FIELD_KEYS",
      "REDDIT_OPERATION_NAMES",
      "REDDIT_READ_CONTRACT_AREAS",
      "REDDIT_REQUIRED_CONFIG_FIELD_KEYS",
      "REDDIT_RUNTIME_FAKE_CLOCK",
      "REDDIT_SENSITIVE_CONFIG_FIELD_KEYS",
      "REDDIT_VALIDATION_ISSUE_CODES",
      "REDDIT_VALIDATION_TARGETS",
      "RedditConnectorError",
      "RedditRuntimeError",
      "createRedditConnectorError",
      "createRedditFakeProvider",
      "createRedditFixtureProvider",
      "createRedditLifecycleReadiness",
      "createRedditRuntimeConnector",
      "createRedditRuntimeError",
      "createRedditRuntimeHarness",
      "mapRedditRuntimeFailure",
      "mapRedditRuntimeSuccess",
      "readRedditFixtureAuthors",
      "readRedditFixtureComments",
      "readRedditFixtureOperation",
      "readRedditFixturePosts",
      "readRedditFixtureSubreddits",
      "sanitizeRedditConnectorErrorMessage",
      "validateRedditRuntimeConfig"
    ]);
  });
});
