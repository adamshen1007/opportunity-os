# Packages

Shared workspace packages live here.

Package boundaries must follow the dependency rules in `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md` and the implementation order in `docs/05_BOOTSTRAP/05-005_IMPLEMENTATION_ORDER.md`.

## Current Packages

- `packages/config` owns runtime configuration validation and typed config exports.
- `packages/types` owns generic shared TypeScript types.
- `packages/errors` owns generic error contracts and secret-safe serialization.
- `packages/utils` owns generic deterministic utility helpers.
- `packages/shared` owns shared contracts and approved aggregation for the shared foundation layer.

## Dependency Direction

- `packages/types` and `packages/utils` are base packages.
- `packages/errors` may depend on `@opportunity-os/types`.
- `packages/shared` may depend on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.

Shared foundation packages must not depend on apps, APIs, connectors, AI workflows, database packages, frontend packages, domain packages, or business packages.

## Non-Goals

Phase 1 Milestone 2 does not include business logic, connectors, APIs, AI workflows, database implementation, frontend implementation, or app code.

## Testing

Package-level tests use Vitest and run through `pnpm test`.

Future package work should:

- keep tests inside the package that owns the behavior
- add contract tests for exported types, schemas, event envelopes, connector contracts, and AI workflow input/output contracts only when those scoped packages exist
- add integration tests only when implementation depends on PostgreSQL, Redis, queues, or provider adapters

Do not add tests for application behavior, APIs, connectors, AI workflows, database behavior, or business logic before the corresponding implementation task is approved.
