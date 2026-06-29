import { describe, expect, expectTypeOf, it } from "vitest";

import {
  IDEMPOTENCY_STATUSES,
  type IdempotencyCheck,
  type IdempotencyRecord,
  type IdempotencyStatus
} from "../index.js";

describe("idempotency contracts", () => {
  it("defines stable infrastructure idempotency statuses", () => {
    expect(IDEMPOTENCY_STATUSES).toEqual({
      new: "new",
      processed: "processed",
      duplicate: "duplicate",
      conflict: "conflict"
    });
  });

  it("supports optional idempotency keys before persistence exists", () => {
    const check = {
      status: IDEMPOTENCY_STATUSES.new
    } satisfies IdempotencyCheck;

    expect(check).toEqual({
      status: "new"
    });
  });

  it("keeps idempotency contracts generic", () => {
    expectTypeOf<IdempotencyStatus>().toEqualTypeOf<
      "new" | "processed" | "duplicate" | "conflict"
    >();
    expectTypeOf<IdempotencyRecord>().toHaveProperty("idempotencyKey");
    expectTypeOf<IdempotencyRecord>().toHaveProperty("eventId");
    expectTypeOf<IdempotencyRecord>().toHaveProperty("status");
  });
});
