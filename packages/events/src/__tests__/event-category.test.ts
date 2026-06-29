import { describe, expect, expectTypeOf, it } from "vitest";

import {
  EVENT_CATEGORIES,
  isEventCategory,
  type EventCategory
} from "../index.js";

describe("event categories", () => {
  it("defines stable infrastructure-level event categories", () => {
    expect(EVENT_CATEGORIES).toEqual({
      infrastructure: "infrastructure",
      integration: "integration",
      lifecycle: "lifecycle",
      observability: "observability",
      security: "security"
    });
  });

  it("rejects unsupported categories", () => {
    expect(isEventCategory(EVENT_CATEGORIES.infrastructure)).toBe(true);
    expect(isEventCategory("business")).toBe(false);
    expect(isEventCategory("customer.created")).toBe(false);
    expect(isEventCategory(undefined)).toBe(false);
  });

  it("keeps the category type infrastructure-only", () => {
    expectTypeOf<EventCategory>().toEqualTypeOf<
      | "infrastructure"
      | "integration"
      | "lifecycle"
      | "observability"
      | "security"
    >();
  });
});
