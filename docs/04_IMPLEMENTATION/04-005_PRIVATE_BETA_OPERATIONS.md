# 04-005_PRIVATE_BETA_OPERATIONS.md

**Document ID:** 04-005
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Private Beta Operations

## Purpose

Phase 3 Milestone 29 Slice B prepares Opportunity OS for production operation without adding production user features or business logic changes.

This document defines the Private Beta operational baseline for deployment workflow, production config, config binding, secrets management, health monitoring, operational logging, monitoring strategy, backup strategy, rollback guidance, and beta operations.

## Deployment Workflow

`.github/workflows/deploy.yml` is the Private Beta deployment workflow.

The workflow:

- runs against the GitHub `private-beta` environment
- uses Node.js from `.node-version`
- uses `pnpm@11.7.0`
- installs dependencies with `pnpm install --frozen-lockfile`
- runs `node scripts/verify-repository.mjs --phase phase-3-milestone-29`
- runs lint, build, test, and Docker Compose config validation
- records the production operation contract for deployment, production config, secrets management, health monitoring, operational logging, monitoring strategy, and backup strategy

The workflow remains provider-neutral until a later scoped task attaches a hosting provider.

## Production Config

`config/private-beta.env.example` is the Private Beta production config template.

It mirrors the validated runtime schema and contains placeholders only. Real values must come from protected deployment environment configuration or an approved secret manager.

Required production config groups:

- application identity and runtime environment
- database connection string
- Redis connection string
- AI provider keys and model names
- authentication secret and expiry
- log level and telemetry endpoint

Optional production config groups:

- Sentry DSN
- Langfuse API key
- LangSmith API key

## Config Binding

Private Beta config binding is explicit:

- `packages/config` remains the runtime schema owner.
- `.env.example` remains the canonical variable list.
- `config/private-beta.env.example` mirrors the production-facing placeholder template.
- deployment environments provide actual values through protected secret storage.
- API and web runtime configuration must use validated configuration contracts.
- undeclared environment values must not become implicit runtime dependencies.

Operators must verify config binding before launch using `docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md`.

## Secrets Management

Private Beta secrets must be stored in protected environment secret storage, not in the repository.

Rules:

- never commit real secrets
- never print secrets in deployment logs
- never put secrets in screenshots, artifacts, fixtures, or docs
- rotate exposed secrets immediately
- use placeholder values in examples
- keep secret validation fail-fast and secret-safe

Secret-like values include API keys, provider keys, tokens, auth headers, passwords, credentials, DSNs, database URLs, JWT secrets, and refresh tokens.

## Health Monitoring

Private Beta health monitoring uses existing health boundaries:

- Docker Compose health checks for local services
- API health endpoint from `apps/api`
- deployment workflow validation
- future hosting provider health checks once scoped

Health output must be safe for operators and must not expose connection strings, raw config, credentials, provider responses, stack traces, or raw causes.

## Operational Logging

Operational logging must use structured, secret-safe logging.

Required fields remain:

- timestamp
- service
- environment
- severity
- correlationId
- requestId
- eventName
- message

Logs must not include secrets, tokens, auth headers, provider keys, credentials, DSNs, database URLs, raw provider payloads, prompts, stack traces, or raw causes by default.

## Monitoring Strategy

Private Beta monitoring should start with operational signals that support safe launch decisions:

- deployment success or failure
- health status
- request error rate
- request latency
- feedback API failures
- dashboard load failures
- resource pressure
- structured error counts by safe error code

Vendor-specific monitoring integrations are deferred until a scoped task selects and configures the provider.

Operational monitoring procedures are defined in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`.

## Backup Strategy

Private Beta backup strategy is PostgreSQL-first:

- document the database owner and restore owner before launch
- enable scheduled database snapshots through the approved hosting provider
- run a restore rehearsal before inviting design partners
- store restore steps in the operational runbook
- avoid committing database dumps, production exports, or participant data

Redis remains cache/coordination infrastructure and should not be treated as the source of record.

## Rollback Guidance

Rollback guidance is owned by `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`.

Rollback must be considered when:

- deployment health checks fail
- invite-only access blocks test users
- dashboard load fails
- feedback or bug reporting is unusable
- logs expose unsafe values
- migration or database connection behavior is unsafe

The last known good release must be identified before launch.

## Beta Operations

Private Beta operation uses:

- this operations baseline
- `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`
- `docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md`

Operators should record release commit, workflow run, launch decision, rollback owner, backup owner, restore owner, and any design-partner issue summaries using safe identifiers only.

## Non-Goals

Slice B does not implement:

- production user features
- business logic changes
- payments
- subscriptions
- enterprise features
- notifications
- CRM integrations
- multi-tenancy

## Verification

Run:

```sh
pnpm test
pnpm build
```

Recommended full gate:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-29
pnpm test
pnpm build
```
