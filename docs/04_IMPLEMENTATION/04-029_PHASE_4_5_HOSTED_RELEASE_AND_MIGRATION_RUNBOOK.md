# 04-029_PHASE_4_5_HOSTED_RELEASE_AND_MIGRATION_RUNBOOK.md

**Document ID:** 04-029  
**Version:** 1.0.0  
**Status:** Active (Operator Verification Required)  
**Owner:** Engineering and Release Operations

# Phase 4.5 Hosted Release And Migration Runbook

## Scope

This runbook closes `TASK-P45-A01` and `TASK-P45-A02`. It verifies one hosted web/API release and the database migration path without starting authentication, ownership, evidence-clustering, or intelligence work.

## Recorded Baseline

- Current Phase 4.5 migration baseline: `20260729110000_add_evidence_clusters`
- Migration directories at baseline: ten
- New migrations in Slice A1: none
- Slice A1 originally verified six migrations through `20260712000000_persist_scan_result`; authentication, ownership, raw-source uniqueness, and evidence-cluster migrations were added later without modifying the verified history.
- Render release promotion runs `migrate deploy` followed by `migrate status`; either failure stops promotion.
- GitHub readiness runs the full migration chain twice against a confirmed-empty PostgreSQL 16 service.
- On 2026-08-11, the production Render API moved from Free to Starter so the service can execute the approved pre-deploy promotion guard.

## Hosted Release Record

| Evidence | Current status |
|---|---|
| Canonical API URL | `https://opportunity-os.onrender.com` - reachable over HTTPS and redirects HTTP to HTTPS (verified 2026-07-28) |
| Canonical web URL | `https://opportunity-os-web.vercel.app` - reachable over HTTPS and redirects HTTP to HTTPS (verified 2026-07-28) |
| Web-to-API binding | The deployed Vercel client bundle targets `https://opportunity-os.onrender.com` (verified 2026-07-28) |
| API CORS | The API allows `https://opportunity-os-web.vercel.app` as the exact browser origin (verified 2026-07-28) |
| Shared release commit | Passed on 2026-08-11 at `33b7f134dc69ee7565ad2260baed9a8f208e5f4f`; the hosted verifier confirmed API health, database readiness, CORS, redirects, web/API binding, and exact API/web commit identity |
| Hosted fixture browser journey | Passed on 2026-08-11 against matched candidate `33b7f134dc69ee7565ad2260baed9a8f208e5f4f`; the browser visibly reported fixture fallback |
| Hosted two-user journey | Passed on 2026-08-11 against the matched candidate with separate sessions, owner-scoped resource denial, transactional deletion, stale-resource denial, and logout |
| Rollback rehearsal | Passed on 2026-08-11 by switching both canonical origins from candidate `33b7f134dc69ee7565ad2260baed9a8f208e5f4f` to previous known-good `7489189ec9afa2600a1d05cd428388c362f357ae`, verifying the matched rollback, restoring the candidate, and verifying the matched candidate again |
| Staging migration status | Passed on 2026-08-11 against a separate isolated Supabase project at baseline `20260729110000_add_evidence_clusters`; connection details were not printed |
| Confirmed-empty migration rehearsal | Passed on 2026-08-11 for the final ten-migration Phase 4.5 baseline, including repeat deployment for idempotency |
| Backup upgrade rehearsal | Passed on 2026-08-11 by restoring a migration-9 public-schema backup with representative synthetic data into isolated PostgreSQL 17 and applying migration 10 without table or count regression |
| Failed and partial migration recovery | Passed on 2026-08-11 in an isolated non-production Render service and staging database; failed candidates did not promote, targeted recovery succeeded, and production remained unchanged |

Do not mark a task externally complete until every item above that applies to that task has dated evidence and an operator name. Public URLs and commit SHAs may be recorded. Secrets, connection strings, invite codes, and tokens must not be recorded.

## A01 Hosted Release Verification

1. Deploy the same full Git commit to Render and Vercel.
2. In Vercel, set `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL` to the canonical Render API origin and redeploy.
3. In Render, set `OPPORTUNITY_OS_WEB_URL` or `OPPORTUNITY_OS_WEB_ORIGINS` to the canonical Vercel origin.
4. Record the canonical HTTPS origins as protected GitHub environment variables, not secrets.
5. Export the public origins and expected full SHA in an operator terminal:

