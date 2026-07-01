# Packages

Shared workspace packages live here.

Package boundaries must follow the dependency rules in `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md` and the implementation order in `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`.

## Current Packages

- `packages/config` owns runtime configuration validation and typed config exports.
- `packages/types` owns generic shared TypeScript types.
- `packages/errors` owns generic error contracts and secret-safe serialization.
- `packages/utils` owns generic deterministic utility helpers.
- `packages/shared` owns shared contracts and approved aggregation for the shared foundation layer.
- `packages/events` owns Event Foundation contracts for envelopes, metadata, versioning, publisher and consumer interfaces, serialization, idempotency, replay-readiness, event results, event errors, and test-only in-memory event bus support.
- `packages/database` owns Database Foundation infrastructure for Prisma setup, PostgreSQL schema foundation, migration framework commands, database client creation, repository contracts, transaction contracts, seed placeholders, and health contracts.
- `packages/domain` owns generic Domain Foundation contracts only.
- `packages/application` owns generic Application Foundation contracts only.
- `packages/container` owns Dependency Injection and Composition Foundation contracts only.
- `packages/infrastructure` owns Infrastructure Composition Foundation contracts only.
- `packages/connectors` owns generic Connector SDK Foundation contracts only.
- `packages/connector-runtime` owns Connector Runtime Foundation contracts only.
- `packages/connector-host` owns Connector Host Foundation contracts only.
- `packages/connectors-reddit` owns Reddit connector contracts only.

## Dependency Direction

- `packages/types` and `packages/utils` are base packages.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.
- `packages/events` is a shared infrastructure package and currently must remain independent of other workspace packages unless a future approved milestone changes the boundary.
- `packages/database` is a persistence infrastructure package and may declare Prisma dependencies plus explicitly approved shared infrastructure package dependencies when a scoped milestone requires them.
- `packages/domain` may depend only on `@opportunity-os/types`, `@opportunity-os/errors`, `@opportunity-os/events`, and optionally `@opportunity-os/utils`.
- `packages/application` may depend only on approved foundation packages when a scoped milestone requires them.
- `packages/container` may depend only on `@opportunity-os/config`, `@opportunity-os/errors`, `@opportunity-os/shared`, and deterministic test/build tooling.
- `packages/infrastructure` may depend only on `@opportunity-os/config`, `@opportunity-os/shared`, `@opportunity-os/events`, `@opportunity-os/database`, `@opportunity-os/domain`, `@opportunity-os/application`, `@opportunity-os/container`, and deterministic test/build tooling.
- `packages/connectors` may depend only on approved foundation packages and deterministic test/build tooling when a scoped milestone requires them.
- `packages/connector-runtime` may depend only on `@opportunity-os/connectors`, `@opportunity-os/container`, `@opportunity-os/application`, `@opportunity-os/events`, `@opportunity-os/shared`, `@opportunity-os/infrastructure`, and explicitly justified `@opportunity-os/errors`, `@opportunity-os/types`, or `@opportunity-os/utils`.
- `packages/connector-host` may depend only on `@opportunity-os/config`, `@opportunity-os/connectors`, `@opportunity-os/connector-runtime`, `@opportunity-os/container`, `@opportunity-os/application`, `@opportunity-os/errors`, `@opportunity-os/events`, `@opportunity-os/shared`, and `@opportunity-os/infrastructure`.
- `packages/connectors-reddit` may depend only on `@opportunity-os/connectors`, `@opportunity-os/connector-host`, and deterministic test/build tooling during Phase 2 Milestone 13.

Shared foundation packages must not depend on apps, APIs, connectors, AI workflows, frontend packages, domain packages, intelligence packages, acquisition packages, application packages, or business packages. Database package dependencies must remain limited to approved persistence infrastructure and shared infrastructure explicitly allowed by a scoped milestone. Domain package dependencies must remain limited to approved shared infrastructure packages. Application package dependencies must remain limited to approved foundation packages. Container package dependencies must remain limited to approved foundation packages. Infrastructure package dependencies must remain limited to approved foundation packages and must not depend on apps, APIs, controllers, auth implementations, connectors, AI workflows, database repositories, frontend packages, product workflows, or business packages. Connector SDK package dependencies must remain limited to approved foundation packages and must not introduce concrete connector implementations, OAuth, HTTP clients, APIs, auth implementation, AI workflows, frontend packages, product workflows, or business packages. Connector Runtime package dependencies must remain limited to approved foundation packages and must not introduce provider connectors, OAuth, HTTP clients, schedulers, queues, worker processes, APIs, auth implementation, AI workflows, frontend packages, product workflows, business packages, or actual connector execution. Connector Host package dependencies must remain limited to approved foundation packages and must not introduce provider connectors, OAuth, HTTP clients, schedulers, queues, worker processes, APIs, auth implementation, AI workflows, frontend packages, product workflows, business packages, provider integration, or actual connector execution. Reddit connector package dependencies must remain limited to approved connector foundation packages and must not introduce OAuth, live Reddit API calls, HTTP clients, scraping, schedulers, queues, worker processes, database persistence, AI workflows, APIs, frontend packages, business logic, or actual connector execution.

