# Contributing

Opportunity OS is documentation-first. Implementation work must start from the Engineering Kit and preserve its architecture, naming, dependency, testing, and security rules.

Engineering Kit v3.0 is the canonical baseline for future Codex work. It reflects completed work through Phase 2 Milestone 21: Opportunity Engine Foundation. Phase 2 Milestone 22 has not started and must not begin without an explicitly scoped implementation task.

## Before You Start

Read these documents in order:

1. `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`
2. `developer-ai/00_CONTEXT/MISSION.md`
3. `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`
4. `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`
5. `docs/05_BOOTSTRAP/05-003_ENVIRONMENT_SPEC.md`
6. `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`
7. The specification, Developer AI playbook, and checklist for the change you intend to make

## Engineering Kit Workflow

The Engineering Kit is the source of truth. Start with `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md`, then read the foundation, architecture, bootstrap, and task-specific specification documents.

For AI-assisted implementation work, also read:

- `developer-ai/00_CONTEXT/MISSION.md`
- `developer-ai/00_CONTEXT/ARCHITECTURE_MAP.md`
- `developer-ai/00_CONTEXT/REPOSITORY_OVERVIEW.md`
- relevant standards in `developer-ai/01_STANDARDS/`
- relevant patterns in `developer-ai/02_PATTERNS/`
- relevant playbooks in `developer-ai/03_PLAYBOOKS/`
- relevant checklists in `developer-ai/05_CHECKLISTS/`

## Rules

- Do not add business logic without a linked issue and an approved specification.
- Do not introduce APIs, connectors, AI workflows, database tables, or application behavior in repository foundation changes.
- Keep package dependencies aligned with `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.
- Keep cross references valid whenever documents move or are renamed.
- Keep implementation scoped to the relevant package boundary.
- Add or update tests for implementation changes.

## Local Checks

```sh
node scripts/verify-repository.mjs --phase review
pnpm install
pnpm lint
pnpm build
pnpm test
```

During Phase 2 Milestone 21, these commands validate repository structure, documentation integrity, package boundaries, logging, event, database, domain, application, container, infrastructure composition, connector SDK foundation policy, connector runtime foundation policy, connector host foundation policy, Reddit connector foundation policy, Reddit runtime policy, Reddit provider transport boundary policy, Raw Content Pipeline Foundation policy, Normalization Pipeline Foundation policy, Embedding Foundation policy, LLM Analysis Foundation policy, Structured Analysis Foundation policy, Opportunity Engine Foundation policy, and package-level tests for `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, `packages/shared`, `packages/events`, `packages/database`, `packages/domain`, `packages/application`, `packages/container`, `packages/infrastructure`, `packages/connectors`, `packages/connector-runtime`, `packages/connector-host`, `packages/connectors-reddit`, `packages/raw-content`, `packages/normalization`, `packages/embeddings`, `packages/llm-analysis`, `packages/analysis`, and `packages/opportunity-engine`.

Phase 2 Milestone 19 work must stay inside its scoped task. Milestone 19 may add LLM Analysis Foundation contracts only inside `packages/llm-analysis` and must not add provider SDKs, OpenAI API calls, Anthropic API calls, Gemini API calls, live LLM calls, prompt execution runtime, extraction workflows, pain point extraction, opportunity generation, REST APIs, frontend, persistence implementation, scheduler, worker, or business scoring.

Phase 2 Milestone 20 work must stay inside its scoped task. Milestone 20 may add Structured Analysis Foundation contracts only inside `packages/analysis` and must not add provider SDKs, prompt execution, AI reasoning, pain point extraction, opportunity generation, REST APIs, frontend, persistence implementation, scheduler, worker, business scoring, provider payloads, API keys, network behavior, or business examples.

Phase 2 Milestone 21 work must stay inside its scoped task. Milestone 21 may add Opportunity Engine Foundation contracts only inside `packages/opportunity-engine` and must not add REST APIs, frontend, persistence implementation, scheduler, worker, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, or business workflows.

## Phase 0 and Phase 1

Phase 0 work is limited to repository foundation, documentation quality, verification, CI, Docker, environment guidance, and governance. Do not add application code, business logic, connectors, APIs, AI workflows, or database schema implementation during Phase 0.

Phase 1 begins shared infrastructure implementation. A Phase 1 task must identify:

- owning package
- referenced Engineering Kit documents
- dependency order
- acceptance criteria
- required tests
- expected documentation updates

## Phase 0 Completion Checklist

Before Phase 1 begins, confirm:

- `node scripts/verify-repository.mjs --phase review` passes
- `pnpm lint` passes
- `pnpm build` passes
- `pnpm test` passes
- `docker compose config` passes
- `git status --short --ignored` shows no unexpected files
- no implementation source files exist under `apps/` or `packages/`
- no business logic, APIs, connectors, AI workflows, or database schema implementation exists
- no secrets, generated local artifacts, or unrelated local files are staged

If any item fails, keep the work in Phase 0 and fix the foundation before starting Phase 1.

## Phase 1 Milestone 1 Readiness

Phase 1 Milestone 1 is limited to runtime configuration and validation in `packages/config`.

Before handing off to the next shared infrastructure milestone, confirm:

- `packages/config` is implemented, tested, documented, and buildable through `pnpm build`
- all required and optional environment variables are validated and documented
- config errors identify invalid variable names and reason codes without printing raw secret values
- `apps/` still contains no application code
- no business logic, connectors, AI workflows, API routes, database implementation, or frontend implementation exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Future implementation work should consume typed configuration from `@opportunity-os/config` and keep direct `process.env` reads inside this package unless a later Engineering Kit task changes the boundary.

## Shared Foundation Package Boundaries

Phase 1 Milestone 2 introduces shared foundation packages only. It does not introduce business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code.

Package ownership:

