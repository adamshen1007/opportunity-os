import { describe, expect, it } from "vitest";
import { REDDIT_CONNECTOR_METADATA } from "../index.js";

describe("reddit connector metadata contracts", () => {
  it("declares stable connector metadata", () => {
    expect(REDDIT_CONNECTOR_METADATA).toEqual({
      id: "reddit",
      name: "Reddit",
      version: "0.0.0",
      description: "Reddit connector contract package for future read-only data acquisition.",
      provider: "reddit",
      category: "source",
      tags: ["reddit", "social", "community", "read-contract"],
      stability: "experimental"
    });
  });

  it("keeps the description safe and non-secret", () => {
    expect(REDDIT_CONNECTOR_METADATA.description).not.toMatch(
      /secret|token|password|credential|authorization/iu
    );
  });
});
