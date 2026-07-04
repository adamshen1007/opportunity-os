# Infrastructure

Reserved for deployment and infrastructure configuration.

## Private Beta Operations

Phase 3 Milestone 29 uses `.github/workflows/deploy.yml` as the Private Beta deployment workflow.

The workflow is provider-neutral and validates:

- repository policy with `phase-3-milestone-29`
- lint
- build
- test
- Docker Compose configuration

Operational ownership is documented in:

- `docs/04_IMPLEMENTATION/04-004_PRIVATE_BETA_DEPLOYMENT.md`
- `docs/04_IMPLEMENTATION/04-005_PRIVATE_BETA_OPERATIONS.md`
- `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`
- `docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md`

Private Beta infrastructure strategy:

- production config comes from protected environment configuration
- secrets management must use deployment environment secrets or an approved secret manager
- health monitoring starts with API health, service health checks, deployment status, error rates, latency, and resource pressure
- operational logging must remain structured and secret-safe
- backup strategy is PostgreSQL-first and must include snapshot ownership plus restore rehearsal before design-partner traffic
- rollback guidance, monitoring guidance, config binding, and beta operations are documented in the Private Beta runbook
- the beta checklist must be complete before inviting design partners

This directory must not introduce payments, subscriptions, enterprise features, notifications, CRM integrations, multi-tenancy, production user features, or business logic.
