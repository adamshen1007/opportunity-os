# 04-007_PRIVATE_BETA_CHECKLIST.md

**Document ID:** 04-007
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Private Beta Checklist

## Purpose

Phase 3 Milestone 29 Slice E defines the Private Beta launch checklist for design-partner readiness.

Use this checklist before inviting the first 10-20 design partners.

## Repository Gate

- [ ] `node scripts/verify-repository.mjs --phase review` passes.
- [ ] `node scripts/verify-repository.mjs --phase phase-3-milestone-29` passes.
- [ ] `pnpm install --frozen-lockfile` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm test` passes.
- [ ] `docker compose config` passes.
- [ ] Working tree contains only scoped Private Beta changes.

## Configuration Gate

- [ ] Every required value in `.env.example` has a corresponding Private Beta protected environment value.
- [ ] `config/private-beta.env.example` remains placeholder-only.
- [ ] `NODE_ENV` is set to the approved production value for the deployment target.
- [ ] `LOG_LEVEL` is set to an approved severity value.
- [ ] `OTEL_EXPORTER_ENDPOINT` points to an approved telemetry endpoint or placeholder for the readiness environment.
- [ ] No real secrets are committed.
- [ ] No real secrets are present in screenshots, logs, fixtures, docs, or artifacts.

## Deployment Gate

- [ ] `.github/workflows/deploy.yml` ran against the `private-beta` environment.
- [ ] The workflow verified repository policy, install, lint, build, test, and Docker Compose config.
- [ ] The release commit is recorded.
- [ ] The release owner approved promotion.
- [ ] The operations owner confirmed post-deployment health checks.

## Product Gate

- [ ] Protected dashboard state loads.
- [ ] Invite workflow display is visible and safe.
- [ ] Onboarding state is visible and deterministic.
- [ ] Invite acceptance works with a test invite.
- [ ] Session lookup works for a test session.
- [ ] Save feedback works.
- [ ] Dismiss feedback works.
- [ ] Usefulness, evidence quality, and ranking quality ratings work.
- [ ] Bug reporting works.
- [ ] Error states are safe and actionable.

## Monitoring Gate

- [ ] API health status is visible.
- [ ] Dashboard load failures can be observed.
- [ ] Invite acceptance failures can be counted by safe reason code.
- [ ] Session failures can be counted by safe reason code.
- [ ] Feedback failures can be counted by safe error code.
- [ ] Bug report failures can be counted by safe error code.
- [ ] Logs include correlation IDs and request IDs.
- [ ] Logs do not include secrets, tokens, auth headers, database URLs, provider keys, raw payloads, stack traces, or raw causes.

## Backup Gate

- [ ] PostgreSQL backup owner is assigned.
- [ ] Restore owner is assigned.
- [ ] Scheduled snapshots are configured by the approved hosting provider before real design-partner use.
- [ ] Restore rehearsal is completed in a non-production environment.
- [ ] Restore procedure is documented in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`.

## Rollback Gate

- [ ] Last known good release is identified.
- [ ] Rollback owner is assigned.
- [ ] Rollback trigger conditions are documented.
- [ ] Rollback procedure is documented.
- [ ] Data safety procedure is documented for failed migrations or unsafe write paths.

## Non-Goals Check

Confirm this Private Beta slice did not introduce:

- payments
- subscriptions
- enterprise features
- notifications
- CRM integrations
- multi-tenancy

## Launch Decision

Private Beta can launch only when every required item above is complete or explicitly waived by the release owner with a documented reason.

