# Opportunity OS

Opportunity OS is currently an Engineering Kit, staged platform foundation, Product Behavior foundation, REST API foundation, Dashboard MVP, and completed Product Validation Loop. The repository contains shared foundation packages, connector foundation packages, Reddit provider transport contracts, deterministic Reddit runtime support, Raw Content Pipeline Foundation contracts, Normalization Pipeline Foundation contracts, Embedding Foundation contracts, LLM Analysis Foundation contracts, Structured Analysis Foundation contracts, Opportunity Engine Foundation contracts, Opportunity Pipeline Foundation contracts, Candidate Opportunity Engine Foundation contracts, Opportunity Generation Workflow Foundation contracts, the Opportunity Ranking Engine, the completed `apps/api` REST API application boundary, the completed `apps/web` Dashboard MVP application boundary, deterministic product validation feedback API behavior, dashboard feedback interactions, demo-ready validation states, and design-partner walkthrough documentation. It intentionally does not contain recommendation engines, AI workflows, production persistence, schedulers, workers, provider AI calls, vector databases, billing, user accounts, production authentication providers, ML behavior, LLM calls, analytics platforms, notifications, email integrations, CRM integrations, mobile apps, or a complex admin console.

Engineering Kit v3.0 is the canonical reference for future Codex work. It now reflects completed implementation through Phase 3 Milestone 28: Product Validation Loop. Phase 3 begins deterministic product behavior; Milestone 28 prepares design-partner validation through deterministic feedback routes, in-memory validation behavior, dashboard interactions, cross-app quality gates, and walkthrough documentation without production persistence, billing, analytics platforms, notifications, email, CRM integrations, schedulers, workers, mobile apps, or a complex admin console.

## Start Here

1. Read `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`.
2. Read `developer-ai/00_CONTEXT/MISSION.md`.
3. Read `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.
4. Read `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`.
5. Read `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`.
6. Use the relevant specification, Developer AI playbook, and checklist before any implementation work.

## Engineering Kit

The Engineering Kit is the source of truth for product intent, architecture, bootstrap rules, and implementation order.

Required reading order:

1. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`
2. `docs/01_FOUNDATION/01-001_VISION.md`
3. `docs/01_FOUNDATION/01-002_ENGINEERING_PRINCIPLES.md`
4. `docs/01_FOUNDATION/01-003_GLOSSARY.md`
5. `docs/02_ARCHITECTURE/02-001_ARCHITECTURE.md`
6. `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`
7. `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`
8. `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md`
9. `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`

Read task-specific specifications from `docs/03_SPECIFICATIONS/` before implementation work begins.

## Developer AI Documents

Developer AI documents define how AI-assisted work should be performed in this repository.

Required before implementation:

1. `developer-ai/00_CONTEXT/MISSION.md`
2. `developer-ai/00_CONTEXT/ARCHITECTURE_MAP.md`
3. `developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md`
4. Relevant standards from `developer-ai/01_STANDARDS/`
5. Relevant patterns from `developer-ai/02_PATTERNS/`
6. Relevant playbook from `developer-ai/03_PLAYBOOKS/`
7. Relevant checklist from `developer-ai/05_CHECKLISTS/`

## Repository Areas

- `docs/` contains product, architecture, specification, implementation, and bootstrap documents.
- `developer-ai/` contains AI agent context, standards, patterns, playbooks, prompts, and checklists.
- `apps/` contains application entry points. `apps/api` is the Phase 3 Milestone 26 REST API application boundary and Phase 3 Milestone 28 deterministic feedback API owner; `apps/web` is the Phase 3 Milestone 27 Dashboard MVP application boundary and Phase 3 Milestone 28 design-partner validation experience owner.
- `packages/` contains shared infrastructure workspace packages introduced in Phase 1, connector/raw-content/normalization/embedding/analysis/opportunity foundations introduced in Phase 2, and product-behavior foundations introduced in Phase 3. Current implemented packages are `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, `packages/shared`, `packages/events`, `packages/database`, `packages/domain`, `packages/application`, `packages/container`, `packages/infrastructure`, `packages/connectors`, `packages/connector-runtime`, `packages/connector-host`, `packages/connectors-reddit`, `packages/raw-content`, `packages/normalization`, `packages/embeddings`, `packages/llm-analysis`, `packages/analysis`, `packages/opportunity-engine`, `packages/opportunity-pipeline`, `packages/opportunity-candidates`, `packages/opportunity-generation`, and `packages/opportunity-ranking`.
- `schemas/`, `prompts/`, `examples/`, `infrastructure/`, `docker/`, and `scripts/` are repository support areas.
- `.github/` contains contribution automation, issue templates, pull request templates, labels, owners, and CI workflows.

## Local Verification

```sh
node scripts/verify-repository.mjs --phase review
pnpm install
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
```

During Phase 3 Product Validation Loop work, these commands verify repository structure, document numbering, README coverage, cross references, package boundaries, logging, event, database, domain, application, container, infrastructure composition, connector SDK foundation policy, connector runtime foundation policy, connector host foundation policy, Reddit connector foundation policy, Reddit runtime policy, Reddit provider transport boundary policy, Raw Content Pipeline Foundation policy, Normalization Pipeline Foundation policy, Embedding Foundation policy, LLM Analysis Foundation policy, Structured Analysis Foundation policy, Opportunity Engine Foundation policy, Opportunity Pipeline Foundation policy, Candidate Opportunity Engine policy, Opportunity Generation Workflow policy, Opportunity Ranking Engine policy, REST API foundation policy, Dashboard MVP foundation policy, Product Validation Loop policy, and package-level tests for `apps/api`, `apps/web`, `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, `packages/shared`, `packages/events`, `packages/database`, `packages/domain`, `packages/application`, `packages/container`, `packages/infrastructure`, `packages/connectors`, `packages/connector-runtime`, `packages/connector-host`, `packages/connectors-reddit`, `packages/raw-content`, `packages/normalization`, `packages/embeddings`, `packages/llm-analysis`, `packages/analysis`, `packages/opportunity-engine`, `packages/opportunity-pipeline`, `packages/opportunity-candidates`, `packages/opportunity-generation`, and `packages/opportunity-ranking`.

Phase 2 Milestone 15: Reddit Provider Transport has an explicit `phase-2-milestone-15` verification gate. Milestone 15 may introduce provider transport architecture only inside `packages/connectors-reddit`; it must not introduce Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, or business logic.

Phase 2 Milestone 16: Raw Content Pipeline Foundation has an explicit `phase-2-milestone-16` verification gate. Milestone 16 introduces `@opportunity-os/raw-content` as the owner of Raw Content contracts only; it must not introduce persistence implementation, Prisma repositories, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, or business scoring.

Phase 2 Milestone 17: Normalization Pipeline Foundation has an explicit `phase-2-milestone-17` verification gate. Milestone 17 introduces `@opportunity-os/normalization` as the owner of normalization contracts, canonical text contracts, deterministic cleaning contracts, language and chunking contracts, metadata/provenance preservation contracts, validation/result/event contracts, deterministic fixtures, security tests, export stability tests, dependency-boundary tests, and pipeline integration tests. It must not introduce embeddings, LLMs, AI analysis, opportunity generation, REST APIs, frontend, scheduler, persistence implementation, Prisma repositories, workers, event buses, database implementation, or business scoring.

Phase 2 Milestone 18: Embedding Foundation has an explicit `phase-2-milestone-18` verification gate. Milestone 18 introduces `@opportunity-os/embeddings` as the owner of provider-independent embedding contracts, provider abstraction contracts, embedding request/response contracts, chunk embedding contracts, metadata/provenance contracts, validation/cache contracts, result/error/event contracts, deterministic synthetic fixtures, security tests, export stability tests, dependency-boundary tests, and pipeline integration tests. It must not introduce OpenAI API calls, Gemini API calls, Voyage API calls, vector databases, AI reasoning, prompt execution, opportunity generation, REST APIs, frontend, persistence implementation, scheduler behavior, workers, or business logic.

