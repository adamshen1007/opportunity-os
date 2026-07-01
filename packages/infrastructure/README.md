# Infrastructure Package

Owns the Infrastructure Composition Foundation for Phase 1 Milestone 9.

`packages/infrastructure` owns infrastructure composition contracts only. It defines the declarative boundaries used by future implementation packages to compose existing foundation packages without starting applications, resolving dependency graphs, opening connections, running workflows, or executing product behavior.

## Package Boundary

Phase 1 Milestone 9 establishes:

- `@opportunity-os/infrastructure` workspace package setup
- strict TypeScript package configuration
- public package exports through `src/index.ts`
- repository verification support for `phase-1-milestone-9`
- dependency boundaries for approved foundation packages
- infrastructure modules
- composition modules
- package registration modules
- infrastructure bootstrap
- lifecycle orchestration
- startup validation
- shutdown orchestration
- health aggregation
- dependency graph validation
- infrastructure-safe errors and results
- foundation package composition metadata

`packages/infrastructure` may depend only on approved foundation packages:

- `@opportunity-os/config`
- `@opportunity-os/shared`
- `@opportunity-os/events`
- `@opportunity-os/database`
- `@opportunity-os/domain`
- `@opportunity-os/errors`
- `@opportunity-os/application`
- `@opportunity-os/container`

It may also use deterministic test and build tooling such as `vitest` and `@types/node`.

## Contracts

Module contracts describe infrastructure modules, their stable infrastructure-level kind, dependencies, tags, and optional container module metadata. Package registration metadata records the approved foundation package, module ID, provided capabilities, required modules, and optional version information.

Bootstrap contracts describe explicit bootstrap input, validation output, and composed container result shapes. They do not compose, resolve, instantiate, or start anything.

Lifecycle contracts define stable phases, participant metadata, startup order, and shutdown order. Graceful shutdown contracts define participants, ordering, timeout metadata, and safe failure result shapes without process signal handling or shutdown execution.

Startup validation contracts define checks, result statuses, issue codes, and safe messages. Dependency graph validation contracts define nodes, edges, cycles, missing dependencies, duplicate registrations, and validation results without executing graph traversal or runtime resolution.

Health aggregation contracts define aggregate status, component status, checked timestamp, metadata, and safe failure messages. They do not expose API routes or perform live health checks.

Foundation package composition contracts reference:

- `@opportunity-os/config` for typed runtime configuration
- `@opportunity-os/shared` for logging contracts
- `@opportunity-os/events` for event publisher, consumer, and schema contracts
- `@opportunity-os/database` for database client factory and health contract types
- `@opportunity-os/domain` for domain metadata only
- `@opportunity-os/application` for application metadata and ports only

Infrastructure errors use `@opportunity-os/errors` and serialize safe details only. Safe output must not include secrets, tokens, raw auth headers, credentials, DSNs, database URLs, provider keys, raw configuration values, stack traces, raw causes, or raw dependency details.

## Non-Goals

This package must not introduce:

- REST APIs
- controllers
- authentication implementation
- authorization implementation
- connector execution
- AI workflows
- database repository implementations
- frontend implementation
- application services
- product workflows
- business logic

Future approved milestones may consume these generic infrastructure composition contracts. They must not add app startup, API boot, runtime workflow composition, connector behavior, database repository behavior, frontend behavior, or business behavior inside `packages/infrastructure`.

## Readiness Gate

Milestone 9 is ready for handoff when:

- `@opportunity-os/infrastructure` is implemented, tested, documented, and independently buildable
- public exports route through `packages/infrastructure/src/index.ts`
- export, boundary, stability, and security tests pass
- repository verification supports `phase-1-milestone-9`
- no REST APIs, controllers, auth implementation, connector execution, AI workflows, database repositories, frontend, product workflows, application services, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-1-milestone-9`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

## Commands

Build the package:

```sh
pnpm --filter @opportunity-os/infrastructure build
```

Run deterministic package tests:

```sh
pnpm --filter @opportunity-os/infrastructure test
```

Run the package boundary through repository verification:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-9
```
