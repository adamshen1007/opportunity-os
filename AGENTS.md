# Opportunity OS — Repository Working Agreement

## 1. Product and Current Outcome

Opportunity OS turns customer conversations into evidence-backed, explainable, ranked startup opportunities. Primary users are founders, product teams, and investors; the current release target is a controlled design-partner pilot.

The repository is in **Phase 5 — Design-Partner Learning Pilot**. The active task is `TASK-P5-A01`, Cohort 1 Readiness. Its canonical plan, frozen evidence contract, readiness record, and fail-closed state are maintained in `docs/04_IMPLEMENTATION/04-036_PHASE_5_DESIGN_PARTNER_PILOT_PLAN.md`, `docs/04_IMPLEMENTATION/04-037_PHASE_5_EVIDENCE_CONTRACT.md`, `docs/04_IMPLEMENTATION/04-038_PHASE_5_COHORT_1_READINESS.md`, and `docs/04_IMPLEMENTATION/evidence/phase-5-design-partner-pilot.json`.

Phase 4.5 is closed at `GO` with 13 of 13 P0 checks passing. Its manifest and `pnpm verify:pilot-gate` remain the production-safety prerequisite and must stay `GO`. G01 is externally complete at merged `main` SHA `28c4f93cc1a77c9452cf593ad07a2a05c19d1ce4` with canonical digest `930185fc07283f0ed175fe0ede59985dfa22abe225b25c42bef55906500b9109`. Phase 5 itself remains `NO-GO`: A01 may freeze only the matched release, current production safeguards, approved narrow domain, private five-person cohort facts, protocol, and aggregate ready state. Product/runtime work, invitations, and cohort execution remain prohibited until A01 passes independent review and exact-byte publication verification.

## 2. Scope and Non-Goals

Active A01 scope is readiness governance only: verify the matched hosted release, current migration and backup/RPO safeguards, freeze the approved domain and Stack Exchange live protocol, record only private-cohort aggregate facts, and keep all activity counts at zero. Preserve the existing invite-only model, owner isolation, transactional deletion, evidence/provenance, deterministic quality benchmark, fail-closed provider behavior, and operator-safe monitoring and recovery controls.

The active task does not include product/runtime behavior, app/package changes, workflows, migrations, provider configuration, infrastructure, deployments, production mutations, pilot invitations, cohort sessions, or participant-level repository evidence. Phase 5 does not include enterprise features, additional connectors, payments, subscriptions, CRM integrations, notifications, multi-tenancy expansion, schedulers, workers, recommendation engines, complex admin consoles, external identity providers, or infrastructure unrelated to evidenced pilot remediation.

**Do not implement during A01:** any product/runtime behavior, invitation/session activity, or subsequent Phase 5 task. Reddit-specific readiness remains unverified; verified Stack Exchange evidence must not be presented as Reddit readiness.

## 3. Authoritative Documents

Within repository scope, use this precedence order:

