# Packages

Future shared workspace packages live here.

Package boundaries must follow the dependency rules in `docs/05_BOOTSTRAP/05-002_REPOSITORY_STRUCTURE.md`.

## Future Testing

No package implementation tests exist during Phase 0.

When package implementation begins:

- Use Vitest for unit tests and package-level integration tests.
- Add contract tests for exported types, schemas, event envelopes, connector contracts, and AI workflow input/output contracts.
- Add integration tests for packages that depend on PostgreSQL, Redis, queues, or provider adapters.
- Keep tests inside the package that owns the behavior.

Do not add test files before the corresponding package implementation task is approved.