- `packages/config` owns runtime configuration validation and typed configuration exports.
- `packages/types` owns generic shared TypeScript types only.
- `packages/errors` owns generic error categories, error codes, base error contracts, and secret-safe error serialization.
- `packages/utils` owns generic deterministic object, string, redaction, and time utilities.
- `packages/shared` owns shared contracts and approved aggregation for logging, context, validation results, and shared foundation exports.

Allowed dependency direction:

- `packages/types` and `packages/utils` are base packages.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.
- Shared foundation packages must not depend on apps, API packages, connectors, AI workflows, database packages, frontend packages, domain packages, or business packages.

Future packages should import from the package that owns the concern. Do not read `process.env` outside `@opportunity-os/config`; do not define duplicate error, validation, logging, context, or utility contracts in downstream packages when the shared foundation already provides them.

## Domain Foundation Governance

Phase 1 Milestone 6 implements generic domain contracts in `packages/domain`. Future packages must consume `@opportunity-os/domain` instead of redefining or bypassing domain primitives, entities, value objects, aggregate roots, domain events, domain errors, repository contracts, validation contracts, or result contracts.

Domain changes must remain generic. They must not introduce connector execution, Raw Content persistence workflows, AI workflows, APIs, frontend implementation, application services, business scoring logic, database repository implementations, production event store transport, concrete business aggregates, concrete event names, or concrete payloads.

When domain files change, reviewers should confirm:

- public exports route through `packages/domain/src/index.ts`
- dependencies remain limited to approved shared infrastructure packages
- domain errors remain secret-safe and stack-safe by default
- repository contracts stay interface-only and do not depend on Prisma, SQL, or persistence mapping
- validation and result contracts remain generic
- future package guidance does not bypass Domain Foundation contracts

## Application Foundation Governance

Phase 1 Milestone 7 implements generic application-layer contracts in `packages/application`. Future packages must consume `@opportunity-os/application` instead of redefining or bypassing command/query contracts, use-case boundaries, application services, DI contracts, request contexts, application errors, event publishing ports, repository ports, transaction boundary ports, results, validation outcomes, or handler execution context contracts.

Application changes must remain generic. They must not introduce REST API routes, controllers, authentication implementation, authorization implementation, connector execution, AI workflows, database repository implementations, frontend implementation, business scoring logic, concrete product commands, product handlers, or actual product use cases.

When application files change, reviewers should confirm:

- public exports route through `packages/application/src/index.ts`
- dependencies remain limited to approved foundation packages
- application errors and validation failures remain secret-safe and stack-safe by default
- repository ports stay interface-only and do not depend on Prisma, SQL, persistence mapping, or database clients
- event publishing ports remain transport-agnostic and do not introduce event buses or production transports
- DI and handler contracts do not introduce runtime containers, service locators, registries, dispatch engines, or app startup behavior
- future package guidance does not bypass Application Foundation contracts

## Container Foundation Governance

Phase 1 Milestone 8 implements generic dependency injection and composition contracts in `packages/container`. Future packages must consume `@opportunity-os/container` instead of redefining or bypassing dependency tokens, service registrations, lifetimes, resolver contracts, scope contracts, module definitions, composition root contracts, config binding contracts, logger binding contracts, registration validation contracts, or container error contracts.

Container changes must remain generic. They must not introduce REST APIs, controllers, authentication implementation, authorization implementation, connector execution, AI workflows, database repository implementations, frontend implementation, application services, product workflows, business logic, runtime dependency resolution, reflection, service locators, module loading, app startup, API boot, or product workflow composition.

When container files change, reviewers should confirm:

- public exports route through `packages/container/src/index.ts`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- dependency tokens remain typed identities only
- lifetimes remain the stable vocabulary `singleton`, `scoped`, and `transient`
- registration contracts remain declarative and do not execute dependency graphs
- resolver, scope, module, and composition contracts remain interface-only
- config binding consumes explicit typed configuration and does not read `process.env`
- logger binding does not introduce a singleton, transport, or app integration
- container errors remain secret-safe and stack-safe by default
- future package guidance does not bypass Container Foundation contracts

## Phase 1 Milestone 8 Readiness

Before handing off to the next milestone, confirm:

- `packages/container` is implemented, tested, documented, and independently buildable
- dependency tokens, registration contracts, lifetimes, resolver contracts, scope contracts, module contracts, composition root contracts, config bindings, logger bindings, validation contracts, and container errors are documented for future consumers
- export stability, dependency boundary, contract stability, and security-safe error tests pass
- repository verification supports `phase-1-milestone-8`
- no REST APIs, controllers, auth implementation, connector execution, AI workflows, database repositories, frontend implementation, application services, product workflows, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-8`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Infrastructure Composition Foundation Governance

Phase 1 Milestone 9 implements generic infrastructure composition contracts in `packages/infrastructure`. Future packages must consume `@opportunity-os/infrastructure` instead of redefining or bypassing infrastructure module contracts, package registrations, bootstrap contracts, lifecycle contracts, startup validation contracts, shutdown contracts, health aggregation contracts, dependency graph validation contracts, infrastructure results, infrastructure errors, or foundation package composition metadata.

Infrastructure changes must remain declarative. They must not introduce REST APIs, controllers, authentication implementation, authorization implementation, connector execution, AI workflows, database repository implementations, frontend implementation, product workflows, application services, business logic, app startup, API boot, runtime dependency resolution, lifecycle runners, process signal handling, production event transport, database event stores, database connections, migration execution, command dispatch, product handlers, or scoring.

When infrastructure files change, reviewers should confirm:

- public exports route through `packages/infrastructure/src/index.ts`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- module contracts and package registrations remain metadata-only
- bootstrap contracts do not instantiate services or resolve dependencies
- dependency graph contracts do not execute dependency graphs or runtime resolvers
- lifecycle, startup, shutdown, and health contracts remain declarative
- health aggregation does not introduce API health routes
- config composition receives typed config and does not read `process.env`
- logging composition does not introduce a singleton, transport, or app integration
- event composition does not introduce production event transport or database event stores
- database composition does not introduce Prisma client singletons, connections, migration execution, repository implementations, or database workflows
- infrastructure errors and failure results remain secret-safe and stack-safe by default
- future package guidance does not bypass Infrastructure Composition Foundation contracts

## Phase 1 Milestone 9 Readiness

Before handing off to the next milestone, confirm:

- `packages/infrastructure` is implemented, tested, documented, and independently buildable
- module contracts, package registrations, bootstrap contracts, lifecycle contracts, startup validation, shutdown contracts, health aggregation, dependency graph validation, results, errors, and foundation package composition contracts are documented for future consumers
- export stability, dependency boundary, contract stability, and security tests pass
- repository verification supports `phase-1-milestone-9`
- no REST APIs, controllers, auth implementation, connector execution, AI workflows, database repositories, frontend implementation, product workflows, application services, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-9`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Connector SDK Foundation Governance