```bash
export OPPORTUNITY_OS_API_URL="https://opportunity-os.onrender.com"
export OPPORTUNITY_OS_WEB_URL="https://opportunity-os-web.vercel.app"
export OPPORTUNITY_OS_RELEASE_SHA="0123456789abcdef0123456789abcdef01234567"
pnpm verify:hosted-release
```

The verifier confirms HTTPS, same-origin redirects, API health, database readiness, exact CORS origin, web-to-API binding, and matching API/web commit identity. It never prints protected values.

On 2026-08-11, the authorized repository operator deployed the `main` candidate to Render and ran the verifier against the canonical public origins. It returned `status: passed` for full release SHA `33b7f134dc69ee7565ad2260baed9a8f208e5f4f`, API health, database readiness, CORS, redirects, and web/API binding. No protected values were recorded.

If hosted authentication is enabled, create a temporary invite using the approved operator process, enter it without echo, and run the fixture journey:

```bash
read -s "HOSTED_FIXTURE_INVITE_CODE?Temporary hosted fixture invite: "
echo
export HOSTED_FIXTURE_INVITE_CODE
pnpm --filter @opportunity-os/web test:e2e:hosted
unset HOSTED_FIXTURE_INVITE_CODE
```

If authentication is disabled in the target, omit `HOSTED_FIXTURE_INVITE_CODE`. The journey must visibly select `Fixture fallback`; it must not be represented as a live provider scan.

On 2026-08-11, a fresh protected invite completed this hosted fixture journey against the matched candidate. The browser visibly reported fixture fallback, and the hosted Playwright run passed without exposing the invite code.

Two additional fresh invites then completed separate hosted user journeys on the same candidate release. One journey used explicit Stack Exchange fixture mode and the other used the already approved controlled Stack Exchange live path. Each user completed login, scan, results, evidence, ranking, feedback, transactional deletion, stale-resource checks, and logout. Unique scan, opportunity, and feedback identifiers were denied bidirectionally. The shared public ranking identifier resolved only through each caller's owned scans: each user saw only their own ranked opportunities, deletion removed only the deleting user's ranking view, and the other user's ranking remained intact until its own deletion. This evidence does not claim Reddit live readiness. No invite, session, access, or personal values were recorded.

## Rollback Rehearsal

Before promotion, record the previous known-good commit and deployment identifiers.

1. In Render, open the API service deployment history, select the previous known-good successful deployment, and use the provider rollback/redeploy action.
2. In Vercel, open project deployments, select the matching previous known-good deployment, and promote it to the canonical domain.
3. Run `pnpm verify:hosted-release` with the previous commit SHA.
4. Restore the candidate release only after the rollback verification passes.
5. Record timestamps, operator, old SHA, candidate SHA, and result. Do not record protected configuration.

On 2026-08-11, the authorized repository operator used Render's specific-commit deployment action and Vercel's promotion action to switch both canonical origins from candidate `33b7f134dc69ee7565ad2260baed9a8f208e5f4f` to previous known-good `7489189ec9afa2600a1d05cd428388c362f357ae`. The hosted-release verifier passed at the previous SHA with API health, database readiness, CORS, redirects, web/API binding, and exact API/web release identity. The operator then restored the candidate on both providers; Render completed its migration pre-deploy guard before promotion, and the same verifier passed again at the full candidate SHA. No protected configuration was recorded.

## A02 Database Migration Verification

Validate the repository schema first:

```bash
pnpm --filter @opportunity-os/database prisma validate
```

### Staging status

Enter the staging URL without terminal echo:

```bash
read -s "DATABASE_URL?Protected staging database URL: "
echo
export DATABASE_URL
pnpm --filter @opportunity-os/database verify:migrations:staging
unset DATABASE_URL
```

This mode is read-only: it validates the schema, checks migration status, and confirms the recorded baseline is applied.

On 2026-08-11, the operator authorized a temporary Supabase branch at the provider-displayed hourly rate. The provider reported `MIGRATIONS_FAILED` while creating the branch from its own migration history. The failed branch was deleted immediately, production was not modified, and only the production `main` project remained. This attempt is not passing staging evidence. The repository uses Prisma migration directories and does not contain a Supabase migration directory that could be safely replayed as a branch substitute.

