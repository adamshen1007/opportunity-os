import { describe, expect, it } from "vitest";
import {
  createRedditLifecycleReadiness,
  validateRedditRuntimeConfig,
  REDDIT_FAKE_CONFIG
} from "../index.js";

describe("Reddit runtime lifecycle", () => {
  it("creates deterministic ready lifecycle states from valid config", () => {
    const readiness = createRedditLifecycleReadiness(
      validateRedditRuntimeConfig(REDDIT_FAKE_CONFIG)
    );

    expect(readiness.states.map((state) => state.phase)).toEqual([
      "configure",
      "validate",
      "initialize",
      "health-check",
      "execute-ready",
      "shutdown"
    ]);
    expect(readiness.states.every((state) => state.ready)).toBe(true);
  });

  it("creates deterministic not-ready states from invalid config", () => {
    const readiness = createRedditLifecycleReadiness({
      ok: false,
      issues: [
        {
          code: "reddit-config-invalid",
          target: "config",
          safeMessage: "Missing required Reddit config field: userAgent"
        }
      ]
    });

    expect(readiness.states.every((state) => !state.ready)).toBe(true);
    expect(readiness.states.every((state) => state.redditState === "not-ready")).toBe(true);
  });
});
