# 04-033_PHASE_4_5_MONITORING_AND_RECOVERY.md

## Purpose

This runbook closes the repository-controlled parts of:

- `TASK-P45-A06` Monitoring And Alerting
- `TASK-P45-A07` Backup And Restore Verification

Opportunity OS uses the existing Vercel, Render, and hosted PostgreSQL capabilities for the design-partner pilot. It does not add a telemetry vendor or expose private operational data.

Repository implementation is complete. Monitoring alert delivery and the isolated restore rehearsal have passed. The production Supabase project has operator-observed automated daily database backups meeting the approved 24-hour RPO. The final `TASK-P45-G01` verifier returns **GO** with all 13 P0 checks passing.

## Safe Operational Surfaces

### `GET /health`

`/health` is a public, secret-safe availability endpoint. It reports:

- API status and environment
- database connectivity
- configured Redis, Stack Exchange, and LLM dependency state
- release identity when configured
- a correlation identifier

It does not return credentials, database URLs, tokens, provider payloads, prompts, stacks, or causes.

### `GET /operations`

`/operations` is an administrator-only aggregate summary. A normal authenticated session is not sufficient.

```sh
read -s "ADMIN_TOKEN?Render API_ADMIN_ACCESS_TOKEN: "
echo

curl --fail-with-body --silent --show-error \
  -H "x-opportunity-os-admin-token: $ADMIN_TOKEN" \
  "https://opportunity-os.onrender.com/operations" \
  | python3 -m json.tool

unset ADMIN_TOKEN
```

The response includes safe request and correlation identifiers plus aggregate:

- request count, status count, maximum latency, and average latency
- scan outcomes
- authentication, database, datasource, LLM, and scan failure counts
- dependency observations
- readiness alerts

Never paste the administrator token into tickets, screenshots, chat, or documentation.

## Alert Matrix

The named pilot operator is `primary-beta-operator`. Replace that label in the hosting consoles with the real operator contact while keeping personal contact details out of the repository.

| Signal | Source | Pilot trigger | Operator action |
| --- | --- | --- | --- |
| Hosted web unavailable | Vercel availability or external HTTPS check | 2 failed checks within 5 minutes | Verify latest Vercel deployment, then roll back if the current release caused the failure. |
| API unavailable | Render health check on `/health` | 2 failed checks within 5 minutes | Inspect the latest Render deploy and safe request logs; roll back when release-related. |
| API 5xx spike | Render HTTP logs/metrics | 3 or more 5xx responses within 5 minutes | Use correlation IDs to group failures; check database and provider dependencies. |
| Database connectivity | `/health` database dependency | 2 degraded checks within 5 minutes | Confirm hosted PostgreSQL status and connection limits; do not redeploy migrations blindly. |
| Authentication failures | Render 401/403 request counts and `/operations` | 5 or more within 5 minutes | Check for an expired invite/session or abuse; revoke affected sessions when needed. |
| Scan failure | `/operations` scan and failure counters | Any failed scan in 15 minutes | Check datasource and LLM dependency states using the scan correlation ID. |
| Live datasource failure | `/operations` datasource failure count | Any new failure in 15 minutes | Check Stack Exchange/Reddit provider status, quota, and rate-limit state. |
| LLM failure | `/operations` LLM failure count | Any new failure in 15 minutes | Check Gemini availability, quota, timeout, and schema-validation failures. |
| Excessive latency | Render latency metrics and `/operations` | Any request above 10 seconds or p95 above 5 seconds for 10 minutes | Identify the slow route and dependency; disable live pilot scans if failures compound. |

The in-process `/operations` counters reset when the API process restarts. Platform request logs and metrics are the durable alert source; `/operations` is a safe diagnostic view.

## Beginner-First Alert Setup

Complete these steps in order:

