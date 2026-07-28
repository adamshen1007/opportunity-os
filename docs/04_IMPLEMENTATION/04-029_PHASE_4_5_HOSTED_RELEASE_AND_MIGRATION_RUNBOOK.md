# 04-029_PHASE_4_5_HOSTED_RELEASE_AND_MIGRATION_RUNBOOK.md

**Document ID:** 04-029  
**Version:** 1.0.0  
**Status:** Active (Operator Verification Required)  
**Owner:** Engineering and Release Operations

# Phase 4.5 Hosted Release And Migration Runbook

## Scope

This runbook closes `TASK-P45-A01` and `TASK-P45-A02`. It verifies one hosted web/API release and the database migration path without starting authentication, ownership, evidence-clustering, or intelligence work.

## Recorded Baseline

- Current migration baseline: `20260728120000_add_user_ownership`
- Migration directories at baseline: six
- New migrations in Slice A1: none
- Later ownership and evidence-cluster migrations must be additive and must build after this baseline.
- Render release promotion runs `migrate deploy` followed by `migrate status`; either failure stops promotion.
- GitHub readiness runs the full migration chain twice against a confirmed-empty PostgreSQL 16 service.

## Hosted Release Record

| Evidence | Current status |
|---|---|
| Canonical API URL | `https://opportunity-os.onrender.com` - reachable over HTTPS and redirects HTTP to HTTPS (verified 2026-07-28) |
| Canonical web URL | `https://opportunity-os-web.vercel.app` - reachable over HTTPS and redirects HTTP to HTTPS (verified 2026-07-28) |
| Web-to-API binding | The deployed Vercel client bundle targets `https://opportunity-os.onrender.com` (verified 2026-07-28) |
| API CORS | The API allows `https://opportunity-os-web.vercel.app` as the exact browser origin (verified 2026-07-28) |
| Shared release commit | **MANUAL ACTION REQUIRED** - deploy this slice to both services, then verify the full commit SHA |
| Hosted fixture browser journey | Passed against the current hosted release on 2026-07-28; repeat after deploying this slice so release identity is also verified |
| Rollback rehearsal | **MANUAL ACTION REQUIRED** - requires Render and Vercel rollback permission |
| Staging migration status | **MANUAL ACTION REQUIRED** - requires the protected staging `DATABASE_URL` |
| Confirmed-empty migration rehearsal | Passed on 2026-07-28 against an isolated disposable PostgreSQL 16 database; all six migrations reached the recorded baseline and repeat deployment was idempotent |
| Backup upgrade rehearsal | **MANUAL ACTION REQUIRED** - requires an isolated restored staging backup |

Do not mark either task externally complete until every applicable item above has dated evidence and an operator name. Public URLs and commit SHAs may be recorded. Secrets, connection strings, invite codes, and tokens must not be recorded.

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

If hosted authentication is enabled, create a temporary invite using the approved operator process, enter it without echo, and run the fixture journey:

```bash
read -s "HOSTED_FIXTURE_INVITE_CODE?Temporary hosted fixture invite: "
echo
export HOSTED_FIXTURE_INVITE_CODE
pnpm --filter @opportunity-os/web test:e2e:hosted
unset HOSTED_FIXTURE_INVITE_CODE
```

If authentication is disabled in the target, omit `HOSTED_FIXTURE_INVITE_CODE`. The journey must visibly select `Fixture fallback`; it must not be represented as a live provider scan.

## Rollback Rehearsal

Before promotion, record the previous known-good commit and deployment identifiers.

1. In Render, open the API service deployment history, select the previous known-good successful deployment, and use the provider rollback/redeploy action.
2. In Vercel, open project deployments, select the matching previous known-good deployment, and promote it to the canonical domain.
3. Run `pnpm verify:hosted-release` with the previous commit SHA.
4. Restore the candidate release only after the rollback verification passes.
5. Record timestamps, operator, old SHA, candidate SHA, and result. Do not record protected configuration.

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

## Decision

`TASK-P45-A01` and `TASK-P45-A02` are repository-ready but externally incomplete until the manual hosted, staging, backup, fixture-browser, and rollback evidence is supplied. Authentication hardening remains **No-Go** until those external checks pass.
