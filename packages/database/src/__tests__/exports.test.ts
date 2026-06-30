import { describe, expect, it } from "vitest";
import * as database from "../index.js";

const expectedExports = [
  "DATABASE_ERROR_CODES",
  "DatabaseConfigurationError",
  "DatabaseError",
  "checkDatabaseHealth",
  "connectDatabase",
  "createDatabaseClient",
  "createDatabaseConfig",
  "createSeedPlaceholder",
  "createTransactionBoundary",
  "disconnectDatabase",
  "safelyShutdownDatabase",
  "sanitizeDatabaseErrorMessage",
  "toSafeDatabaseErrorDetails"
];

describe("database package exports", () => {
  it("exports approved runtime contracts through the package boundary", () => {
    for (const exportName of expectedExports) {
      expect(database).toHaveProperty(exportName);
    }
  });
});
