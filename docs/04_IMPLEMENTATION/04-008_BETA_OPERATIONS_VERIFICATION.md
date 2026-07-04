# 04-008_BETA_OPERATIONS_VERIFICATION.md

**Document ID:** 04-008
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Beta Operations Verification

## Purpose

Phase 3 Milestone 30 Slice B defines the operations verification procedures for the first 10-20 design partners.

This document is operations-only. It verifies deployment, smoke testing, rollback, monitoring, health, and logs without adding new backend features, AI features, payments, CRM integrations, notifications, analytics platforms, mobile apps, schedulers, workers, new APIs, new dashboard features, new persistence features, or new authentication features.

## Deployment Verification

Before a beta release is considered deployable, the release owner verifies:

- the release commit is present on `main`
- the release tag or launch note points to the intended commit
- `node scripts/verify-repository.mjs --phase phase-3-milestone-30` passes
- `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, and `pnpm test` pass
- `docker compose config` passes
- the Private Beta deployment workflow references the protected `private-beta` environment
- production configuration is bound through protected environment values
- no deployment artifact includes `.env`, database dumps, participant exports, screenshots with secrets, or unredacted logs

The deployment operator records the release commit, workflow run, deployment target, deployment time, and verifier initials in launch notes using safe identifiers only.

## Deployment Smoke Testing

After deployment, the operator runs smoke checks before inviting or re-inviting design partners:

1. Open the protected dashboard entry point.
2. Confirm the dashboard shell renders without unsafe error output.
3. Confirm the API health endpoint returns a safe healthy response.
4. Confirm an invite-only test flow can reach the dashboard.
5. Confirm a test opportunity list is visible.
6. Confirm an opportunity detail view renders ranking, confidence, evidence, and provenance fields.
7. Confirm save, dismiss, rating, feedback, and bug-report paths return safe responses.
8. Confirm empty and error states remain actionable and secret-safe.

Smoke checks must use test invite data and deterministic beta fixtures. They must not use real customer secrets, provider payloads, raw prompts, production exports, or unsupported admin paths.

## Rollback Verification

Before launch, the operations owner verifies rollback readiness:

- the last known good release commit is identified
- the rollback owner is assigned
- rollback triggers are documented in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`
- the deployment platform can re-promote the last known good release
- database compatibility is reviewed for the release
- write paths can be paused if data safety is at risk
- rollback communication uses safe issue summaries and avoids participant-sensitive data

After a rollback rehearsal or real rollback, the operator repeats deployment smoke testing and records the result.

## Monitoring Verification

Monitoring verification confirms that the beta can be operated without adding a vendor-specific analytics platform in this slice.

Operators verify visibility into:

- deployment success and failure
- API health status
- dashboard load failures
- invite acceptance failures by safe reason code
- session lookup failures by safe reason code
- feedback failures by safe error code
- bug report failures by safe error code
- request latency
- structured error counts
- database availability
- backup completion status

Monitoring notes must use safe codes, timestamps, correlation IDs, request IDs, and component names. They must not include secrets, tokens, auth headers, database URLs, provider keys, raw payloads, stack traces, raw causes, participant private details, or raw dependency internals.

## Health Verification

Health verification uses existing boundaries:

- Docker Compose service health for local infrastructure
- `apps/api` health endpoint for API readiness
- dashboard smoke checks for web readiness
- database availability checks through the approved operations process
- backup completion checks through the approved hosting provider

Health status must be classified as:

- `healthy`: all required beta checks pass
- `degraded`: beta can continue with a documented limitation
- `unhealthy`: beta launch or continued use is blocked

Unhealthy status requires either rollback or a documented release-owner waiver before design partners continue using the product.

## Log Verification

Log verification confirms that beta operations can diagnose issues safely.

Required log properties:

- timestamp
- service
- environment
- severity
- correlationId
- requestId when available
- eventName
- safe message

Operators verify that logs do not include:

- secrets
- tokens
- auth headers
- credentials
- provider keys
- DSNs
- database URLs
- raw provider payloads
- raw prompts
- participant private details
- stack traces by default
- raw causes by default

Any unsafe log exposure requires immediate access restriction, secret rotation when relevant, incident notes, and a follow-up fix before beta expansion.

## Slice B Completion

Phase 3 Milestone 30 Slice B is complete when:

- deployment verification is documented
- deployment smoke testing is documented
- rollback verification is documented
- monitoring verification is documented
- health verification is documented
- log verification is documented
- `pnpm build` passes
- no new product behavior or prohibited system is introduced

