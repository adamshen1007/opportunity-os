# Connectors Package

`packages/connectors` owns the Connector SDK Foundation for Phase 2 Milestone 10.

The package defines generic connector contracts only. Future provider-specific connector packages must consume these SDK contracts instead of redefining metadata, capability, configuration, context, lifecycle, result, error, registry, factory, validation, health, limit, operation, or test utility shapes.

## Ownership

`@opportunity-os/connectors` owns:

- connector metadata contracts
- connector capability contracts
- connector configuration contracts
- connector context contracts
- connector lifecycle contracts
- generic connector interface contracts
- connector result contracts
- connector error contracts
- connector validation contracts
- connector registry contracts
- connector factory contracts
- connector operation contracts
- connector health contracts
- rate-limit and quota metadata contracts
- connector test utility contracts

## Contract Areas

Metadata describes provider-neutral identity and release state: connector ID, name, version, description, provider, category, tags, and stability status.

Capabilities are declarative and describe supported SDK capability kinds without provider behavior.

Configuration accepts explicit typed input and does not read `process.env`. Secret-like config fields are marked sensitive.

Context carries required correlation ID, optional request ID, shared logger contract, explicit config, and operation metadata.

Lifecycle contracts define stable phase vocabulary and state transitions without running connector work.

Results, operations, registry, and factory contracts remain generic. They describe success/failure payloads, operation input/output, pagination metadata, registry shapes, and factory input/output only.

Validation contracts cover config, metadata, capability, lifecycle, and dependency issues with safe messages.

Health contracts include status, checked timestamp, safe message, metadata, and optional capability references.

Rate-limit and quota contracts describe metadata only.

Test utility contracts describe fake metadata, fake contexts, fixtures, and assertion helper shapes. They do not execute real connectors or call external providers.

## Errors And Security

Connector errors use `@opportunity-os/errors` and serialize through safe output.

Safe output must not leak:

- secrets
- tokens
- raw auth headers
- credentials
- provider keys
- DSNs
- database URLs
- raw config values
- stack traces
- raw causes
- raw response payloads
- raw dependency details

## Non-Goals

Phase 2 Milestone 10 does not include:

- Reddit connector
- YouTube connector
- OAuth implementation
- HTTP clients
- REST APIs
- controllers
- authentication implementation
- authorization implementation
- AI workflows
- frontend implementation
- business logic
- concrete connector implementations
- connector execution

## Commands

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-10
pnpm --filter @opportunity-os/connectors test
pnpm --filter @opportunity-os/connectors build
```

## Readiness

The Connector SDK Foundation is ready when:

- `@opportunity-os/connectors` is implemented, tested, documented, and independently buildable
- all public exports route through `packages/connectors/src/index.ts`
- export stability, dependency boundary, contract stability, and security tests pass
- repository verification supports `phase-2-milestone-10`
- no concrete connector, OAuth, HTTP client, API, auth implementation, AI workflow, frontend, business logic, or connector execution exists
