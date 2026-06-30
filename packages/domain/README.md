# Domain Package

Owns the Domain Foundation for Phase 1 Milestone 6.

`packages/domain` owns generic domain contracts only. It is the future home for domain primitive types, entity contracts, value object contracts, aggregate root contracts, domain event contracts, domain error contracts, and domain repository interface contracts.

## Package Boundary

Slice A establishes:

- `@opportunity-os/domain` workspace package setup
- strict TypeScript package configuration
- public package exports through `src/index.ts`
- repository verification support for `phase-1-milestone-6`
- dependency boundaries for approved shared infrastructure packages

Slice B adds generic contracts for:

- branded domain IDs
- domain timestamps
- domain versions
- immutable value objects
- entities with identity and metadata
- aggregate roots with identity, version, and pending event references
- created, updated, and version metadata

Slice C adds generic contracts for:

- domain events that reuse `@opportunity-os/events` envelope, metadata, payload, and version concepts
- domain event collections that expose pending events without publication or transport behavior
- domain errors based on `@opportunity-os/errors`
- domain repository interfaces that return domain entities or aggregate roots
- generic validation results
- generic domain operation results

Slice D hardens the package with:

- public export stability tests
- package dependency boundary tests
- contract stability tests for primitives, entities, value objects, aggregate roots, events, errors, and repositories
- root pipeline coverage through workspace lint, build, and test

Slice E completes governance with:

- repository verification support for `phase-1-milestone-6`
- package usage documentation for future consumers
- roadmap readiness and next milestone dependency documentation
- PR checklist coverage for domain contract review

`packages/domain` may depend only on:

- `@opportunity-os/types`
- `@opportunity-os/errors`
- `@opportunity-os/events`
- `@opportunity-os/utils`
- `@types/node` for deterministic package tests

Additional dependencies require a later approved milestone task.

## Non-Goals

This package must not introduce:

- connector execution
- Raw Content persistence workflows
- AI workflows
- APIs
- frontend implementation
- application services
- business scoring logic
- database repository implementations
- production event store transport

Phase 1 Milestone 6 does not implement concrete aggregate types, concrete event names, concrete payloads, scoring, command handlers, application services, business processes, persistence models, repository implementations, publication, transport, or runtime behavior.

## Consumer Rules

Future packages should use `@opportunity-os/domain` for:

- domain primitives such as IDs, timestamps, and versions
- immutable value object contracts
- entity and aggregate root contracts
- created, updated, and version metadata contracts
- domain event references and pending event collection contracts
- generic domain errors
- generic repository interface contracts
- generic validation and result contracts

Future packages must not define local replacements for these contracts when `@opportunity-os/domain` already owns the concept. Domain repository implementations, application services, workflow execution, connector execution, database mapping, and business scoring remain later milestone work.

## Commands

Build the package:

```sh
pnpm --filter @opportunity-os/domain build
```

Run deterministic package tests:

```sh
pnpm --filter @opportunity-os/domain test
```

Run the package boundary through repository verification:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-6
```