Phase 2 Milestone 19: LLM Analysis Foundation has an explicit `phase-2-milestone-19` verification gate. Milestone 19 introduces `@opportunity-os/llm-analysis` as the owner of provider-independent LLM provider contracts, prompt contracts, prompt template contracts, prompt input/output contracts, structured output contracts, analysis request/response contracts, validation contracts, safety/redaction contracts, result/error/event contracts, deterministic synthetic fixtures, security tests, export stability tests, contract stability tests, dependency-boundary tests, and pipeline integration tests. It must not introduce provider SDKs, OpenAI API calls, Anthropic API calls, Gemini API calls, live LLM calls, prompt execution runtime, extraction workflows, pain point extraction, opportunity generation, REST APIs, frontend, persistence implementation, scheduler behavior, workers, or business scoring.

Phase 2 Milestone 20: Structured Analysis Foundation has an explicit `phase-2-milestone-20` verification gate. Milestone 20 introduces `@opportunity-os/analysis` as the owner of structured analysis contracts, parser contracts, schema validation contracts, structured output normalization contracts, evidence contracts, confidence contracts, analysis provenance contracts, validation/result/error/event contracts, deterministic synthetic fixtures, security tests, export stability tests, contract stability tests, dependency-boundary tests, and pipeline integration tests. It must not introduce provider SDKs, prompt execution, AI reasoning, pain point extraction, opportunity generation, REST APIs, frontend, persistence implementation, scheduler behavior, workers, business scoring, provider payloads, API keys, real network behavior, or business examples.

Phase 2 Milestone 21: Opportunity Engine Foundation has an explicit `phase-2-milestone-21` verification gate. Milestone 21 introduces `@opportunity-os/opportunity-engine` as the owner of opportunity primitives, source/evidence contracts, hypothesis contracts, score contracts, confidence contracts, ranking contracts, validation contracts, result contracts, secret-safe error contracts, event contracts, deterministic synthetic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, and upstream integration tests. It must not introduce REST APIs, frontend, persistence implementation, scheduler behavior, workers, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, or business workflows.

Phase 2 Milestone 22: Opportunity Pipeline Foundation has an explicit `phase-2-milestone-22` verification gate. Milestone 22 introduces `@opportunity-os/opportunity-pipeline` as the owner of pipeline primitives, stages, metadata, provenance, evidence aggregation, hypothesis assembly, candidate opportunity, validation, result, error, event, deterministic fixture, export stability, contract stability, dependency-boundary, security, and upstream integration contracts. It must not introduce business scoring algorithms, ranking algorithms, recommendation engines, REST APIs, frontend, persistence implementation, schedulers, workers, provider SDKs, or business workflows.

Phase 2 Milestone 23: Candidate Opportunity Engine has an explicit `phase-2-milestone-23` verification gate. Milestone 23 introduces `@opportunity-os/opportunity-candidates` as the owner of candidate opportunity contracts, lifecycle contracts, metadata and provenance contracts, evidence completeness contracts, confidence aggregation contracts, validation contracts, result contracts, safe error contracts, event contracts, deterministic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, upstream integration tests, and workspace pipeline integration. It must not introduce production ranking algorithms, recommendation engines, business scoring, REST APIs, frontend, persistence implementation, schedulers, workers, provider SDKs, or business workflows.

Phase 2 Milestone 24: Opportunity Generation Workflow has an explicit `phase-2-milestone-24` verification gate. Milestone 24 introduces `@opportunity-os/opportunity-generation` as the owner of deterministic candidate-to-opportunity generation workflow contracts, generation input/output contracts, deterministic generation service contracts, evidence-to-hypothesis assembly contracts, candidate validation behavior contracts, confidence aggregation contracts, result contracts, safe error contracts, event contracts, deterministic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, upstream integration tests, deterministic service tests, and workspace pipeline integration. It must not introduce production ranking, recommendation engines, REST APIs, frontend, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, live AI providers, or business workflows.

Phase 3 Milestone 25: Opportunity Ranking Engine has an explicit `phase-3-milestone-25` verification gate. Milestone 25 introduces `@opportunity-os/opportunity-ranking` as the owner of deterministic ranking product behavior. It implements ranking primitives, inputs, outputs, signals, factors, weights, deterministic score calculation, ranking pipeline behavior, tie breaking, explanations, validation, results, safe errors, events, synthetic fixtures, export stability tests, contract stability tests, ranking quality tests, security tests, dependency-boundary tests, upstream integration tests, workspace integration, documentation, and governance. It must not introduce recommendation engines, REST APIs, frontend, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, ML behavior, or LLM calls.

Phase 3 Milestone 26: REST API has an explicit `phase-3-milestone-26` verification gate. It introduces `apps/api` as the strict TypeScript REST API application boundary with explicit bootstrap, routing, OpenAPI contracts, health endpoint, opportunity endpoints, ranking endpoints, pagination, filtering, request validation, error mapping, authentication and authorization contracts, API versioning, deterministic fixtures, integration tests, security tests, contract stability tests, dependency-boundary tests, package exports, package metadata, and repository policy. It must not introduce frontend implementation, billing, user management, analytics, notifications, production authentication providers, persistence changes, schedulers, workers, provider SDKs, or unrelated product workflows.

Phase 3 Milestone 26 is complete when `apps/api` is implemented, tested, documented, independently buildable, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, verified by `phase-3-milestone-26`, and free of frontend implementation, billing, user management, analytics, notifications, production authentication providers, persistence changes, schedulers, workers, provider SDKs, and unrelated product workflows.

Phase 3 Milestone 27: Dashboard MVP has an explicit `phase-3-milestone-27` verification gate. It introduces `apps/web` as the Next.js App Router dashboard application boundary with strict TypeScript, route map, dashboard shell, sidebar and topbar navigation, Opportunity List page, Opportunity Detail page, Ranking View, Evidence View, Search UI, Filter UI, Pagination UI, loading states, empty states, error states, typed API integration layer, generated route contract, deterministic frontend fixtures, unit/component tests, security tests, dependency-boundary tests, route stability tests, and Playwright browser coverage. It must not introduce authentication implementation, billing, analytics, notifications, user accounts, production deployment, persistence changes, recommendation engines, mobile apps, schedulers, workers, provider SDKs, or unrelated backend changes.

Phase 3 Milestone 27 is complete when `apps/web` is implemented, tested, documented, independently buildable, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, covered by `pnpm --filter @opportunity-os/web test:e2e`, verified by `phase-3-milestone-27`, and free of authentication implementation, billing, analytics, notifications, user accounts, production deployment, persistence changes, recommendation engines, mobile apps, schedulers, workers, provider SDKs, and unrelated backend changes.

Phase 3 Milestone 28: Product Validation Loop has an explicit `phase-3-milestone-28` verification gate. It introduces deterministic product validation boundaries on top of `apps/api` and `apps/web`, starting with feedback vocabulary for save, dismiss, usefulness rating, evidence quality rating, ranking quality rating, and feedback reason categories. It must not introduce production persistence, billing, analytics platforms, notifications, email, CRM integrations, schedulers, workers, mobile apps, complex admin consoles, or unrelated product systems.

Phase 3 Milestone 28 is complete when repository verification supports `phase-3-milestone-28`, API feedback DTOs/routes/fixtures/in-memory store are exported through `apps/api`, dashboard feedback UI consumes the web API layer, cross-app API/web alignment tests pass, the design-partner walkthrough is documented, Product Validation Loop documentation states deterministic product validation only, and the final gate passes:

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

Design-partner validation should follow `docs/04_IMPLEMENTATION/04-003_DESIGN_PARTNER_WALKTHROUGH.md`.

## Phase Workflow

Phase 0 is repository foundation work only. It may update documentation, repository verification, CI, Docker, environment guidance, and governance files. It must not add application code, business logic, APIs, connectors, AI workflows, or database schema implementation.

Phase 1 starts shared infrastructure work. It should begin only after Phase 0 verification passes and a scoped implementation task identifies the owning package, referenced Engineering Kit documents, and required tests.

## Phase 0 Completion Checklist

Phase 0 is complete when all of the following are true:

- repository verification passes with `node scripts/verify-repository.mjs --phase review`
- `pnpm lint`, `pnpm build`, and `pnpm test` pass
- Docker Compose validates with `docker compose config`
- `git status --short --ignored` shows no unexpected tracked or untracked files
- `apps/` and `packages/` contain only approved README placeholders
- no application code, business logic, APIs, connectors, AI workflows, or database schema implementation exists
- environment, logging, testing, security, and contributor guidance are documented
- Phase 1 work has a scoped task, owning package, referenced Engineering Kit documents, acceptance criteria, and required tests

When this checklist passes, the repository is ready for Phase 1 shared infrastructure work.

## Documentation Rules

Cross references must resolve to real files or approved Engineering Kit document aliases. Prefer repository-relative paths such as `docs/05_BOOTSTRAP/05-001_TECH_STACK.md` and `developer-ai/00_CONTEXT/MISSION.md`.

Numbered documents under `docs/` must keep their folder prefix and file heading aligned. For example, `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md` belongs in the `05_BOOTSTRAP` section and starts with `# 05-003_ENVIRONMENT_SPEC.md`.

## Testing Strategy

During Phase 1 Milestone 2, `pnpm test` runs repository verification and package-level tests for `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared`. It does not run application, API, business logic, connector, AI workflow, database, or frontend tests because those implementations do not exist yet.

Future implementation phases should introduce tests in layers:

- Vitest for unit tests in shared packages and domain-level modules
- Supertest for Fastify API route and HTTP contract tests
- Playwright for end-to-end browser tests once the web application exists
- Contract testing for APIs, event envelopes, connectors, and AI workflow inputs/outputs
- Integration testing for database, Redis, queues, external-provider adapters, and cross-package workflows

Test dependencies should be added only when the corresponding implementation package or app is introduced.

## Environment Setup

Create a local environment file from the example:

```sh
cp .env.example .env
```

Required variables are grouped in `.env.example`:

- Application: `APP_NAME`, `NODE_ENV`, `PORT`
- Services: `DATABASE_URL`, `REDIS_URL`
- AI providers: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_MODEL`, `ANTHROPIC_MODEL`
- Authentication: `JWT_SECRET`, `JWT_EXPIRES_IN`
- Observability: `LOG_LEVEL`, `OTEL_EXPORTER_ENDPOINT`

Optional variables:

- `SENTRY_DSN`
- `LANGFUSE_API_KEY`
- `LANGSMITH_API_KEY`

Safe defaults are documented in `.env.example` and `packages/config/README.md`:

- `NODE_ENV=local`
- `PORT=3000`
- `LOG_LEVEL=info`

Runtime configuration validation fails fast when required values are missing or malformed. Required secrets do not receive fake defaults. Before implementation work uses AI providers, authentication, or external observability, fill the relevant values in your local `.env`; never commit real secrets.

Production environments must provide required variables through the deployment platform or secret manager. Production secrets must not be copied from local files, committed to Git, or stored in documentation.

## Config Package Usage

`packages/config` owns runtime configuration during Phase 1 Milestone 1.

Future packages should consume typed configuration from `@opportunity-os/config` rather than reading `process.env` directly. Use `loadRuntimeConfig()` for runtime environment loading and `createRuntimeConfig(requiredEnvironment, optionalEnvironment)` for tests or controlled package boundaries.

Typed config is grouped by `application`, `services`, `aiProviders`, `authentication`, `observability`, and `optionalIntegrations`.

Apps, APIs, connectors, AI workflows, and business logic are not part of this milestone. The next shared-infrastructure milestone should depend on `packages/config` for validated service name, environment, log level, exporter endpoint, and related runtime settings.

## Phase 1 Milestone 1 Readiness

Phase 1 Milestone 1 is complete when all of the following are true:

- `packages/config` implements environment schema validation, typed exports, fail-fast loading, and secret-safe configuration errors
- `packages/config` is documented, tested, and independently buildable through the workspace build
- `.env.example`, repository documentation, and the config schema describe the same required and optional variables
- `apps/` contains no application implementation
- no business logic, connectors, AI workflows, API routes, database implementation, or frontend implementation exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

After this gate passes, the next shared infrastructure milestone may consume `@opportunity-os/config` instead of reading from `process.env` directly.

## Shared Foundation Usage

Phase 1 Milestone 2 establishes shared foundation packages without application behavior.

Package ownership:

- `packages/config` owns runtime configuration validation and typed configuration exports.
- `packages/types` owns generic shared TypeScript types such as branded primitives, result contracts, and metadata contracts.
- `packages/errors` owns generic error categories, stable error codes, base error contracts, and secret-safe error serialization.
- `packages/utils` owns generic deterministic object, string, redaction, and time utilities.
- `packages/shared` owns shared contracts and approved aggregation for logging, request/correlation context, validation results, and shared foundation exports.

Allowed dependency direction:

- `packages/types` and `packages/utils` sit at the base and should remain dependency-light.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.

Future packages should consume shared foundation capabilities through the owning package first. Use `@opportunity-os/config` for runtime configuration, `@opportunity-os/types` for generic type contracts, `@opportunity-os/errors` for error contracts, `@opportunity-os/utils` for deterministic helpers, and `@opportunity-os/shared` for cross-cutting shared contracts. Do not create new shared abstractions inside apps, connectors, APIs, workflows, database packages, or frontend packages when an existing shared foundation package owns the concern.

Phase 1 Milestone 2 does not include business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code.

## Phase 1 Milestone 2 Readiness

Phase 1 Milestone 2 is complete when all of the following are true:

- `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared` are implemented, tested, documented, and independently buildable
- shared package boundaries and dependency direction are enforced by repository verification
- package-level tests run through `pnpm test`
- no business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

After this gate passes, the next milestone may depend on shared foundation packages for typed configuration, generic types, safe errors, deterministic utilities, logging contracts, request/correlation context contracts, and validation result contracts. Future implementation packages should consume these contracts instead of redefining them locally.

## Logging Architecture

Phase 1 Milestone 3 implements the structured logging foundation in `packages/shared`. `packages/shared` is the owner of the logging foundation, and Pino is the approved structured logging implementation.

The logging foundation must remain compatible with the Phase 1 Milestone 2 dependency direction:

- `packages/types` and `packages/utils` sit at the base.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.

The logging foundation remains out of scope for application code, APIs, connectors, AI workflows, database implementation, frontend implementation, and business logic.

The Pino logger implementation consumes the shared logging contracts and emits structured logs with these required fields:

- `timestamp`
- `service`
- `environment`
- `severity`
- `correlationId`
- `requestId` when a request context exists
- `eventName`
- `message`

Logger usage:

- use `createLoggerConfig()` with explicit `service`, `environment`, and `logLevel`
- create logger instances with `createPinoLogger()`
- pass an injectable destination for deterministic tests when needed
- pass an injectable clock for deterministic timestamps when needed
- use `logger.child()` to inherit immutable correlation, request, and base context
- call `debug`, `info`, `warn`, or `error` with `correlationId`, `eventName`, `message`, and optional `requestId`, `context`, or `error`

Future packages should consume logging through `@opportunity-os/shared`; they must not create local logger factories, read `process.env` for logging settings, or declare their own Pino dependency. Application, API, connector, AI workflow, frontend, and database integration remain future milestones.

Sensitive data must never be logged. This includes API keys, tokens, passwords, raw authentication headers, credentials, and unredacted secret values.

The shared logger normalizes log entries and errors through secret-safe output. `OpportunityError` and unknown `Error` values are logged without stack traces, raw causes, provider keys, tokens, DSNs, passwords, or auth headers.

## Phase 1 Milestone 3 Readiness

Phase 1 Milestone 3 is complete when all of the following are true:

- `packages/shared` contains the Pino-backed logging foundation, logging contracts, context support, secret-safe normalization, and deterministic tests
- logger configuration is explicit and does not read `process.env`
- logger destinations and clocks are injectable for deterministic testing
- correlation IDs are required, request IDs are optional, and child loggers inherit immutable context
- `OpportunityError` and unknown `Error` logging remain stack-safe and secret-safe
- logging exports are available from `@opportunity-os/shared`
- repository verification enforces logging files, exports, dependency boundaries, and Pino scoping
- no application code, APIs, connectors, AI workflows, database implementation, frontend implementation, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

After this gate passes, the next milestone may consume `@opportunity-os/shared` logging from future implementation packages. Do not begin Phase 1 Milestone 4 until its owning package, scope, tests, and Engineering Kit references are approved.

## Event Foundation

Phase 1 Milestone 4 implements the Event Foundation in `packages/events`.

`packages/events` owns infrastructure-level event contracts:

- stable event category constants
- event metadata with event ID, event name, category, version, timestamp, source, correlation ID, optional causation ID, optional request ID, and optional idempotency key
- generic `vN` event versioning
- generic event envelopes with metadata and payload
- event context for correlation, causation, and request IDs
- library-agnostic event schema contracts
- transport-agnostic publisher and consumer interfaces
- deterministic serialization and safe deserialization
- idempotency and replay-readiness contracts
- generic event result and secret-safe event error contracts
- test-only in-memory event bus support

Event privacy rules:

- event errors, logs, test fixtures, and documentation must not expose raw payloads, API keys, tokens, passwords, raw auth headers, provider keys, credentials, DSNs, or credential-bearing URLs
- event metadata must stay operational and must not include business payload fields
- event payload types in this package must remain generic and business-agnostic

`packages/events` does not define business events, domain-specific event names, a database event store, Kafka/NATS/Redis transport, connectors, APIs, AI workflows, frontend code, or business logic.

Future packages may consume these event contracts once their own milestone approves the dependency. Do not add production transports, persistence, API integration, connector integration, AI workflow integration, or domain event names inside `packages/events`.

## Phase 1 Milestone 4 Readiness

Phase 1 Milestone 4 is complete when all of the following are true:

- `packages/events` is implemented, tested, documented, and independently buildable
- event envelope, metadata, versioning, correlation, causation, publisher, consumer, serialization, idempotency, replay, result, and error contracts are exported from `@opportunity-os/events`
- the in-memory event bus is documented and constrained as test-only infrastructure
- event security tests verify secret-safe errors and deserialization failures
- repository verification supports `phase-1-milestone-4`, permits `packages/events`, and continues blocking apps, APIs, connectors, AI workflows, frontend, database, domain, intelligence, acquisition, application, and business implementation
- no application code, APIs, connectors, AI workflows, database implementation, frontend implementation, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-4`, `pnpm lint`, `pnpm build`, and `pnpm test` pass