The operator then created a separate isolated Supabase project with an empty public schema. Migrations one through nine were applied from an untracked temporary migration bundle, representative synthetic relational data was inserted, and migration ten was applied only after the restored-backup rehearsal passed. The exact `verify:migrations:staging` retry returned `status: passed`, `mode: staging`, baseline `20260729110000_add_evidence_clusters`, and `connectionDetailsPrinted: false`. A transient provider connection failure on the first verifier attempt cleared before the passing retry and did not alter the migration baseline.

### Confirmed-empty rehearsal

Use a disposable empty PostgreSQL database that is not staging or production:

```bash
read -s "MIGRATION_CLEAN_DATABASE_URL?Disposable empty database URL: "
echo
export MIGRATION_CLEAN_DATABASE_URL
export MIGRATION_CLEAN_DATABASE_CONFIRMED_EMPTY=true
pnpm --filter @opportunity-os/database verify:migrations:clean
unset MIGRATION_CLEAN_DATABASE_URL MIGRATION_CLEAN_DATABASE_CONFIRMED_EMPTY
```

The verifier refuses a non-empty target, applies migrations only, verifies the baseline, repeats deployment to prove idempotency, and does not print the URL.

On 2026-08-11, the authorized repository operator ran this verifier against a confirmed-empty disposable local PostgreSQL 16 database. It returned `status: passed`, `mode: clean`, baseline `20260729110000_add_evidence_clusters`, and `connectionDetailsPrinted: false`. The disposable database was removed after the rehearsal.

### Restored-backup upgrade rehearsal

Restore a recent staging backup into an isolated database first. Never point this command at the active production database.

```bash
read -s "MIGRATION_BACKUP_DATABASE_URL?Isolated restored-backup database URL: "
echo
export MIGRATION_BACKUP_DATABASE_URL
export MIGRATION_BACKUP_DATABASE_CONFIRMED_SAFE=true
pnpm --filter @opportunity-os/database verify:migrations:backup
unset MIGRATION_BACKUP_DATABASE_URL MIGRATION_BACKUP_DATABASE_CONFIRMED_SAFE
```

The verifier records pre-upgrade table counts in memory, applies migrations, verifies the baseline, and fails if an existing table disappears or its record count decreases. It does not print row counts or connection details.

On 2026-08-11, the authorized repository operator captured a private PostgreSQL 17 public-schema backup from the isolated staging project after migrations one through nine and deterministic synthetic relational seeding. The backup was restored into a fresh isolated PostgreSQL 17 database. This verifier returned `status: passed`, `mode: backup`, baseline `20260729110000_add_evidence_clusters`, and `connectionDetailsPrinted: false`; every pre-existing table remained present with no lower record count. The disposable restore database was removed after independent review accepted the evidence.

### Controlled failure and partial-state recovery rehearsals

On 2026-08-11, an isolated non-production Render service using an isolated staging database ran two temporary Prisma migrations outside tracked repository paths. The first deliberately failed before applying schema steps and proved failed-migration detection, promotion blocking, Prisma ledger resolution, and return to the committed baseline. The second deliberately failed after committing one synthetic rehearsal table and row, leaving an observed durable partial state. Render stopped pre-deploy before promotion in both cases, and the previously promoted temporary service remained available.

For the partial-state recovery, the operator removed only the named rehearsal table, marked only the temporary failed migration rolled back, deleted the temporary fixture, and verified the committed migration set current at `20260729110000_add_evidence_clusters`. A subsequent normal Render pre-deploy completed and promoted the recovered temporary service. Canonical production hosted-release verification passed unchanged at full SHA `33b7f134dc69ee7565ad2260baed9a8f208e5f4f` before and after the rehearsal. No protected connection details or production data were recorded.

## Decision

The shared hosted release, fresh hosted fixture and two-user journeys, matched-release rollback and restoration, final ten-migration clean/idempotency rehearsal, protected staging verification, restored-backup upgrade, controlled failed-migration non-promotion, and durable partial-state recovery rehearsal pass. On 2026-08-11, production Render Starter ran the configured `migrate deploy` and `migrate status` pre-deploy command, found all ten migrations current, completed the gate, and only then promoted the API. `TASK-P45-A01` and `TASK-P45-A02` are externally complete. The final fail-closed pilot verifier returned `GO` with all 13 P0 checks passing.
