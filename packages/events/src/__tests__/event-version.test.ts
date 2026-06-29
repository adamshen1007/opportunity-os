import { describe, expect, expectTypeOf, it } from "vitest";

import {
  EVENT_VERSION_PATTERN,
  createEventVersion,
  isEventVersion,
  type EventVersion
} from "../index.js";

describe("event versioning", () => {
  it("creates deterministic generic event versions", () => {
    expect(createEventVersion(1)).toBe("v1");
    expect(createEventVersion(12)).toBe("v12");
  });

  it("accepts only positive major version strings", () => {
    expect(EVENT_VERSION_PATTERN.test("v1")).toBe(true);
    expect(isEventVersion("v2")).toBe(true);
    expect(isEventVersion("v0")).toBe(false);
    expect(isEventVersion("1")).toBe(false);
    expect(isEventVersion("v1.0")).toBe(false);
    expect(() => createEventVersion(0)).toThrow(
      "Event version must be a positive integer"
    );
    expect(() => createEventVersion(1.5)).toThrow(
      "Event version must be a positive integer"
    );
  });

  it("exposes a generic version type", () => {
    expectTypeOf<EventVersion>().toExtend<`v${number}`>();
  });
});