## Database Foundation

Phase 1 Milestone 5 introduces the Database Foundation in `packages/database`.

Slice A establishes the package and Prisma foundation only:

- `@opportunity-os/database` workspace package
- strict TypeScript package configuration
- Prisma dependency scoped to `packages/database`
- PostgreSQL datasource using `DATABASE_URL`
- Prisma client generator
- package scripts for build, lint, test, and Prisma validation
- public exports through `packages/database/src/index.ts`

Slice B adds the migration and configuration boundary:

- documented Prisma migration commands
- empty foundation baseline migration
- explicit typed database configuration input
- database client factory contract with injected client creation
- no process-level singleton and no automatic connection during import

Slice C adds runtime contracts:

- connect, disconnect, and safe shutdown contracts
- generic repository interfaces
- transaction boundary contracts
- secret-safe database error mapping
- database health check contract
- seed framework placeholder

Slice D hardens the package boundary:

- schema policy tests that keep prohibited business models out of Prisma
- database security tests for secret-safe errors and health failures
- optional local database integration verification through `verify:local`
- public export stability tests
- package dependency boundary tests

`packages/database` owns Prisma setup, database client creation, migration framework, repository contracts, transaction contracts, seed placeholders, and database health contracts.

Slice D does not define connector persistence, Raw Content workflow tables, event store tables, AI workflow tables, API tables, frontend tables, business tables, application services, business logic, API routes, or production event store transport.

## Local Services

The repository includes a Docker Compose baseline for local PostgreSQL and Redis only. It does not define application containers during Phase 1 Milestone 1.

Validate the Compose file:

```sh
docker compose config
```

Optionally start local services:

```sh
docker compose up postgres redis
```

## Implementation Guardrails

- Do not add business logic without approved implementation scope.
- Do not add connectors, APIs, database tables, or AI workflows in repository foundation changes.
- Keep TypeScript, pnpm, Turborepo, and Node.js versions aligned with the bootstrap documents.
- Keep documentation cross references valid.

## Pull Request Workflow

Every pull request should:

- link a GitHub issue or task
- identify the relevant Engineering Kit documents
- explain whether it is Phase 0 foundation work or Phase 1+ implementation work
- include verification output
- update documentation when behavior, structure, or workflow changes
- confirm no secrets or unrelated local artifacts are included

## Current Status

Phase 2 Milestone 22 completes the Opportunity Pipeline Foundation in `packages/opportunity-pipeline`. The repository remains free of business scoring algorithms, ranking algorithms, recommendation engines, REST APIs, controllers, authentication implementation, authorization implementation, AI workflows, frontend implementation, app code, schedulers, workers, persistence implementations, database repository implementations, production event store transport, provider SDKs, provider AI calls, vector databases, prompt execution runtime, workflow engines, aggregation algorithms, generation logic, execution behavior, and business workflows.

## Domain Foundation

Phase 1 Milestone 6 introduces the Domain Foundation in `packages/domain`.

Slice A establishes the package boundary only:

- `@opportunity-os/domain` workspace package
- strict TypeScript package configuration
- public exports through `packages/domain/src/index.ts`
- dependency boundaries for approved shared infrastructure packages
- repository verification support for `phase-1-milestone-6`

Slice B adds generic domain primitive and structure contracts:

- domain ID, timestamp, and version contracts
- immutable value object contracts
- entity contracts with identity and metadata
- aggregate root contracts with identity, version, and pending event references
- created, updated, and version metadata contracts

Slice C adds generic domain event, error, repository, validation, and result contracts:

- domain event contracts reuse `@opportunity-os/events` concepts
- domain error contracts use `@opportunity-os/errors` patterns
- repository contracts return domain entities or aggregate roots
- validation and result contracts remain generic

Slice D hardens the package with export stability tests, package-boundary tests, contract stability tests, and root workspace pipeline coverage.

Slice E completes documentation and governance for the Domain Foundation:

- repository verification supports `phase-1-milestone-6`
- future packages must consume `@opportunity-os/domain` contracts instead of redefining or bypassing them
- PR governance requires domain contract review when domain files change
- the roadmap records deliverables, dependency direction, non-goals, readiness gate, and next milestone dependency

`packages/domain` owns generic domain contracts only. Future packages must not bypass domain primitives, entities, value objects, aggregate roots, domain events, domain errors, repository contracts, validation contracts, or result contracts when those concepts apply.

Phase 1 Milestone 6 does not implement connector execution, Raw Content persistence workflows, AI workflows, APIs, frontend implementation, application services, business scoring logic, database repository implementations, production event store transport, concrete aggregate types, concrete event names, concrete payloads, command handlers, business processes, persistence models, publication, transport, or runtime behavior.

## Application Foundation

Phase 1 Milestone 7 introduces the Application Foundation in `packages/application`.

`packages/application` owns generic application-layer contracts only:

- command and query contracts
- use-case boundary contracts
- application service contracts
- dependency injection token and provider contracts
- request context contracts using shared context and logging concepts
- secret-safe application error contracts
- event publishing and dispatch ports
- repository ports using domain contracts
- transaction boundary ports
- application result and validation outcome contracts
- handler execution context contracts

Future packages must consume `@opportunity-os/application` for application-layer contracts instead of redefining or bypassing them. Application Foundation does not implement REST APIs, controllers, authentication, authorization, connector execution, AI workflows, database repositories, frontend, business scoring, concrete product commands, product handlers, or actual product use cases.

## Container Foundation

Phase 1 Milestone 8 introduces the Dependency Injection and Composition Foundation in `packages/container`.

