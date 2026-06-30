import { describe, expect, it } from "vitest";
import {
  DATABASE_ERROR_CODES,
  DatabaseError,
  sanitizeDatabaseErrorMessage,
  toSafeDatabaseErrorDetails
} from "../database-error.js";

describe("database errors", () => {
  it("serializes safe infrastructure error details", () => {
    const error = new DatabaseError({
      code: DATABASE_ERROR_CODES.queryFailed,
      message: "Query failed for postgresql://user:secret@localhost:5432/app",
      operation: "database.query",
      cause: new Error("SELECT secret FROM users")
    });

    expect(error.toSafeDetails()).toEqual({
      code: "DATABASE_QUERY_FAILED",
      category: "infrastructure",
      message: "Query failed for [REDACTED]",
      operation: "database.query"
    });
    expect(JSON.stringify(error)).not.toContain("secret");
    expect(JSON.stringify(error)).not.toContain("SELECT");
  });

  it("redacts credentials, SQL payloads, and Prisma internals from messages", () => {
    const message = sanitizeDatabaseErrorMessage(
      "password=secret token=abc authorization: Bearer value SELECT secret FROM users prisma.user.findMany"
    );

    expect(message).not.toContain("secret");
    expect(message).not.toContain("Bearer");
    expect(message).not.toContain("SELECT");
    expect(message).not.toContain("prisma.user");
  });

  it("maps unknown errors to safe fallback details", () => {
    const safeError = toSafeDatabaseErrorDetails(new Error("postgresql://user:secret@localhost/app"), {
      code: DATABASE_ERROR_CODES.connectionFailed,
      operation: "database.connect"
    });

    expect(safeError).toEqual({
      code: "DATABASE_CONNECTION_FAILED",
      category: "infrastructure",
      message: "Database operation failed.",
      operation: "database.connect"
    });
  });
});
