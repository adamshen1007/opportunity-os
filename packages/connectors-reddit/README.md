# Reddit Connector Foundation

`packages/connectors-reddit` owns Reddit connector contracts only.

Phase 2 Milestone 13 establishes the package boundary for Reddit connector foundation work. Slice F completes documentation, governance, roadmap alignment, and final readiness verification while keeping the package contract-only.

Phase 2 Milestone 14 establishes the Reddit Runtime Foundation boundary. The milestone may introduce a non-network Reddit runtime adapter in future slices, but Slice A updates verification and documentation only. No runtime execution exists in Slice A.

Phase 2 Milestone 15 establishes the Reddit Provider Transport boundary. Slice A defines provider transport architecture only, adds the explicit `phase-2-milestone-15` verification gate, and routes provider transport exports through `packages/connectors-reddit/src/provider/index.ts`.

Phase 4 Milestone 33 establishes controlled live Reddit provider access. Live access is opt-in, development-oriented, credential-gated, and limited to Reddit provider transport code inside `packages/connectors-reddit`. Default tests continue to use fake transport and deterministic fixtures.

Phase 4 Milestone 34 Slice B promotes that live path into the real Reddit datasource boundary for the External MVP Runtime. The implementation remains env-gated and package-local: fake provider behavior is still the default for CI and deterministic tests, while live Reddit scans run only through the explicit development command with configured credentials.

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
- controlled live Reddit provider transport
- OAuth token exchange for configured development credentials
- Node `fetch` based HTTP transport
- live public subreddit post fetch command
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

## Provider Transport Boundary

Phase 2 Milestone 15 permits provider transport architecture only inside `packages/connectors-reddit`.

Provider transport contracts must route through `packages/connectors-reddit/src/provider/index.ts` and must be re-exported by `packages/connectors-reddit/src/index.ts`. Existing metadata, capability, data, fixture, and runtime exports must remain stable.

Slice B defines provider authentication, HTTP transport abstraction, API client, and request-building contracts. Authentication contracts model tokens, credentials, refresh requests, expiration metadata, and auth state with sensitive fields marked explicitly. Transport contracts model method, URL, headers, body, timeout, cancellation, and safe response metadata. API client contracts accept explicit transport, auth context, runtime context, and logger contracts. Request descriptions are deterministic, support posts, comments, subreddits, authors, pagination cursors, and auth header inputs, and serialize without raw token values.

Slice C defines safe provider response parsing, pagination transport, and rate-limit parsing. Parser helpers map safe provider response shapes into existing post, comment, subreddit, author, pagination, rate-limit, and data envelope contracts. Malformed responses return safe validation failures. Pagination helpers create replay-safe cursor metadata and next-page request descriptions. Rate-limit parsing maps provider headers or metadata into existing rate-limit contracts and falls back safely when values are missing or malformed.

Slice D defines runtime policy compatibility, auth lifecycle, provider errors, telemetry, and container binding contracts. Runtime compatibility maps transport failures, timeout metadata, and cancellation metadata into `@opportunity-os/connector-runtime` shapes without retry runners, timers, execution loops, signal handling, or worker cancellation. Auth lifecycle contracts enumerate unauthenticated, configured, token-valid, token-expiring, refresh-required, failed, and revoked states without OAuth exchange or refresh calls. Provider errors use approved safe error patterns. Telemetry contracts reference shared logging and event concepts without vendors, exporters, event buses, or production transports. Container bindings reference `@opportunity-os/container` tokens without runtime containers, app startup, or dependency resolution.

Slice E adds deterministic provider fixtures, fake transport support, integration tests, security tests, contract stability tests, and dependency boundary tests. Fixtures cover safe request objects, safe response objects, parsed Reddit data, pagination, rate limits, auth lifecycle states, and safe error cases. Fake transport records request descriptions for assertions and returns deterministic fixture responses without external calls.

Slice F completes documentation, PR governance, roadmap readiness, and final verification for Reddit Provider Transport.

The completed provider transport foundation documents:

- OAuth token, credential, refresh, expiration, and auth state contracts
- HTTP transport abstraction
- Reddit API client abstraction
- deterministic request builder
- safe response parser
- pagination transport
- rate-limit parsing
- retry, timeout, and cancellation compatibility
- authentication lifecycle
- provider error mapping
- telemetry contracts
- deterministic test fixtures
- fake transport support

