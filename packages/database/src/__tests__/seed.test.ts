import { describe, expect, it } from "vitest";
import { createSeedPlaceholder } from "../seed.js";

describe("seed placeholder contract", () => {
  it("defines a skipped seed plan without inserting data", () => {
    expect(
      createSeedPlaceholder({
        name: "foundation",
        description: "No seed data is inserted during Database Foundation."
      })
    ).toEqual({
      status: "skipped",
      plan: {
        name: "foundation",
        description: "No seed data is inserted during Database Foundation.",
        enabled: false
      }
    });
  });
});