Phase 2 Milestone 10 implements generic connector SDK contracts in `packages/connectors`. Future concrete connectors must consume `@opportunity-os/connectors` instead of redefining or bypassing connector metadata, capability, configuration, context, lifecycle, result, error, registry, factory, validation, health, limit, operation, or test utility contracts.

Connector SDK changes must remain generic. They must not introduce Reddit connector, YouTube connector, OAuth implementation, HTTP clients, REST APIs, controllers, authentication implementation, authorization implementation, AI workflows, frontend implementation, business logic, concrete connector implementations, provider calls, external network behavior, or connector execution.

When connector SDK files change, reviewers should confirm:

- public exports route through `packages/connectors/src/index.ts`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- metadata categories and stability statuses remain stable unless a scoped milestone changes them
- capability kinds remain declarative
- config contracts use explicit typed input and do not read `process.env`
- secret-like config fields are marked sensitive
- context contracts carry correlation IDs and optional request IDs
- lifecycle contracts remain descriptive and do not execute connector work
- result, operation, registry, and factory contracts remain generic
- validation contracts cover config, metadata, capability, lifecycle, and dependency issues with safe messages
- connector errors remain secret-safe and stack-safe by default
- health, rate-limit, and quota contracts remain metadata-only
- test utilities do not execute real connectors or call external providers
- future package guidance does not bypass Connector SDK Foundation contracts

## Phase 2 Milestone 10 Readiness

Before handing off to the next milestone, confirm:

- `packages/connectors` is implemented, tested, documented, and independently buildable
- metadata, capability, config, context, lifecycle, results, errors, registry, factory, validation, health, operation, limit, and testing contracts are documented for future consumers
- export stability, dependency boundary, contract stability, and security tests pass
- repository verification supports `phase-2-milestone-10`
- no Reddit connector, YouTube connector, OAuth implementation, HTTP clients, APIs, authentication implementation, AI workflows, frontend implementation, business logic, concrete connector implementation, or connector execution exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-10`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Connector Runtime Foundation Governance

Phase 2 Milestone 11 implements generic connector runtime contracts in `packages/connector-runtime`. Future runtime consumers must consume `@opportunity-os/connector-runtime` instead of redefining or bypassing execution pipeline, execution state, retry, timeout, cancellation, checkpoint, rate-limit, metrics, telemetry, aggregation, runtime error, or deterministic test harness contracts.

Connector runtime changes must remain generic. They must not introduce Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, REST APIs, controllers, authentication implementation, authorization implementation, AI workflows, frontend implementation, business logic, provider integration, or actual connector execution.

When connector runtime files change, reviewers should confirm:

- public exports route through `packages/connector-runtime/src/index.ts`
- consumers can import approved contracts from `@opportunity-os/connector-runtime`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- execution pipeline and state contracts remain declarative
- retry, timeout, cancellation, checkpoint, and rate-limit policies remain contracts only
- telemetry contracts do not emit telemetry or configure vendors
- metrics, checkpoints, telemetry, aggregation output, and runtime errors remain secret-safe and stack-safe by default
- deterministic test harness contracts do not execute real connectors or call external providers
- future package guidance does not bypass Connector Runtime Foundation contracts

## Phase 2 Milestone 11 Readiness

Before handing off to the next milestone, confirm:

- `packages/connector-runtime` is implemented, tested, documented, and independently buildable
- pipeline, state, retry, timeout, cancellation, checkpoint, rate-limit, metrics, telemetry, aggregation, runtime error, and deterministic test harness contracts are documented for future consumers
- export stability, contract stability, security, dependency boundary, and package-boundary tests pass
- repository verification supports `phase-2-milestone-11`
- no Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, authentication implementation, AI workflows, frontend implementation, business logic, provider integration, or actual connector execution exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-11`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Connector Host Foundation Governance

Phase 2 Milestone 12 implements generic connector host contracts in `packages/connector-host`. Future host, worker, API, connector, or orchestration packages must consume `@opportunity-os/connector-host` instead of redefining or bypassing connector host bootstrap, runner, runtime orchestration, lifecycle orchestration, DI binding, config binding, logger binding, event publishing binding, startup validation, graceful shutdown, health aggregation, execution orchestration, result, error, or deterministic test harness contracts.

Connector host changes must remain generic. They must not introduce Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, REST APIs, controllers, authentication implementation, authorization implementation, AI workflows, frontend implementation, business logic, provider integration, external service calls, or actual connector execution.

When connector host files change, reviewers should confirm:

- public exports route through `packages/connector-host/src/index.ts`
- consumers can import approved contracts from `@opportunity-os/connector-host`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- bootstrap, runner, runtime orchestration, lifecycle, binding, startup, shutdown, health, execution, result, error, and test harness contracts remain generic
- config binding receives explicit typed config and does not read `process.env`
- logger binding does not introduce a singleton, vendor integration, or app integration
- event publishing binding remains a port/interface and does not introduce event buses, production transport, or database event stores
- startup failures, health failures, execution results, host errors, telemetry bindings, and shutdown failures remain secret-safe and stack-safe by default
- deterministic test harness contracts do not execute real connectors or call external providers
- future package guidance does not bypass Connector Host Foundation contracts

