import { describe, expect, it } from "vitest";
import {
  REDDIT_VALIDATION_ISSUE_CODES,
  REDDIT_VALIDATION_TARGETS
} from "../index.js";
import type { RedditValidationIssue } from "../index.js";

describe("reddit connector validation contracts", () => {
  it("covers metadata, capability, config, lifecycle, dependency, and data shape issues", () => {
    expect(REDDIT_VALIDATION_ISSUE_CODES).toEqual([
      "reddit-metadata-invalid",
      "reddit-capability-invalid",
      "reddit-config-invalid",
      "reddit-lifecycle-not-ready",
      "reddit-dependency-not-ready",
      "reddit-data-shape-incompatible"
    ]);
    expect(REDDIT_VALIDATION_TARGETS).toEqual([
      "metadata",
      "capability",
      "config",
      "lifecycle",
      "dependency",
      "data-shape"
    ]);
  });

  it("uses safe messages without raw values", () => {
    const issue: RedditValidationIssue = {
      code: "reddit-config-invalid",
      target: "config",
      safeMessage: "Reddit connector config is missing a required contract field.",
      path: ["fields", "userAgent"],
      connectorId: "reddit",
      genericCode: "config-invalid"
    };

    expect(Object.keys(issue)).toEqual([
      "code",
      "target",
      "safeMessage",
      "path",
      "connectorId",
      "genericCode"
    ]);
    expect(issue.safeMessage).not.toMatch(/secret|token|password|authorization/iu);
  });
});
