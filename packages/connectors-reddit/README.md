# Reddit Connector Foundation

`packages/connectors-reddit` owns Reddit connector contracts only.

Phase 2 Milestone 13 establishes the package boundary for Reddit connector foundation work. Slice F completes documentation, governance, roadmap alignment, and final readiness verification while keeping the package contract-only.

Phase 2 Milestone 14 establishes the Reddit Runtime Foundation boundary. The milestone may introduce a non-network Reddit runtime adapter in future slices, but Slice A updates verification and documentation only. No runtime execution exists in Slice A.

## Ownership

This package defines Reddit-specific connector contracts for:

- connector metadata
- capability declarations
- explicit configuration contracts
- validation contracts
- post, comment, subreddit, author, pagination, rate-limit, and data envelope contracts
- read operation contracts
- declarative lifecycle readiness contracts
- factory contracts
- host integration contracts
- safe error contracts
- deterministic fixture contracts
- export stability tests
- contract stability tests
- security tests
- dependency boundary tests
- final readiness verification

Future Reddit connector implementation must consume `@opportunity-os/connectors-reddit` for Reddit-specific contracts and must continue to consume generic connector contracts from `@opportunity-os/connectors` and host contracts from `@opportunity-os/connector-host` instead of redefining them locally.

## Dependency Boundary

Approved workspace dependencies for this milestone:

- `@opportunity-os/connectors`
- `@opportunity-os/connector-host`

No other workspace package dependencies are allowed unless a future scoped milestone updates the verifier and documentation.

## Runtime Boundary

Future Phase 2 Milestone 14 slices may implement deterministic, fixture-backed runtime behavior inside `packages/connectors-reddit` only. Runtime work must use existing Reddit connector contracts, Connector SDK contracts, Connector Host contracts, and deterministic test harness contracts.

The only approved runtime direction is a non-network Reddit runtime adapter using an in-memory or fake provider adapter. It may support deterministic fixture-based reads in later scoped slices, but it must not perform external connector execution.

Slice A does not add runtime source files, provider adapters, connector construction, lifecycle behavior, validation behavior, read behavior, or result mapping.

## Contracts

Metadata includes connector ID, name, version, provider, category, tags, stability status, and a safe description.

Capabilities are declarative only and cover Reddit read-contract areas for posts, comments, subreddits, authors, pagination metadata, and rate-limit metadata.

Configuration is explicit typed input only. It does not read `process.env`. Secret-like fields, including future OAuth credential fields, are modeled as sensitive config fields.

Validation contracts cover metadata, capabilities, config, lifecycle readiness, dependency readiness, and data shape compatibility. Validation issues include safe messages and do not define a runtime validation engine.

Data shape contracts define posts, comments, subreddits, authors, replay-safe pagination cursors, rate-limit metadata, and data envelopes. Cursors and source metadata must remain safe placeholders and must not expose secrets or raw provider payloads.

Operation contracts describe generic Reddit read operation inputs and outputs and return Reddit data envelopes. Lifecycle contracts map Reddit readiness to generic connector lifecycle concepts without running lifecycle behavior. Factory and host integration contracts reference `@opportunity-os/connectors` and `@opportunity-os/connector-host` concepts, accept explicit config and host context contracts, and do not create live connectors. Reddit errors use safe connector error serialization, and fixtures are deterministic placeholders with no real credentials.

Stability tests lock public root exports, metadata constants, capability values, validation issue codes, data envelope keys, pagination keys, rate-limit keys, factory contract shape, and safe error shape. Security tests verify validation failures, errors, fixtures, pagination metadata, rate-limit metadata, and host-facing contracts do not leak secrets, tokens, auth headers, credentials, provider keys, DSNs, database URLs, raw provider responses, raw payloads, stacks, causes, or dependency internals.

## Governance

Changes to this package require Reddit connector boundary review. Reviewers must confirm:

- public exports route through `packages/connectors-reddit/src/index.ts`
- contracts stay Reddit-specific and provider-facing without performing provider work
- configuration remains explicit typed input only
- future credential fields remain contract-only and sensitive
- fixture values are deterministic placeholders and contain no real credentials
- validation failures, errors, pagination metadata, rate-limit metadata, fixtures, and host-facing contracts remain secret-safe
- dependency boundaries stay limited to approved connector foundation packages and deterministic test/build tooling
- future implementation packages consume `@opportunity-os/connectors-reddit` instead of bypassing these contracts

## Readiness Gate

Phase 2 Milestone 13 is complete when:

- `@opportunity-os/connectors-reddit` is implemented, tested, documented, and independently buildable
- package files, contract files, tests, README, public exports, and dependency boundaries are enforced by repository verification
- metadata, capability, config, validation, data shape, factory, host, error, and fixture contracts are documented
- export stability, contract stability, security, dependency boundary, package-boundary, and package contract tests pass
- root `pnpm lint`, `pnpm build`, and `pnpm test` include the Reddit connector foundation package
- Docker Compose still validates the local service baseline
- no OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend, business logic, or actual connector execution exists

## Non-Goals

This package must not implement OAuth, live Reddit API calls, HTTP clients, provider calls, scraping, schedulers, queues, worker processes, host startup, runner loops, database persistence, AI workflows, APIs, frontend code, business logic, or connector execution.

No Reddit network behavior exists in this package.
