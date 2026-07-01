# Connector Runtime Package

`packages/connector-runtime` owns the Connector Runtime Foundation for Phase 2 Milestone 11.

The package defines connector runtime contracts only. It owns execution pipeline contracts, execution state machine contracts, retry and timeout policy contracts, cancellation contracts, checkpoint contracts, execution metrics and telemetry contracts, rate-limit policy contracts, execution result aggregation contracts, runtime error contracts, and deterministic runtime test harness contracts.

## Package Boundary

`@opportunity-os/connector-runtime` provides generic runtime contracts for future connector orchestration. It does not run connectors and does not own provider integrations.

Public consumers should import from the package root:

```ts
import type {
  ConnectorRuntimeContext,
  ConnectorRuntimeExecutionPipeline,
  ConnectorRuntimeRetryPolicy
} from "@opportunity-os/connector-runtime";
```

Internal file imports are unnecessary for approved consumers. Public exports route through `src/index.ts`.

## Runtime Contracts

The package documents and exports:

- execution pipeline stages, pipeline inputs, outputs, success shapes, and safe failure shapes
- execution state and transition vocabularies
- retry, timeout, cancellation, checkpoint, and rate-limit policy contracts
- execution metrics for counts, durations, attempts, records, failures, and limit metadata
- structured telemetry event contracts that reference shared logging and event concepts
- execution result aggregation with connector summaries, metrics, checkpoints, validation issues, and safe errors
- runtime error contracts based on approved safe error patterns
- deterministic test harness contracts for fake clocks, fake connector fixtures, assertion helpers, and pipeline fixtures

Telemetry contracts are data shapes only. They do not emit telemetry, configure vendors, or export OpenTelemetry data.

## Approved Dependencies

`@opportunity-os/connector-runtime` may depend on:

- `@opportunity-os/connectors`
- `@opportunity-os/container`
- `@opportunity-os/application`
- `@opportunity-os/errors`
- `@opportunity-os/events`
- `@opportunity-os/shared`
- `@opportunity-os/infrastructure`

`@opportunity-os/types` and `@opportunity-os/utils` may be added only when a scoped runtime contract requires them.

Future packages should consume runtime contracts from `@opportunity-os/connector-runtime` instead of redefining execution state, pipeline, policy, telemetry, metrics, aggregation, error, or test harness shapes locally.

## Security And Privacy

Runtime failures, telemetry, metrics, checkpoints, and aggregation output must remain safe for logs and CI output. They must not expose:

- secrets
- tokens
- raw authentication headers
- credentials
- provider keys
- DSNs
- database URLs
- raw config values
- raw response payloads
- stack traces
- raw causes
- dependency internals

## Non-Goals

This package must not introduce:

- Reddit connector
- YouTube connector
- OAuth implementation
- HTTP clients
- scheduler
- queue
- worker process
- REST APIs
- controllers
- authentication implementation
- authorization implementation
- AI workflows
- frontend implementation
- business logic
- actual connector execution

## Commands

Build the package:

```sh
pnpm --filter @opportunity-os/connector-runtime build
```

Run package tests:

```sh
pnpm --filter @opportunity-os/connector-runtime test
```

Run the package boundary through repository verification:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-11
```

## Readiness Gate

Phase 2 Milestone 11 is complete when:

- `@opportunity-os/connector-runtime` is implemented, tested, documented, and independently buildable
- export stability, contract stability, security, dependency boundary, and package-boundary tests pass
- root `pnpm lint`, `pnpm build`, and `pnpm test` include the package
- repository verification passes for `review` and `phase-2-milestone-11`
- Docker Compose configuration validates
- no Reddit connector, YouTube connector, OAuth, HTTP clients, scheduler, queue, worker process, APIs, auth, AI workflows, frontend, business logic, or actual connector execution exists
