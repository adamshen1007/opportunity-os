import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_CONFIG,
  validateRedditRuntimeConfig,
  type RedditConnectorConfig
} from "../index.js";

describe("Reddit runtime config validation", () => {
  it("accepts explicit valid fixture config", () => {
    expect(validateRedditRuntimeConfig(REDDIT_FAKE_CONFIG)).toEqual({
      ok: true,
      issues: []
    });
  });

  it("returns safe config validation issues for missing required fields", () => {
    const invalidConfig = {
      fields: REDDIT_FAKE_CONFIG.fields.filter(
        (field) => field.key !== "userAgent"
      )
    } satisfies RedditConnectorConfig;

    const result = validateRedditRuntimeConfig(invalidConfig);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual([
        {
          code: "reddit-config-invalid",
          target: "config",
          safeMessage: "Missing required Reddit config field: userAgent",
          path: ["fields", "userAgent"]
        }
      ]);
    }
  });
});
