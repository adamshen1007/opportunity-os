import { describe, expect, it } from "vitest";
import { API_SCAN_PERSISTENCE_TRANSACTION_OPTIONS } from "../runtime/index.js";

describe("production runtime", () => {
  it("allows hosted multi-item persistence to outlive Prisma's short defaults", () => {
    expect(API_SCAN_PERSISTENCE_TRANSACTION_OPTIONS).toEqual({
      maxWait: 10_000,
      timeout: 60_000
    });
    expect(API_SCAN_PERSISTENCE_TRANSACTION_OPTIONS.timeout).toBeGreaterThan(5_000);
  });
});
