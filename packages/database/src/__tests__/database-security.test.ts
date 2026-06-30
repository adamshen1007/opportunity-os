import { describe, expect, it } from "vitest";
import { checkDatabaseHealth } from "../health.js";
import {
  DATABASE_ERROR_CODES,
  DatabaseError,
  sanitizeDatabaseErrorMessage,
  toSafeDatabaseErrorDetails
} from "../database-error.js";

const sensitiveSamples = [
  "DATABASE_URL=postgresql://user:secret@localhost:5432/opportunity_os",
  "postgresql://user:secret@localhost:5432/opportunity_os",
  "password=secret",
  "token=super-secret-token",
  "api_key=provider-secret",
  "authorization: Bearer raw-auth-value",
  "SELECT password FROM users WHERE token = 'secret'",
  "prisma.rawContent.findMany",
  "PrismaClientKnownRequestError"
];

describe("database security", () => {
  it("redacts secret-like database values from sanitized messages", () => {
    const sanitized = sanitizeDatabaseErrorMessage(sensitiveSamples.join(" "));

    expect(sanitized).not.toContain("secret");
    expect(sanitized).not.toContain("Bearer");
    expect(sanitized).not.toContain("SELECT password");
    expect(sanitized).not.toContain("prisma.rawContent");
  });

  it("does not leak raw causes from database errors", () => {
    const error = new DatabaseError({
      code: DATABASE_ERROR_CODES.queryFailed,
      message: sensitiveSamples.join(" "),
      operation: "database.query",
      cause: new Error("DATABASE_URL=postgresql://user:secret@localhost:5432/opportunity_os")
    });
    const serialized = JSON.stringify(error);

    expect(serialized).not.toContain("DATABASE_URL=");
    expect(serialized).not.toContain("secret");
    expect(serialized).not.toContain("PrismaClientKnownRequestError");
  });

  it("maps unknown provider errors to safe details without provider internals", () => {
    const safeError = toSafeDatabaseErrorDetails(
      new Error("PrismaClientKnownRequestError: SELECT secret FROM users using postgresql://user:secret@localhost/app"),
      {
        code: DATABASE_ERROR_CODES.queryFailed,
        operation: "database.query"
      }
    );

    expect(safeError).toEqual({
      code: "DATABASE_QUERY_FAILED",
      category: "infrastructure",
      message: "Database operation failed.",
      operation: "database.query"
    });
  });

  it("does not leak health probe failure details", async () => {
    const result = await checkDatabaseHealth({
      clock: () => "2026-06-30T00:00:00.000Z",
      probe: async () => {
        throw new Error("authorization: Bearer raw-auth-value SELECT secret FROM users");
      }
    });

    expect(JSON.stringify(result)).not.toContain("raw-auth-value");
    expect(JSON.stringify(result)).not.toContain("SELECT secret");
  });
});