## Phase 2 Milestone 12 Readiness

Before handing off to the next milestone, confirm:

- `packages/connector-host` is implemented, tested, documented, and independently buildable
- bootstrap, runner, runtime orchestration, lifecycle orchestration, DI binding, config binding, logger binding, event publishing binding, startup validation, graceful shutdown, health aggregation, execution orchestration, result, host error, and deterministic test harness contracts are documented for future consumers
- export stability, contract stability, security, dependency boundary, and package-boundary tests pass
- repository verification supports `phase-2-milestone-12`
- no Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, authentication implementation, AI workflows, frontend implementation, business logic, provider integration, or actual connector execution exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-12`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Reddit Connector Foundation Governance

Phase 2 Milestone 13 implements Reddit connector contracts in `packages/connectors-reddit`. Future Reddit connector implementation must consume `@opportunity-os/connectors-reddit` instead of redefining or bypassing Reddit metadata, capability, configuration, validation, data shape, operation, lifecycle, factory, host, error, or fixture contracts.

Reddit connector foundation changes must remain contract-only. They must not introduce OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, APIs, authentication implementation, AI workflows, frontend implementation, business logic, provider integration, external network behavior, host startup, runner loops, or actual connector execution.

When Reddit connector files change, reviewers should confirm:

- public exports route through `packages/connectors-reddit/src/index.ts`
- consumers can import approved contracts from `@opportunity-os/connectors-reddit`
- dependencies remain limited to `@opportunity-os/connectors`, `@opportunity-os/connector-host`, and deterministic test/build tooling
- metadata constants, capability values, validation issue codes, data envelope keys, pagination keys, rate-limit keys, factory contract shape, and safe error shape remain stable unless a scoped milestone changes them
- configuration uses explicit typed input and does not read `process.env`
- OAuth and credential fields remain future contract fields only and are marked sensitive
- validation failures, Reddit errors, pagination metadata, rate-limit metadata, fixtures, and host-facing contracts remain secret-safe and stack-safe by default
- deterministic fixtures do not include real credentials, raw provider payloads, or live provider response data
- no live Reddit calls, HTTP clients, scraping libraries, schedulers, queues, workers, database persistence, AI workflows, APIs, frontend code, business logic, provider integration, or actual connector execution are introduced
- future package guidance does not bypass Reddit Connector Foundation contracts

## Phase 2 Milestone 13 Readiness

Before handing off to the next milestone, confirm:

- `packages/connectors-reddit` is implemented, tested, documented, and independently buildable
- metadata, capabilities, config, validation, data shape contracts, factory contracts, host contracts, errors, and fixtures are documented for future consumers
- export stability, contract stability, security, dependency boundary, package-boundary, metadata, capability, config, validation, data shape, operation, lifecycle, factory, host, error, and fixture tests pass
- repository verification supports `phase-2-milestone-13`
- `@opportunity-os/connectors-reddit` contains only Reddit connector contracts and deterministic test fixtures
- no OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend implementation, business logic, provider integration, or actual connector execution exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-13`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, `docker compose config`, `pnpm --filter @opportunity-os/connectors-reddit test`, and `pnpm --filter @opportunity-os/connectors-reddit build` pass

## Reddit Runtime Governance

Phase 2 Milestone 14 implements deterministic Reddit runtime behavior inside `packages/connectors-reddit`. Future Reddit provider integration must consume `@opportunity-os/connectors-reddit` instead of redefining or bypassing fake-provider runtime construction, config validation, lifecycle readiness, fixture-backed read behavior, result mapping, safe runtime errors, or deterministic runtime harness contracts.

Reddit runtime changes must remain deterministic and non-network. They must not introduce OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, APIs, authentication implementation, AI workflows, frontend implementation, business logic, provider integration, external network behavior, host startup, runner loops, event publishing, or external connector execution.

When Reddit runtime files change, reviewers should confirm:

- public exports route through `packages/connectors-reddit/src/index.ts`
- dependencies remain limited to `@opportunity-os/connectors`, `@opportunity-os/connector-host`, and deterministic test/build tooling
- runtime construction uses the fake provider or fixture provider only
- runtime config validation uses explicit typed config and does not read `process.env`
- lifecycle readiness remains deterministic and does not run startup or host behavior
- read operations use fixtures only and preserve pagination and rate-limit metadata
- runtime result mapping keeps success and failure shapes stable
- runtime errors remain secret-safe and stack-safe by default
- deterministic runtime harness uses fake provider, fake clock, and fake context
- export stability, contract stability, runtime security, and dependency boundary tests cover the runtime surface
- no OAuth implementation, live Reddit calls, HTTP clients, scraping libraries, schedulers, queues, workers, database persistence, AI workflows, APIs, frontend code, business logic, provider integration, event publishing, or external connector execution are introduced
- future package guidance does not bypass Reddit Runtime Foundation contracts

## Phase 2 Milestone 14 Readiness

Before handing off to the next milestone, confirm:

- `packages/connectors-reddit` contains the deterministic non-network Reddit runtime implementation
- fake provider, fixture provider, runtime config validation, lifecycle readiness, read operations, result mapping, safe runtime errors, and deterministic runtime harness are implemented, tested, documented, and independently buildable
- export stability, contract stability, runtime security, dependency boundary, runtime config, runtime construction, lifecycle, read operation, result, error, and harness tests pass
- repository verification supports `phase-2-milestone-14`
- no OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend implementation, business logic, provider integration, event publishing, host startup, runner loop, or external connector execution exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-14`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Phase 2 Milestone 15 Readiness

Before handing off to the next milestone, confirm:

- `@opportunity-os/connectors-reddit` owns the Reddit Provider Transport surface and remains independently buildable
- provider exports route through `packages/connectors-reddit/src/provider/index.ts` and `packages/connectors-reddit/src/index.ts`
- OAuth contracts, API client abstraction, HTTP transport abstraction, request builder, response parser, pagination transport, rate-limit parsing, runtime compatibility, auth lifecycle, error mapping, telemetry, test fixtures, and fake transport are documented
- request descriptions, parser failures, provider errors, telemetry, rate-limit metadata, and fake transport results remain secret-safe
- raw provider responses are not persisted or exposed by default
- default tests use deterministic fixtures and fake transport only; no live Reddit calls are required
- no Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend implementation, scheduler, worker, database persistence, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-15`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Raw Content Pipeline Foundation Governance

