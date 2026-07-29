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
- [x] Canonical API and web HTTPS origins are recorded without secrets.
- [ ] API and web expose the same full release commit SHA.
- [ ] `pnpm verify:hosted-release` passes for the promoted release.
- [ ] CORS allows the canonical dashboard origin and rejects an unapproved origin.
- [ ] The hosted fixture-mode Playwright journey passes and is visibly labeled as fixture mode.
- [ ] The previous known-good API and web release can be restored and passes hosted verification.

## Database Migration Readiness

- [ ] Prisma schema validation passes.
- [ ] Protected staging migration status reaches `20260712000000_persist_scan_result` or a reviewed additive successor.
- [ ] Confirmed-empty migration rehearsal passes using migrations only.
- [ ] Repeated migration deployment is idempotent.
- [ ] An isolated restored-backup upgrade preserves all existing tables and record counts.
- [ ] Render pre-deploy migration failure prevents release promotion.
- [ ] Migration evidence contains no connection string, credential, or secret value.

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

## Phase 4.5 Pilot Convergence

- [ ] Canonical web and API expose the same full commit SHA.
- [ ] Final hosted migration status reaches `20260729110000_add_evidence_clusters`.
- [ ] The previous known-good web and API release is restored and reverified.
- [x] Invite/session hardening and deterministic two-user isolation pass.
- [ ] Two isolated users complete the full hosted journey against one release.
- [x] Transactional owner-scoped deletion passes.
- [x] The approved opportunity-quality benchmark passes all thresholds.
- [x] One controlled live datasource and one controlled live LLM path have safe evidence.
- [x] Alert delivery and isolated restore evidence are recorded.
- [ ] Automated backups meet and evidence the 24-hour RPO.
- [ ] `pnpm verify:pilot-gate` returns `GO`.

No waiver may convert an unresolved P0 check into a pass. The authoritative decision is recorded in `04-034_PHASE_4_5_PILOT_GATE.md`.
