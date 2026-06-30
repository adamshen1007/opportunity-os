# Container Package

Owns the Dependency Injection and Composition Foundation for Phase 1 Milestone 8.

`packages/container` owns dependency injection and composition contracts only. It is the future home for dependency token contracts, service registration contracts, lifetime contracts, factory registration contracts, scoped container contracts, composition root contracts, module registration contracts, configuration binding contracts, and logger integration contracts.

## Package Boundary

Milestone 8 establishes:

- `@opportunity-os/container` workspace package setup
- strict TypeScript package configuration
- public package exports through `src/index.ts`
- repository verification support for `phase-1-milestone-8`
- dependency boundaries for approved foundation packages
- dependency tokens
- service descriptors
- singleton, scoped, and transient lifetimes
- factory, class, and value registrations
- container resolver interfaces
- scope interfaces
- module definitions
- composition root contracts
- typed configuration bindings
- shared logger bindings
- registration validation contracts
- secret-safe container errors
- export stability, package boundary, and contract stability tests

`packages/container` may depend only on approved foundation packages:

- `@opportunity-os/errors`
- `@opportunity-os/config`
- `@opportunity-os/shared`

It may also use deterministic test and build tooling such as `vitest` and `@types/node`.

## Contract Usage

Future packages must consume `@opportunity-os/container` instead of redefining dependency injection or composition contracts locally.

Use dependency tokens for typed dependency identity:

- `DependencyToken`
- `createDependencyToken`

Use registration contracts for generic dependency registration descriptions:

- `ServiceDescriptor`
- `ClassRegistration`
- `FactoryRegistration`
- `ValueRegistration`
- `SERVICE_REGISTRATION_KINDS`

Use lifetimes for stable lifecycle vocabulary:

- `CONTAINER_LIFETIMES`
- `singleton`
- `scoped`
- `transient`

Use container and resolver contracts for dependency lookup boundaries:

- `DependencyResolver`
- `ContainerContract`

These contracts describe lookup shape only. They do not implement dependency graph execution, reflection, runtime resolution, or a service locator.

Use scope contracts for scoped lifetime boundaries:

- `ContainerScope`
- `ScopedContainer`
- `ScopeFactory`

These contracts do not create HTTP request scopes, middleware, propagation, or application startup behavior.

Use module and composition contracts for future assembly boundaries:

- `ModuleDefinition`
- `ModuleRegistration`
- `CompositionRoot`
- `CompositionRootInput`
- `CompositionResult`
- `COMPOSITION_RESULT_STATUSES`

These contracts do not implement app startup, API boot, product workflow composition, module loading, dependency graph execution, or runtime container behavior.

Use configuration bindings to bind explicit typed config from `@opportunity-os/config`:

- `ConfigBinding`
- `ConfigBindingInput`

Configuration bindings must receive explicit `RuntimeConfig` values. They must not read `process.env`.

Use logger bindings to bind explicit shared logging dependencies from `@opportunity-os/shared`:

- `LoggerBinding`
- `LoggerFactoryBinding`
- `LoggerBindingContract`

Logger bindings must not introduce a logger singleton, app integration, transport, or startup behavior.

Use validation and error contracts for future composition root diagnostics:

- `RegistrationValidationResult`
- `RegistrationValidationIssue`
- `REGISTRATION_VALIDATION_ISSUE_CODES`
- `ContainerError`
- `createContainerError`
- `CONTAINER_ERROR_CODES`

Container errors serialize safely by default. They must not expose secrets, tokens, auth headers, credentials, raw config values, stack traces, or raw causes.

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

Future approved milestones may consume these generic container contracts. They must not add concrete product services, runtime application startup, HTTP behavior, auth behavior, connector behavior, workflow behavior, database repository behavior, frontend behavior, or business behavior inside `packages/container`.

## Readiness

Milestone 8 is ready when:

- `@opportunity-os/container` is implemented, tested, documented, and independently buildable
- public exports route through `packages/container/src/index.ts`
- dependency boundary tests confirm only approved dependencies are used
- contract stability tests cover tokens, lifetimes, registration kinds, composition result shapes, validation issue codes, and safe error shapes
- repository verification passes for `review` and `phase-1-milestone-8`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/container`
- Docker Compose config validates
- no REST APIs, controllers, auth implementation, connector execution, AI workflows, database repositories, frontend, application services, product workflows, or business logic exist

## Commands

Build the package:

```sh
pnpm --filter @opportunity-os/container build
```

Run deterministic package tests:

```sh
pnpm --filter @opportunity-os/container test
```

Run the package boundary through repository verification:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-8
```
