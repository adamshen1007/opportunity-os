# 05-005_IMPLEMENTATION_ORDER.md

**Document ID:** 05-005
**Version:** 3.0.0
**Status:** Approved (Engineering Kit v3.0)
**Layer:** 4 - Repository Bootstrap
**Owner:** Architecture Team

# Implementation Order

This document is the authoritative build sequence for Opportunity OS through Phase 4 Milestone 33 Reddit Live Provider Transport work.

Every Codex task must follow this order unless an approved Architecture Decision Record explicitly supersedes it.

## Build Principles

- Build contracts before implementations.
- Keep each milestone independently verifiable.
- Keep package boundaries explicit.
- Do not skip persistence, event, runtime, or security gates.
- Do not introduce business logic before its owning milestone.
- Do not begin the next milestone until the current milestone is committed, pushed, tagged, and verified.

## Completed Milestones

The following milestones are complete in Engineering Kit v3.0:

| Milestone | Status | Owner |
|-----------|--------|-------|
| Phase 0 - Repository Foundation | Complete | repository foundation |
| Phase 1 M1 - Runtime Configuration | Complete | `packages/config` |
| Phase 1 M2 - Shared Foundation | Complete | `packages/types`, `packages/errors`, `packages/utils`, `packages/shared` |
| Phase 1 M3 - Logging Foundation | Complete | `packages/shared` |
| Phase 1 M4 - Event Foundation | Complete | `packages/events` |
| Phase 1 M5 - Database Foundation | Complete | `packages/database` |
| Phase 1 M6 - Domain Foundation | Complete | `packages/domain` |
| Phase 1 M7 - Application Foundation | Complete | `packages/application` |
| Phase 1 M8 - Dependency Injection & Composition | Complete | `packages/container` |
| Phase 1 M9 - Infrastructure Composition | Complete | `packages/infrastructure` |
| Phase 2 M10 - Connector SDK Foundation | Complete | `packages/connectors` |
| Phase 2 M11 - Connector Runtime Foundation | Complete | `packages/connector-runtime` |
| Phase 2 M12 - Connector Host Foundation | Complete | `packages/connector-host` |
| Phase 2 M13 - Reddit Connector Foundation | Complete | `packages/connectors-reddit` |
| Phase 2 M14 - Reddit Runtime | Complete | `packages/connectors-reddit` |
| Phase 2 M15 - Reddit Provider Transport | Complete | `packages/connectors-reddit` |
| Phase 2 M16 - Raw Content Pipeline Foundation | Complete | `packages/raw-content` |
| Phase 2 M17 - Normalization Pipeline Foundation | Complete | `packages/normalization` |
| Phase 2 M18 - Embedding Foundation | Complete | `packages/embeddings` |
| Phase 2 M19 - LLM Analysis Foundation | Complete | `packages/llm-analysis` |
| Phase 2 M20 - Structured Analysis Foundation | Complete | `packages/analysis` |
| Phase 2 M21 - Opportunity Engine Foundation | Complete | `packages/opportunity-engine` |
| Phase 2 M22 - Opportunity Pipeline Foundation | Complete | `packages/opportunity-pipeline` |
| Phase 2 M23 - Candidate Opportunity Engine | Complete | `packages/opportunity-candidates` |
| Phase 2 M24 - Opportunity Generation Workflow | Complete | `packages/opportunity-generation` |
| Phase 3 M25 - Opportunity Ranking Engine | Complete | `packages/opportunity-ranking` |
| Phase 3 M26 - REST API | Complete | `apps/api` |
| Phase 3 M27 - Dashboard MVP | Complete | `apps/web` |
| Phase 3 M28 - Product Validation Loop | Complete | `apps/api`, `apps/web` |
| Phase 3 M29 - Private Beta | Complete | `apps/api`, `apps/web`, deployment documentation |
| Phase 3 M30 - Beta Operations | Complete | operations documentation, repository verification |
| Phase 4 M31 - Local Product Runtime | Complete | `apps/api`, `apps/web`, repository scripts |
| Phase 4 M32 - Product Data Schema | Complete | `packages/database`, `apps/api` |

## Current Platform State

