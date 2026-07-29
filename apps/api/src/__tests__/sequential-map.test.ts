import { describe, expect, it } from "vitest";
import { mapSequentially } from "../pipeline/sequential-map.js";

describe("sequential provider mapping", () => {
  it("preserves input order and never overlaps provider work", async () => {
    let active = 0;
    let maximumActive = 0;
    const started: number[] = [];

    const result = await mapSequentially([1, 2, 3, 4, 5], async (item) => {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      started.push(item);
      await Promise.resolve();
      active -= 1;
      return item * 10;
    });

    expect(result).toEqual([10, 20, 30, 40, 50]);
    expect(started).toEqual([1, 2, 3, 4, 5]);
    expect(maximumActive).toBe(1);
  });
});
