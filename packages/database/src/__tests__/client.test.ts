import { describe, expect, it, vi } from "vitest";
import { createDatabaseClient, type DatabaseClientContract } from "../client.js";
import { createDatabaseConfig } from "../database-config.js";

describe("createDatabaseClient", () => {
  it("creates a database client from explicit configuration", () => {
    const config = createDatabaseConfig({
      databaseUrl: "postgresql://user:password@localhost:5432/opportunity_os"
    });
    const client: DatabaseClientContract = {
      $connect: vi.fn(async () => undefined),
      $disconnect: vi.fn(async () => undefined)
    };
    const createClient = vi.fn(() => client);

    const result = createDatabaseClient({
      config,
      createClient
    });

    expect(result).toBe(client);
    expect(createClient).toHaveBeenCalledOnce();
    expect(createClient).toHaveBeenCalledWith(config);
  });

  it("does not automatically connect during client creation", () => {
    const config = createDatabaseConfig({
      databaseUrl: "postgresql://user:password@localhost:5432/opportunity_os"
    });
    const client: DatabaseClientContract = {
      $connect: vi.fn(async () => undefined),
      $disconnect: vi.fn(async () => undefined)
    };

    createDatabaseClient({
      config,
      createClient: () => client
    });

    expect(client.$connect).not.toHaveBeenCalled();
    expect(client.$disconnect).not.toHaveBeenCalled();
  });
});