The repository now contains foundation packages, connector SDK/runtime/host contracts, Reddit connector contracts, deterministic non-network Reddit runtime behavior, Reddit provider transport contracts, controlled live Reddit provider transport, Raw Content contracts, Normalization contracts, Embedding contracts, LLM Analysis Foundation contracts, Structured Analysis Foundation contracts, Opportunity Engine Foundation contracts, Opportunity Pipeline Foundation contracts, Candidate Opportunity Engine contracts, Opportunity Generation Workflow Foundation contracts, the Opportunity Ranking Engine, the REST API application boundary in `apps/api`, the Dashboard MVP in `apps/web`, completed Product Validation Loop behavior for deterministic design-partner validation, completed Phase 3 Milestone 29 Private Beta deployment readiness, completed Phase 3 Milestone 30 Beta Operations policy, completed Phase 4 Milestone 31 Local Product Runtime, completed Phase 4 Milestone 32 Product Data Schema, and active Phase 4 Milestone 33 Reddit Live Provider Transport.

The repository does not yet contain:

- schedulers
- workers
- live AI workflows
- provider LLM calls
- prompt execution runtime
- recommendation engines
- unsupported product business logic
- payments
- subscriptions
- enterprise features
- CRM integrations
- multi-tenancy

## Future Build Sequence

Engineering Kit v3.0 establishes this future order:

| Milestone | Goal | Primary Owner |
|-----------|------|---------------|
| Phase 4 M31 - Local Product Runtime | Complete | `apps/api`, `apps/web`, repository scripts |
| Phase 4 M32 - Product Data Schema | Complete | `packages/database`, `apps/api` |
| Phase 4 M33 - Reddit Live Provider Transport | Active | `packages/connectors-reddit` |

## Phase 4 M31 Boundary

Milestone 31 makes the product runnable locally for first-time workflow walkthroughs.

Allowed:

- dependency-free local HTTP server for `apps/api`
- local API `dev` and `start` commands
- dashboard API base URL configuration
- combined workspace `pnpm dev` command
- dashboard fixture fallback when the API is unavailable
- local runtime documentation and smoke tests

Not allowed:

- live Reddit ingestion
- AI workflows
- production persistence expansion
- schedulers
- workers
- billing
- analytics platforms
- notifications
- CRM integrations
- recommendation engines
- mobile apps

Milestone 31 is complete only when `node scripts/verify-repository.mjs --phase phase-4-milestone-31`, lint, build, and tests pass, and a fresh clone can start API and dashboard locally with documented commands.

## Phase 4 M33 Boundary

Milestone 33 adds controlled live Reddit provider transport inside `packages/connectors-reddit`.

Allowed:

- OAuth token exchange with explicit development credentials
- Node 24 `fetch` based HTTP transport
- public subreddit request execution for development verification
- rate-limit parsing from provider headers
- pagination metadata from Reddit listing cursors
- safe response mapping into existing Reddit contracts
- optional live integration test gated by environment variables

Not allowed:

- Raw Content persistence
- Prisma repositories
- AI workflows
- opportunity generation
- REST APIs
- frontend changes
- schedulers
- workers
- database persistence workflows
- business logic

Milestone 33 is complete only when `node scripts/verify-repository.mjs --phase phase-4-milestone-33`, lint, build, and tests pass, default tests avoid live network access, and `pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live` can fetch public Reddit posts when credentials are configured.

## Phase 2 M15 Boundary

Milestone 15 is the first milestone after the platform foundation sequence.

It may begin real provider integration architecture for Reddit, but it must not implement product workflows.

Slice A establishes the `phase-2-milestone-15` verifier gate and provider module export structure. Provider transport exports must route through `packages/connectors-reddit/src/provider/index.ts` and remain re-exported from the package root.

Slice B defines provider authentication, HTTP transport abstraction, API client, and deterministic request-building contracts only. It does not perform token exchange, refresh calls, live provider calls, scheduling, persistence, route handling, or product behavior.

Slice C defines safe response parsing, pagination transport metadata, and rate-limit parsing only. It does not persist provider responses, run pagination loops, schedule work, or execute transport requests.

Slice D defines runtime compatibility, auth lifecycle, provider error, telemetry, and DI binding contracts only. It does not implement retry runners, timers, process signal handling, worker cancellation, telemetry vendors, event buses, runtime containers, application startup, or dependency resolution.

Slice E hardens the provider transport boundary with deterministic fixtures, fake transport tests, integration coverage, security checks, contract stability checks, dependency boundary tests, and repository verification. It does not introduce live-network behavior.

Slice F completes provider transport documentation, governance, roadmap updates, and the final readiness gate. It confirms default tests use fake transport and deterministic fixtures only; no live Reddit calls are required.

Allowed:

- OAuth contract implementation
- Reddit API client abstraction
- HTTP transport abstraction
- request builder
- response parser
- pagination transport
- rate-limit parsing
- retry compatibility
- timeout compatibility
- cancellation compatibility
- authentication lifecycle
- error mapping
- telemetry integration
- deterministic fake transport and test infrastructure
- documentation and repository verification updates

Dependency direction:

