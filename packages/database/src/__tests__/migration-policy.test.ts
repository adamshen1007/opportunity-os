import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  import.meta.dirname,
  "../../prisma/migrations/00000000000000_foundation_baseline/migration.sql"
);

describe("foundation baseline migration", () => {
  it("creates no database tables", () => {
    const migration = fs.readFileSync(migrationPath, "utf8");

    expect(migration).not.toMatch(/\bCREATE\s+TABLE\b/iu);
    expect(migration).not.toMatch(/\bRawContent\b/u);
    expect(migration).not.toMatch(/\bConnector\b/u);
    expect(migration).not.toMatch(/\bEventStore\b/u);
  });
});