Phase 2 Milestone 16 implements Raw Content Pipeline Foundation contracts in `packages/raw-content`. Future normalization, persistence, ingestion, AI, API, and product packages must consume `@opportunity-os/raw-content` instead of redefining or bypassing raw content source metadata, author, community, post, comment, ingestion, provenance, envelope, normalization boundary, fingerprint, deduplication, validation, storage port, raw-content event, safe error, fixture, or Reddit mapping contracts.

Raw Content changes must remain contract-only until a later milestone explicitly scopes implementation behavior. They must not introduce persistence implementation, Prisma repositories, database writes, normalization algorithms, hashing engines, event buses, AI workflows, opportunity generation, REST APIs, frontend implementation, schedulers, workers, business scoring logic, raw provider payload persistence, or raw provider payload exposure.

When raw-content files change, reviewers should confirm:

- public exports route through `packages/raw-content/src/index.ts`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- source metadata and provenance expose only safe references and safe metadata placeholders
- storage ports remain interfaces and do not depend on Prisma clients, SQL, database writes, or repository implementations
- raw-content events remain contract shapes and do not introduce an event bus or production transport
- Reddit mapping remains boundary-only and does not execute provider calls or persist provider payloads
- fixtures are deterministic and contain no secrets, credentials, tokens, auth headers, DSNs, database URLs, raw provider payloads, or real provider responses
- errors and validation failures remain secret-safe and stack-safe by default
- dependency-boundary, security, export-stability, and contract-stability tests cover the changed surface
- future package guidance does not bypass `@opportunity-os/raw-content`

## Phase 2 Milestone 16 Readiness

Before handing off to the next milestone, confirm:

- `@opportunity-os/raw-content` is implemented, tested, documented, and independently buildable
- raw content contracts cover source metadata, authors, communities, posts, comments, ingestion metadata, provenance, envelopes, normalization boundaries, fingerprints, deduplication, validation, storage ports, events, safe errors, deterministic fixtures, and Reddit-to-RawContent mapping
- export stability, contract stability, security, dependency boundary, raw content model, and pipeline contract tests pass
- repository verification supports `phase-2-milestone-16`
- no persistence implementation, Prisma repository, normalization algorithm, hashing engine, event bus, AI workflow, opportunity generation, REST API, frontend implementation, scheduler, worker, database persistence, or business scoring exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-16`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Phase 2 Milestone 17 consumes `@opportunity-os/raw-content` for canonical Raw Content contracts and hands off normalized canonical text contracts to the next milestone.

## Normalization Pipeline Foundation Governance

Phase 2 Milestone 17 implements Normalization Pipeline Foundation contracts in `packages/normalization`. Future AI analysis, indexing, search, persistence, API, and product packages must consume `@opportunity-os/normalization` instead of redefining or bypassing canonical text, text segments, normalization input/output, stage vocabulary, cleaning contracts, language detection, chunking, metadata preservation, provenance preservation, validation, results, events, fixtures, export stability, security, dependency boundary, or pipeline integration contracts.

Normalization changes must remain contract-only unless a later scoped milestone explicitly authorizes implementation behavior. They must not introduce normalization algorithm execution, DOM parsing, browser behavior, network calls, parser-library integrations, embeddings, LLMs, AI analysis, event buses, database persistence, Prisma repositories, opportunity generation, REST APIs, frontend implementation, schedulers, workers, business scoring, or product workflows.

When normalization files change, reviewers should confirm:

- public exports route through `packages/normalization/src/index.ts`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- canonical text, segments, chunks, language metadata, preservation records, validation issues, results, and events remain safe contract shapes
- fixtures are deterministic, secret-free, and do not contain raw provider payloads
- cleaning contracts remain declarative and do not introduce DOM, browser, network, parser-library, AI, or semantic interpretation behavior
- normalization events remain contract-only and do not introduce an event bus, production transport, or persistence workflow
- security, dependency-boundary, export-stability, fixture, and pipeline integration tests cover the changed surface
- future package guidance does not bypass `@opportunity-os/normalization`

## Phase 2 Milestone 17 Readiness

Before handing off to the next milestone, confirm:

- `packages/normalization` is implemented, tested, documented, and independently buildable
- canonical text, cleaning, language, chunking, metadata preservation, provenance preservation, validation, result, event, and fixture contracts are documented for future consumers
- export stability, dependency boundary, fixture, security, and pipeline integration tests pass
- repository verification supports `phase-2-milestone-17`
- no embeddings, LLMs, AI analysis, event bus, database persistence, Prisma repository, REST API, frontend, scheduler, worker, opportunity generation, or business scoring implementation exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-17`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Phase 2 Milestone 18 consumes `@opportunity-os/normalization` for canonical normalized text contracts.

## Embedding Foundation Governance

Phase 2 Milestone 18 implements Embedding Foundation contracts in `packages/embeddings`. Future AI analysis, indexing, retrieval, search, persistence, API, and product packages must consume `@opportunity-os/embeddings` instead of redefining or bypassing embedding primitives, provider abstractions, request/response contracts, chunk embedding contracts, metadata/provenance contracts, validation contracts, cache contracts, results, events, errors, fixtures, export stability, security, dependency boundary, or pipeline integration contracts.

Embedding changes must remain foundation-only unless a later scoped milestone explicitly authorizes provider execution. They must not introduce OpenAI API calls, Gemini API calls, Voyage API calls, provider SDKs, provider API calls, vector databases, model execution, AI reasoning, prompt execution, cache persistence, opportunity generation, REST APIs, frontend implementation, schedulers, workers, business scoring, or product workflows.

