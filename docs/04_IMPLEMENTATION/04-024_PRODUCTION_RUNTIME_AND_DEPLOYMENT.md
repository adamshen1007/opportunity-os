# 04-024_PRODUCTION_RUNTIME_AND_DEPLOYMENT.md

**Document ID:** 04-024
**Status:** Implemented
**Scope:** Phase 4 Milestones 40-43

## Objective

Turn the verified multi-source MVP into an explicitly configured hosted runtime. Production uses PostgreSQL persistence, a restricted dashboard origin, a private live-scan access code, bounded requests, rate controls, safe operational logs, health checks, and host-managed secrets.

## Runtime Modes

- `API_PERSISTENCE_MODE=memory` is the local and deterministic-test default.
- `API_PERSISTENCE_MODE=database` requires `DATABASE_URL`, connects Prisma during startup, persists scan and feedback records, probes database health, and disconnects on `SIGTERM` or `SIGINT`.
- Live scans can require `API_LIVE_SCAN_ACCESS_TOKEN`; the value belongs only in API secret storage and is never logged.
- Production CORS allows `OPPORTUNITY_OS_WEB_URL`. Local development may omit it and use the permissive local default.

## Deployment Assets

- `render.yaml` defines the API build, migration pre-deploy command, start command, health check, and protected environment contract. Automatic deployment remains disabled until an operator completes the checklist.
- `apps/web/vercel.json` defines the Vercel monorepo install and dashboard build commands.
- `scripts/verify-external-mvp.mjs` verifies hosted health, dashboard availability, and a fixture or explicitly enabled live scan without printing secrets or raw provider output.

## Beginner-First Release Sequence

1. Rotate any credential previously shown outside protected secret storage.
2. Run the full local repository gate.
3. Apply Prisma migrations to a non-production staging database.
4. Create the Render API from `render.yaml`; enter every `sync: false` value in Render, never in Git.
5. Verify `/health` before enabling live providers.
6. Create the Vercel project with root directory `apps/web`; configure `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL`.
7. Set the final Vercel URL as `OPPORTUNITY_OS_WEB_URL` on Render and redeploy the API.
8. Run `pnpm smoke:external` in fixture mode.
9. Enable Stack Exchange and one LLM provider, then run the live smoke check.
10. Invite pilot users only after health, persistence, refresh, feedback, and rollback checks pass.

## Operations

API completion logs include timestamp, service, severity, event name, method, route path, status, duration, and correlation ID. They intentionally exclude request bodies, headers, credentials, prompts, provider payloads, database URLs, stacks, and causes.

Monitor API and dashboard uptime, `/health`, request errors and latency, scan completion and duration, provider failure categories, PostgreSQL capacity, and backup status.

## Backup And Rollback

Before each release, confirm a current PostgreSQL backup and record the previous healthy API and web deployment identifiers. Roll back application deployments before attempting a database rollback. Database schema rollback requires a reviewed forward-fix migration unless a tested restore is explicitly approved.

## Verification

```sh
node scripts/verify-repository.mjs --phase phase-4-milestone-44
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

External smoke, after hosted URLs are configured:

```sh
OPPORTUNITY_OS_API_URL=https://api.example.com \
OPPORTUNITY_OS_WEB_URL=https://app.example.com \
pnpm smoke:external
```
