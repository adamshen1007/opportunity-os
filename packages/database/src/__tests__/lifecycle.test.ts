import { describe, expect, it, vi } from "vitest";
import { connectDatabase, disconnectDatabase, safelyShutdownDatabase } from "../lifecycle.js";
import type { DatabaseClientContract } from "../client.js";

describe("database lifecycle contracts", () => {
  it("connects through an injected client", async () => {
    const client: DatabaseClientContract = {
      $connect: vi.fn(async () => undefined),
      $disconnect: vi.fn(async () => undefined)
    };

    await expect(connectDatabase(client)).resolves.toEqual({ status: "connected" });
    expect(client.$connect).toHaveBeenCalledOnce();
  });

  it("disconnects through an injected client", async () => {
    const client: DatabaseClientContract = {
      $connect: vi.fn(async () => undefined),
      $disconnect: vi.fn(async () => undefined)
    };

    await expect(disconnectDatabase(client)).resolves.toEqual({ status: "disconnected" });
    expect(client.$disconnect).toHaveBeenCalledOnce();
  });

  it("returns a safe shutdown failure without leaking raw causes", async () => {
    const client: DatabaseClientContract = {
      $connect: vi.fn(async () => undefined),
      $disconnect: vi.fn(async () => {
        throw new Error("postgresql://user:secret@localhost:5432/app failed");
      })
    };

    const result = await safelyShutdownDatabase(client);

    expect(result.status).toBe("shutdown_failed");
    expect(result.error).toEqual({
      code: "DATABASE_UNKNOWN_ERROR",
      category: "infrastructure",
      message: "Database operation failed.",
      operation: "database.shutdown"
    });
  });
});
