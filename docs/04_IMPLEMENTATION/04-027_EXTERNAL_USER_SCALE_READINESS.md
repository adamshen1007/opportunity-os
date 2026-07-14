# 04-027_EXTERNAL_USER_SCALE_READINESS.md

**Status:** Implemented
**Scope:** Phase 4 Milestones 53-57

## Objective

M53-M57 move the closed beta from a single happy path toward a controlled external-user service. They preserve fixture mode and the existing provider pipeline while adding user-controlled sessions, durable scan execution, explicit opportunity trust metadata, deletion controls, and safe operational metrics.

## M53 - External User Access Experience

- `GET /auth/session` lets the dashboard inspect its active HttpOnly-cookie session.
- `POST /auth/logout` revokes the session in memory or PostgreSQL and clears the browser cookie.
- The access page explains the first successful workflow and surfaces safe invite errors.
- The sidebar identifies the active principal, session expiry, and sign-out action. Local fixture mode remains usable when production auth is disabled.

## M54 - Durable Scan Execution

- `POST /scan-jobs` persists a queued job before execution.
- `GET /scan-jobs/:jobId` reports queued, running, completed, failed, or cancelled state and returns the completed result when ready.
- Cancel and retry actions are available for eligible jobs.
- Interrupted queued/running records are recovered when the API process starts.
- The browser polls durable status and stores the active job identifier so a reload can resume progress.
- Job records contain only validated scan input and safe state messages. Credentials and provider payloads are never persisted.

## M55 - Opportunity Quality And Trust

- Source records without stable IDs, meaningful titles, or safe source links are rejected before analysis.
- Duplicate source records are removed before normalization and LLM analysis.
- Each opportunity reports its evidence count, confidence band, deterministic ranking factors, and human-review limitations.
- Confidence is a prioritization signal, not a claim of market size, feasibility, or guaranteed commercial value.

## M56 - Privacy And Data Controls

- `DELETE /scans/:scanId` removes the scan plus linked raw, normalized, analysis, candidate, generated, and ranking records.
- `DELETE /feedback/:feedbackId` removes validation feedback.
- `/privacy` explains retained data, prohibited stored values, session revocation, and deletion controls.
- Scan history exposes a delete action. Account-level ownership remains a closed-beta constraint; access continues to require the shared invite workspace boundary.

## M57 - Production Observability

- `GET /operations` exposes an authenticated safe summary of request totals, response classes, latency, scan transitions, and readiness messages.
- Metrics are process-local and reset on deployment. Hosting metrics remain the durable source for long-term alerting.
- Suggested alerts: any server error, any failed scan, or a request above ten seconds.
- Operational metrics never include request bodies, headers, credentials, prompts, or provider payloads.

## Verification

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-4-milestone-57
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

## Deployment Notes

1. Apply existing Prisma migrations before deploying the API.
2. Deploy the API, then confirm `/health` is healthy.
3. Sign in with a test invite and confirm `/auth/session` returns the active principal.
4. Queue one fixture scan and one controlled live Stack Exchange scan; reload during execution and confirm status resumes.
5. Inspect trust details, delete a test scan, submit/delete test feedback, and sign out.
6. Review `/operations` and hosting logs. Roll back if session revocation, durable scan recovery, deletion, or secret-safety fails.

## Remaining Constraints

- Scan execution is durable across process restarts but runs inside the API process. Horizontal execution and high-volume workloads require a separate future execution service.
- Metrics are process-local and are not a replacement for hosted log retention and alerts.
- Closed-beta users share a research workspace; per-user scan ownership should precede broad self-service registration.