When embedding files change, reviewers should confirm:

- public exports route through `packages/embeddings/src/index.ts`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- embedding vectors, chunk embedding records, metadata, validation issues, cache ports, results, errors, and events remain safe contract shapes
- fixtures use deterministic synthetic vectors only and contain no real provider payloads, API keys, tokens, auth headers, credentials, DSNs, database URLs, or provider secrets
- provider abstractions remain declarative and do not introduce provider SDKs, API calls, model execution, prompt execution, vector database behavior, or cache implementation
- embedding events remain contract-only and do not introduce an event bus, production transport, persistence workflow, or telemetry vendor
- security, dependency-boundary, export-stability, contract-stability, fixture, and pipeline integration tests cover the changed surface
- future package guidance does not bypass `@opportunity-os/embeddings`

## Phase 2 Milestone 18 Readiness

Before handing off to the next milestone, confirm:

- `packages/embeddings` is implemented, tested, documented, and independently buildable
- embedding primitives, provider abstractions, requests, responses, chunk embeddings, metadata, provenance, validation, cache, result, error, event, and fixture contracts are documented for future consumers
- export stability, dependency boundary, fixture, security, contract stability, and pipeline integration tests pass
- repository verification supports `phase-2-milestone-18`
- no OpenAI, Gemini, Voyage, provider SDK, vector database, model execution, AI reasoning, prompt execution, cache persistence, REST API, frontend, scheduler, worker, opportunity generation, or business logic implementation exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-18`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

The next milestone must consume `@opportunity-os/embeddings` for provider-independent embedding contracts.

## LLM Analysis Foundation Governance

Phase 2 Milestone 19 implements LLM Analysis Foundation contracts in `packages/llm-analysis`. Future analysis, opportunity generation, API, persistence, workflow, and product packages must consume `@opportunity-os/llm-analysis` instead of redefining or bypassing provider abstractions, prompt contracts, prompt template contracts, prompt input/output contracts, structured output contracts, analysis request/response contracts, validation contracts, safety/redaction contracts, results, errors, events, fixtures, export stability, security, dependency boundary, or pipeline integration contracts.

LLM Analysis changes must remain provider-independent and foundation-only. They must not introduce provider SDKs, OpenAI API calls, Anthropic API calls, Gemini API calls, live LLM calls, prompt execution runtime, extraction workflows, pain point extraction, opportunity generation, REST APIs, frontend implementation, persistence implementation, schedulers, workers, business scoring, real prompts, real embeddings, provider payloads, API keys, or network behavior.

When LLM Analysis files change, reviewers should confirm:

- public exports route through `packages/llm-analysis/src/index.ts`
- dependencies remain limited to approved foundation packages and deterministic test/build tooling
- provider contracts remain generic and do not instantiate provider SDKs or clients
- prompt and template contracts remain declarative and do not render or execute prompts
- structured output contracts remain schema contracts and do not parse provider responses
- analysis request/response, validation, safety, redaction, result, error, and event contracts remain provider-independent
- fixtures use deterministic synthetic prompts, normalized content, embeddings, and structured outputs only
- errors, validation failures, safe payloads, events, and fixtures remain secret-safe and stack-safe
- dependency-boundary, export-stability, contract-stability, security, fixture, and pipeline integration tests cover the changed surface
- future package guidance does not bypass LLM Analysis Foundation contracts

## Phase 2 Milestone 19 Readiness

Before handing off to the next milestone, confirm:

- `packages/llm-analysis` is implemented, tested, documented, and independently buildable
- LLM provider abstractions, prompts, prompt templates, prompt input/output contracts, structured output contracts, analysis request/response contracts, validation contracts, safety/redaction contracts, results, errors, events, and deterministic fixtures are documented for future consumers
- export stability, contract stability, security, dependency-boundary, fixture, and pipeline integration tests pass
- repository verification supports `phase-2-milestone-19`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/llm-analysis`
- no provider SDKs, OpenAI API calls, Anthropic API calls, Gemini API calls, live LLM calls, prompt runtime, extraction workflows, opportunity generation, REST APIs, frontend implementation, persistence implementation, schedulers, workers, business scoring, real prompts, real embeddings, provider payloads, API keys, or network behavior exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-19`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Phase 2 Milestone 20 consumes `@opportunity-os/llm-analysis` for provider-independent analysis contracts.

## Structured Analysis Foundation Governance

Phase 2 Milestone 20 implements Structured Analysis Foundation contracts in `packages/analysis`. Future opportunity generation, API, persistence, workflow, and product packages must consume `@opportunity-os/analysis` instead of redefining or bypassing structured analysis contracts, parser contracts, schema validation contracts, structured output normalization contracts, evidence contracts, confidence contracts, provenance contracts, validation contracts, results, errors, events, fixtures, export stability, security, dependency boundary, or pipeline integration contracts.

Structured Analysis changes must confirm:

- public exports route through `packages/analysis/src/index.ts`
- dependencies stay limited to approved foundation packages
- parser, schema, normalization, evidence, confidence, provenance, validation, result, error, and event contracts remain provider-independent
- deterministic fixtures use synthetic analysis inputs, outputs, evidence, confidence metadata, provenance, and validation examples only
- security tests confirm no provider payloads, API keys, credentials, tokens, auth headers, DSNs, database URLs, stack traces, raw causes, or prompt internals leak from safe outputs
- dependency-boundary tests continue blocking provider SDKs, prompt execution runtimes, AI reasoning, persistence, APIs, frontend, schedulers, workers, database implementations, and business packages
- future package guidance does not bypass Structured Analysis Foundation contracts

## Phase 2 Milestone 20 Readiness

Before handing off to the next milestone, confirm:

- `packages/analysis` is implemented, tested, documented, and independently buildable
- the package contains structured analysis contracts only
- repository verification supports `phase-2-milestone-20`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/analysis`
- no provider SDKs, prompt execution, AI reasoning, pain point extraction, opportunity generation, REST APIs, frontend, persistence implementation, scheduler, worker, business scoring, provider payloads, API keys, real network behavior, or business examples exist in `packages/analysis`
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-20`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Phase 2 Milestone 21 consumes `@opportunity-os/analysis` for structured, validated analysis outputs.

## Opportunity Engine Foundation Governance

Phase 2 Milestone 21 implements Opportunity Engine Foundation contracts in `packages/opportunity-engine`. Future API, persistence, workflow, product, dashboard, and ranking packages must consume `@opportunity-os/opportunity-engine` instead of redefining or bypassing opportunity primitives, source/evidence contracts, hypothesis contracts, score contracts, confidence contracts, ranking contracts, validation contracts, results, errors, events, fixtures, export stability, security, dependency boundary, or upstream integration contracts.

Opportunity Engine changes must confirm:

- public exports route through `packages/opportunity-engine/src/index.ts`
- dependencies stay limited to approved foundation packages
- opportunity primitives, sources, evidence, hypotheses, scores, confidence, ranking, validation, result, error, and event contracts remain provider-independent
- deterministic fixtures use synthetic IDs, source/evidence references, hypotheses, score metadata, confidence metadata, ranking metadata, validation examples, result examples, and events only
- security tests confirm no provider payloads, prompts, business examples, API keys, credentials, tokens, auth headers, DSNs, database URLs, stack traces, raw causes, or dependency internals leak from safe outputs
- dependency-boundary tests continue blocking REST APIs, frontend frameworks, persistence implementations, schedulers, workers, live AI calls, prompt runtimes, billing packages, user account implementations, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, and business packages
- future package guidance does not bypass Opportunity Engine Foundation contracts

## Phase 2 Milestone 21 Readiness

Before handing off to the next milestone, confirm:

- `packages/opportunity-engine` is implemented, tested, documented, and independently buildable
- the package contains Opportunity Engine Foundation contracts and deterministic synthetic fixtures only
- repository verification supports `phase-2-milestone-21`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-engine`
- no REST APIs, frontend implementation, persistence implementation, scheduler, worker, live AI calls, prompt runtime, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, business workflows, provider payloads, prompts, secrets, or business examples exist in `packages/opportunity-engine`
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-21`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

The next milestone may consume `@opportunity-os/opportunity-engine` for provider-independent opportunity contracts. Do not begin Phase 2 Milestone 22 until a scoped implementation task is approved.

## Phase 1 Milestone 2 Readiness

Before handing off to the next milestone, confirm:

- `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, and `packages/shared` are implemented, tested, documented, and independently buildable
- dependency direction remains valid: base packages first, `packages/errors` may depend on `packages/types`, and `packages/shared` may depend on `packages/config`, `packages/types`, `packages/errors`, and `packages/utils`
- shared contracts for configuration, generic types, errors, utilities, logging, context, and validation results are documented for future consumers
- no business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

