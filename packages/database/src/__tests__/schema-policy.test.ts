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
  "Customer",
  "Tenant"
];

const allowedPrivateBetaModelNames = [
  "PrivateBetaBugReport",
  "PrivateBetaFeedback",
  "PrivateBetaInvite",
  "PrivateBetaSession"
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

  it("defines only approved Private Beta persistence models", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");
    const modelNames = [...schema.matchAll(/\bmodel\s+([A-Z][A-Za-z0-9_]*)\s*\{/gu)].map((match) => match[1]);

    expect(modelNames.toSorted()).toEqual(allowedPrivateBetaModelNames.toSorted());
    expect(schema).toContain("@@map(\"private_beta_invites\")");
    expect(schema).toContain("@@map(\"private_beta_sessions\")");
    expect(schema).toContain("@@map(\"private_beta_feedback\")");
    expect(schema).toContain("@@map(\"private_beta_bug_reports\")");
    expect(schema).toContain("inviteCodeHash String");
    expect(schema).toContain("safeDescription String");
    expect(schema).not.toContain("inviteCode String");
  });
});