## Non-Goals

Phase 1 Milestone 7 Slice A does not include business logic, connectors, APIs, REST API routes, controllers, authentication implementation, authorization implementation, AI workflows, frontend implementation, app code, connector execution, Raw Content persistence workflows, database repository implementations, business scoring logic, production event store transport, actual product use cases, or full business workflows.

Future packages must not bypass `@opportunity-os/domain` for domain primitives, entities, value objects, aggregate roots, domain events, domain errors, repository contracts, validation contracts, or result contracts.

Future packages must not bypass `@opportunity-os/application` for command/query contracts, use-case boundaries, application services, DI contracts, request contexts, application errors, event publishing ports, repository ports, transaction boundary ports, results, validation outcomes, or handler execution context contracts.

Future packages must not bypass `@opportunity-os/container` for dependency tokens, service registrations, lifetimes, resolver contracts, scope contracts, module definitions, composition roots, config bindings, logger bindings, registration validation contracts, or container error contracts.

Future packages must not bypass `@opportunity-os/infrastructure` for infrastructure module contracts, package registration modules, bootstrap contracts, lifecycle orchestration contracts, startup validation contracts, shutdown orchestration contracts, health aggregation contracts, or dependency graph validation contracts once those contracts are introduced by approved Milestone 9 slices.

Future concrete connectors must not bypass `@opportunity-os/connectors` for generic connector metadata, capability, configuration, context, lifecycle, result, error, registry, factory, validation, health, operation, limit, or test utility contracts.

Future runtime consumers must not bypass `@opportunity-os/connector-runtime` for connector runtime pipeline, state, retry, timeout, cancellation, checkpoint, rate-limit, metrics, telemetry, aggregation, runtime error, or deterministic test harness contracts.

Future host consumers must not bypass `@opportunity-os/connector-host` for connector host bootstrap, runner, runtime orchestration, lifecycle orchestration, DI bindings, config bindings, logger bindings, event publishing bindings, startup validation, graceful shutdown, health aggregation, execution orchestration, result, error, or deterministic test harness contracts.

Future Reddit connector work must consume `@opportunity-os/connectors-reddit` for Reddit-specific contracts and must consume `@opportunity-os/connectors` and `@opportunity-os/connector-host` contracts rather than bypassing the Connector SDK or Connector Host foundations.

Phase 2 Milestone 10 does not include Reddit connector, YouTube connector, OAuth implementation, HTTP clients, APIs, authentication implementation, AI workflows, frontend implementation, business logic, concrete connector implementations, or connector execution.

Phase 2 Milestone 11 does not include Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, authentication implementation, AI workflows, frontend implementation, business logic, or actual connector execution.

Phase 2 Milestone 12 does not include Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, authentication implementation, AI workflows, frontend implementation, business logic, provider integration, or actual connector execution.

Phase 2 Milestone 13 does not include OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend implementation, business logic, or actual connector execution.

The in-memory event bus in `packages/events` is test-only infrastructure. It must not be used as production transport, persistence, queueing, stream processing, connector behavior, workflow behavior, API behavior, or business behavior.

## Testing

Package-level tests use Vitest and run through `pnpm test`.

Future package work should:

- keep tests inside the package that owns the behavior
- add contract tests for exported types, schemas, event envelopes, connector contracts, and AI workflow input/output contracts only when those scoped packages exist
- keep Event Foundation contract tests inside `packages/events`
- keep Database Foundation tests and Prisma validation inside `packages/database`
- keep Domain Foundation contract tests inside `packages/domain`
- keep Application Foundation contract tests inside `packages/application`
- keep Container Foundation contract tests inside `packages/container`
- keep Infrastructure Composition Foundation contract tests inside `packages/infrastructure`
- keep Connector SDK Foundation contract tests inside `packages/connectors`
- keep Connector Runtime Foundation contract tests inside `packages/connector-runtime`
- keep Connector Host Foundation contract tests inside `packages/connector-host`
- keep Reddit Connector Foundation contract tests inside `packages/connectors-reddit`
- add integration tests only when implementation depends on PostgreSQL, Redis, queues, or provider adapters

Do not add tests for application behavior, APIs, connectors, AI workflows, database behavior, or business logic before the corresponding implementation task is approved.