Future packages must consume `@opportunity-os/connectors-reddit` for Reddit provider transport contracts instead of redefining request, response, auth, lifecycle, telemetry, or test fixture behavior.

The Milestone 15 verifier continues to block Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, and business logic. Provider transport tests are fixture-backed and do not require live Reddit calls.

## Live Provider Transport Boundary

Phase 4 Milestone 33 permits controlled live Reddit provider access inside `packages/connectors-reddit` only.

Allowed:

- OAuth token exchange against Reddit's token endpoint using explicit local credentials
- Node 24 `fetch` based HTTP transport
- Reddit request execution for public subreddit posts
- live response mapping into existing safe Reddit provider contracts
- rate-limit parsing from Reddit response headers
- pagination metadata from Reddit listing cursors
- secret-safe provider errors
- optional live integration test gated by `REDDIT_LIVE_TEST_ENABLED=true`
- development command `pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live`

Required environment variables for the live command:

- `REDDIT_PRODUCTION_CLIENT_ID` or `REDDIT_CLIENT_ID`
- `REDDIT_PRODUCTION_USER_AGENT` or `REDDIT_USER_AGENT`

Optional environment variables:

- `REDDIT_PRODUCTION_CLIENT_SECRET`
- `REDDIT_PRODUCTION_REFRESH_TOKEN`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_REFRESH_TOKEN`
- `REDDIT_LIVE_TEST_ENABLED`
- `REDDIT_LIVE_SUBREDDIT`
- `REDDIT_LIVE_LIMIT`

Default tests do not perform network calls. The live integration test is skipped unless `REDDIT_LIVE_TEST_ENABLED=true` and required credentials are configured.

Run an explicit live scan only when credentials are configured:

```sh
REDDIT_LIVE_TEST_ENABLED=true \
REDDIT_PRODUCTION_CLIENT_ID=... \
REDDIT_PRODUCTION_USER_AGENT="OpportunityOS/0.0.0 external-mvp" \
REDDIT_LIVE_SUBREDDIT=entrepreneur \
REDDIT_LIVE_LIMIT=5 \
pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live
```

If the configured Reddit app requires a client secret or refresh token, also provide `REDDIT_PRODUCTION_CLIENT_SECRET` and/or `REDDIT_PRODUCTION_REFRESH_TOKEN`. The command prints only safe summaries, post titles, permalinks, and parsed rate-limit metadata. It must not print credentials, tokens, auth headers, raw provider responses, stacks, or causes.

Milestone 33 still does not permit Raw Content persistence, Prisma repositories, AI workflows, opportunity generation, REST APIs, frontend changes, schedulers, workers, database persistence, or business logic.

## Phase 2 Milestone 15 Readiness

Before handing off to the next milestone, confirm:

- `@opportunity-os/connectors-reddit` is implemented, tested, documented, and independently buildable
- provider exports route through `packages/connectors-reddit/src/provider/index.ts` and the package root
- OAuth contracts, API client abstraction, HTTP transport abstraction, request builder, response parser, pagination transport, rate-limit parsing, runtime compatibility, auth lifecycle, error mapping, telemetry, test fixtures, and fake transport are documented
- fake transport and provider fixtures remain deterministic and contain no real tokens, credentials, raw provider responses, or external network behavior
- export stability, contract stability, security, integration, fake transport, dependency boundary, and package-boundary tests pass
- repository verification supports `phase-2-milestone-15`
- no Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, or business logic exists
- `node scripts/verify-repository.mjs --phase review`, `node scripts/verify-repository.mjs --phase phase-2-milestone-15`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

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
- provider transport changes complete OAuth secret handling, request/response safety, no raw provider response leakage, no persistence, no scheduler/worker, no API/frontend/business logic, and fake transport test review

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

This package must not implement scraping, schedulers, queues, worker processes, host startup, runner loops, database persistence, AI workflows, APIs, frontend code, business logic, or connector execution beyond the controlled Phase 4 Milestone 33 live provider transport.

Reddit network behavior exists only in the controlled live provider transport and opt-in dev/integration paths. It must remain credential-gated, secret-safe, and excluded from default tests.
