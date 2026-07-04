# 04-004_PRIVATE_BETA_DEPLOYMENT.md

**Document ID:** 04-004
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Private Beta Deployment

## Purpose

Phase 3 Milestone 29 prepares Opportunity OS for Private Beta launch with the first 10-20 design partners.

This document defines the deployment architecture and deployment readiness boundary. Slice A establishes the readiness gate; Slice B adds deployment and operations policy for production config, secrets management, health monitoring, operational logging, monitoring strategy, and backup strategy. Slice E adds clear deployment instructions, config binding, rollback guidance, monitoring guidance, the Private Beta runbook, and the beta checklist. It does not implement monitoring vendors or production traffic routing by itself.

## Deployment Architecture

Private Beta deployment uses the repository CI/CD boundary as the first production-facing control plane:

- `.github/workflows/deploy.yml` owns the Private Beta deployment readiness gate.
- The workflow runs on `main` and manual dispatch for the `private-beta` environment.
- The workflow installs with `pnpm@11.7.0`, reads Node from `.node-version`, runs `phase-3-milestone-29` repository verification, then runs lint, build, test, and Docker Compose configuration validation.
- The workflow records the deployment workflow, production config, secrets management, health monitoring, operational logging, monitoring strategy, and backup strategy contract.
- `apps/api` remains the REST API boundary for Private Beta API behavior.
- `apps/web` remains the dashboard boundary for Private Beta user-facing behavior.
- Runtime configuration continues to be validated through `@opportunity-os/config`.
- Logging remains structured and secret-safe through the shared logging foundation.

The deployment workflow remains provider-neutral. A later scoped Private Beta task may attach the approved hosting provider, protected environment secrets, release promotion, and monitoring integrations.

## Slice E Deployment Instructions

Private Beta deployment uses the following release procedure:

1. Confirm the release commit is on `main`.
2. Confirm protected environment values exist for every required variable in `config/private-beta.env.example`.
3. Run `.github/workflows/deploy.yml` against the `private-beta` environment.
4. Confirm the workflow passes repository verification, install, lint, build, test, and Docker Compose config validation.
5. Promote only the commit or artifact that passed the readiness workflow.
6. Record release owner, operations owner, release commit, workflow run, and deployment time.
7. Run the post-deployment health checks in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`.
8. Complete the launch checklist in `docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md`.

## Config Binding

Private Beta configuration is bound through protected deployment environment values:

- `.env.example` and `packages/config` define the canonical variable contract.
- `config/private-beta.env.example` defines Private Beta placeholder values.
- actual values must be provided by protected environment configuration or approved secret storage.
- runtime code must consume validated configuration and must not read undeclared environment variables.
- deployment logs must not print secret values.

## Rollback Guidance

Rollback guidance is defined in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`.

Rollback is required when deployment health checks fail, invite-only access blocks test users, dashboard load fails, feedback or bug reporting is unusable, logs expose unsafe values, or database migration behavior is unsafe.

## Monitoring Guidance

Monitoring guidance is defined in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`.

Private Beta launch monitoring starts with deployment success, API health, dashboard load, invite acceptance failures, session lookup failures, feedback failures, bug report failures, request latency, structured error counts, database availability, and backup completion status.

## Slice B Operations Boundary

Allowed in Slice B:

- deployment workflow hardening
- production config template in `config/private-beta.env.example`
- secrets management documentation
- health monitoring documentation
- operational logging documentation
- monitoring strategy documentation
- backup strategy documentation
- repository verification updates for the operations baseline

Not implemented in Slice B:

- production user features
- business logic changes
- production authentication provider
- feedback persistence
- monitoring vendor integration
- backup execution
- production traffic routing

## Slice C Invite-only Access Boundary

Allowed in Slice C:

- invite contracts
- invite validation
- session management contracts
- minimal persistence schema for `PrivateBetaInvite` and `PrivateBetaSession`
- secret-safe invite and session API behavior

Not implemented in Slice C:

- billing
- multi-tenancy
- production identity provider
- enterprise auth
- payments
- subscriptions
- production user management platform
- business logic changes

## Slice A Boundary

Allowed in Slice A:

- Private Beta boundaries
- deployment architecture documentation
- deployment readiness workflow configuration
- repository verification support for `phase-3-milestone-29`
- governance updates for Private Beta work

Not implemented in Slice A:

- production authentication provider
- session management
- feedback persistence
- invite workflow behavior
- monitoring vendor integration
- backup execution
- production traffic routing

## Explicit Non-Goals

Phase 3 Milestone 29 continues to block:

- payments
- subscriptions
- enterprise features
- notifications
- CRM integrations
- multi-tenancy

These capabilities require future approved milestones and must not appear in Private Beta foundation changes.

## Verification

Run:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-29
pnpm lint
pnpm build
```

Final Private Beta readiness slices should additionally run:

```sh
pnpm install --frozen-lockfile
pnpm test
docker compose config
```