1. `AGENTS.override.md`, if later added at an applicable path, then this `AGENTS.md`.
2. `docs/04_IMPLEMENTATION/04-036_PHASE_5_DESIGN_PARTNER_PILOT_PLAN.md` for Phase 5 scope, task order, acceptance criteria, gates, and authorization boundaries.
3. `docs/04_IMPLEMENTATION/evidence/phase-5-design-partner-pilot.json` for the current fail-closed Phase 5 state.
4. Task-specific Phase 5 records indexed by `docs/04_IMPLEMENTATION/README.md`.
5. `docs/04_IMPLEMENTATION/04-025_DESIGN_PARTNER_PILOT.md` for the approved pilot hypothesis, cohort structure, session flow, and value thresholds.
6. `docs/04_IMPLEMENTATION/04-028_PHASE_4_5_EXECUTION_PLAN.md`, `docs/04_IMPLEMENTATION/04-034_PHASE_4_5_PILOT_GATE.md`, and `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json` as closed Phase 4.5 scope and readiness evidence.
7. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`, then the approved vision, engineering principles, architecture, domain model, PRD, specifications, and bootstrap documents it indexes.
8. `developer-ai/` standards, patterns, playbooks, and checklists.
9. Existing code, tests, package scripts, CI, and deployment configuration as implementation evidence.

The approved active-task plan controls within its scope unless a higher-authority repository instruction explicitly overrides it. The current Phase 5 manifest controls over earlier Phase 5 readiness summaries; the Phase 4.5 manifest continues to control its closed prerequisite gate. Resolve other conflicts by preserving the narrowest safe Phase 5 interpretation and record the resolution.

## 4. Repository, Stack, and Layout

- Repository: `adamshen1007/opportunity-os`; intended base and default branch: `main`.
- Monorepo tooling: Node.js `>=24 <25`, pnpm `11.7.0`, Corepack, pnpm workspaces, and Turborepo.
- Applications: `apps/api` is the TypeScript API/runtime boundary; `apps/web` is the strict-TypeScript Next.js App Router dashboard.
- Packages: `packages/` owns shared, acquisition, connector, data, intelligence, opportunity, and ranking capabilities. Package public contracts route through package entry points; do not import another package's internals.
- Data and tests: Prisma with PostgreSQL, Vitest, Node's test runner, and Playwright.
- Operations: Docker Compose locally; Render API, Vercel web, hosted PostgreSQL/Supabase, and GitHub Actions for hosted operation and CI.
- Support areas: `docs/`, `developer-ai/`, `scripts/`, `schemas/`, `prompts/`, `research/fixtures/`, `config/`, `infrastructure/`, and `docker/`.

## 5. Architecture and Implementation Boundaries

- Dependencies flow from Application Platform to Intelligence Platform to Data Acquisition Framework. Reverse dependencies and cross-boundary shortcuts are prohibited.
- Raw Content and Canonical Content are immutable. Business logic consumes canonical, provider-independent content; AI interpretations never modify source evidence.
- Connectors do not execute AI logic. Provider payloads stay inside acquisition boundaries. Services communicate through documented, versioned contracts.
- Scoring, ranking, tie-breaking, and business decisions remain deterministic, reproducible, explainable, and reconstructable from versioned signals and weights. Missing evidence lowers confidence; it must not create inferred certainty.
- Every derived claim remains traceable to evidence, provenance, model/provider metadata where applicable, and schema/prompt/workflow versions. Live provider output must pass schema, citation, and evidence-reference validation and fail closed.
- Ownership is derived from the server-side session. All protected reads, mutations, retries, cancellation, feedback, and deletion remain owner-scoped. Cross-user identifier probing must not reveal existence.
- Scan deletion remains transactional, complete, idempotent, retry-safe, and orphan-free. Database migrations are ordered, additive, forward-only, observable, and must stop release promotion on failure.
- Fixture mode is the CI default and must be visibly distinguishable from live mode. A failed live request must never become a successful fixture result.
- Never commit or expose credentials, invite/session tokens, auth headers, database URLs, prompts, raw provider responses, private participant data, stacks, or raw causes. Logs, health output, operations output, fixtures, screenshots, and evidence records must remain secret-safe.
- Preserve backward-compatible public contracts unless the approved milestone explicitly authorizes a breaking change. Architecture-constraint changes require an ADR.
- Reuse the existing stack and patterns. Do not add future-milestone behavior, unrelated refactors, dependency upgrades, or new infrastructure without approved scope.

## 6. Supported Commands

Run commands from the repository root. Do not substitute npm or yarn for pnpm.

| Purpose | Verified command |
| --- | --- |
| Enable package manager | `corepack enable` |
| Install | `pnpm install --frozen-lockfile` |
| Repository/document validation | `pnpm repo:check` |
| Latest implemented repository boundary gate | `node scripts/verify-repository.mjs --phase phase-4-milestone-57` |
| Lint and static analysis | `pnpm lint` |
| Build | `pnpm build` |
| Full deterministic test suite | `pnpm test` |
| Targeted workspace test | `pnpm --filter <workspace-name> test` |
| Web end-to-end tests | `pnpm --filter @opportunity-os/web test:e2e` |
| Hosted web end-to-end tests | `pnpm --filter @opportunity-os/web test:e2e:hosted` |
| Validate quality benchmark | `pnpm benchmark:quality:validate` |
| Evaluate quality benchmark | `pnpm benchmark:quality` |
| Evaluate clustered benchmark | `pnpm benchmark:quality:clustered` |
| External smoke verification | `pnpm smoke:external` |
| Hosted release verification | `pnpm verify:hosted-release` |
| Fail-closed pilot gate | `pnpm verify:pilot-gate` |
| Fail-closed Phase 5 gate | `pnpm verify:phase-5-gate` |
| Clean-database migration check | `pnpm --filter @opportunity-os/database verify:migrations:clean` |
| Staging migration check | `pnpm --filter @opportunity-os/database verify:migrations:staging` |
| Isolated restored-database check | `pnpm verify:restore` |
| Docker configuration validation | `docker compose config` |
| Local API and web runtime | `pnpm dev` |

No repository-wide format command is defined; formatting is an unresolved command and must not be invented. Hosted, live-provider, migration, restore, and browser commands require their documented environment prerequisites and must never target production accidentally.

## 7. Acceptance and Verification Gates

For any change, map the affected Phase 5 acceptance criteria to observable evidence and preserve the Phase 4.5 prerequisite. The A01 candidate decision requires:

- repository and instruction inspection;
- authority consistency across `AGENTS.md`, the Phase 5 plan, evidence contract and manifests, the roadmap, the implementation order, both documentation indexes, and the pilot contract;
- `git diff --check`, `pnpm repo:check`, `node scripts/verify-repository.mjs --phase phase-4-milestone-57`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`;
- focused negative/boundary tests for exact threshold arithmetic, source/mode eligibility, aggregate privacy, Cohort 2 optionality, and validation revisions;
- `pnpm verify:phase-5-gate` returning the expected fail-closed `NO-GO` for the empty, not-started cohort record;
- stale-current-authority, changed-path, and secret-pattern scans;
- `pnpm verify:pilot-gate` remaining `GO` with 13 of 13 checks passing and no unresolved entries;
- a whole-branch diff review against `main`; and
- current read-only migration and backup/RPO evidence, aggregate-only readiness evidence, fresh independent candidate review, and exact-byte publication verification before invitations can become operationally eligible.