1. Open the Vercel project for `apps/web`.
2. Open **Settings**, then confirm the production domain is the canonical dashboard URL.
3. Enable Vercel deployment-failure notifications for the named operator.
4. Configure an availability check for the dashboard URL. Use a five-minute interval where the plan permits it.
5. Open the Render service for `opportunity-os-api`.
6. Confirm **Health Check Path** is `/health`.
7. Confirm `OPERATIONS_ALERT_OPERATOR` is set to the named operator label.
8. Enable deploy-failure and service-unavailable notifications for the named operator.
9. Add the API 5xx, latency, and authentication thresholds from the alert matrix using Render metrics/log alerts where the plan supports them.
10. Open the hosted PostgreSQL/Supabase project and enable database health and connection-capacity notifications.
11. Trigger one controlled rehearsal by temporarily requesting a known nonexistent API route. Do not intentionally break the database or production secrets.
12. Confirm the operator receives the expected notification.
13. Record the date, alert name, delivery channel, and redacted screenshot in the private release evidence. Do not record tokens or URLs containing credentials.

## Backup Policy

The pilot uses the hosted PostgreSQL provider's automated backup capability.

Required policy:

- automated backups are enabled
- retention is confirmed in the provider console
- backup access is limited to approved operators
- a manual backup is created before final production migrations
- restore rehearsals target a separate, isolated, non-production database
- restored databases never reuse production API or web credentials

The pilot target is:

- recovery point objective (RPO): no more than 24 hours, subject to the confirmed hosted backup schedule
- recovery time objective (RTO): four hours from incident declaration to a verified restored API

If the hosted plan cannot meet the 24-hour RPO, the pilot is **NO-GO** until the plan or backup process is changed.

## Beginner-First Backup And Restore Rehearsal

### Part 1 - Confirm and capture a backup

1. Open the hosted PostgreSQL/Supabase console.
2. Open the project's **Backups** page.
3. Confirm automated backups are enabled.
4. Record the displayed schedule and retention period in private release evidence.
5. Create an on-demand/manual backup before the final production migration, if the plan supports it.
6. Record only the backup identifier and timestamp. Do not download it to a shared folder.

### Part 2 - Restore in isolation

1. Create a separate non-production database/project named for the restore rehearsal.
2. Restrict its network and console access to approved operators.
3. Restore the selected backup into that isolated database using the provider console.
4. Confirm the restored project is not connected to the production Render or Vercel services.
5. Copy its PostgreSQL connection URL without displaying it in screenshots or shell history.

### Part 3 - Verify the restored database

From the repository root, enter the URL without echoing it:

```sh
read -s "RESTORE_DATABASE_URL?Isolated restored database URL: "
echo
export RESTORE_DATABASE_URL
export RESTORE_DATABASE_CONFIRMED_ISOLATED=true

pnpm verify:restore

unset RESTORE_DATABASE_URL
unset RESTORE_DATABASE_CONFIRMED_ISOLATED
```

The verifier:

- rejects the active `DATABASE_URL`
- requires explicit isolated-database confirmation
- confirms the current migration baseline
- verifies users/invites, sessions, scans, clusters and memberships, opportunities, rankings, and feedback
- checks required relationships for orphaned records
- runs a read-only application smoke transaction
- never prints record contents, counts, credentials, or database addresses

### Part 4 - Application smoke test

1. Deploy a temporary non-production API instance using the restored database URL.
2. Keep production datasource and LLM execution disabled for this temporary instance.
3. Open `/health` and confirm API and database status are healthy.
4. Sign in with an approved restored test invite/session or create a new isolated test invite.
5. List restored scans and open one opportunity, ranking, and evidence view.
6. Submit and delete one newly created test feedback record.
7. Do not change restored historical design-partner records.
8. Delete the temporary service and isolated restore database after evidence is accepted.

## Required Evidence

The convergence gate requires:

