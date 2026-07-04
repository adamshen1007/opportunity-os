# 04-006_PRIVATE_BETA_RUNBOOK.md

**Document ID:** 04-006
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Private Beta Operational Runbook

## Purpose

Phase 3 Milestone 29 Slice E defines the operational runbook for Private Beta launch and support.

This runbook is provider-neutral. It documents how operators should prepare, deploy, monitor, roll back, and recover Opportunity OS for the first 10-20 design partners without adding payments, subscriptions, enterprise features, notifications, CRM integrations, or multi-tenancy.

## Roles

- Release owner: approves Private Beta deployment and rollback decisions.
- Operations owner: verifies environment configuration, health, logs, monitoring, and backup readiness.
- Database owner: verifies PostgreSQL backup and restore readiness.
- Support owner: records design-partner issues through the approved bug reporting path.

## Pre-Deployment Checks

Before deployment:

1. Confirm `main` is up to date with the intended release commit.
2. Confirm `node scripts/verify-repository.mjs --phase phase-3-milestone-29` passes.
3. Confirm `pnpm install --frozen-lockfile` passes.
4. Confirm `pnpm lint`, `pnpm build`, and `pnpm test` pass.
5. Confirm `docker compose config` passes.
6. Confirm `config/private-beta.env.example` has a matching protected environment value for every required variable.
7. Confirm secrets are present only in protected environment secret storage.
8. Confirm PostgreSQL backup and restore owners are assigned.
9. Confirm the beta checklist in `docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md` is complete.

## Config Binding

Private Beta config binding follows the runtime configuration contract:

- `packages/config` owns environment schema validation.
- `config/private-beta.env.example` is the production-facing placeholder template.
- Deployment environments bind actual values through protected secrets.
- `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `JWT_SECRET` must never be committed or printed.
- API and web deployment steps must consume validated configuration rather than reading undeclared environment values.

Required binding groups:

- application identity: `APP_NAME`, `NODE_ENV`, `PORT`
- service URLs: `DATABASE_URL`, `REDIS_URL`
- provider config: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_MODEL`, `ANTHROPIC_MODEL`
- authentication: `JWT_SECRET`, `JWT_EXPIRES_IN`
- observability: `LOG_LEVEL`, `OTEL_EXPORTER_ENDPOINT`
- optional integrations: `SENTRY_DSN`, `LANGFUSE_API_KEY`, `LANGSMITH_API_KEY`

## Deployment Procedure

1. Open the GitHub Actions workflow for Private Beta deployment readiness.
2. Run `.github/workflows/deploy.yml` against the `private-beta` environment.
3. Verify the workflow runs repository verification, install, lint, build, test, and Docker Compose config validation.
4. Promote only the artifact or commit that passed the readiness workflow.
5. Record the release commit, workflow run, operator, and deployment time in the launch notes.
6. Run post-deployment health checks immediately after promotion.

## Post-Deployment Health Checks

Verify:

- API health endpoint reports healthy status.
- Dashboard loads the protected Private Beta entry state.
- Invite acceptance flow works with a test invite.
- Session read works for an accepted invite.
- Save and dismiss feedback actions return safe success responses.
- Bug reporting returns a safe success response.
- Logs include correlation IDs and request IDs.
- Logs do not include secrets, tokens, auth headers, database URLs, provider keys, raw payloads, stack traces, or raw causes.

## Monitoring Guidance

Monitor the following launch signals:

- deployment workflow success or failure
- API health status
- dashboard load success
- invite acceptance failures by safe reason code
- session lookup failures by safe reason code
- feedback API failures by safe error code
- bug report API failures by safe error code
- request latency
- structured error counts
- database availability
- backup completion status

Vendor-specific monitoring remains out of scope until a later scoped task selects and configures the provider.

## Rollback Guidance

Rollback is required when:

- health checks fail after deployment
- invite-only access blocks all test users
- dashboard cannot load for design partners
- feedback or bug reporting returns unsafe or unusable output
- logs expose secrets or unsafe internals
- database migration or connection behavior is unsafe

Rollback steps:

1. Stop inviting additional design partners.
2. Mark the release as rollback-required in launch notes.
3. Re-promote the last known good release artifact or commit.
4. Re-run health checks.
5. Verify database schema compatibility before and after rollback.
6. If data integrity is at risk, pause write paths and contact the database owner.
7. Record the incident, root cause, and follow-up tasks.

## Backup And Restore

Before launch:

- confirm scheduled PostgreSQL snapshots are enabled by the approved hosting provider
- perform one restore rehearsal in a non-production environment
- verify restored data includes Private Beta invite/session/feedback/bug-report records
- document recovery time and recovery point expectations

During beta:

- do not commit database exports or participant data
- keep backup access restricted to approved operators
- treat restore artifacts as sensitive

## Incident Handling

For beta incidents:

1. Capture correlation ID, request ID, safe error code, and timestamp.
2. Avoid copying raw secrets, raw payloads, auth headers, provider responses, or stack traces into issue trackers.
3. Reproduce with deterministic fixtures when possible.
4. Triage severity using design-partner impact.
5. Apply rollback guidance when launch safety is affected.

## Exit Criteria

Slice E operational readiness is complete when:

- deployment instructions are clear
- rollback guidance is documented
- monitoring guidance is documented
- beta operations are documented
- config binding is documented
- the beta checklist exists
- `pnpm build` passes