`packages/container` owns generic dependency injection and composition contracts only. It provides typed dependency tokens, service registration contracts, stable lifetimes, resolver contracts, scope contracts, module definitions, composition root contracts, config binding contracts, logger binding contracts, registration validation contracts, and secret-safe container error contracts.

Future packages must consume `@opportunity-os/container` for dependency injection and composition contracts instead of redefining or bypassing them.

Use `createDependencyToken` and `DependencyToken` for typed dependency identity. Use `ServiceDescriptor`, `ClassRegistration`, `FactoryRegistration`, and `ValueRegistration` for declarative registrations. Use `CONTAINER_LIFETIMES` for the stable `singleton`, `scoped`, and `transient` lifecycle vocabulary. Use resolver, scope, module, and composition root contracts to describe future assembly boundaries without implementing runtime dependency graph execution.

Use `ConfigBinding` with explicit typed configuration from `@opportunity-os/config`; consumers must not read `process.env` through container contracts. Use `LoggerBinding` and `LoggerFactoryBinding` with shared logging contracts from `@opportunity-os/shared`; consumers must not introduce logger singletons or app integration in `packages/container`.

Container validation and errors are contract-only. `RegistrationValidationResult` documents duplicate token, missing dependency, and unsupported lifetime issues. `ContainerError` serializes safely without exposing secrets, tokens, auth headers, credentials, raw config values, stack traces, or raw causes by default.

`packages/container` must not implement REST APIs, controllers, authentication, authorization, connector execution, AI workflows, database repositories, frontend behavior, application services, product workflows, business logic, runtime service locators, reflection, app startup, API boot, or product workflow composition.

Phase 1 Milestone 8 is complete when `@opportunity-os/container` is implemented, tested, documented, independently buildable, covered by export stability and dependency boundary tests, included in root lint/build/test, and verified by `node scripts/verify-repository.mjs --phase review` and `node scripts/verify-repository.mjs --phase phase-1-milestone-8`.

## Infrastructure Composition Foundation

Phase 1 Milestone 9 introduces the Infrastructure Composition Foundation in `packages/infrastructure`.

`packages/infrastructure` owns infrastructure composition contracts only. It provides module contracts, package registration metadata, composition module contracts, bootstrap contracts, lifecycle phase and ordering contracts, startup validation contracts, graceful shutdown contracts, health aggregation contracts, dependency graph validation contracts, infrastructure result/error contracts, and foundation package composition metadata.

Future packages must consume `@opportunity-os/infrastructure` for infrastructure composition boundaries instead of redefining or bypassing them.

Use infrastructure module and package registration contracts to describe approved foundation package capabilities. Use bootstrap and dependency graph contracts to describe validation results without executing graphs or resolving dependencies. Use lifecycle, startup, shutdown, and health contracts to describe orchestration boundaries without implementing runners, signal handling, API health routes, or live checks. Use foundation package composition contracts to reference `@opportunity-os/config`, `@opportunity-os/shared`, `@opportunity-os/events`, `@opportunity-os/database`, `@opportunity-os/domain`, `@opportunity-os/application`, and `@opportunity-os/container`.

Infrastructure errors and failure contracts must remain secret-safe. They must not expose secrets, tokens, auth headers, credentials, DSNs, database URLs, provider keys, raw config values, stack traces, raw causes, or raw dependency details by default.

`packages/infrastructure` must not implement REST APIs, controllers, authentication, authorization, connector execution, AI workflows, database repositories, frontend behavior, product workflows, application services, business logic, app startup, API boot, production event transport, database event stores, database connections, migration execution, command dispatch, product handlers, or scoring.

Phase 1 Milestone 9 is complete when `@opportunity-os/infrastructure` is implemented, tested, documented, independently buildable, covered by export stability, dependency boundary, contract stability, and security tests, included in root lint/build/test, and verified by `node scripts/verify-repository.mjs --phase review` and `node scripts/verify-repository.mjs --phase phase-1-milestone-9`.

## Connector SDK Foundation

Phase 2 Milestone 10 introduces the Connector SDK Foundation in `packages/connectors`.

`packages/connectors` owns generic connector SDK contracts only. Slice A establishes the package boundary, strict TypeScript scaffold, public export routing, repository verification for `phase-2-milestone-10`, and approved dependency boundaries for future connector SDK contracts.

`@opportunity-os/connectors` now documents and exports generic contracts for metadata, capabilities, configuration, context, lifecycle, results, errors, validation, registry, factory, operations, health, rate-limit and quota metadata, and test utilities.

Future concrete connectors must consume `@opportunity-os/connectors` instead of redefining connector SDK contracts locally.

`packages/connectors` must not implement Reddit connectors, YouTube connectors, OAuth, HTTP clients, REST APIs, controllers, authentication, authorization, AI workflows, frontend behavior, business logic, concrete connector implementations, or connector execution.

Phase 2 Milestone 10 is complete when `@opportunity-os/connectors` is implemented, tested, documented, independently buildable, covered by export stability, dependency boundary, contract stability, and security tests, included in root lint/build/test, and verified by `node scripts/verify-repository.mjs --phase review` and `node scripts/verify-repository.mjs --phase phase-2-milestone-10`.

After this gate passes, the next milestone may depend on `@opportunity-os/connectors` for generic connector SDK contracts. It must not begin concrete provider connectors, OAuth, HTTP clients, connector runners, API integration, AI workflows, frontend integration, or business workflows until scoped by an approved milestone.

## Connector Runtime Foundation

Phase 2 Milestone 11 introduces the Connector Runtime Foundation in `packages/connector-runtime`.

`packages/connector-runtime` owns generic connector runtime contracts only. It defines execution pipeline, state, retry, timeout, cancellation, checkpoint, rate-limit, metrics, telemetry, aggregation, runtime error, and deterministic test harness contracts.

The runtime foundation may depend on `@opportunity-os/connectors`, `@opportunity-os/container`, `@opportunity-os/application`, `@opportunity-os/errors`, `@opportunity-os/events`, `@opportunity-os/shared`, and `@opportunity-os/infrastructure`. It may use `@opportunity-os/types` or `@opportunity-os/utils` only when a scoped runtime contract requires them.

Future runtime consumers should import approved contracts from `@opportunity-os/connector-runtime` and should not use internal package file imports. Future implementation packages must consume these contracts rather than redefining runtime pipeline, state, policy, telemetry, metrics, aggregation, error, or test harness shapes locally.

Runtime failures, telemetry, metrics, checkpoints, and aggregation output must remain secret-safe. They must not expose secrets, tokens, raw auth headers, credentials, provider keys, DSNs, database URLs, raw config values, raw response payloads, stacks, causes, or dependency internals.

`packages/connector-runtime` must not implement Reddit connectors, YouTube connectors, OAuth, HTTP clients, schedulers, queues, worker processes, REST APIs, controllers, authentication, authorization, AI workflows, frontend behavior, business logic, or actual connector execution.