The next milestone must consume the shared foundation packages rather than redefining configuration, error, utility, logging, context, or validation contracts inside downstream implementation packages.

## Logging Foundation Usage

Phase 1 Milestone 3 implements the logging foundation in `packages/shared`. Future packages should consume logging through `@opportunity-os/shared`.

Use the shared logger as follows:

- create explicit logger configuration with `createLoggerConfig()`
- create logger instances with `createPinoLogger()`
- use injectable destinations and clocks in tests
- use `logger.child()` for immutable inherited correlation, request, and base context
- use severity methods `debug`, `info`, `warn`, and `error`
- provide a `correlationId` through the call input or child logger
- provide `requestId` only when request context exists

Do not read `process.env` from logging consumers. Logging runtime values should come from validated configuration once a future package wires `@opportunity-os/config` to `@opportunity-os/shared`.

Secret-safe logging rules:

- never log secrets, tokens, API keys, provider keys, passwords, credentials, DSNs, connection strings with credentials, or raw auth headers
- log stable identifiers, event names, correlation IDs, request IDs, and operational metadata instead of sensitive payloads
- rely on shared normalization for defense in depth, but do not intentionally pass sensitive data to the logger
- log `OpportunityError` and unknown `Error` values through the shared logger so stacks and raw causes stay out of safe output

Milestone 3 does not include HTTP middleware, API integration, connector integration, AI workflow integration, database integration, frontend integration, app startup, or business logic.

## Phase 1 Milestone 3 Readiness

Before handing off to the next milestone, confirm:

- `packages/shared` owns the Pino-backed structured logger foundation
- logger contracts, config, Pino level mapping, clock, destination, child logger, severity methods, and error normalization are tested
- logging output remains secret-safe, schema-stable, and stack-safe
- workspace exports expose approved logging capabilities from `@opportunity-os/shared`
- repository verification enforces logging files, exports, dependency boundaries, and Pino scoping
- no application code, APIs, connectors, AI workflows, database implementation, frontend implementation, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Do not begin Phase 1 Milestone 4 until its task scope, owning package, Engineering Kit references, acceptance criteria, and tests are approved.

## Event Foundation Usage

Phase 1 Milestone 4 implements event foundation contracts in `packages/events`. Future packages should consume event contracts through `@opportunity-os/events` once their implementation milestone approves the dependency.

Use the event package for:

- infrastructure-level event categories
- event metadata and generic event envelopes
- correlation, causation, request, idempotency, and replay-readiness contracts
- transport-agnostic publisher and consumer interfaces
- deterministic event serialization and safe deserialization
- generic event results and secret-safe event errors
- test-only in-memory event bus support

Do not add business event names, domain payload types, database event stores, Kafka/NATS/Redis transport, production queues, connector integration, API integration, AI workflow integration, frontend integration, app startup, or business logic to `packages/events`.

Event privacy rules:

- never expose raw event payloads, secrets, tokens, API keys, provider keys, passwords, credentials, DSNs, credential-bearing URLs, or raw auth headers in event errors, logs, tests, generated artifacts, pull requests, or documentation
- keep event metadata operational; do not place business payload fields in metadata
- treat the in-memory event bus as test-only infrastructure and never as production transport
- update package tests and contract stability checks whenever event contract shapes change

