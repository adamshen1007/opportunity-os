# 04-026_EXTERNAL_USER_LAUNCH.md

**Document ID:** 04-026
**Status:** Active Launch Gate
**Scope:** Phase 4 Milestones 45-51

## Objective

M45-M51 turn the hosted pilot into a controlled external-user product. Fixture mode remains available for demonstrations, while live mode never presents demo output as provider output.

## Completed Milestones

### M45 Production Connectivity

- Explicit comma-separated browser-origin allowlist and credentialed CORS.
- Safe health status for database, Redis, datasource, and LLM configuration.
- Independently deployable web and API services.

### M46 Durable Access

- Invite codes are HMAC hashed rather than stored in plaintext.
- Accepted invites create durable, expiring database sessions.
- Production routes require an active session when `API_AUTH_REQUIRED=true`.
- Invite creation uses the separate `API_ADMIN_ACCESS_TOKEN` gate.
- Production browser sessions use secure, HttpOnly cookies.

### M47 Honest Live Scan UX

- Live failures render an error and do not substitute fixture results.
- Demo data appears only in fixture mode or after the user explicitly selects `Try demo data`.
- Source attribution comes from the returned result.

### M48 Durable Scan Runtime

- Completed results and stages persist in `ScanRunRecord`.
- Results can be restored by ID without repeating provider or LLM calls.
- `GET /scans?limit=5` returns bounded recent history.
- Execution remains synchronous; a queue/worker is deferred until beta load requires it.

### M49 External User Continuity

- The dashboard restores the last persisted scan and lists recent scans.
- Feedback links to generated opportunity records.
- Database-backed invites, sessions, scans, opportunities, rankings, and feedback survive API restarts.

### M50 Trust, Security, And Operations

- API responses use no-store, anti-sniffing, anti-framing, referrer, permissions, and restrictive CSP headers.
- Request bodies are bounded and scan requests rate limited.
- Logs contain correlation metadata, never bodies or credentials.

### M51 Closed Beta Launch Gate

Run:

```bash
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-4-milestone-51
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

## Production Configuration

API: `NODE_ENV=production`, `API_PERSISTENCE_MODE=database`, `API_AUTH_REQUIRED=true`, `API_ADMIN_ACCESS_TOKEN`, `API_LIVE_SCAN_ACCESS_TOKEN`, `DATABASE_URL`, `JWT_SECRET`, `OPPORTUNITY_OS_WEB_ORIGINS`, plus the datasource and LLM variables in `.env.example`.

Web: `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL=https://<production-api-domain>`.

Never commit these values. Rotate any value exposed in screenshots, terminal history, chat, or logs.

## Launch Procedure

1. Apply Prisma migrations to the hosted database.
2. Deploy the API and verify `/health` returns safe status.
3. Deploy the web app with the production API URL.
4. Create one invite through the protected admin route.
5. Accept it at `/access`; refresh and confirm the session remains active.
6. Run a fixture scan and restore it from Recent scans.
7. Run a live Stack Exchange scan and verify attribution, evidence links, and mode.
8. Submit feedback and verify it remains after an API restart.
9. Confirm logs contain correlation IDs but no credentials, prompts, payloads, or stacks.
10. Roll back if health, access, persistence, or attribution fails.

## Go / No-Go

Go only when verification, lint, build, unit tests, browser tests, Docker validation, hosted health, invite access, one live scan, scan restoration, and feedback persistence pass. Secret exposure, fixture/live ambiguity, unapplied migrations, or bypassable access control is an immediate No-Go.

## Remaining Risks

- Synchronous scans may require a durable worker when workloads exceed HTTP timeouts.
- Invite administration is API-only; a complex admin console is deferred.
- Monitoring currently relies on hosting alerts and safe structured logs.
- Reddit live access remains approval-dependent; Stack Exchange is the approved live source.