- `packages/connectors-reddit` owns Reddit Provider Transport
- provider transport may reference the approved connector, runtime, host, shared logging, event, and container foundations
- future packages must consume `@opportunity-os/connectors-reddit`

Not allowed:

- Raw Content persistence
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business logic
- database persistence workflows

Milestone 15 is complete only when provider transport is implemented, tested, documented, independently buildable, verified by `phase-2-milestone-15`, and free of Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, and business logic.

## Phase 2 M16 Boundary

Milestone 16 establishes the Raw Content Pipeline Foundation in `packages/raw-content`.

Slice A creates the strict TypeScript package boundary and the `phase-2-milestone-16` repository verification gate. Public exports must route through `packages/raw-content/src/index.ts`.

Allowed:

- Raw Content package boundary
- raw content contract scaffolding in later scoped slices
- source, ingestion, provenance, normalization boundary, deduplication, fingerprinting, validation, storage port, event, and Reddit mapping contracts in later scoped slices

Not allowed:

- persistence implementation
- Prisma repositories
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business scoring

## Phase 2 M17 Boundary

Milestone 17 establishes the Normalization Pipeline Foundation in `packages/normalization`.

Public exports must route through `packages/normalization/src/index.ts`. The package consumes `@opportunity-os/raw-content` for canonical Raw Content contracts and produces canonical text, cleaning, language, chunking, preservation, validation, result, event, and fixture contracts for future consumers.

Allowed:

- Normalization package boundary
- canonical text and text segment contracts
- normalization input, output, operation, and stage vocabulary contracts
- markdown, HTML, Unicode, whitespace, and URL cleaning contracts
- language detection contracts
- text chunking contracts
- metadata and provenance preservation contracts
- validation, result, and event contracts
- deterministic fixtures
- export stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

- embeddings
- LLMs
- AI analysis
- semantic interpretation
- normalization algorithm execution
- DOM or browser behavior
- network calls
- parser-library integrations
- event buses
- database persistence
- Prisma repositories
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business scoring

## Phase 2 M18 Boundary

Milestone 18 establishes the Embedding Foundation in `packages/embeddings`.

Public exports must route through `packages/embeddings/src/index.ts`. The package consumes `@opportunity-os/normalization` for canonical text and chunk contracts, `@opportunity-os/raw-content` for source and provenance vocabulary, `@opportunity-os/shared` for context and logging vocabulary, and `@opportunity-os/events` for event contract vocabulary.

Allowed:

- Embedding package boundary
- embedding primitive contracts
- provider abstraction contracts
- embedding request and response contracts
- chunk embedding contracts
- embedding metadata and provenance contracts
- validation contracts
- cache contracts
- result, error, and event contracts
- deterministic synthetic fixtures
- export stability, contract stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

- OpenAI API calls
- Gemini API calls
- Voyage API calls
- provider SDKs
- vector databases
- model execution
- AI reasoning
- prompt execution
- cache implementation or persistence
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business logic

## Phase 2 M19 Boundary

Milestone 19 establishes the LLM Analysis Foundation in `packages/llm-analysis`.

Public exports must route through `packages/llm-analysis/src/index.ts`. The package consumes `@opportunity-os/normalization` for normalized content references, `@opportunity-os/embeddings` for provider-independent embedding references, `@opportunity-os/raw-content` for provenance vocabulary, `@opportunity-os/shared` for context and logging vocabulary, and `@opportunity-os/events` for event contract vocabulary.

Allowed:

- LLM Analysis package boundary
- provider-independent LLM provider abstraction contracts
- prompt contract types
- prompt template contracts
- prompt input and output contracts
- structured output contracts
- analysis request and response contracts
- analysis validation contracts
- safety and redaction contracts
- analysis result contracts
- secret-safe analysis error contracts
- analysis event contracts
- deterministic synthetic fixtures
- export stability, contract stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

- OpenAI API calls
- Anthropic API calls
- Gemini API calls
- provider SDKs
- live LLM calls
- prompt execution runtime
- extraction workflows
- pain point extraction
- opportunity generation
- REST APIs
- frontend
- persistence implementation
- scheduler
- worker
- business scoring

## Phase 2 M20 Boundary

Milestone 20 establishes the Structured Analysis Foundation in `packages/analysis`.

Public exports must route through `packages/analysis/src/index.ts`. The package consumes `@opportunity-os/llm-analysis` for provider-independent analysis contract vocabulary, `@opportunity-os/embeddings` for embedding references, `@opportunity-os/normalization` for normalized content references, `@opportunity-os/raw-content` for source/provenance vocabulary, and `@opportunity-os/events` for event contract vocabulary.