Phase 2 Milestone 11 is complete when `@opportunity-os/connector-runtime` is implemented, tested, documented, independently buildable, covered by export stability, contract stability, security, dependency boundary, and package-boundary tests, included in root lint/build/test, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-11`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

After this gate passes, the next milestone may depend on `@opportunity-os/connector-runtime` for generic connector runtime contracts. It must not begin Reddit connectors, YouTube connectors, OAuth, HTTP clients, schedulers, queues, worker processes, API integration, auth implementation, AI workflows, frontend integration, business logic, or actual connector execution until scoped by an approved milestone.

## Connector Host Foundation

Phase 2 Milestone 12 introduces the Connector Host Foundation in `packages/connector-host`.

`packages/connector-host` owns generic connector host contracts only. It provides the completed Phase 2 Milestone 12 package boundary, strict TypeScript scaffold, public export routing, repository verification for `phase-2-milestone-12`, and approved dependency boundaries.

`packages/connector-host` defines host bootstrap, runner, runtime orchestration, lifecycle orchestration, DI binding, typed config binding, logger binding, event publishing binding, startup validation, graceful shutdown, health aggregation, execution orchestration, result, safe error, and deterministic test harness contracts.

The connector host foundation may depend on `@opportunity-os/config`, `@opportunity-os/connectors`, `@opportunity-os/connector-runtime`, `@opportunity-os/container`, `@opportunity-os/application`, `@opportunity-os/errors`, `@opportunity-os/events`, `@opportunity-os/shared`, and `@opportunity-os/infrastructure`.

Future packages must consume `@opportunity-os/connector-host` instead of redefining host bootstrap, orchestration, lifecycle, binding, startup, shutdown, health, execution, result, error, or test harness contracts.

Startup failures, health failures, execution results, host errors, telemetry bindings, and shutdown failures must remain secret-safe. They must not expose raw payloads, config values, provider responses, stacks, causes, secrets, tokens, auth headers, credentials, provider keys, DSNs, database URLs, or dependency internals.

`packages/connector-host` must not implement Reddit connectors, YouTube connectors, OAuth, HTTP clients, schedulers, queues, worker processes, APIs, authentication, AI workflows, frontend behavior, business logic, provider integration, or actual connector execution.

Phase 2 Milestone 12 is complete when `@opportunity-os/connector-host` is implemented, tested, documented, independently buildable, covered by export stability, contract stability, security, dependency boundary, and package-boundary tests, included in root lint/build/test, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-12`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

## Reddit Connector Foundation

Phase 2 Milestone 13 introduces the Reddit connector foundation in `packages/connectors-reddit`.

`packages/connectors-reddit` owns Reddit connector contracts only. The milestone provides the strict TypeScript package scaffold, package boundary documentation, public export routing through `packages/connectors-reddit/src/index.ts`, repository verification for `phase-2-milestone-13`, approved dependency boundaries, metadata contracts, declarative capability contracts, explicit configuration contracts, validation contracts, data shape contracts, operation contracts, lifecycle contracts, factory contracts, host integration contracts, safe error contracts, deterministic fixture contracts, export stability tests, contract stability tests, security tests, and dependency boundary tests.

The package may depend only on `@opportunity-os/connectors`, `@opportunity-os/connector-host`, and deterministic test/build tooling during Phase 2 Milestone 13.

Current Reddit contracts define connector metadata, read-contract capabilities for posts, comments, subreddits, authors, pagination metadata, and rate-limit metadata, explicit typed configuration input, sensitive future OAuth credential fields, validation issue/result contracts for metadata, capabilities, config, lifecycle readiness, dependency readiness, and data shape compatibility, post, comment, subreddit, author, pagination, rate-limit, and data envelope contracts, generic Reddit read operation contracts, declarative lifecycle readiness contracts, factory and host integration contracts, safe Reddit connector errors, and deterministic fixtures. Hardening tests lock public exports, contract constants, safe error shapes, secret-safe outputs, and approved dependency boundaries.

Future Reddit connector implementation must consume `@opportunity-os/connectors-reddit` instead of bypassing the Reddit connector foundation contracts.

Phase 2 Milestone 13 is complete when `@opportunity-os/connectors-reddit` is implemented, tested, documented, independently buildable, covered by export stability, contract stability, security, dependency boundary, package-boundary, metadata, capability, config, validation, data shape, operation, lifecycle, factory, host, error, and fixture tests, included in root lint/build/test, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-13`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, `docker compose config`, `pnpm --filter @opportunity-os/connectors-reddit test`, and `pnpm --filter @opportunity-os/connectors-reddit build`.

`packages/connectors-reddit` must not implement OAuth, live Reddit API calls, HTTP clients, provider calls, scraping, schedulers, queues, worker processes, host startup, runner loops, database persistence, AI workflows, APIs, frontend behavior, business logic, or connector execution.

After this gate passes, the next milestone may depend on `@opportunity-os/connectors-reddit` for Reddit connector contracts. It must not begin OAuth, live Reddit API calls, HTTP clients, scraping, schedulers, queues, worker processes, database persistence, API integration, auth implementation, AI workflows, frontend integration, business logic, provider integration, or actual connector execution until scoped by an approved milestone.

## Reddit Runtime Foundation

Phase 2 Milestone 14 establishes the Reddit Runtime Foundation boundary in `packages/connectors-reddit`.

Milestone 14 implements deterministic, non-network Reddit runtime behavior using the existing Reddit connector contracts, Connector SDK contracts, Connector Host contracts, and deterministic runtime test harness contracts.

The runtime provides:

- a fake provider and fixture provider only
- explicit runtime config validation
- deterministic lifecycle readiness
- fixture-backed read operations for posts, comments, subreddits, and authors
- deterministic pagination and rate-limit metadata preservation
- connector result mapping
- secret-safe runtime errors
- a deterministic runtime harness with fake provider, fake clock, and fake context
- export stability, contract stability, runtime security, and dependency boundary tests

Runtime behavior remains local and deterministic. It does not call Reddit, construct OAuth flows, use HTTP clients, scrape content, persist data, schedule work, create queues or workers, start a host, run external connectors, publish events, or implement business behavior.

Future Reddit provider integration must consume `@opportunity-os/connectors-reddit` instead of bypassing the Reddit runtime foundation.

`packages/connectors-reddit` must continue blocking OAuth, live Reddit API calls, HTTP clients, provider calls, scraping, schedulers, queues, worker processes, database persistence, AI workflows, APIs, frontend behavior, business logic, and external connector execution.

Phase 2 Milestone 14 is complete when `@opportunity-os/connectors-reddit` contains the deterministic fake-provider runtime, fixture-backed read behavior, safe result/error handling, deterministic test harness, runtime stability tests, runtime security tests, dependency boundary tests, and public exports; remains independently buildable and covered by the root workspace pipeline; and passes `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-14`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

## Reddit Provider Transport Boundary

Phase 2 Milestone 15 establishes the Reddit Provider Transport boundary in `packages/connectors-reddit`.

Slice A defines provider transport architecture only. Provider transport exports route through `packages/connectors-reddit/src/provider/index.ts`, and approved provider transport contracts are re-exported from `packages/connectors-reddit/src/index.ts` so existing runtime exports remain stable.

Slice B adds provider authentication contracts, HTTP transport abstraction contracts, API client contracts, and deterministic request-building contracts. These contracts model token, credential, refresh, expiration, auth state, transport request/response, timeout, cancellation, safe metadata, explicit client context, and request descriptions without performing token exchange, refresh calls, live Reddit calls, scheduling, persistence, API routes, or business behavior.

Slice C adds safe provider response parsing, pagination transport metadata, and rate-limit metadata mapping. The parser maps safe provider shapes into existing Reddit data contracts, rejects malformed responses with safe validation failures, creates replay-safe cursors and next-page request descriptions, and falls back to safe rate-limit metadata when provider metadata is missing or malformed.

Slice D connects provider contracts to runtime policy compatibility, auth lifecycle states, provider error mapping, telemetry contracts, and DI binding contracts. These additions map retry, timeout, and cancellation metadata into connector-runtime shapes; define auth lifecycle snapshots; serialize provider errors safely; reference shared logging and event concepts; and describe container tokens without implementing runners, timers, signal handling, telemetry vendors, event buses, production transports, runtime containers, app startup, or dependency resolution.

Slice E hardens the provider transport boundary with deterministic fixtures, fake transport support, integration tests, provider security tests, contract stability tests, and dependency boundary tests. Fake transport records request descriptions and returns fixture responses only; it does not perform external calls.

Slice F completes provider transport documentation, PR governance, roadmap readiness, and the final Milestone 15 readiness gate.

The `phase-2-milestone-15` repository verification gate permits provider transport implementation only inside `packages/connectors-reddit` and continues to block Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, and business logic.

The completed provider transport surface documents OAuth contracts, the Reddit API client abstraction, HTTP transport abstraction, request builder, response parser, pagination transport, rate-limit parsing, runtime compatibility, auth lifecycle, error mapping, telemetry contracts, test fixtures, and fake transport support. Future packages must consume `@opportunity-os/connectors-reddit` rather than redefining Reddit provider transport contracts.

Milestone 15 is ready when `@opportunity-os/connectors-reddit` is implemented, tested, documented, independently buildable, and covered by default non-network tests. No live Reddit calls are required for `pnpm test`; fixture-backed fake transport remains the only default transport behavior.

## Raw Content Pipeline Foundation

Phase 2 Milestone 16 establishes the Raw Content Pipeline Foundation in `packages/raw-content`.

`@opportunity-os/raw-content` owns contracts for source metadata, authors, communities, posts, comments, ingestion metadata, provenance, raw content envelopes, normalization boundaries, fingerprints, deduplication, validation, storage ports, raw-content events, safe errors, deterministic fixtures, and Reddit-to-RawContent mapping.

Raw Content consumers must import from `@opportunity-os/raw-content` instead of redefining raw content shapes, provenance contracts, storage ports, validation results, event names, error shapes, fixture contracts, or Reddit mapping contracts.

The milestone remains contract-only. Storage ports are interfaces, event contracts are envelope shapes, mapping contracts describe input/output boundaries, and fixtures contain safe deterministic public-like data. The package does not implement normalization algorithms, hashing engines, persistence, Prisma repositories, event buses, AI workflows, opportunity generation, REST APIs, frontend behavior, schedulers, workers, or business scoring.

Security and governance rules:

- raw provider payloads must not be persisted or exposed
- secrets, tokens, auth headers, credentials, DSNs, database URLs, provider keys, stack traces, and raw causes must not appear in safe outputs
- dependency boundaries must continue blocking Prisma, API/frontend frameworks, schedulers, workers, AI SDKs, and business packages
- public exports must route through `packages/raw-content/src/index.ts`

Milestone 16 is complete when `@opportunity-os/raw-content` is implemented, tested, documented, independently buildable, covered by security, dependency-boundary, export-stability, and contract-stability tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-16`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

