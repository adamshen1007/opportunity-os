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
  "EvidenceCluster",
  "EvidenceClusterMembership",
  "GeneratedOpportunityRecord",
  "NormalizedContent",
  "OpportunityRankingItem",
  "OpportunityRankingResult",
  "PrivateBetaBugReport",
  "PrivateBetaFeedback",
  "PrivateBetaInvite",
  "PrivateBetaSession",
  "RawSourceContent",
  "ScanRunRecord"
];

const requiredProductTableMappings = [
  "@@map(\"scan_run_records\")",
  "@@map(\"raw_source_content\")",
  "@@map(\"normalized_content\")",
  "@@map(\"analysis_results\")",
  "@@map(\"evidence_clusters\")",
  "@@map(\"evidence_cluster_memberships\")",
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
    expect(schema).toMatch(/tokenHash\s+String\s+@unique/u);
    expect(schema).toContain("safeDescription String");
    expect(schema).toContain("opportunityRecordId String?");
    expect(schema).toMatch(/model ScanRunRecord[\s\S]*ownerPrincipalId\s+String/u);
    expect(schema).toMatch(/model PrivateBetaFeedback[\s\S]*ownerPrincipalId\s+String/u);
    expect(schema).toMatch(/model RawSourceContent[\s\S]*scanId\s+String/u);
    expect(schema).toMatch(/model OpportunityRankingResult[\s\S]*scanId\s+String/u);
    expect(schema).toMatch(/model EvidenceCluster[\s\S]*ownerPrincipalId\s+String/u);
    expect(schema).toMatch(/model EvidenceClusterMembership[\s\S]*ownerPrincipalId\s+String/u);
    expect(schema).not.toContain("inviteCode String");
  });

  it("keeps product data schema durable without provider ingestion or execution tables", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");

    expect(schema).toContain("model RawSourceContent");
    expect(schema).toContain("model ScanRunRecord");
    expect(schema).toContain("model GeneratedOpportunityRecord");
    expect(schema).toContain("model OpportunityRankingResult");
    expect(schema).toContain("GeneratedOpportunityRecord? @relation");
    expect(schema).not.toMatch(/\bmodel\s+(ProviderRun|IngestionRun|WorkflowRun|SchedulerJob|WorkerJob)\b/u);
    expect(schema).not.toMatch(/\bproviderPayload\b/u);
    expect(schema).not.toMatch(/\brawProviderResponse\b/u);
  });

  it("keeps deletion foreign keys compatible with explicit transactional graph removal", () => {
    const schema = fs.readFileSync(schemaPath, "utf8");

    expect(schema).toMatch(/model NormalizedContent[\s\S]*rawSourceContent\s+RawSourceContent\s+@relation\([^\n]*onDelete:\s*Cascade\)/u);
    expect(schema).toMatch(/model AnalysisResult[\s\S]*normalizedContent\s+NormalizedContent\s+@relation\([^\n]*onDelete:\s*Cascade\)/u);
    expect(schema).toMatch(/model EvidenceCluster[\s\S]*scan\s+ScanRunRecord\s+@relation\([^\n]*onDelete:\s*Cascade\)/u);
    expect(schema).toMatch(/model EvidenceClusterMembership[\s\S]*cluster\s+EvidenceCluster\s+@relation\([^\n]*onDelete:\s*Cascade\)/u);
    expect(schema).toMatch(/model OpportunityRankingItem[\s\S]*rankingResult\s+OpportunityRankingResult\s+@relation\([^\n]*onDelete:\s*Cascade\)/u);
    expect(schema).toMatch(/model OpportunityRankingItem[\s\S]*generatedOpportunity\s+GeneratedOpportunityRecord\s+@relation\([^\n]*onDelete:\s*Cascade\)/u);
    expect(schema).toMatch(/model PrivateBetaFeedback[\s\S]*opportunityRecord\s+GeneratedOpportunityRecord\?\s+@relation\([^\n]*onDelete:\s*SetNull\)/u);
  });
});