Allowed:

- Structured Analysis package boundary
- structured analysis primitives
- analysis input and output contracts
- parser contracts
- schema validation contracts
- structured output normalization contracts
- evidence contracts
- confidence contracts
- analysis provenance contracts
- analysis validation contracts
- analysis result contracts
- secret-safe analysis error contracts
- analysis event contracts
- deterministic synthetic fixtures
- export stability, contract stability, security, dependency-boundary, and pipeline integration tests

Not allowed:

- OpenAI API calls
- Anthropic API calls
- Gemini API calls
- provider SDKs
- live provider calls
- prompt execution
- AI reasoning
- pain point extraction
- opportunity generation
- REST APIs
- frontend
- persistence implementation
- scheduler
- worker
- business scoring
- provider payloads, API keys, real network behavior, or business examples

## Phase 2 M21 Boundary

Milestone 21 establishes the Opportunity Engine Foundation in `packages/opportunity-engine`.

Public exports must route through `packages/opportunity-engine/src/index.ts`. The package consumes `@opportunity-os/analysis` for structured analysis outputs, `@opportunity-os/llm-analysis` for provider-independent analysis vocabulary, `@opportunity-os/embeddings` for embedding references, `@opportunity-os/normalization` for normalized content references, `@opportunity-os/raw-content` for source/provenance vocabulary, `@opportunity-os/events` for event contract vocabulary, and `@opportunity-os/shared` for shared operational vocabulary.

Allowed:

- Opportunity Engine package boundary
- opportunity primitive contracts
- opportunity source and evidence contracts
- opportunity hypothesis contracts
- opportunity score contracts
- opportunity confidence contracts
- opportunity ranking contracts
- opportunity validation contracts
- opportunity result contracts
- opportunity event contracts
- deterministic fixtures
- export stability, contract stability, security, dependency-boundary, and upstream integration tests

Not allowed:

- REST APIs
- frontend
- persistence implementation
- scheduler
- worker
- live AI calls
- prompt runtime
- billing
- user accounts
- production ranking algorithm
- scoring implementation
- extraction workflow
- opportunity generation logic
- business workflows

Milestone 21 is complete when `@opportunity-os/opportunity-engine` is implemented, tested, documented, independently buildable, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, verified by `phase-2-milestone-21`, and free of REST APIs, frontend implementation, persistence implementation, scheduler behavior, workers, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, and business workflows.

## Required Verification Gate

Every implementation milestone from M15 onward must pass:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase <milestone-phase>
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

For Milestone 15, `<milestone-phase>` must be:

```sh
phase-2-milestone-15
```

For Milestone 17, `<milestone-phase>` must be:

```sh
phase-2-milestone-17
```

For Milestone 18, `<milestone-phase>` must be:

```sh
phase-2-milestone-18
```

For Milestone 19, `<milestone-phase>` must be:

```sh
phase-2-milestone-19
```

For Milestone 20, `<milestone-phase>` must be:

```sh
phase-2-milestone-20
```

For Milestone 21, `<milestone-phase>` must be:

```sh
phase-2-milestone-21
```

## Codex Execution Rules

Every Codex implementation session must:

1. Work on one scoped task or approved slice only.
2. Read the relevant Engineering Kit and Developer AI documents.
3. Modify only the files allowed by the task.
4. Preserve package boundaries.
5. Add deterministic tests with implementation changes.
6. Keep safe error and logging behavior secret-safe.
7. Run the required verification commands.
8. Stop after the assigned task is complete.

## Phase 2 M22 Boundary

Milestone 22 adds the Opportunity Pipeline Foundation in `packages/opportunity-pipeline`.

Milestone 22 establishes the `phase-2-milestone-22` verifier gate, strict TypeScript package scaffold, package README, package test config, public export boundary, pipeline primitives, stage contracts, metadata contracts, provenance contracts, evidence aggregation contracts, hypothesis assembly contracts, candidate opportunity contracts, validation contracts, result contracts, error contracts, event contracts, deterministic fixtures, export stability tests, contract stability tests, security tests, dependency-boundary tests, upstream integration tests, and workspace pipeline integration.

Milestone 22 must not introduce:

- business scoring algorithms
- ranking algorithms
- recommendation engines
- REST APIs
- frontend implementation
- persistence implementation
- schedulers
- workers
- provider SDKs
- business workflows

Required final verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-22
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

## Phase 2 M23 Boundary

Milestone 23 adds the Candidate Opportunity Engine foundation in `packages/opportunity-candidates`.

