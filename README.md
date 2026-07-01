# Opportunity OS

Opportunity OS is currently an Engineering Kit and repository foundation. The repository is prepared for future implementation, but it intentionally does not contain application code, business logic, connectors, APIs, or AI workflows yet.

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
- `apps/` is reserved for future application entry points.
- `packages/` contains shared infrastructure workspace packages introduced in Phase 1 and connector foundations introduced in Phase 2. Current implemented packages are `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, `packages/shared`, `packages/events`, `packages/database`, `packages/domain`, `packages/application`, `packages/container`, `packages/infrastructure`, `packages/connectors`, `packages/connector-runtime`, `packages/connector-host`, and `packages/connectors-reddit`.
- `schemas/`, `prompts/`, `examples/`, `infrastructure/`, `docker/`, and `scripts/` are repository support areas.
- `.github/` contains contribution automation, issue templates, pull request templates, labels, owners, and CI workflows.

## Local Verification

```sh
node scripts/verify-repository.mjs --phase review
pnpm install
pnpm lint
pnpm build
pnpm test
```

During Phase 2 connector runtime work, these commands verify repository structure, document numbering, README coverage, cross references, package boundaries, logging, event, database, domain, application, container, infrastructure composition, connector SDK foundation policy, connector runtime foundation policy, connector host foundation policy, Reddit connector foundation policy, Reddit runtime policy, and package-level tests for `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, `packages/shared`, `packages/events`, `packages/database`, `packages/domain`, `packages/application`, `packages/container`, `packages/infrastructure`, `packages/connectors`, `packages/connector-runtime`, `packages/connector-host`, and `packages/connectors-reddit`.

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

Phase 1 Milestone 7 Slice E completes Application Foundation documentation and governance. The repository remains free of business logic, connectors, APIs, REST API routes, controllers, authentication implementation, authorization implementation, AI workflows, frontend implementation, app code, connector execution, Raw Content persistence workflows, database repository implementations, production event store transport, business scoring logic, and product use cases.

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
