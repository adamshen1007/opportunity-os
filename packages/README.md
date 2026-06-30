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

## Dependency Direction

- `packages/types` and `packages/utils` are base packages.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.
- `packages/events` is a shared infrastructure package and currently must remain independent of other workspace packages unless a future approved milestone changes the boundary.
- `packages/database` is a persistence infrastructure package and may declare Prisma dependencies plus explicitly approved shared infrastructure package dependencies when a scoped milestone requires them.
- `packages/domain` may depend only on `@opportunity-os/types`, `@opportunity-os/errors`, `@opportunity-os/events`, and optionally `@opportunity-os/utils`.
- `packages/application` may depend only on approved foundation packages when a scoped milestone requires them.

Shared foundation packages must not depend on apps, APIs, connectors, AI workflows, frontend packages, domain packages, intelligence packages, acquisition packages, application packages, or business packages. Database package dependencies must remain limited to approved persistence infrastructure and shared infrastructure explicitly allowed by a scoped milestone. Domain package dependencies must remain limited to approved shared infrastructure packages. Application package dependencies must remain limited to approved foundation packages.

## Non-Goals

Phase 1 Milestone 7 Slice A does not include business logic, connectors, APIs, REST API routes, controllers, authentication implementation, authorization implementation, AI workflows, frontend implementation, app code, connector execution, Raw Content persistence workflows, database repository implementations, business scoring logic, production event store transport, actual product use cases, or full business workflows.

Future packages must not bypass `@opportunity-os/domain` for domain primitives, entities, value objects, aggregate roots, domain events, domain errors, repository contracts, validation contracts, or result contracts.

Future packages must not bypass `@opportunity-os/application` for command/query contracts, use-case boundaries, application services, DI contracts, request contexts, application errors, event publishing ports, repository ports, transaction boundary ports, results, validation outcomes, or handler execution context contracts.

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
- add integration tests only when implementation depends on PostgreSQL, Redis, queues, or provider adapters

Do not add tests for application behavior, APIs, connectors, AI workflows, database behavior, or business logic before the corresponding implementation task is approved.