Milestone 23 establishes the `phase-2-milestone-23` verifier gate, strict TypeScript package scaffold, package README, package test config, public export boundary, candidate opportunity contracts, lifecycle contracts, validation contracts, evidence completeness contracts, confidence aggregation contracts, metadata contracts, provenance contracts, event contracts, error contracts, result contracts, deterministic fixtures, export stability tests, contract stability tests, security tests, dependency-boundary tests, upstream integration tests, and workspace pipeline integration.

Milestone 23 must not introduce:

- production ranking algorithms
- recommendation engines
- business scoring
- REST APIs
- frontend implementation
- persistence implementation
- schedulers
- workers
- provider SDKs
- business workflows

Required final verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-23
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Do not begin REST APIs, frontend implementation, persistence implementation, schedulers, workers, provider SDKs, production ranking algorithms, recommendation engines, business scoring, or business workflows until a later scoped implementation task approves them.

## Phase 2 M24 Boundary

Milestone 24 establishes the Opportunity Generation Workflow foundation in `packages/opportunity-generation`.

Milestone 24 establishes the `phase-2-milestone-24` verifier gate, strict TypeScript package scaffold, package README, package test config, public export boundary, candidate-to-opportunity generation workflow contracts, deterministic generation service contracts, input/output contracts, evidence-to-hypothesis assembly behavior contracts, candidate validation behavior contracts, confidence aggregation behavior contracts, generated opportunity result contracts, generation errors, generation events, deterministic fixtures, export stability tests, contract stability tests, security tests, dependency-boundary tests, upstream integration tests, deterministic service tests, and workspace pipeline integration.

Milestone 24 must not introduce:

- production ranking
- recommendation engines
- REST APIs
- frontend implementation
- persistence implementation
- schedulers
- workers
- billing
- user accounts
- provider SDKs
- live AI providers
- prompt execution
- provider payloads
- business workflows

Required final verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-24
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Do not begin REST APIs, frontend implementation, persistence implementation, schedulers, workers, provider SDKs, production ranking, recommendation engines, billing, user accounts, live AI providers, or business workflows until a later scoped implementation task approves them.

## Phase 3 M25 Boundary

Milestone 25 begins the Product Behavior phase and establishes the Opportunity Ranking Engine in `packages/opportunity-ranking`.

Milestone 25 establishes the `phase-3-milestone-25` verifier gate, strict TypeScript package scaffold, package README, package test config, public export boundary, deterministic ranking primitives, ranking inputs and outputs, ranking signals, ranking factors, ranking weights, score calculation, ranking pipeline behavior, stable tie breaking, explanation model, ranking validation, ranking results, ranking errors, ranking events, deterministic synthetic ranking fixtures, export stability tests, contract stability tests, ranking behavior tests, ranking quality tests, security tests, dependency-boundary tests, upstream integration tests, workspace integration, documentation, governance, and final readiness gate.

Every ranking decision must remain deterministic, testable, explainable, and reconstructable from explicit inputs, signals, factors, and weights.

Milestone 25 must not introduce:

- recommendation engines
- REST APIs
- frontend implementation
- persistence implementation
- schedulers
- workers
- billing
- user accounts
- provider SDKs
- ML behavior
- LLM calls
- hidden heuristics
- prompts
- provider payloads
- secrets
- production business examples

Required final verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-25
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Do not begin frontend implementation, persistence implementation, schedulers, workers, provider SDKs, recommendation engines, billing, user accounts, ML behavior, or LLM calls until a later scoped implementation task approves them.

## Phase 3 M26 Boundary

Milestone 26 establishes the REST API application boundary in `apps/api`.

Milestone 26 establishes the `phase-3-milestone-26` verifier gate, strict TypeScript application scaffold, package README, explicit bootstrap exports, package metadata, package ownership, routing, OpenAPI contracts, health endpoint, opportunity endpoints, ranking endpoints, pagination, filtering, request validation, error mapping, authentication and authorization contracts, request context contracts, API versioning, deterministic fixtures, API integration tests, API security tests, contract stability tests, dependency-boundary tests, workspace integration, documentation, governance, and final readiness gate.

Milestone 26 may introduce:

- API bootstrap
- routing
- OpenAPI contracts
- health endpoint
- opportunity endpoints
- ranking endpoints
- pagination and filtering
- request validation
- error mapping
- authentication and authorization contracts
- API versioning
- API documentation
- deterministic synthetic fixtures
- API integration tests
- API security tests
- contract stability tests
- dependency-boundary tests

Milestone 26 must not introduce:

- frontend implementation
- billing
- user management
- analytics
- notifications
- production authentication providers
- persistence changes
- schedulers
- workers
- provider SDKs
- unrelated product workflows