- Vercel web availability notification configured
- Render API health and failure notifications configured
- hosted database health notification configured
- one alert-delivery rehearsal received by the named operator
- hosted backup schedule and retention recorded
- manual pre-migration backup identifier and timestamp recorded
- isolated restore identifier recorded
- successful `pnpm verify:restore` output
- successful restored-database API smoke test
- measured restore duration and calculated recovery point

## Current Status

Repository controls: **PASS**

External alert delivery: **PASS - Render failure notification received 2026-07-28**

Alert evidence:

- the named operator received an email from Render's official notification sender
- the message identified a failed deploy for the `opportunity-os` service
- the message referenced the Slice A1 release commit and linked to the corresponding Render deploy logs
- no recipient address, message identifier, token, or credential is recorded in repository evidence

Hosted automated database backup RPO: **PASS - Supabase Pro automated daily backups evidenced 2026-08-11**

Current account-specific evidence:

- production database provider: Supabase PostgreSQL
- safe project label: `opportunity-os`
- environment: `main / PRODUCTION`
- region: `ap-southeast-1`
- PostgreSQL major version: 17
- project status: `ACTIVE_HEALTHY`
- plan observed: `PRO`
- observation time: `2026-08-11T11:30:50+08:00`
- latest visible scheduled backup: `2026-08-10T21:44:25.770Z`
- seven consecutive daily recovery points were visible at `2026-08-10T21:44:25.770Z`, `2026-08-09T21:43:30Z`, `2026-08-08T21:44:19Z`, `2026-08-07T21:44:10Z`, `2026-08-06T21:43:55Z`, `2026-08-05T21:44:24Z`, and `2026-08-04T21:43:35Z`, each with a Restore action

The production Render API is bound through a protected `DATABASE_URL` to the verified `opportunity-os` Supabase project. The protected value is not recorded.

Supabase's current [database-backup documentation](https://supabase.com/docs/guides/platform/backups), [pricing page](https://supabase.com/pricing), and [database-backups feature page](https://supabase.com/features/database-backups) state that Pro projects receive automatic daily database backups with seven days of retention. Supabase's [PITR guidance](https://supabase.com/blog/postgres-point-in-time-recovery) describes daily backups as having a worst-case data-loss window of up to 24 hours. The operator-observed active daily schedule therefore satisfies this runbook's approved database-backup RPO of no more than 24 hours. PITR is not enabled or claimed.

Supabase database backups do not include objects stored through the Storage API. This evidence closes only the PostgreSQL database-backup RPO check; it does not claim file or object-storage recovery.

Manual logical backup: **PASS - 2026-07-29 UTC**

Isolated restore rehearsal: **PASS - 2026-07-29 UTC**

Restore evidence:

- the production PostgreSQL database was captured as a private custom-format logical backup outside the repository with owner and ACL restoration disabled
- the archive structure was validated before restore
- Supabase refused a second active Free project because the organization had reached its active-project limit; no project was paused, deleted, or upgraded
- the backup was restored into an isolated temporary PostgreSQL 18 database that was never connected to Render or Vercel
- `pnpm verify:restore` passed at migration baseline `20260729110000_add_evidence_clusters`
- users/invites, sessions, scans, clusters and memberships, opportunities, rankings, feedback, and relational integrity were verified
- a temporary API runtime reported the restored database dependency as `ok`
- live datasource and live LLM execution remained disabled during the restore smoke test
- the temporary API and restored database were stopped and removed after verification; the private backup was retained with owner-only file permissions

The July 29 restore rehearsal used a manual logical backup, not the managed Supabase daily backup. It remains valid evidence of PostgreSQL restore capability and is separate from the automated-backup RPO evidence.

Design-partner pilot: **GO** on 2026-08-11 after every P0 check in the current Phase 4.5 evidence manifest passed and `pnpm verify:pilot-gate` returned `GO`.

Current recovery status:

- automated database backup RPO: **PASS**
- existing isolated restore rehearsal: **PASS**
- overall Phase 4.5 pilot gate: **GO**