Phase 2 Milestone 17 consumes `@opportunity-os/raw-content` for canonical Raw Content contracts and hands off canonical normalized text contracts to Phase 2 Milestone 18.

## Normalization Pipeline Foundation

Phase 2 Milestone 17 establishes the Normalization Pipeline Foundation in `packages/normalization`.

`@opportunity-os/normalization` owns canonical text contracts, text segment contracts, normalization input/output contracts, stage vocabulary, deterministic cleaning contracts, language detection contracts, text chunking contracts, metadata preservation contracts, provenance preservation contracts, validation contracts, result contracts, normalization event contracts, deterministic fixtures, security tests, export stability tests, dependency-boundary tests, and pipeline integration tests.

Normalization consumers must import from `@opportunity-os/normalization` instead of redefining canonical text, cleaning, chunking, preservation, validation, result, event, or fixture contracts.

The milestone remains contract-only. It does not implement normalization algorithms, DOM parsing, browser behavior, network calls, parser-library integrations, embeddings, LLMs, AI analysis, event buses, database persistence, Prisma repositories, opportunity generation, REST APIs, frontend behavior, schedulers, workers, or business scoring.

Security and governance rules:

- fixtures must contain deterministic safe data only
- raw provider payloads must not appear in canonical text, fixtures, validation issues, results, events, logs, or tests
- secrets, tokens, auth headers, credentials, provider keys, DSNs, database URLs, stack traces, and raw causes must not appear in safe outputs
- dependency boundaries must continue blocking AI SDKs, persistence, API/frontend frameworks, schedulers, workers, database implementations, and business packages
- public exports must route through `packages/normalization/src/index.ts`

Milestone 17 is complete when `@opportunity-os/normalization` is implemented, tested, documented, independently buildable, covered by fixture, export-stability, security, dependency-boundary, and pipeline integration tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-17`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

Phase 2 Milestone 18 consumes `@opportunity-os/normalization` for canonical normalized text and provenance-preserving normalization outputs.

## Embedding Foundation

Phase 2 Milestone 18 establishes the Embedding Foundation in `packages/embeddings`.

`@opportunity-os/embeddings` owns embedding primitives, provider abstraction contracts, embedding request and response contracts, chunk embedding contracts, embedding metadata and provenance contracts, validation contracts, cache contracts, result contracts, safe error contracts, embedding event contracts, deterministic synthetic fixtures, export stability tests, security tests, dependency-boundary tests, and pipeline integration tests.

Embedding consumers must import from `@opportunity-os/embeddings` instead of redefining embedding vectors, provider abstractions, request/response contracts, chunk embedding records, metadata, validation results, cache ports, results, errors, events, or deterministic fixture shapes.

The milestone remains foundation-only. It does not implement OpenAI, Gemini, Voyage, provider SDKs, provider API calls, model execution, vector database behavior, cache persistence, AI reasoning, prompt execution, opportunity generation, REST APIs, frontend behavior, schedulers, workers, or business logic.

Security and governance rules:

- fixtures must use deterministic synthetic vectors only
- fixtures must not contain real embeddings, provider payloads, API keys, tokens, auth headers, credentials, DSNs, database URLs, or provider secrets
- embedding errors, validation failures, cache results, events, and metadata must not expose raw provider payloads, secret values, stack traces, or raw causes
- dependency boundaries must continue blocking provider SDKs, AI SDKs, vector databases, persistence, API/frontend frameworks, schedulers, workers, and business packages
- public exports must route through `packages/embeddings/src/index.ts`

Milestone 18 is complete when `@opportunity-os/embeddings` is implemented, tested, documented, independently buildable, covered by fixture, export-stability, security, dependency-boundary, contract-stability, and pipeline integration tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-18`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

Phase 2 Milestone 19 consumes `@opportunity-os/embeddings` for provider-independent embedding contracts.

## LLM Analysis Foundation

Phase 2 Milestone 19 establishes the LLM Analysis Foundation in `packages/llm-analysis`.

`@opportunity-os/llm-analysis` owns provider-independent LLM provider abstraction contracts, prompt contract types, prompt template contracts, prompt input and output contracts, structured output contracts, analysis request and response contracts, validation contracts, safety and redaction contracts, result contracts, secret-safe analysis error contracts, analysis event contracts, deterministic synthetic fixtures, export stability tests, contract stability tests, security tests, dependency-boundary tests, and pipeline integration tests.

LLM analysis consumers must import from `@opportunity-os/llm-analysis` instead of redefining provider abstractions, prompt contracts, structured output contracts, analysis request/response contracts, validation contracts, safety/redaction contracts, result contracts, error contracts, event contracts, fixture contracts, or pipeline integration contracts.

The milestone remains foundation-only. It does not implement OpenAI, Anthropic, Gemini, provider SDKs, provider API calls, live LLM calls, prompt execution runtime, extraction workflows, pain point extraction, opportunity generation, REST APIs, frontend behavior, persistence implementation, schedulers, workers, or business scoring.

Security and governance rules:

- fixtures must use deterministic synthetic prompts, normalized content references, embedding references, and structured outputs only
- fixtures must not contain real prompts, real embeddings, provider payloads, API keys, tokens, auth headers, credentials, DSNs, database URLs, or provider secrets
- analysis errors, validation failures, events, redaction contracts, and safe payloads must not expose raw provider payloads, prompt internals, secret values, stack traces, or raw causes
- dependency boundaries must continue blocking provider SDKs, AI SDKs, persistence, API/frontend frameworks, schedulers, workers, database implementations, and business packages
- public exports must route through `packages/llm-analysis/src/index.ts`