## Phase 1 Milestone 4 Readiness

Before handing off to the next milestone, confirm:

- `packages/events` owns and exports Event Foundation contracts
- event categories, metadata, versioning, envelopes, context, schemas, publisher and consumer interfaces, serialization, idempotency, replay, results, errors, and test-only in-memory bus behavior are tested
- event errors and deserialization failures remain secret-safe
- repository verification supports `phase-1-milestone-4`, permits `packages/events`, and continues blocking apps, APIs, connectors, AI workflows, frontend, database, domain, intelligence, acquisition, application, and business implementation
- no application code, APIs, connectors, AI workflows, database implementation, frontend implementation, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-4`, `pnpm lint`, `pnpm build`, and `pnpm test` pass

## Documentation Rules

Cross references must point to existing files or approved Engineering Kit document aliases. Prefer repository-relative paths.

When adding or renaming Markdown documents:

- keep `docs/` documents numbered by section
- keep folder number and document number aligned
- make the first heading match the file name
- update `docs/00_INDEX/00-001_DOCUMENTATION_INDEX.md` when document order or source-of-truth mapping changes
- run `node scripts/verify-repository.mjs --phase review`

## Testing

At Phase 1 Milestone 4, `pnpm test` runs repository verification and package-level tests for `packages/config`, `packages/types`, `packages/errors`, `packages/utils`, `packages/shared`, and `packages/events`.

Event Foundation work must remain infrastructure-only and must not introduce business events, domain-specific event names, database event stores, Kafka/NATS/Redis transport, connectors, APIs, AI workflows, frontend code, or business logic.

Do not add test suites for application behavior, APIs, connectors, AI workflows, or business logic until the relevant implementation task exists.

Future testing expectations:

- Use Vitest for package-level unit and integration tests.
- Use Supertest for API route and HTTP contract tests.
- Use Playwright for end-to-end frontend workflows.
- Add contract tests for API schemas, event envelopes, connector contracts, and AI workflow input/output contracts.
- Add integration tests when code crosses package boundaries or depends on PostgreSQL, Redis, queues, or external provider adapters.

Every implementation pull request should identify the test layer it affects and include verification evidence.

## Environment

Use `.env.example` as the contract for required and optional variables.

Required variables:

- `APP_NAME`
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_MODEL`
- `ANTHROPIC_MODEL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `LOG_LEVEL`
- `OTEL_EXPORTER_ENDPOINT`

Optional variables:

- `SENTRY_DSN`
- `LANGFUSE_API_KEY`
- `LANGSMITH_API_KEY`

Safe defaults are limited to `NODE_ENV=local`, `PORT=3000`, and `LOG_LEVEL=info`. Required secrets and credentials do not receive defaults.

For local work:

1. Create `.env` from `.env.example`.
2. Keep real secrets only in `.env` or your local secret manager.
3. Leave provider keys empty until a scoped implementation task requires them.
4. Use Docker Compose for local PostgreSQL and Redis when a task requires services.

For production work:

- Provide required variables through the deployment platform or secret manager.
- Do not reuse local secrets.
- Do not commit `.env`, credentials, API keys, tokens, or generated secret files.

Runtime configuration validation now belongs to `packages/config` during Phase 1 shared infrastructure work. It fails fast when required variables are missing or malformed and must not print raw secret values in error output.

## Security and Repository Hygiene

Treat the repository as public unless told otherwise.

Secret handling:

- Never commit `.env`; only `.env.example` belongs in Git.
- Never commit API keys, access tokens, refresh tokens, passwords, private keys, certificates with private material, database dumps, browser session exports, or raw authentication headers.
- Keep real secrets in your local `.env`, OS keychain, password manager, deployment platform, or secret manager.
- Use placeholder values in documentation and examples.
- Rotate any secret immediately if it is accidentally committed or pasted into an issue, pull request, log, or generated artifact.

Shared foundation security expectations:

- Error output exposed outside the throwing boundary must use secret-safe serialization.
- Safe errors may include stable codes, categories, safe messages, `correlationId`, and `requestId`; they must not include raw causes, stack traces, provider keys, credentials, tokens, passwords, raw auth headers, or secret values by default.
- Logging must never include secrets, tokens, raw auth headers, provider keys, credentials, API keys, passwords, or connection strings with credentials.
- Future logging implementations must use structured fields from `packages/shared` and avoid placing sensitive payloads in `message` or structured context.
- Generic redaction helpers from `@opportunity-os/utils` may be used for infrastructure-safe diagnostics, but redaction is defense in depth and not permission to collect or log sensitive values.

Ignored files:

- `.env` and `.env.*` are ignored, except `.env.example`.
- dependency folders, build outputs, test reports, local caches, generated archives, scratch artifacts, and unrelated local research folders are ignored.
- generated files should be reviewed before staging; do not assume `.gitignore` catches every local artifact.

Artifact cleanup:

- Remove temporary exports, local reports, scratch files, database dumps, and generated archives before opening a pull request.
- Do not commit local Docker state, dependency caches, coverage reports, Playwright reports, or `node_modules`.
- Keep unrelated work outside this repository or add a narrowly scoped ignore rule.

Manual security checklist before every pull request:

- `git status --short --ignored` shows no unexpected tracked or untracked files.
- No real secrets appear in staged changes.
- `.env` remains ignored and `.env.example` contains placeholders only.
- Logs, screenshots, generated reports, and archives contain no credentials or private data.
- Pull request text does not include secret values.

## Pull Requests

Every pull request should include:

- Summary of the change
- Linked issue or task
- Documentation impact
- Test or verification evidence
- Explicit note if no business logic was changed
- Referenced Engineering Kit documents
- Phase classification: Phase 0 foundation or Phase 1+ implementation
- Confirmation that cross references and document numbering were checked
- Confirmation that no secrets or unrelated local artifacts are included
