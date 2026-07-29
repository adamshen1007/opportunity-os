import process from "node:process";
import pg from "pg";

const { Pool } = pg;
const CURRENT_MIGRATION_BASELINE = "20260729110000_add_evidence_clusters";

const REQUIRED_DATA_FAMILIES = Object.freeze({
  users: ["private_beta_invites"],
  sessions: ["private_beta_sessions"],
  scans: ["scan_run_records"],
  clusters: ["evidence_clusters", "evidence_cluster_memberships"],
  opportunities: ["candidate_opportunity_records", "generated_opportunity_records"],
  rankings: ["opportunity_ranking_results", "opportunity_ranking_items"],
  feedback: ["private_beta_feedback"]
});

const ORPHAN_AUDITS = Object.freeze([
  {
    name: "session-invite",
    sql: `SELECT COUNT(*)::bigint AS count
          FROM private_beta_sessions child
          LEFT JOIN private_beta_invites parent ON parent.id = child."inviteId"
          WHERE parent.id IS NULL`
  },
  {
    name: "raw-scan",
    sql: `SELECT COUNT(*)::bigint AS count
          FROM raw_source_content child
          LEFT JOIN scan_run_records parent ON parent.id = child."scanId"
          WHERE parent.id IS NULL`
  },
  {
    name: "cluster-scan",
    sql: `SELECT COUNT(*)::bigint AS count
          FROM evidence_clusters child
          LEFT JOIN scan_run_records parent ON parent.id = child."scanId"
          WHERE parent.id IS NULL`
  },
  {
    name: "cluster-membership",
    sql: `SELECT COUNT(*)::bigint AS count
          FROM evidence_cluster_memberships membership
          LEFT JOIN evidence_clusters cluster ON cluster.id = membership."clusterId"
          LEFT JOIN raw_source_content raw ON raw.id = membership."rawSourceContentId"
          LEFT JOIN normalized_content normalized ON normalized.id = membership."normalizedContentId"
          WHERE cluster.id IS NULL OR raw.id IS NULL OR normalized.id IS NULL`
  },
  {
    name: "ranking-scan",
    sql: `SELECT COUNT(*)::bigint AS count
          FROM opportunity_ranking_results child
          LEFT JOIN scan_run_records parent ON parent.id = child."scanId"
          WHERE parent.id IS NULL`
  },
  {
    name: "ranking-item",
    sql: `SELECT COUNT(*)::bigint AS count
          FROM opportunity_ranking_items item
          LEFT JOIN opportunity_ranking_results ranking ON ranking.id = item."rankingResultId"
          LEFT JOIN generated_opportunity_records opportunity ON opportunity.id = item."generatedOpportunityId"
          WHERE ranking.id IS NULL OR opportunity.id IS NULL`
  }
]);

async function main() {
  let pool;
  try {
    const databaseUrl = readRestoreTarget();
    pool = new Pool({
      connectionString: databaseUrl,
      max: 1,
      connectionTimeoutMillis: 10_000,
      statement_timeout: 15_000
    });

    const tableNames = await readTableNames(pool);
    assertRequiredFamilies(tableNames);
    await assertMigrationBaseline(pool);
    await assertNoOrphans(pool);
    await runApplicationReadSmoke(pool);

    console.log(JSON.stringify({
      status: "passed",
      target: "isolated-restore",
      migrationBaseline: CURRENT_MIGRATION_BASELINE,
      dataFamilies: Object.fromEntries(Object.keys(REQUIRED_DATA_FAMILIES).map((family) => [family, "verified"])),
      relationalIntegrity: "verified",
      applicationReadSmoke: "verified",
      connectionDetailsPrinted: false
    }, null, 2));
  } catch {
    console.error("Restore verification failed safely. Review the protected operator log.");
    process.exitCode = 1;
  } finally {
    await pool?.end().catch(() => undefined);
  }
}

function readRestoreTarget() {
  const value = process.env.RESTORE_DATABASE_URL?.trim();
  if (!value) throw new Error("Missing restore target.");
  if (process.env.RESTORE_DATABASE_CONFIRMED_ISOLATED !== "true") {
    throw new Error("Restore target is not confirmed isolated.");
  }
  if (process.env.DATABASE_URL?.trim() === value) {
    throw new Error("Restore target must not be the active application database.");
  }
  const parsed = new URL(value);
  if (!new Set(["postgres:", "postgresql:"]).has(parsed.protocol)) {
    throw new Error("Restore target must use PostgreSQL.");
  }
  return value;
}

async function readTableNames(pool) {
  const result = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
  );
  return new Set(result.rows.map((row) => String(row.table_name)));
}

function assertRequiredFamilies(tableNames) {
  for (const tables of Object.values(REQUIRED_DATA_FAMILIES)) {
    for (const table of tables) {
      if (!tableNames.has(table)) throw new Error("Required restored table is unavailable.");
    }
  }
}

async function assertMigrationBaseline(pool) {
  const result = await pool.query(
    'SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = $1 AND "finished_at" IS NOT NULL AND "rolled_back_at" IS NULL',
    [CURRENT_MIGRATION_BASELINE]
  );
  if (result.rowCount !== 1) throw new Error("Restore has not reached the approved migration baseline.");
}

async function assertNoOrphans(pool) {
  for (const audit of ORPHAN_AUDITS) {
    const result = await pool.query(audit.sql);
    if (BigInt(result.rows[0]?.count ?? 0) !== 0n) {
      throw new Error(`Restore integrity audit failed: ${audit.name}.`);
    }
  }
}

async function runApplicationReadSmoke(pool) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
    await client.query(
      `SELECT session.id
       FROM private_beta_sessions session
       JOIN private_beta_invites invite ON invite.id = session."inviteId"
       ORDER BY session."createdAt" DESC
       LIMIT 1`
    );
    await client.query(
      `SELECT scan.id
       FROM scan_run_records scan
       LEFT JOIN evidence_clusters cluster ON cluster."scanId" = scan.id
       LEFT JOIN opportunity_ranking_results ranking ON ranking."scanId" = scan.id
       ORDER BY scan."createdAt" DESC
       LIMIT 1`
    );
    await client.query(
      `SELECT opportunity.id
       FROM generated_opportunity_records opportunity
       LEFT JOIN opportunity_ranking_items item ON item."generatedOpportunityId" = opportunity.id
       LEFT JOIN private_beta_feedback feedback ON feedback."opportunityRecordId" = opportunity.id
       ORDER BY opportunity."createdAt" DESC
       LIMIT 1`
    );
    await client.query("ROLLBACK");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

await main();
