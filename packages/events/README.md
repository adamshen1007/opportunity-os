# Events Package

Owns Event Foundation contracts for Phase 1 Milestone 4.

`packages/events` defines infrastructure-level event contracts only. It does not implement business events, domain-specific event names, a database event store, Kafka/NATS/Redis transport, connectors, APIs, AI workflows, frontend code, or business logic.

## Package Boundary

Owned responsibilities for Slice A:

- event category contracts
- event metadata contracts
- event versioning contracts
- public exports for foundational event contracts
- package-level tests for category, metadata, and version stability

Owned responsibilities for Slice B:

- generic event envelope contracts
- event context contracts for correlation, causation, and request IDs
- schema interface contracts
- publisher interface contracts
- consumer interface contracts
- package-level tests for envelope, context, schema, publisher, and consumer contracts

Owned responsibilities for Slice C:

- idempotency key and status contracts
- replay metadata, checkpoint, and eligibility contracts
- deterministic event serialization and safe deserialization helpers
- generic event result contracts
- secret-safe event error contracts
- package-level tests for idempotency, replay, serialization, results, and safe errors

Owned responsibilities for Slice D:

- test-only in-memory event bus support
- explicit event contract stability tests
- event security tests
- package-level lint, build, and test participation in the root workspace pipeline

## Event Categories

Event categories are stable infrastructure-level constants:

- `infrastructure`
- `integration`
- `lifecycle`
- `observability`
- `security`

Do not add business categories such as customer, opportunity, account, acquisition, intelligence, or recommendation categories in this package.

## Event Metadata

Event metadata includes:

- `eventId`
- `eventName`
- `category`
- `version`
- `timestamp`
- `source`
- `correlationId`
- optional `causationId`
- optional `requestId`
- optional `idempotencyKey`

Metadata must not contain payload business fields.

## Event Versioning

Event versions use the generic `vN` format, where `N` is a positive integer. Examples:

- `v1`
- `v2`
- `v12`

Version helpers must remain deterministic and must not introduce migration, persistence, transport, connector, workflow, API, frontend, or business behavior.

## Event Envelopes

Event envelopes include:

- `metadata`
- generic `payload`

Payloads must remain generic and business-agnostic in this package. Do not add domain payload types or business event names to `packages/events`.

## Event Context

Event context includes:

- required `correlationId`
- optional `causationId`
- optional `requestId`

Correlation IDs are required for tracing event chains. Causation IDs and request IDs are optional because not every event is caused by another event or request.

## Event Schemas

Event schema contracts define:

- `eventName`
- `version`
- `validate(payload)`

The schema contract is library-agnostic. Do not add Zod or any other schema library to this package unless a future approved task changes that boundary.

## Publisher And Consumer Contracts

Publisher and consumer contracts are transport-agnostic interfaces. They must not include queue, stream, database, connector, workflow, API, frontend, or business behavior.

## Idempotency

Idempotency contracts define stable infrastructure statuses:

- `new`
- `processed`
- `duplicate`
- `conflict`

These are contracts only. The package does not implement persistence, deduplication, or an idempotency store.

## Replay Readiness

Replay contracts define replay metadata, checkpoint, and eligibility shapes for future event stores.

This package does not implement a scheduler, stream reader, replay executor, database event store, or transport.

## Serialization And Results

`serializeEventEnvelope()` produces deterministic JSON by sorting object keys. `deserializeEventEnvelope()` returns an explicit event result and fails safely for invalid serialized input.

Event errors must not expose raw payloads or secret-like values. Error messages and details redact passwords, API keys, provider keys, tokens, authorization headers, credentials, DSNs, and credential-bearing URLs.

## Event Privacy Rules

Event contracts must remain secret-safe by default:

- do not include raw payload values in event errors, logs, tests, pull requests, generated artifacts, or documentation
- do not expose API keys, tokens, passwords, raw auth headers, provider keys, credentials, DSNs, or credential-bearing URLs
- keep metadata operational and free of business payload fields
- keep payload contracts generic inside this package
- add or update security tests whenever error or serialization behavior changes

## Test-only In-memory Event Bus

`createInMemoryEventBus()` exists for deterministic package tests only.

It supports:

- `subscribe(consumer)`
- `publish(envelope)`
- deterministic consumer notification order
- reading published envelopes inside tests
- clearing test-owned memory

It does not persist events and must not be used as production transport. It does not implement Kafka, NATS, Redis, database-backed event stores, queueing, streams, connectors, workflows, APIs, frontend behavior, or business behavior.

## Contract Hardening

Contract stability tests lock:

- event envelope keys
- metadata keys
- category values
- version format
- idempotency statuses
- replay metadata, checkpoint, and eligibility keys

Security tests verify event errors and deserialization failures do not leak API keys, tokens, passwords, auth headers, provider keys, DSNs, credentials, or raw payload values.

## Readiness Gate

Phase 1 Milestone 4 is ready when:

- `packages/events` builds and tests independently
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/events`
- repository verification passes for `review` and `phase-1-milestone-4`
- no app, API, connector, AI workflow, frontend, database, domain, intelligence, acquisition, application, or business implementation exists
- event privacy rules are reviewed for every event contract change
