import { describe, expect, it, vi } from "vitest";
import { checkDatabaseHealth } from "../health.js";

const fixedClock = () => "2026-06-29T00:00:00.000Z";

describe("database health check contract", () => {
  it("returns healthy when the injected probe succeeds", async () => {
    const probe = vi.fn(async () => undefined);

    await expect(checkDatabaseHealth({ probe, clock: fixedClock })).resolves.toEqual({
      status: "healthy",
      checkedAt: "2026-06-29T00:00:00.000Z"
    });
  });

  it("returns a safe unhealthy result when the injected probe fails", async () => {
    const probe = vi.fn(async () => {
      throw new Error("postgresql://user:secret@localhost:5432/app failed");
    });

    await expect(checkDatabaseHealth({ probe, clock: fixedClock })).resolves.toEqual({
      status: "unhealthy",
      checkedAt: "2026-06-29T00:00:00.000Z",
      error: {
        code: "DATABASE_HEALTH_CHECK_FAILED",
        category: "infrastructure",
        message: "Database health check failed.",
        operation: "database.health_check"
      }
    });
  });
});
