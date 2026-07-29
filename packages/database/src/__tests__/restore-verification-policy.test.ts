import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = path.join(import.meta.dirname, "../..");
const verifierPath = path.join(packageRoot, "scripts/verify-restored-database.mjs");

describe("restored database verification policy", () => {
  it("requires an isolated target and verifies every pilot data family", () => {
    const source = fs.readFileSync(verifierPath, "utf8");

    expect(source).toContain("RESTORE_DATABASE_URL");
    expect(source).toContain("RESTORE_DATABASE_CONFIRMED_ISOLATED");
    expect(source).toContain("active application database");
    for (const family of ["users", "sessions", "scans", "clusters", "opportunities", "rankings", "feedback"]) {
      expect(source).toContain(`${family}:`);
    }
    expect(source).toContain("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
    expect(source).toContain("ROLLBACK");
    expect(source).not.toMatch(/console\.(?:log|error)\([^\n]*(?:RESTORE_DATABASE_URL|connectionString)/u);
  });

  it("fails safely without printing inherited database credentials", () => {
    const result = spawnSync(process.execPath, [verifierPath], {
      cwd: packageRoot,
      env: {
        ...process.env,
        DATABASE_URL: "postgresql://operator:unsafe-password@database.example.test:5432/production",
        RESTORE_DATABASE_URL: ""
      },
      encoding: "utf8"
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain("Restore verification failed safely.");
    expect(output).not.toContain("unsafe-password");
    expect(output).not.toContain("database.example.test");
  });
});
