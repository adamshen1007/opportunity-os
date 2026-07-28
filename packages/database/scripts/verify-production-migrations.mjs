import { spawnSync } from "node:child_process";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;
const CURRENT_MIGRATION_BASELINE = "20260712000000_persist_scan_result";

async function main() {
  let pool;
  try {
    const mode = process.argv[2];
    if (!new Set(["staging", "clean", "backup"]).has(mode)) {
      throw new Error("Choose one migration verification mode: staging, clean, or backup.");
    }

    const target = readTarget(mode);
    pool = new Pool({ connectionString: target, max: 1 });
    if (mode === "clean") await assertCleanTarget(pool);
    const before = mode === "backup" ? await readTableCounts(pool) : undefined;

    runPrisma(["validate"], target);
    if (mode !== "staging") runPrisma(["migrate", "deploy"], target);
    runPrisma(["migrate", "status"], target);
    await assertMigrationBaseline(pool);

    if (mode === "clean") {
      runPrisma(["migrate", "deploy"], target);
      await assertSchemaCreated(pool);
    }
    if (mode === "backup" && before) {
      const after = await readTableCounts(pool);
      assertNoDataLoss(before, after);
    }

    console.log(JSON.stringify({
      status: "passed",
      mode,
      migrationBaseline: CURRENT_MIGRATION_BASELINE,
      connectionDetailsPrinted: false
    }, null, 2));
  } catch (error) {
    console.error(`Migration verification failed: ${error instanceof Error ? error.message : "Unknown safe failure."}`);
    process.exitCode = 1;
  } finally {
    await pool?.end().catch(() => undefined);
  }
}

function readTarget(mode) {
  const configuration = {
    staging: ["DATABASE_URL", undefined],
    clean: ["MIGRATION_CLEAN_DATABASE_URL", "MIGRATION_CLEAN_DATABASE_CONFIRMED_EMPTY"],
    backup: ["MIGRATION_BACKUP_DATABASE_URL", "MIGRATION_BACKUP_DATABASE_CONFIRMED_SAFE"]
  }[mode];
  const [urlName, confirmationName] = configuration;
  const value = process.env[urlName]?.trim();
  if (!value) throw new Error(`Set ${urlName} in protected environment storage.`);
  if (confirmationName && process.env[confirmationName] !== "true") {
    throw new Error(`Set ${confirmationName}=true only after confirming the target is isolated and safe.`);
  }
  if (mode !== "staging" && process.env.DATABASE_URL && value === process.env.DATABASE_URL.trim()) {
    throw new Error("Migration rehearsal target must not be the configured staging or production database.");
  }
  try {
    const url = new URL(value);
    if (!new Set(["postgres:", "postgresql:"]).has(url.protocol)) throw new Error();
  } catch {
    throw new Error(`${urlName} must be a valid PostgreSQL URL.`);
  }
  return value;
}

function runPrisma(args, databaseUrl) {
  const result = spawnSync("pnpm", ["exec", "prisma", "--config=./prisma.config.ts", ...args], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    throw new Error(`Prisma ${args.join(" ")} failed. Review the protected deployment log.`);
  }
}

async function assertCleanTarget(pool) {
  const tables = await readPublicTables(pool);
  if (tables.length !== 0) throw new Error("Clean migration target already contains public tables.");
}

async function assertSchemaCreated(pool) {
  const tables = await readPublicTables(pool);
  if (tables.length < 2) throw new Error("Clean migration rehearsal did not create the expected schema.");
}

async function assertMigrationBaseline(pool) {
  const result = await pool.query(
    'SELECT "migration_name" FROM "_prisma_migrations" WHERE "finished_at" IS NOT NULL AND "rolled_back_at" IS NULL'
  );
  if (!result.rows.some((row) => row.migration_name === CURRENT_MIGRATION_BASELINE)) {
    throw new Error("Database has not reached the recorded Phase 4.5 migration baseline.");
  }
}

async function readPublicTables(pool) {
  const result = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name"
  );
  return result.rows.map((row) => String(row.table_name));
}

async function readTableCounts(pool) {
  const counts = new Map();
  for (const table of await readPublicTables(pool)) {
    if (table === "_prisma_migrations") continue;
    const safeIdentifier = `"${table.replaceAll('"', '""')}"`;
    const result = await pool.query(`SELECT COUNT(*)::bigint AS count FROM ${safeIdentifier}`);
    counts.set(table, BigInt(result.rows[0]?.count ?? 0));
  }
  return counts;
}

function assertNoDataLoss(before, after) {
  for (const [table, count] of before) {
    const upgradedCount = after.get(table);
    if (upgradedCount === undefined || upgradedCount < count) {
      throw new Error("Backup upgrade rehearsal detected a missing table or reduced record count.");
    }
  }
}

await main();
