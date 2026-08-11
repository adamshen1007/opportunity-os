# 04-034_PHASE_4_5_PILOT_GATE.md

**Task:** `TASK-P45-G01`  
**Recorded:** 2026-08-11
**Decision:** **GO**

## 1. Executive Readiness Summary

Opportunity OS has deterministic safety and intelligence coverage, matched hosted releases, a rehearsed production migration and rollback path, verified two-user isolation and deletion, a verified Stack Exchange live datasource path, an operator-observed schema-validated Gemini scan, alert-delivery evidence, automated daily database backups, and a successful isolated database restore. All 13 P0 checks pass for the controlled design-partner pilot. Reddit-specific live readiness remains outside the verified pilot scope.

The gate is fail-closed. `pnpm verify:pilot-gate` reads the versioned evidence manifest at `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json` and exits nonzero unless every P0 check is `pass`.

## 2. Production Safety Results

| Check | Result | Safe evidence identifier |
| --- | --- | --- |
| Canonical HTTPS origins | Pass | `canonical-hosted-origins-20260728` |
| Same deployed commit | Pass | `matched-hosted-release-33b7f13-20260811` |
| Production migration path | Pass | `production-migration-path-rehearsed-20260811` |
| Rollback rehearsal | Pass | `matched-hosted-rollback-7489189-to-33b7f13-20260811` |
| Monitoring alert delivery | Pass | `render-alert-delivery-20260728` |
| Isolated backup restore | Pass | `isolated-postgresql-restore-20260729` |
| Automated backup RPO | Pass | `supabase-pro-daily-backup-rpo-20260811` |

On 2026-08-11, Render deployed the current `main` candidate and public verification passed against full release SHA `33b7f134dc69ee7565ad2260baed9a8f208e5f4f` on both the API and web origins. The production API moved to Render Starter and a subsequent deployment ran `migrate deploy` plus `migrate status`, found all ten migrations through `20260729110000_add_evidence_clusters` current, completed the pre-deploy stage, and only then promoted the API. A matched-release rollback then switched both canonical origins to previous known-good SHA `7489189ec9afa2600a1d05cd428388c362f357ae`; hosted verification passed before the candidate was restored on both providers and verified again. A disposable PostgreSQL 16 rehearsal also passed the final ten-migration chain plus repeat-deploy idempotency. A separate protected staging project passed current-baseline verification, and its migration-9 public-schema backup with synthetic relational data passed an isolated PostgreSQL 17 migration-10 upgrade without table or count regression. Isolated non-production rehearsals then proved failed migration detection, promotion blocking, recovery of a failed Prisma ledger, recovery from an observed durable partial state, and return to the committed baseline without changing production.

## 3. Two-User Isolation Results

Deterministic API coverage passes invite acceptance, replay protection, expiration, revocation, session expiration, logout, malformed credentials, Origin protection, administrator authorization, ownership backfill, identifier guessing, and cross-user access denial.

Transactional deletion coverage passes owner scoping, full relational deletion, feedback deletion, rollback after injected failure, repeated deletion, stale identifiers, and orphan checks.

On 2026-08-11, two fresh hosted users completed isolated journeys against matched candidate SHA `33b7f134dc69ee7565ad2260baed9a8f208e5f4f`. One used explicit Stack Exchange fixture mode and one used the approved controlled Stack Exchange live path. Both completed login, scan, results, evidence, ranking, feedback, transactional deletion, stale-resource denial, and logout. Unique resource identifiers were denied bidirectionally. The shared public ranking identifier remained owner-scoped: each user received only their own ranked opportunities, deleting one user's scan removed only that user's ranking view, and the other user's view remained intact until its own deletion. No protected or personal values were recorded. Safe evidence identifier: `hosted-two-user-owner-isolation-33b7f13-20260811`.

## 4. Opportunity-Quality Benchmark Results

The frozen, Adam-approved benchmark is version `1.0.0`.

| Metric | Result | Required threshold |
| --- | ---: | ---: |
| Clustering precision | 100% | at least 85% |
| Clustering recall | 100% | at least 75% |
| Duplicate opportunity rate | 0% | no more than 10% |
| Citation coverage | 100% | 100% |
| Ranking agreement | 75% | at least 75% |
| Ranking improvement | 25 percentage points | at least 15 points |
| Repeatability | 100% | 100% |

Ranking uses versioned evidence-derived signals, keeps demand strength separate from confidence, applies contradiction penalties, and reconciles the final score with its explanation.

## 5. Live Datasource Result

Stack Exchange is the verified fallback datasource through its official read-only API. Safe evidence identifier: `stack-exchange-live-fallback-20260729`.

