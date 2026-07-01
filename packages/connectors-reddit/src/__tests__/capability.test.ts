import { describe, expect, it } from "vitest";
import {
  REDDIT_CONNECTOR_CAPABILITIES,
  REDDIT_READ_CONTRACT_AREAS
} from "../index.js";

describe("reddit connector capability contracts", () => {
  it("declares read contract areas without executable behavior", () => {
    expect(REDDIT_READ_CONTRACT_AREAS).toEqual([
      "posts",
      "comments",
      "subreddits",
      "authors",
      "pagination-metadata",
      "rate-limit-metadata"
    ]);
  });

  it("declares capabilities for every read contract area", () => {
    expect(REDDIT_CONNECTOR_CAPABILITIES.map((capability) => capability.area)).toEqual(
      REDDIT_READ_CONTRACT_AREAS
    );
    expect(REDDIT_CONNECTOR_CAPABILITIES.every((capability) => capability.enabled)).toBe(true);
    expect(
      REDDIT_CONNECTOR_CAPABILITIES.every((capability) =>
        ["read", "discover"].includes(capability.kind)
      )
    ).toBe(true);
  });
});
