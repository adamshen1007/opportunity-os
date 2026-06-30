import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const schemaPath = path.join(import.meta.dirname, "../../prisma/schema.prisma");

const prohibitedModelNames = [
  "RawContent",
  "Connector",
  "ConnectorRun",
  "EventStore",
  "StoredEvent",
  "AiWorkflow",
  "Api",
  "Frontend",
  "Business",
  "Opportunity",
  "Account",
  "Customer"
];

describe("database schema policy", () => {
  it("declares PostgreSQL and Prisma client foundation only", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");

    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain('provider = "prisma-client-js"');
  });

  it("does not define prohibited business, connector, API, workflow, frontend, or event store models", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");

    for (const modelName of prohibitedModelNames) {
      expect(schema).not.toMatch(new RegExp(`\\bmodel\\s+${modelName}\\b`, "u"));
    }
  });

  it("does not define any tables in the foundation slice", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");

    expect(schema).not.toMatch(/\bmodel\s+[A-Z][A-Za-z0-9_]*\s*\{/u);
  });
});
