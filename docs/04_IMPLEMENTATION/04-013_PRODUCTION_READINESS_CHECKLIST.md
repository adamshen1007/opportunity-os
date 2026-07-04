# 04-013_PRODUCTION_READINESS_CHECKLIST.md

**Document ID:** 04-013
**Version:** 3.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Production Readiness Checklist

## Purpose

Phase 3 Milestone 30 Slice D defines the production readiness checklist for Private Beta operations.

This checklist confirms readiness; it does not add deployment providers, backend features, AI features, analytics platforms, payments, CRM integrations, notifications, schedulers, workers, or mobile apps.

## Repository Readiness

- [ ] `node scripts/verify-repository.mjs --phase review` passes.
- [ ] `node scripts/verify-repository.mjs --phase phase-3-milestone-30` passes.
- [ ] `pnpm install --frozen-lockfile` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm test` passes.
- [ ] `docker compose config` passes.
- [ ] Working tree contains only scoped Beta Operations changes.

## Deployment Readiness

- [ ] Intended release commit is identified.
- [ ] Deployment workflow is available.
- [ ] Protected `private-beta` environment is configured.
- [ ] Production config is present through protected environment values.
- [ ] No real secrets are committed.
- [ ] No release artifact includes `.env`, logs with secrets, database dumps, or participant exports.
- [ ] Deployment verification procedure in `docs/04_IMPLEMENTATION/04-008_BETA_OPERATIONS_VERIFICATION.md` is complete.

## Product Readiness

- [ ] Protected dashboard entry state loads.
- [ ] Opportunity list loads.
- [ ] Opportunity detail loads.
- [ ] Ranking explanation is visible.
- [ ] Evidence and provenance are visible.
- [ ] Search, filters, and pagination are usable.
- [ ] Save and dismiss flows work.
- [ ] Usefulness, evidence quality, and ranking quality ratings work.
- [ ] Feedback and bug-report paths work.
- [ ] Empty and error states are safe and actionable.

## Operations Readiness

- [ ] Operator handbook is current.
- [ ] Beta user handbook is current.
- [ ] Support guide is current.
- [ ] Deployment smoke testing is complete.
- [ ] Rollback verification is complete.
- [ ] Monitoring verification is complete.
- [ ] Health verification is complete.
- [ ] Log verification is complete.
- [ ] Backup owner and restore owner are assigned.

## Security Readiness

- [ ] Logs do not expose secrets, tokens, auth headers, credentials, database URLs, provider keys, raw payloads, stack traces, or raw causes by default.
- [ ] Support notes use safe identifiers only.
- [ ] Invite communication excludes secrets and internal implementation details.
- [ ] Screenshots and artifacts are reviewed for sensitive information.
- [ ] Unsafe exposure triggers access restriction, rotation when relevant, and incident follow-up.

## Readiness Decision

Production readiness is approved only when each required item is complete or explicitly waived by the release owner with a documented safe reason.

