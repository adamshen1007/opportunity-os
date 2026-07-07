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

  it("keeps Private Beta persistence limited to invites and sessions", () => {
    const migration = fs.readFileSync(
      path.join(import.meta.dirname, "../../prisma/migrations/20260704000000_private_beta_invites_sessions/migration.sql"),
      "utf8"
    );

    expect(migration).toMatch(/\bCREATE\s+TABLE\s+"private_beta_invites"/iu);
    expect(migration).toMatch(/\bCREATE\s+TABLE\s+"private_beta_sessions"/iu);
    expect(migration).toContain('"inviteCodeHash"');
    expect(migration).not.toContain('"inviteCode"');
    expect(migration).not.toMatch(/\btenant\b/iu);
    expect(migration).not.toMatch(/\bbilling\b/iu);
    expect(migration).not.toMatch(/\bsubscription\b/iu);
  });

  it("keeps beta feedback persistence limited to validation feedback and bug reports", () => {
    const migration = fs.readFileSync(
      path.join(import.meta.dirname, "../../prisma/migrations/20260704010000_private_beta_feedback_bug_reports/migration.sql"),
      "utf8"
    );

    expect(migration).toMatch(/\bCREATE\s+TABLE\s+"private_beta_feedback"/iu);
    expect(migration).toMatch(/\bCREATE\s+TABLE\s+"private_beta_bug_reports"/iu);
    expect(migration).toContain('"reasonCategories" JSONB');
    expect(migration).toContain('"ratings" JSONB');
    expect(migration).toContain('"safeDescription" TEXT');
    expect(migration).not.toMatch(/\btenant\b/iu);
    expect(migration).not.toMatch(/\bbilling\b/iu);
    expect(migration).not.toMatch(/\bsubscription\b/iu);
  });

  it("adds durable MVP product data tables without provider ingestion or execution tables", () => {
    const migration = fs.readFileSync(
      path.join(import.meta.dirname, "../../prisma/migrations/20260705000000_product_data_schema/migration.sql"),
      "utf8"
    );

    for (const tableName of [
      "raw_source_content",
      "normalized_content",
      "analysis_results",
      "candidate_opportunity_records",
      "generated_opportunity_records",
      "opportunity_ranking_results",
      "opportunity_ranking_items"
    ]) {
      expect(migration).toMatch(new RegExp(`\\bCREATE\\s+TABLE\\s+"${tableName}"`, "iu"));
    }

    expect(migration).toContain('"opportunityRecordId" TEXT');
    expect(migration).toContain('"private_beta_feedback_opportunityRecordId_fkey"');
    expect(migration).not.toMatch(/\bprovider_payload\b/iu);
    expect(migration).not.toMatch(/\braw_provider_response\b/iu);
    expect(migration).not.toMatch(/\bingestion_run\b/iu);
    expect(migration).not.toMatch(/\bworkflow_run\b/iu);
    expect(migration).not.toMatch(/\bscheduler\b/iu);
    expect(migration).not.toMatch(/\bworker\b/iu);
  });

  it("adds scan run persistence without unsafe provider payload storage", () => {
    const migration = fs.readFileSync(
      path.join(import.meta.dirname, "../../prisma/migrations/20260707010000_scan_run_records/migration.sql"),
      "utf8"
    );

    expect(migration).toMatch(/\bCREATE\s+TABLE\s+"scan_run_records"/iu);
    expect(migration).toContain('"source" JSONB');
    expect(migration).toContain('"stages" JSONB');
    expect(migration).toContain('"safeMetadata" JSONB');
    expect(migration).not.toMatch(/\bprovider_payload\b/iu);
    expect(migration).not.toMatch(/\braw_provider_response\b/iu);
    expect(migration).not.toMatch(/\bauth/i);
    expect(migration).not.toMatch(/\bsecret\b/iu);
  });
});
