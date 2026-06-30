import { describe, expect, it } from "vitest";
import { createDatabaseConfig, DatabaseConfigurationError } from "../database-config.js";

describe("createDatabaseConfig", () => {
  it("creates runtime database config from explicit input", () => {
    const config = createDatabaseConfig({
      databaseUrl: " postgresql://user:password@localhost:5432/opportunity_os "
    });

    expect(config).toEqual({
      databaseUrl: "postgresql://user:password@localhost:5432/opportunity_os"
    });
  });

  it("accepts postgres protocol aliases", () => {
    const config = createDatabaseConfig({
      databaseUrl: "postgres://user:password@localhost:5432/opportunity_os"
    });

    expect(config.databaseUrl).toBe("postgres://user:password@localhost:5432/opportunity_os");
  });

  it("rejects missing DATABASE_URL values", () => {
    expect(() => createDatabaseConfig({ databaseUrl: " " })).toThrow(DatabaseConfigurationError);
    expect(() => createDatabaseConfig({ databaseUrl: " " })).toThrow("DATABASE_URL is required");
  });

  it("rejects non-PostgreSQL connection URLs", () => {
    expect(() => createDatabaseConfig({ databaseUrl: "mysql://user:password@localhost:3306/app" })).toThrow(
      "DATABASE_URL must use the postgresql:// or postgres:// protocol."
    );
  });
});