Rollback, hosted two-user isolation, live-provider, alert, restore, and frozen quality-benchmark outcomes remain closed Phase 4.5 prerequisite evidence. A01 freshly verifies current hosted release, migration status, database health, and backup/RPO status without mutating production.

The Phase 4.5 prerequisite remains fail-closed: every P0 check in `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json` must stay `pass`, and `pnpm verify:pilot-gate` must return `GO`. The Phase 5 manifest remains `NO-GO` until its governed checks pass. Never claim an operator, cohort, value, or hosted gate from repository-only evidence. For each skipped gate, record the reason, strongest substitute evidence, and readiness impact.

## 8. Git and Publication Boundaries

Use `main` as the intended PR base. Keep each branch and PR to one logical, milestone-scoped change; use the `codex/` branch prefix for Codex-created branches unless the task specifies otherwise. `@adamshen1007` owns repository review; required GitHub lint, build, and test checks must pass, plus deployment/pilot checks applicable to the change.

Local inspection, editing, and reversible verification are permitted when the task authorizes the work. Commit, push, tag, PR creation or update, merge, deployment, release, production-data changes, billing actions, and other irreversible external actions require explicit authorization in the current task. Never use destructive Git operations to discard or conceal work. Report commit, push, PR, merge, deployment, and release states separately.

## 9. External Services and Manual Actions

Configured external-service surfaces include GitHub/GitHub Actions, Render, Vercel, hosted PostgreSQL/Supabase, the Stack Exchange read-only API, the conditionally supported Reddit provider path, and Gemini/OpenAI LLM provider paths. The authoritative evidence manifest determines which integrations are verified for pilot readiness. Redis is an optional configured dependency where the runtime enables it.

Follow the global working agreement for human-only actions. Repository-specific evidence must remain safe and must never place protected values or secret-bearing screenshots in the repository.

## 10. Repository-Specific Completion Additions

Follow the global completion-report contract. For Opportunity OS, also report the current Phase 5 manifest decision, unresolved P0 check IDs, the closed Phase 4.5 prerequisite decision, fixture-versus-live evidence, skipped hosted or operator gates, whether `pnpm verify:pilot-gate` returned `GO`, and the exact expected `pnpm verify:phase-5-gate` decision. Do not recommend beginning a subsequent task or phase while its governing gate remains non-`GO`.
