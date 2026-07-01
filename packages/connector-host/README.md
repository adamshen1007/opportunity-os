# Connector Host Package

`packages/connector-host` owns the Connector Host Foundation for Phase 2 Milestone 12.

The package defines generic connector host contracts only. It coordinates host-facing contracts across connector bootstrap, runner boundaries, runtime orchestration, lifecycle orchestration, dependency injection bindings, configuration bindings, logger bindings, event publishing bindings, startup validation, graceful shutdown, health aggregation, execution orchestration, results, host errors, and deterministic test harnesses.

It does not start a host process, instantiate services, run connectors, call providers, or integrate with application entry points.

## Public Boundary

Public consumers must import approved contracts from the package root:

```ts
import type {
  ConnectorHostExecutionOrchestrationContract,
  ConnectorHostResult
} from "@opportunity-os/connector-host";
```

Internal file imports are unnecessary for approved consumers. Public exports route through `src/index.ts`, and export stability tests protect the public surface.

## Host Contracts

The foundation includes:

- bootstrap contracts for host inputs, outputs, infrastructure validation, and safe status reporting
- runner boundary contracts for request context and safe result shapes
- runtime orchestration contracts that compose runtime pipeline, state, retry, timeout, rate-limit, metrics, telemetry, and aggregation contracts
- lifecycle orchestration contracts for configure, validate, initialize, health-check, execute-ready, and shutdown phases
- DI, config, logger, and event publishing binding contracts
- startup validation checks, issue codes, safe messages, and result shapes
- graceful shutdown participants, ordering, timeout metadata, and safe failure results
- host, runtime, and connector health aggregation contracts
- execution orchestration request, context, policy input, and safe result contracts
- host result contracts for success, partial success, failure, validation failure, and shutdown failure
- secret-safe host error contracts based on approved `@opportunity-os/errors` patterns
- deterministic test harness contracts for fake config, runtime context, connector fixtures, logger/event bindings, and assertions

## Approved Dependencies

`@opportunity-os/connector-host` may depend only on:

- `@opportunity-os/config`
- `@opportunity-os/connectors`
- `@opportunity-os/connector-runtime`
- `@opportunity-os/container`
- `@opportunity-os/application`
- `@opportunity-os/errors`
- `@opportunity-os/events`
- `@opportunity-os/shared`
- `@opportunity-os/infrastructure`

Additional workspace dependencies require a scoped milestone task and repository verification update.

## Future Consumption

Future host, worker, API, connector, or orchestration packages must consume `@opportunity-os/connector-host` rather than redefining host bootstrap, lifecycle, binding, validation, shutdown, health, execution, result, error, or test harness contracts.

Future implementation milestones may bind these contracts to concrete runtime behavior only when explicitly scoped. Until then, these contracts remain declarative and side-effect free.

## Security

Startup failures, health failures, execution results, host errors, telemetry bindings, and shutdown failures must stay secret-safe and stack-safe by default.

Do not expose raw payloads, config values, provider responses, stacks, causes, secrets, tokens, auth headers, credentials, provider keys, DSNs, database URLs, or dependency internals.

## Non-Goals

This package must not introduce:

- Reddit connector
- YouTube connector
- OAuth implementation
- HTTP clients
- scheduler
- queue
- worker process
- AI workflows
- APIs
- frontend implementation
- business logic
- provider integration
- actual connector execution

## Commands

Build the package:

```sh
pnpm --filter @opportunity-os/connector-host build
```

Run package tests:

```sh
pnpm --filter @opportunity-os/connector-host test
```

Run repository verification:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-12
```
