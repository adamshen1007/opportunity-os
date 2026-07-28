# 04-028_PHASE_4_5_EXECUTION_PLAN.md

**Document ID:** 04-028
**Version:** 1.0.0
**Status:** Approved (Implementation Plan)
**Layer:** 3 - Implementation
**Owner:** Engineering Team
**Scope:** Phase 4.5 - Design-Partner Readiness

## Objective

Phase 4.5 prepares Opportunity OS for a safe, valuable design-partner pilot. It runs two workstreams in parallel:

- Workstream A closes production safety gaps before any design partner receives access.
- Workstream B improves opportunity intelligence quality so pilot output is evidence-backed, synthesized, and explainably ranked.

The workstreams converge at one pilot gate. Neither production safety alone nor output quality alone is sufficient for release.

Phase 4.5 does not add enterprise features, new connectors, payments, subscriptions, CRM integrations, notifications, multi-tenancy, schedulers, workers, or infrastructure that is not required for the pilot.

## Execution Model

```text
Workstream A: A01 -> A02 -> A03 -> A04 -> A05
                    A01 -> A06
                    A02 -----------------> A07

Workstream B: B01 -> B02 -> B03 -> B04
                                -> B05

All tasks -------------------------------> G01
```

Workstream B may begin while deployment and migration verification are underway. Schema changes from A04, A05, and B02 must be coordinated into an ordered, additive migration sequence before A02 receives final closure.

## Workstream A - Production Safety Before Design Partners

### TASK-P45-A01 - Hosted Deployment Verification

Objective:

- prove that the existing Render API and Vercel dashboard deploy from a recorded commit, communicate correctly, and can be rolled back

Dependencies:

- existing Render, Vercel, GitHub environment, and protected configuration

Files:

- `render.yaml`
- `apps/web/vercel.json`
- `.github/workflows/deploy.yml`
- `scripts/verify-external-mvp.mjs`
- `scripts/verify-hosted-release.mjs`
- `docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md`

Acceptance criteria:

- web and API deployments identify the same commit
- `/health` confirms API and database readiness
- CORS permits only approved dashboard origins
- a hosted fixture workflow completes without browser console or network errors
- release and rollback procedures are successfully rehearsed
- fixture and live modes remain visibly distinguishable

Required tests:

- deployment configuration validation
- hosted API health smoke test
- hosted Playwright fixture journey
- rollback rehearsal

Estimated size: M, 2-3 engineering days.

### TASK-P45-A02 - Database Migration Verification

Objective:

- make production schema migration repeatable, observable, and recoverable

Dependencies:

- `TASK-P45-A01`
- final additive migrations from `TASK-P45-A04`, `TASK-P45-A05`, and `TASK-P45-B02` before closure

Files:

- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/migrations/**`
- `packages/database/src/__tests__/migration-policy.test.ts`
- `packages/database/src/__tests__/schema-policy.test.ts`
- `packages/database/package.json`
- `render.yaml`
- `scripts/verify-production-migrations.mjs`

Acceptance criteria:

- Prisma validation and migration status pass against staging
- a clean database reaches the current schema through migrations only
- a production-like database upgrades without data loss
- deployment stops before API promotion when migration execution fails
- migration logs do not expose connection credentials
- partially applied migration recovery is documented and rehearsed

Required tests:

- empty-database migration
- production-like upgrade migration
- repeat deployment and migration idempotency
- schema constraint and index verification
- controlled failed-migration rehearsal

Estimated size: M, 2-3 engineering days.

#### Slice A1 implementation record

- Repository controls implemented by Slice A1 are documented in `04-029_PHASE_4_5_HOSTED_RELEASE_AND_MIGRATION_RUNBOOK.md`.
- Slice A1 established `20260712000000_persist_scan_result`; Slice A2 advanced the baseline to `20260728093000_harden_private_beta_auth`; Slice A3 advances it additively to `20260728120000_add_user_ownership`.
- The A2 migration revokes legacy sessions and introduces a unique session-token hash. Ownership and evidence-cluster migrations must build additively after this baseline.
- CI proves the migration chain against an empty PostgreSQL 16 database and repeats migration deployment for idempotency.
- Render executes migration deployment and status before release promotion.
- Canonical hosted URLs, shared release SHA, staging status, restored-backup upgrade, hosted fixture journey, and rollback rehearsal remain `MANUAL ACTION REQUIRED` until protected operator access is available.
- A01 and A02 must not be marked externally complete from repository-only evidence.

### TASK-P45-A03 - Production Authentication Hardening

Objective:

- harden the existing invite-only session model without introducing an external identity provider

Dependencies:

- `TASK-P45-A02`

Files:

- `apps/api/src/auth/**`
- `apps/api/src/routes/auth/**`
- `apps/api/src/server.ts`
- `apps/web/src/api/auth.ts`
- `apps/web/src/app/access/page.tsx`
- `packages/database/prisma/schema.prisma`
- `.env.example`

Acceptance criteria:

- invite codes are hashed, expiring, single-use, and revocable
- session tokens are cryptographically random and hashed at rest
- production cookies are secure and HttpOnly
- state-changing requests enforce an approved Origin or CSRF boundary
- logout and administrative revocation invalidate sessions
- anonymous, expired, revoked, and malformed sessions cannot access protected routes
- session identifiers never appear in logs or user-visible failures

Required tests:

- invite acceptance, replay, expiry, and revocation
- session expiry and logout
- secure cookie policy, Origin rejection, malformed tokens, timing-safe comparisons, and secret redaction

Implementation status:

- repository implementation complete; hosted promotion requires the A2 migration and `AUTH_SECRET_PEPPER`
- invite codes use the generated `inv_...` format, expire by default, and are accepted once
- session tokens use the generated `ses_...` format and only keyed hashes persist
- administrative invite revocation invalidates related active sessions
- no ownership fields or product-record ownership behavior are included in this slice
- cookie security
- Origin and CSRF rejection
- malformed-token and secret-redaction tests

Estimated size: L, 4-6 engineering days.

### TASK-P45-A04 - User Ownership Isolation

Objective:

- ensure authenticated users can access only their own scans and derived records

Dependencies:

- `TASK-P45-A03`

Files:

- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/migrations/**`
- `apps/api/src/context/**`
- `apps/api/src/persistence/**`
- `apps/api/src/routes/scans/**`
- `apps/api/src/routes/opportunities/**`
- `apps/api/src/routes/rankings/**`
- `apps/api/src/routes/feedback/**`
- `apps/api/src/runtime/production-runtime.ts`

Acceptance criteria:

- the API derives principal identity from the server-side session
- scans and derived records receive owner and scan-run references transactionally
- every list, get, mutation, retry, cancellation, feedback, and deletion path is owner-scoped
- one user cannot infer whether another user's identifier exists
- administrative access is explicit, narrow, and safely logged
- legacy unowned records are inaccessible or handled by an approved backfill

Required tests:

- two-user authorization matrix for every protected resource
- identifier-guessing and cross-user feedback tests
- cross-user retry, cancellation, and deletion tests
- ownership backfill tests

Implementation status:

- repository implementation complete; hosted promotion requires applying `20260728120000_add_user_ownership`
- `ScanRunRecord.ownerPrincipalId` is the ownership root; raw content and ranking roots reference their scan, and all other generated records remain reachable through that chain
- feedback stores its owner explicitly and validates the referenced opportunity through an owner-scoped scan result
- legacy records are assigned to `__legacy_unowned__`, invisible to authenticated users, and readable only through the authorized read-only administrator override
- route coverage: scan list/detail/create/delete, opportunity list/detail, ranking create/detail, feedback create/list/detail/delete, and scan-job create/detail/retry/cancel are owner-scoped
- no general update route exists; no ownership-unsafe update behavior is exposed
- administrator override is GET-only, requires the administrator token plus explicit override header, and emits `ownership.administrator_override`
- evidence clustering and broader deletion-correctness work remain deferred to their approved slices

Estimated size: XL, 6-8 engineering days.

### TASK-P45-A05 - Deletion Correctness

Objective:

- delete an owned scan and its private derived data transactionally and completely

Dependencies:

- `TASK-P45-A04`
- final Phase 4.5 intelligence schema

Files:

- `apps/api/src/persistence/scan-persistence.ts`
- `apps/api/src/persistence/database-feedback-store.ts`
- `apps/api/src/runtime/production-runtime.ts`
- `apps/api/src/routes/scans/delete-scan-route.ts`
- `apps/api/src/routes/feedback/delete-feedback-route.ts`
- `packages/database/src/transaction.ts`
- `packages/database/prisma/schema.prisma`

Acceptance criteria:

- production adapters expose every required deletion operation
- scan deletion runs inside one database transaction
- raw, normalized, analysis, cluster, candidate, generated, ranking, and feedback records follow documented deletion rules
- shared public evidence is retained only while referenced by another owned scan
- deletion is owner-scoped, idempotent, and safe to retry
- no orphaned record or accessible deleted URL remains

Required tests:

- complete relational deletion
- injected transaction rollback
- repeated deletion
- cross-user deletion denial
- orphan and foreign-key audit

Estimated size: L, 4-5 engineering days.

### TASK-P45-A06 - Monitoring And Alerting

Objective:

- detect deployment, database, authentication, scan, provider, and latency failures using existing hosting capabilities

Dependencies:

- `TASK-P45-A01`

Files:

- `apps/api/src/operations/metrics.ts`
- `apps/api/src/routes/operations/**`
- `apps/api/src/routes/health/**`
- `apps/api/src/server.ts`
- `packages/shared/src/logging/**`
- `render.yaml`
- `.env.example`
- `docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md`

Acceptance criteria:

- platform monitoring covers web, API, and database availability
- alerts cover sustained server errors, database failures, failed scans, provider failures, and excessive latency
- alerts reach a named operator
- `/operations` is administrator-only
- logs include safe correlation identifiers
- telemetry excludes secrets, prompts, provider payloads, auth headers, and database URLs

Required tests:

- health dependency and metrics contract tests
- operations-route authorization
- controlled database and provider failures
- alert-delivery rehearsal
- log-redaction tests

Estimated size: M, 3-4 engineering days.

### TASK-P45-A07 - Backup And Restore Verification

Objective:

- prove that design-partner data can be recovered with the existing hosted PostgreSQL backup capability

Dependencies:

- `TASK-P45-A02`
- final Phase 4.5 schema

Files:

- `scripts/verify-database-restore.mjs`
- `docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-014_RELEASE_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-015_LAUNCH_CHECKLIST.md`

Acceptance criteria:

- automated backups and retention are enabled and documented
- a manual backup is captured before production migration
- a backup restores into an isolated staging database
- restored users, scans, evidence clusters, opportunities, rankings, and feedback pass integrity checks
- recovery point and recovery time expectations are documented
- backup access is restricted to approved operators

Required tests:

- restore rehearsal
- migration status after restore
- row and relationship integrity audit
- application smoke test against the restored database

Estimated size: M, 2-3 engineering days.

## Workstream B - Opportunity Intelligence Quality

### TASK-P45-B01 - Opportunity Quality Benchmark

Objective:

- establish a frozen benchmark that makes opportunity-quality improvements measurable

Dependencies:

- none; begins in parallel with `TASK-P45-A01`

Files:

- `research/fixtures/opportunity-quality/**`
- `packages/analysis/src/__tests__/**`
- `packages/opportunity-pipeline/src/__tests__/**`
- `packages/opportunity-ranking/src/__tests__/**`
- planned document `04-029 Opportunity Quality Validation`

Acceptance criteria:

- the benchmark contains at least 30 safe source records and eight expected pain-point clusters
- at least 15 human-reviewed pairwise ranking judgments are recorded
- baseline duplicate rate, citation coverage, clustering quality, and ranking agreement are measured
- fixtures contain no credentials, private data, or unsafe provider payloads
- benchmark input, rubric, and output are deterministic and versioned

Required tests:

- fixture schema and security validation
- deterministic benchmark execution
- repeat baseline comparison

Estimated size: M, 3-4 engineering days.

### TASK-P45-B02 - Evidence Clustering

Objective:

- group related source records before candidate generation using deterministic evidence rules and existing infrastructure

Dependencies:

- `TASK-P45-B01`

Files:

- `packages/analysis/src/evidence/**`
- `packages/opportunity-pipeline/src/assembly/**`
- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/migrations/**`
- `apps/api/src/pipeline/opportunity-scan-pipeline.ts`

Acceptance criteria:

- related records form one stable evidence cluster
- unrelated records are not merged
- duplicate records cannot inflate demand
- members retain source, timestamp, URL, and normalized-content provenance
- contradictory evidence remains visible
- benchmark precision is at least 0.85 and recall at least 0.75

Required tests:

- related, unrelated, duplicate, and contradictory record cases
- deterministic cluster fingerprint and membership
- cluster persistence
- mixed fixtures using existing connectors only

Estimated size: L, 5-7 engineering days.

### TASK-P45-B03 - Opportunity Synthesis

Objective:

- generate one useful opportunity from a qualified evidence cluster instead of one opportunity per source record

Dependencies:

- `TASK-P45-B02`

Files:

- `packages/opportunity-candidates/src/evidence/**`
- `packages/opportunity-candidates/src/confidence/**`
- `packages/opportunity-generation/src/assembly/**`
- `packages/opportunity-generation/src/generation/**`
- `apps/api/src/pipeline/opportunity-scan-pipeline.ts`
- `apps/web/src/features/opportunities/**`
- `apps/web/src/features/evidence/**`

Acceptance criteria:

- one qualified cluster creates at most one primary opportunity
- output identifies target user, pain, context, workaround, desired outcome, evidence, assumptions, and limitations
- factual claims reference evidence
- unsupported claims are rejected or explicitly labeled as assumptions
- singleton clusters are labeled exploratory
- benchmark duplicate opportunity rate is no more than 10 percent

Required tests:

- cluster-to-candidate synthesis
- evidence citation coverage
- contradictory evidence and weak-cluster rejection
- duplicate opportunity detection
- dashboard evidence rendering

Estimated size: L, 5-7 engineering days.

### TASK-P45-B04 - Ranking Improvement

Objective:

- replace fixed runtime signals with calculated, explainable, opportunity-specific signals

Dependencies:

- `TASK-P45-B03`

Files:

- `packages/opportunity-ranking/src/signals/**`
- `packages/opportunity-ranking/src/weights/**`
- `packages/opportunity-ranking/src/ranking/**`
- `apps/api/src/pipeline/opportunity-scan-pipeline.ts`
- `apps/web/src/features/rankings/**`
- `apps/web/src/features/opportunities/opportunity-detail.tsx`

Acceptance criteria:

- ranking derives recurrence, source diversity, severity, urgency, workaround evidence, engagement, recency, and contradiction penalties
- demand strength and confidence remain separate
- signal and weight versions are recorded
- explanations reconcile with calculated scores
- missing evidence lowers confidence instead of creating inferred certainty
- pairwise agreement reaches at least 75 percent and improves at least 15 percentage points over baseline
- ordering remains deterministic

Required tests:

- signal derivation and demand-strength calculation
- missing-data and contradiction penalties
- score and explanation reconciliation
- deterministic tie-breaking
- benchmark comparison

Estimated size: L, 4-6 engineering days.

### TASK-P45-B05 - LLM Output Validation

Objective:

- ensure live LLM analysis is structured, evidence-grounded, and unable to bypass quality rules

Dependencies:

- `TASK-P45-B03`
- may proceed in parallel with `TASK-P45-B04`

Files:

- `packages/llm-analysis/src/provider/live-prompt-boundary.ts`
- `packages/llm-analysis/src/provider/openai-live-adapter.ts`
- `packages/llm-analysis/src/provider/gemini-live-adapter.ts`
- `packages/llm-analysis/src/__tests__/live-provider*.test.ts`
- `packages/analysis/src/validation/**`
- `apps/api/src/pipeline/opportunity-scan-pipeline.ts`

Acceptance criteria:

- one existing provider and model is selected for the pilot
- output passes schema, citation, and evidence-reference validation
- malformed or unsupported output fails closed
- live failure never becomes a successful fixture response
- prompt and model versions are recorded safely
- credentials, prompts, raw responses, stacks, and causes are excluded from logs and API output
- fixture mode remains the CI default

Required tests:

- fake-provider success
- malformed structured output
- missing and invalid citations
- timeout, refusal, and quota failure
- secret and prompt redaction
- opt-in staging smoke test

Estimated size: M, 3-4 engineering days.

## Pilot Convergence Gate

### TASK-P45-G01 - Safe And Valuable Design-Partner Pilot Gate

Objective:

- admit design partners only after production safety and opportunity intelligence pass together

Dependencies:

- `TASK-P45-A01` through `TASK-P45-A07`
- `TASK-P45-B01` through `TASK-P45-B05`

Files:

- `scripts/verify-production-readiness.mjs`
- `scripts/verify-repository.mjs`
- `.github/workflows/deploy.yml`
- `docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-015_LAUNCH_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-025_DESIGN_PARTNER_PILOT.md`

Acceptance criteria:

- two isolated users complete invite, login, scan, results, evidence, ranking, feedback, logout, and deletion
- cross-user access is denied throughout
- migration and backup-restore verification pass
- hosted monitoring and alerts are active
- one controlled live datasource and one live LLM smoke test pass
- clustering, synthesis, citation, and ranking quality thresholds pass
- rollback is rehearsed
- no unresolved Phase 4.5 P0 issue remains

Required tests:

- repository verification, lint, build, and test
- hosted Playwright journey
- two-user security suite
- migration, deletion, and restore verification
- live provider smoke tests
- opportunity-quality benchmark
- alert and rollback rehearsal

Estimated size: M, 3-4 engineering days.

## Fastest Safe Sequence

| Execution wave | Workstream A | Workstream B |
|---|---|---|
| Wave 1 | A01 hosted deployment, A02 migration preflight | B01 quality benchmark |
| Wave 2 | A03 authentication | B02 evidence clustering |
| Wave 3 | A04 ownership isolation | B03 opportunity synthesis |
| Wave 4 | A05 deletion, A06 monitoring | B04 ranking, B05 LLM validation |
| Wave 5 | A07 backup and production retest | benchmark and intelligence retest |
| Wave 6 | shared G01 pilot convergence gate | shared G01 pilot convergence gate |

## Definition Of Complete

Phase 4.5 is complete only when:

- both workstreams satisfy their acceptance criteria
- all additive migrations are applied and verified
- repository verification, lint, build, unit tests, integration tests, and browser tests pass
- hosted smoke, rollback, alert, and restore rehearsals pass
- design-partner output meets the approved quality benchmark
- documentation matches the deployed behavior
- no unresolved P0 issue remains

Passing one workstream does not authorize a design-partner pilot.