Required final verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-26
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Milestone 26 is complete only when `apps/api` is implemented, tested, documented, independently buildable, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, verified by `phase-3-milestone-26`, and free of frontend implementation, billing, user management, analytics, notifications, production authentication providers, persistence changes, schedulers, workers, provider SDKs, and unrelated product workflows.

Do not begin work beyond the scoped Phase 3 Milestone 29 Private Beta slice until a later scoped implementation task approves the next slice.

## Phase 3 M27 Boundary

Milestone 27 creates the first customer-facing Opportunity OS application in `apps/web`.

Milestone 27 establishes the `phase-3-milestone-27` verifier gate, Next.js App Router scaffold, strict TypeScript configuration, `@opportunity-os/web` package metadata, independent build script, dashboard shell, route map, navigation, opportunity views, ranking view, evidence view, search, filters, pagination, UI states, API integration, deterministic fixtures, dashboard tests, Playwright coverage, and dashboard ownership documentation.

Milestone 27 may introduce:

- Next.js App Router application bootstrap
- routing
- layout
- navigation
- Opportunity List page
- Opportunity Detail page
- Ranking View
- Evidence View
- Search UI
- Filter UI
- Pagination UI
- loading states
- error states
- empty states
- API integration layer for `apps/api`
- OpenAPI client generation
- deterministic frontend fixtures
- Playwright coverage

Milestone 27 must not introduce:

- authentication implementation
- billing
- analytics
- notifications
- user accounts
- production deployment
- persistence changes
- recommendation engine
- mobile app
- schedulers
- workers
- provider SDKs
- unrelated backend changes

