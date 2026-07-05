import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const schemaPath = path.join(import.meta.dirname, "../../prisma/schema.prisma");

const prohibitedModelNames = [
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
  "Tenant",
  "ProviderIngestion",
  "SchedulerJob",
  "WorkerJob",
  "PrismaRepository"
];

const allowedModelNames = [
  "AnalysisResult",
  "CandidateOpportunityRecord",
  "GeneratedOpportunityRecord",
  "NormalizedContent",
  "OpportunityRankingItem",
  "OpportunityRankingResult",
  "PrivateBetaBugReport",
  "PrivateBetaFeedback",
  "PrivateBetaInvite",
  "PrivateBetaSession",
  "RawSourceContent"
];

const requiredProductTableMappings = [
  "@@map(\"raw_source_content\")",
  "@@map(\"normalized_content\")",
  "@@map(\"analysis_results\")",
  "@@map(\"candidate_opportunity_records\")",
  "@@map(\"generated_opportunity_records\")",
  "@@map(\"opportunity_ranking_results\")",
  "@@map(\"opportunity_ranking_items\")"
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

  it("defines only approved Private Beta and MVP product data persistence models", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");
    const modelNames = [...schema.matchAll(/\bmodel\s+([A-Z][A-Za-z0-9_]*)\s*\{/gu)].map((match) => match[1]);

    expect(modelNames.toSorted()).toEqual(allowedModelNames.toSorted());
    expect(schema).toContain("@@map(\"private_beta_invites\")");
    expect(schema).toContain("@@map(\"private_beta_sessions\")");
    expect(schema).toContain("@@map(\"private_beta_feedback\")");
    expect(schema).toContain("@@map(\"private_beta_bug_reports\")");
    for (const tableMapping of requiredProductTableMappings) {
      expect(schema).toContain(tableMapping);
    }
    expect(schema).toContain("inviteCodeHash String");
    expect(schema).toContain("safeDescription String");
    expect(schema).toContain("opportunityRecordId String?");
    expect(schema).not.toContain("inviteCode String");
  });

  it("keeps product data schema durable without provider ingestion or execution tables", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");

    expect(schema).toContain("model RawSourceContent");
    expect(schema).toContain("model GeneratedOpportunityRecord");
    expect(schema).toContain("model OpportunityRankingResult");
    expect(schema).toContain("GeneratedOpportunityRecord? @relation");
    expect(schema).not.toMatch(/\bmodel\s+(ProviderRun|IngestionRun|WorkflowRun|SchedulerJob|WorkerJob)\b/u);
    expect(schema).not.toMatch(/\bproviderPayload\b/u);
    expect(schema).not.toMatch(/\brawProviderResponse\b/u);
  });
});