Reddit remains **CONDITIONAL - REDDIT NOT VERIFIED**. Stack Exchange evidence must not be represented as Reddit readiness.

## 6. Live LLM Result

Gemini using pilot model `gemini-2.5-flash` completed an operator-observed hosted live scan through structured schema and citation validation without fixture substitution. Safe evidence identifier: `gemini-live-schema-validated-scan-20260729`.

Fixture mode remains the CI default. Tests require failed live execution to fail closed and prohibit silently converting a failed live request into a successful fixture result.

## 7. Monitoring And Recovery Result

Render alert delivery and an isolated PostgreSQL restore rehearsal pass. The restore reached migration `20260729110000_add_evidence_clusters`, passed relational integrity verification, and returned healthy API/database status.

The production Supabase project has operator-observed automated daily PostgreSQL backups with seven-day retention, satisfying the approved 24-hour database-backup RPO. This managed backup evidence remains distinct from the manual logical backup and isolated restore rehearsal.

## 8. Unresolved Risks

1. Reddit-specific live readiness remains unverified; the pilot may use only the verified Stack Exchange scope.

## 9. Evidence Index

The safe, machine-readable evidence index is `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json`. It stores no invite codes, session tokens, credentials, database URLs, provider payloads, prompts, personal contact details, stacks, or raw causes.

### Verification Run

The 2026-07-29 gate run produced these results:

- repository review verification: pass
- frozen-lockfile installation: pass
- lint: pass across 28 workspace packages
- build: pass across 28 workspace packages
- unit and integration tests: pass across 28 workspace packages
- local Playwright journey: 18 passed across desktop and mobile
- targeted authentication, ownership, and deletion suite: 17 passed
- Prisma schema validation: pass
- opportunity-quality benchmark: all thresholds passed with fingerprint `8ccbd52ad5412a962d4443c9a1d9d3fe418bd339fd96a0da2cf4f81383452905`
- Stack Exchange live smoke: pass with three safe items
- hosted release verification: passed on 2026-08-11 at full SHA `33b7f134dc69ee7565ad2260baed9a8f208e5f4f`
- hosted fixture Playwright journey: passed on 2026-08-11 against the matched candidate with visible fixture-fallback labeling
- hosted two-user Playwright journey: 1 passed on 2026-08-11 against the matched candidate; separate fixture and controlled Stack Exchange live sessions passed bidirectional owner isolation, owner-scoped ranking projections, transactional deletion, stale-resource denial, and logout
- production migration ledger: all ten migrations through the approved baseline are complete and not rolled back as observed through the protected Supabase connector on 2026-08-11
- production Render promotion guard: passed on 2026-08-11 on Starter; `migrate deploy` and `migrate status` completed before the API was promoted, and the final hosted-release verifier passed
- final ten-migration clean/idempotency rehearsal: passed on 2026-08-11 against a confirmed-empty disposable PostgreSQL 16 database; connection details were not printed
- protected staging status: passed on 2026-08-11 against a separate isolated Supabase project at baseline `20260729110000_add_evidence_clusters`; a transient first-attempt provider connection failure cleared before the exact passing retry
- isolated restored-backup upgrade: passed on 2026-08-11 after restoring a private PostgreSQL 17 public-schema backup containing the first nine migrations and representative synthetic relational data; migration 10 reached the approved baseline without table or count regression
- controlled failed-migration non-promotion and recovery rehearsal: passed on 2026-08-11 in an isolated non-production service and staging database; Render blocked both failed candidates, the second left one observed durable synthetic partial state, targeted cleanup and Prisma ledger resolution succeeded, the normal ten-migration baseline was restored, and canonical production verification remained unchanged
- live Gemini smoke: not rerun because protected credentials were unavailable in the gate shell; prior operator-observed hosted evidence remains recorded
- isolated restore verification and alert delivery: prior dated evidence retained; neither was re-executed in this gate run
- rollback rehearsal: passed on 2026-08-11 by promoting previous known-good SHA `7489189ec9afa2600a1d05cd428388c362f357ae` on both canonical origins, passing the hosted-release verifier, restoring candidate `33b7f134dc69ee7565ad2260baed9a8f208e5f4f`, and passing the verifier again

## 10. Final Decision

**GO for a controlled design-partner pilot.**

On 2026-08-11, `pnpm verify:pilot-gate` returned `GO` with 13 of 13 P0 checks passing and no unresolved entries. The pilot remains limited to the verified Stack Exchange provider scope; this decision does not claim Reddit live readiness or authorize work beyond Phase 4.5.