Required Milestone 27 verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-27
pnpm install --frozen-lockfile
pnpm lint
pnpm --filter @opportunity-os/web build
pnpm --filter @opportunity-os/web test
pnpm --filter @opportunity-os/web test:e2e
pnpm build
pnpm test
docker compose config
```

Milestone 27 is complete only when `apps/web` is implemented, tested, documented, independently buildable, covered by unit/component tests and Playwright browser tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, verified by `phase-3-milestone-27`, and free of prohibited implementation.

Final readiness commands:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-27
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

## Phase 3 Milestone 28 Boundary

Phase 3 Milestone 28 prepares Opportunity OS for design-partner validation through deterministic product validation.

Milestone 28 establishes the `phase-3-milestone-28` verifier gate and Product Validation Loop policy with deterministic feedback API behavior, dashboard feedback interactions, and design-partner walkthrough documentation for save opportunity, dismiss opportunity, usefulness rating, evidence quality rating, ranking quality rating, and feedback reason categories.

Milestone 28 introduces:

- deterministic product validation boundaries
- feedback vocabulary
- feedback API DTOs, validation, safe errors, in-memory store behavior, route handlers, and fixtures
- dashboard feedback interactions, validation summary, search/filter improvements, and demo-ready states
- API/web alignment tests and cross-app quality gates
- deterministic feedback fixtures
- design-partner walkthrough documentation

Milestone 28 must not introduce:

- production persistence
- billing
- analytics platforms
- notifications
- email
- CRM integrations
- schedulers
- workers
- mobile apps
- complex admin console
- unrelated product systems

Required Milestone 28 final verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-28
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

Milestone 28 is complete only when repository verification supports `phase-3-milestone-28`, Product Validation Loop documentation states deterministic product validation only, API feedback behavior is exported through `apps/api`, dashboard feedback interactions consume the web API boundary, cross-app alignment tests pass, design-partner walkthrough documentation is current, final verification commands pass, and prohibited implementation remains absent.

## Phase 3 Milestone 29 Boundary

Phase 3 Milestone 29 prepares Opportunity OS for Private Beta launch with the first 10-20 design partners.

Slice A establishes the `phase-3-milestone-29` verifier gate, Private Beta boundaries, deployment architecture, deployment readiness configuration, and governance. Slice B adds deployment and operations policy for production config, secrets management, health monitoring, operational logging, monitoring strategy, and backup strategy. Slice C adds invite-only authentication contracts, invite validation, session management contracts, and minimal invite/session persistence schema. Slice D adds the deterministic protected dashboard workflow, onboarding, feedback persistence schema, save/dismiss persistence path, bug reporting, and invite workflow UI/API coverage. It does not implement billing, multi-tenancy, production identity providers, enterprise auth, monitoring vendor integration, backup execution, or production traffic routing.

Milestone 29 Slice A introduces:

- Private Beta boundary documentation
- deployment architecture
- `.github/workflows/deploy.yml` deployment readiness configuration
- `docs/04_IMPLEMENTATION/04-004_PRIVATE_BETA_DEPLOYMENT.md`
- repository verification support for `phase-3-milestone-29`
- governance updates for Private Beta changes

Milestone 29 Slice B introduces:

- deployment workflow hardening
- production config template in `config/private-beta.env.example`
- secrets management policy
- health monitoring policy
- operational logging policy
- monitoring strategy
- backup strategy
- `docs/04_IMPLEMENTATION/04-005_PRIVATE_BETA_OPERATIONS.md`
- repository verification updates for the operations baseline

Milestone 29 Slice C introduces:

- invite contracts
- invite validation
- session management
- minimal persistence schema for `PrivateBetaInvite` and `PrivateBetaSession`
- secret-safe invite-only API tests
- repository verification updates for invite-only authentication and persistence

Milestone 29 Slice D introduces:

- protected dashboard state
- onboarding state
- feedback persistence schema for `PrivateBetaFeedback`
- save/dismiss persistence path
- bug reporting schema and API route
- invite workflow UI coverage
- deterministic API and dashboard tests

Milestone 29 Slice E introduces:

- config binding documentation
- clear deployment instructions
- rollback guidance
- monitoring guidance
- beta operations documentation
- operational runbook in `docs/04_IMPLEMENTATION/04-006_PRIVATE_BETA_RUNBOOK.md`
- beta checklist in `docs/04_IMPLEMENTATION/04-007_PRIVATE_BETA_CHECKLIST.md`

Later scoped Private Beta slices may introduce:

- production deployment
- production configuration
- monitoring
- health monitoring
- logging
- backup strategy

Milestone 29 must not introduce:

- payments
- subscriptions
- enterprise features
- notifications
- CRM integrations
- multi-tenancy
- billing
- production identity provider
- enterprise auth

Required Slice E verification:

```sh
pnpm build
```

Milestone 29 Slice E is complete only when repository verification supports `phase-3-milestone-29`, Private Beta deployment readiness is documented, deployment architecture and deployment readiness configuration exist, production config, config binding, secrets management, health monitoring, operational logging, monitoring strategy, backup strategy, rollback guidance, beta checklist, and operational runbook are documented, invite-only authentication and session management are implemented with safe tests, persistence is limited to Private Beta invites, sessions, feedback, and bug reports, protected dashboard/onboarding/save/dismiss/bug-reporting/invite workflow behavior is deterministic, `apps/api` and `apps/web` remain the API and dashboard boundaries, and prohibited implementation remains absent.

## Phase 3 Milestone 30 Boundary

Phase 3 Milestone 30 prepares Opportunity OS for Beta Operations with the first 10-20 design partners.

Milestone 30 is operations-only. It may improve operational documentation, verification policy, launch discipline, and support workflows, but it must not add new product behavior.

Slice A establishes:

- Beta Operations boundary documentation
- `phase-3-milestone-30` repository verification support
- active `review` gate alignment with Beta Operations
- governance that continues blocking unscoped feature work

Slice B establishes:

- deployment verification procedure
- deployment smoke testing procedure
- rollback verification procedure
- monitoring verification procedure
- health verification procedure
- log verification procedure
- `docs/04_IMPLEMENTATION/04-008_BETA_OPERATIONS_VERIFICATION.md`

Slice C establishes:

- operator handbook
- beta handbook
- invite documentation
- onboarding workflow
- support documentation
- `docs/04_IMPLEMENTATION/04-009_BETA_OPERATOR_HANDBOOK.md`
- `docs/04_IMPLEMENTATION/04-010_BETA_USER_HANDBOOK.md`
- `docs/04_IMPLEMENTATION/04-011_BETA_SUPPORT_GUIDE.md`

Slice D establishes:

- bug triage workflow
- feature request workflow
- feedback review workflow
- production readiness checklist
- release checklist
- launch checklist
- troubleshooting guide
- `docs/04_IMPLEMENTATION/04-012_BETA_OPERATIONAL_WORKFLOWS.md`
- `docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-014_RELEASE_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-015_LAUNCH_CHECKLIST.md`
- `docs/04_IMPLEMENTATION/04-016_BETA_TROUBLESHOOTING_GUIDE.md`

Slice E establishes:

- PR governance for Beta Operations review
- documentation index synchronization
- implementation order synchronization
- consistency verification in `scripts/verify-repository.mjs`
- `.github/pull_request_template.md` Beta Operations review checklist
- `node scripts/verify-repository.mjs --phase review`

Milestone 30 must not introduce:

- new backend features
- AI features
- payments
- CRM integrations
- notifications
- analytics platforms
- mobile apps
- schedulers
- workers
- new APIs
- new dashboard features
- new persistence features
- new authentication features

Verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-30
pnpm lint
pnpm build
```