Milestone 19 is complete when `@opportunity-os/llm-analysis` is implemented, tested, documented, independently buildable, covered by fixture, export-stability, security, dependency-boundary, contract-stability, and pipeline integration tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-19`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

Phase 2 Milestone 20 consumes `@opportunity-os/llm-analysis` for provider-independent analysis contracts.

## Structured Analysis Foundation

Phase 2 Milestone 20 establishes the Structured Analysis Foundation in `packages/analysis`.

`@opportunity-os/analysis` owns structured analysis primitives, analysis input and output contracts, parser contracts, schema validation contracts, structured output normalization contracts, evidence contracts, confidence contracts, analysis provenance contracts, validation contracts, result contracts, secret-safe analysis error contracts, analysis event contracts, deterministic synthetic fixtures, export stability tests, contract stability tests, security tests, dependency-boundary tests, and pipeline integration tests.

Structured analysis consumers must import from `@opportunity-os/analysis` instead of redefining parser contracts, schema validation contracts, evidence records, confidence metadata, provenance metadata, validation contracts, result contracts, error contracts, event contracts, fixture contracts, or pipeline integration contracts.

The milestone remains foundation-only. It does not implement OpenAI, Anthropic, Gemini, provider SDKs, live provider calls, prompt execution, AI reasoning, pain point extraction, opportunity generation, REST APIs, frontend behavior, persistence implementation, schedulers, workers, or business scoring.

Security and governance rules:

- fixtures must use deterministic synthetic analysis inputs, outputs, evidence, confidence metadata, provenance, and validation examples only
- fixtures must not contain provider payloads, API keys, real network references, credentials, tokens, auth headers, DSNs, database URLs, or provider secrets
- analysis errors, validation failures, events, and safe payloads must not expose raw provider payloads, prompt internals, secret values, stack traces, or raw causes
- dependency boundaries must continue blocking provider SDKs, AI SDKs, prompt execution runtimes, persistence, API/frontend frameworks, schedulers, workers, database implementations, and business packages
- public exports must route through `packages/analysis/src/index.ts`

Milestone 20 is complete when `@opportunity-os/analysis` is implemented, tested, documented, independently buildable, covered by fixture, export-stability, security, dependency-boundary, contract-stability, and pipeline integration tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-20`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

Phase 2 Milestone 21 consumes `@opportunity-os/analysis` for structured, validated analysis outputs.

## Opportunity Engine Foundation

Phase 2 Milestone 21 establishes the Opportunity Engine Foundation in `packages/opportunity-engine`.

`@opportunity-os/opportunity-engine` owns opportunity primitive contracts, source/evidence contracts, hypothesis contracts, score contracts, confidence contracts, ranking contracts, validation contracts, result contracts, secret-safe opportunity engine error contracts, event contracts, deterministic synthetic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, and upstream integration tests.

Opportunity Engine consumers must import from `@opportunity-os/opportunity-engine` instead of redefining opportunity primitives, source/evidence records, hypothesis records, score metadata, confidence metadata, ranking metadata, validation contracts, result contracts, error contracts, event contracts, fixture contracts, or upstream integration contracts.

The milestone remains foundation-only. It does not implement REST APIs, frontend behavior, persistence implementation, schedulers, workers, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, or business workflows.

Security and governance rules:

- fixtures must use deterministic synthetic opportunity IDs, source/evidence references, hypotheses, score metadata, confidence metadata, ranking metadata, validation examples, result examples, and events only
- fixtures must not contain provider payloads, prompts, business examples, API keys, credentials, tokens, auth headers, DSNs, database URLs, or provider secrets
- opportunity errors, validation failures, events, fixtures, and safe payloads must not expose raw provider payloads, prompt internals, secret values, stack traces, raw causes, or dependency internals
- dependency boundaries must continue blocking API/frontend frameworks, persistence implementations, schedulers, workers, provider SDKs, live AI calls, prompt runtimes, billing packages, user account implementations, production ranking algorithms, and business packages
- public exports must route through `packages/opportunity-engine/src/index.ts`

Milestone 21 is complete when `@opportunity-os/opportunity-engine` is implemented, tested, documented, independently buildable, covered by fixture, export-stability, security, dependency-boundary, contract-stability, and upstream integration tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-21`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

## Opportunity Pipeline Foundation

Phase 2 Milestone 22 establishes the Opportunity Pipeline Foundation in `packages/opportunity-pipeline`.

`@opportunity-os/opportunity-pipeline` owns pipeline primitives, stage contracts, metadata, provenance, evidence aggregation contracts, hypothesis assembly contracts, candidate opportunity contracts, validation contracts, result contracts, secret-safe error contracts, event contracts, deterministic synthetic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, and upstream integration tests.

Future packages must consume `@opportunity-os/opportunity-pipeline` instead of redefining pipeline, aggregation, assembly, candidate opportunity, validation, stage, metadata, provenance, result, error, event, fixture, or upstream integration contracts.

The milestone remains foundation-only. It does not implement business scoring algorithms, ranking algorithms, recommendation engines, REST APIs, frontend behavior, persistence implementation, schedulers, workers, provider SDKs, workflow engines, aggregation algorithms, generation logic, or execution behavior.

Security and governance rules:

- fixtures must use deterministic synthetic pipeline IDs, run IDs, stage IDs, candidate IDs, upstream opportunity references, validation examples, results, and events only
- fixtures must not contain provider payloads, prompts, production business examples, API keys, credentials, tokens, auth headers, DSNs, database URLs, or provider secrets
- pipeline errors, validation failures, events, fixtures, and safe payloads must not expose raw provider payloads, prompt internals, secret values, stack traces, raw causes, or dependency internals
- dependency boundaries must continue blocking API/frontend frameworks, persistence implementations, schedulers, workers, provider SDKs, production ranking algorithms, recommendation engines, scoring implementations, and business packages
- public exports must route through `packages/opportunity-pipeline/src/index.ts`

Milestone 22 is complete when `@opportunity-os/opportunity-pipeline` is implemented, tested, documented, independently buildable, covered by fixture, export-stability, security, dependency-boundary, contract-stability, and upstream integration tests, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-22`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

Do not begin REST APIs, frontend implementation, persistence implementation, schedulers, workers, provider SDKs, business scoring algorithms, ranking algorithms, recommendation engines, or business workflows until a later scoped implementation task approves them.

## Candidate Opportunity Engine

Phase 2 Milestone 23 establishes the Candidate Opportunity Engine foundation in `packages/opportunity-candidates`.

`@opportunity-os/opportunity-candidates` owns candidate opportunity contracts. Slice A establishes the package boundary, strict TypeScript configuration, public export boundary, README, and repository verification support for `phase-2-milestone-23`.

Milestone 23 implements candidate opportunity primitives, candidate contracts, lifecycle contracts, metadata contracts, provenance contracts, evidence completeness contracts, confidence aggregation contracts, validation contracts, result contracts, safe error contracts, event contracts, deterministic synthetic fixtures, export stability tests, contract stability tests, security tests, dependency-boundary tests, upstream integration tests, and root workspace pipeline integration.

The milestone must not introduce production ranking algorithms, recommendation engines, business scoring, REST APIs, frontend behavior, persistence implementation, schedulers, workers, provider SDKs, or business workflows.

Milestone 23 is complete when `@opportunity-os/opportunity-candidates` is implemented, tested, documented, independently buildable, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-23`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.

## Opportunity Generation Workflow

Phase 2 Milestone 24 establishes the Opportunity Generation Workflow foundation in `packages/opportunity-generation`.

`@opportunity-os/opportunity-generation` owns deterministic candidate-to-opportunity generation workflow contracts. It implements the package boundary, strict TypeScript configuration, public export boundary, README, repository verification support for `phase-2-milestone-24`, generation primitives, generation input/output contracts, deterministic generation service contracts, evidence-to-hypothesis assembly contracts, candidate validation behavior contracts, confidence aggregation contracts, result contracts, safe error contracts, event contracts, deterministic synthetic fixtures, export stability tests, contract stability tests, security tests, dependency-boundary tests, upstream integration tests, deterministic service tests, and root workspace pipeline integration.

Future API, persistence, workflow, product, dashboard, scoring, ranking, and recommendation packages must consume `@opportunity-os/opportunity-generation` rather than redefining or bypassing generation contracts.

The milestone must not introduce production ranking algorithms, recommendation engines, business scoring, REST APIs, frontend behavior, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, live AI providers, prompt execution, provider payloads, or business workflows.

Milestone 24 is complete when `@opportunity-os/opportunity-generation` is implemented, tested, documented, independently buildable, included in root `pnpm lint`, `pnpm build`, and `pnpm test`, and verified by `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-24`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config`.
