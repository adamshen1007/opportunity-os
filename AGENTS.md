# Opportunity OS — Repository Working Agreement

## 1. Product and Current Outcome

Opportunity OS turns customer conversations into evidence-backed, explainable, ranked startup opportunities. Primary users are founders, product teams, and investors; the current release target is a controlled design-partner pilot.

The repository is in **Phase 4.5 — Design-Partner Readiness**. The active milestone is `TASK-P45-G01`, the Safe and Valuable Design-Partner Pilot Gate. The authoritative decision and unresolved P0 checks are maintained in `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json`; do not duplicate revision-specific counts or blocker lists here.

The current objective is to close the manifest's unresolved checks with safe evidence and make `pnpm verify:pilot-gate` return `GO`. Treat any non-`GO` result as blocking and do not invite design partners before then.

## 2. Scope and Non-Goals

Active Phase 4.5 scope is limited to the approved production-safety and opportunity-intelligence workstreams in `docs/04_IMPLEMENTATION/04-028_PHASE_4_5_EXECUTION_PLAN.md`, converging at `TASK-P45-G01`. Preserve the existing invite-only model, owner isolation, transactional deletion, evidence/provenance, deterministic quality benchmark, fail-closed provider behavior, and operator-safe monitoring and recovery controls.

The active milestone does not include enterprise features, additional connectors, payments, subscriptions, CRM integrations, notifications, multi-tenancy, schedulers, workers, recommendation engines, complex admin consoles, external identity providers, or infrastructure unrelated to the pilot.

**Do not implement in the active milestone:** future platform expansion, speculative integrations, broader production scale work, or any feature not required by a named Phase 4.5 acceptance criterion. Reddit-specific readiness remains unverified; verified Stack Exchange evidence must not be presented as Reddit readiness.

## 3. Authoritative Documents

Within repository scope, use this precedence order:

1. `AGENTS.override.md`, if later added at an applicable path, then this `AGENTS.md`.
2. `docs/04_IMPLEMENTATION/04-028_PHASE_4_5_EXECUTION_PLAN.md` for approved Phase 4.5 scope and acceptance criteria.
3. `docs/04_IMPLEMENTATION/04-034_PHASE_4_5_PILOT_GATE.md` and `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json` for the current fail-closed decision and evidence state.
4. Task-specific Phase 4.5 records indexed by `docs/04_IMPLEMENTATION/README.md`.
5. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`, then the approved vision, engineering principles, architecture, domain model, PRD, specifications, and bootstrap documents it indexes.
6. `developer-ai/` standards, patterns, playbooks, and checklists.
7. Existing code, tests, package scripts, CI, and deployment configuration as implementation evidence.

The approved active-milestone plan controls within its scope unless a higher-authority repository instruction explicitly overrides it. The current evidence manifest controls over earlier readiness summaries. Resolve other conflicts by preserving the narrowest safe Phase 4.5 interpretation and record the resolution.

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
| Clean-database migration check | `pnpm --filter @opportunity-os/database verify:migrations:clean` |
| Staging migration check | `pnpm --filter @opportunity-os/database verify:migrations:staging` |
| Isolated restored-database check | `pnpm verify:restore` |
| Docker configuration validation | `docker compose config` |
| Local API and web runtime | `pnpm dev` |

No repository-wide format command is defined; formatting is an unresolved command and must not be invented. Hosted, live-provider, migration, restore, and browser commands require their documented environment prerequisites and must never target production accidentally.

## 7. Acceptance and Verification Gates

For any change, map the affected Phase 4.5 acceptance criteria to observable evidence and run the relevant gates. The full `TASK-P45-G01` decision requires:

- repository and instruction inspection;
- `pnpm repo:check`, `node scripts/verify-repository.mjs --phase phase-4-milestone-57`, `pnpm lint`, `pnpm build`, and `pnpm test`;
- relevant targeted, integration, security, contract, browser, and smoke tests;
- migration status, clean migration, production-like upgrade, idempotency, rollback, and isolated restore evidence when data or release behavior is involved;
- two-user owner-isolation and transactional-deletion verification;
- the frozen quality benchmark thresholds: clustering precision at least 85%, recall at least 75%, duplicate opportunity rate at most 10%, citation coverage 100%, ranking agreement at least 75%, improvement at least 15 percentage points, and repeatability 100%;
- controlled live datasource and live LLM evidence without fixture substitution;
- matched web/API release SHA, hosted health/CORS checks, hosted Playwright journey, rollback rehearsal, monitoring/alert evidence, and automated backups meeting the 24-hour RPO;
- secrets and sensitive-data review, documentation/link/schema validation, whole-branch diff review against `main`, and a separate review pass.

The gate is fail-closed: every P0 check in `docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json` must be `pass`, and `pnpm verify:pilot-gate` must return `GO`. Never claim an operator or hosted gate from repository-only evidence. For each skipped gate, record the reason, strongest substitute evidence, and readiness impact.

## 8. Git and Publication Boundaries

Use `main` as the intended PR base. Keep each branch and PR to one logical, milestone-scoped change; use the `codex/` branch prefix for Codex-created branches unless the task specifies otherwise. `@adamshen1007` owns repository review; required GitHub lint, build, and test checks must pass, plus deployment/pilot checks applicable to the change.

Local inspection, editing, and reversible verification are permitted when the task authorizes the work. Commit, push, tag, PR creation or update, merge, deployment, release, production-data changes, billing actions, and other irreversible external actions require explicit authorization in the current task. Never use destructive Git operations to discard or conceal work. Report commit, push, PR, merge, deployment, and release states separately.

## 9. External Services and Manual Actions

Configured external-service surfaces include GitHub/GitHub Actions, Render, Vercel, hosted PostgreSQL/Supabase, the Stack Exchange read-only API, the conditionally supported Reddit provider path, and Gemini/OpenAI LLM provider paths. The authoritative evidence manifest determines which integrations are verified for pilot readiness. Redis is an optional configured dependency where the runtime enables it.

Follow the global working agreement for human-only actions. Repository-specific evidence must remain safe and must never place protected values or secret-bearing screenshots in the repository.

## 10. Repository-Specific Completion Additions

Follow the global completion-report contract. For Opportunity OS, also report the current pilot-manifest decision, unresolved P0 check IDs, fixture-versus-live evidence, skipped hosted or operator gates, and whether `pnpm verify:pilot-gate` returned `GO`. Do not recommend beginning a new milestone while the active gate remains non-`GO`.