Milestone 30 Slice A is complete only when repository verification supports `phase-3-milestone-30`, the active review gate enforces Beta Operations policy, Beta Operations is documented as operations-only, Private Beta readiness remains intact, and prohibited implementation remains absent.

Milestone 30 Slice B is complete only when deployment verification, deployment smoke testing, rollback verification, monitoring verification, health verification, and log verification are documented in `docs/04_IMPLEMENTATION/04-008_BETA_OPERATIONS_VERIFICATION.md`, `pnpm build` passes, and prohibited implementation remains absent.

Milestone 30 Slice C is complete only when the operator handbook, beta handbook, invite documentation, onboarding workflow, and support documentation are documented in `docs/04_IMPLEMENTATION/04-009_BETA_OPERATOR_HANDBOOK.md`, `docs/04_IMPLEMENTATION/04-010_BETA_USER_HANDBOOK.md`, and `docs/04_IMPLEMENTATION/04-011_BETA_SUPPORT_GUIDE.md`, `pnpm build` passes, and prohibited implementation remains absent.

Milestone 30 Slice D is complete only when bug triage, feature request, feedback review, production readiness, release, launch, and troubleshooting workflows are documented in `docs/04_IMPLEMENTATION/04-012_BETA_OPERATIONAL_WORKFLOWS.md`, `docs/04_IMPLEMENTATION/04-013_PRODUCTION_READINESS_CHECKLIST.md`, `docs/04_IMPLEMENTATION/04-014_RELEASE_CHECKLIST.md`, `docs/04_IMPLEMENTATION/04-015_LAUNCH_CHECKLIST.md`, and `docs/04_IMPLEMENTATION/04-016_BETA_TROUBLESHOOTING_GUIDE.md`, `pnpm build` passes, and prohibited implementation remains absent.

Milestone 30 Slice E is complete only when PR governance, documentation index, implementation order, and consistency verification are synchronized, `.github/pull_request_template.md` includes Beta Operations review, `node scripts/verify-repository.mjs --phase review` passes, and prohibited implementation remains absent.

## Definition of Complete

A milestone is complete only when:

- implementation is committed
- tests pass
- repository verification passes
- Docker Compose config validates when required
- documentation matches implementation
- prohibited work remains absent
- the milestone is tagged

## Revision History

| Version | Summary |
|---------|---------|
| 2.0.0 | Defined the initial repository bootstrap implementation sequence. |
| 3.0.0 | Rebased the canonical implementation order on completed work through Phase 2 Milestone 17 and defined the initial Milestone 18 handoff. |
| 3.0.1 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 18 Embedding Foundation work and the Milestone 19 AI analysis handoff. |
| 3.0.2 | Updated the canonical implementation order after Phase 2 Milestone 19 LLM Analysis Foundation work and defined the initial Milestone 20 handoff. |
| 3.0.3 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 20 Structured Analysis Foundation work and the Milestone 21 Opportunity Engine handoff. |
| 3.0.4 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 21 Opportunity Engine Foundation work. |
| 3.0.5 | Updated the canonical implementation order to make Phase 2 Milestone 22 the Opportunity Pipeline Foundation and move REST API work behind the pipeline boundary. |
| 3.0.6 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 22 Opportunity Pipeline Foundation work. |
| 3.0.7 | Updated the canonical implementation order to make Phase 2 Milestone 23 the Candidate Opportunity Engine and move REST API work behind the candidate boundary. |
| 3.0.8 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 23 Candidate Opportunity Engine Foundation work. |
| 3.0.9 | Updated the canonical implementation order to make Phase 2 Milestone 24 the Opportunity Generation Workflow and move REST API work behind the generation boundary. |
| 3.0.10 | Updated the canonical implementation order to reflect completed Phase 2 Milestone 24 Opportunity Generation Workflow Foundation work. |
| 3.0.11 | Updated the canonical implementation order to make Phase 3 Milestone 25 the Opportunity Ranking Engine and begin the Product Behavior phase. |
| 3.0.12 | Updated the canonical implementation order to reflect completed Phase 3 Milestone 25 Opportunity Ranking Engine work and define the REST API handoff. |
| 3.0.13 | Updated the canonical implementation order to reflect completed Phase 3 Milestone 26 REST API work and define the Dashboard handoff. |
| 3.0.14 | Added the Phase 3 Milestone 27 Dashboard MVP foundation boundary and verification gate. |
| 3.0.15 | Completed the Phase 3 Milestone 27 Dashboard MVP implementation order, readiness commands, and final governance gate. |
