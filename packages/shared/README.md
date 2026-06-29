# Shared Package

Owns shared foundation contracts, aggregation helpers, and the Phase 1 Milestone 3 logging foundation.

This package now defines shared logging, context, and validation contracts and implements the Pino-backed logging foundation. It does not implement middleware, propagation, validation engines, application behavior, or business logic.

## Package Boundary

`packages/shared` is the top-level shared foundation package. It may define and re-export shared infrastructure contracts after approved implementation tasks begin.

Owned responsibilities:

- shared logging contracts and Pino-backed logger foundation
- shared validation contracts
- shared request and correlation context contracts
- approved re-exports from shared foundation packages
- package-level documentation for shared infrastructure usage

`packages/shared` must not own:

- business logic
- connectors
- APIs or API routes
- AI workflows
- database implementation
- frontend implementation
- app code
- domain, intelligence, acquisition, or application services

## Dependency Direction

Allowed dependencies for this package:

- `@opportunity-os/config`
- `@opportunity-os/types`
- `@opportunity-os/errors`
- `@opportunity-os/utils`

`packages/shared` must not depend on apps, APIs, connectors, AI workflows, database packages, frontend packages, or business packages.

Foundation dependency order:

1. `packages/types` and `packages/utils` sit at the base.
2. `packages/errors` may depend on `packages/types`.
3. `packages/shared` may depend on `packages/config`, `packages/types`, `packages/errors`, and `packages/utils`.

## Consumption Guidance

Future packages may import shared contracts from `@opportunity-os/shared` when they need cross-cutting logging entry shapes, request/correlation context types, validation result contracts, or approved shared foundation exports.

Prefer the owning package for direct concerns:

- use `@opportunity-os/config` for runtime configuration
- use `@opportunity-os/types` for generic type helpers
- use `@opportunity-os/errors` for generic error contracts
- use `@opportunity-os/utils` for deterministic helpers
- use `@opportunity-os/shared` for shared cross-cutting contracts

Do not use this package as a place for business services, connector clients, API handlers, workflow orchestration, database access, frontend utilities, or app bootstrapping.

## Phase 1 Milestone 3 Logging Foundation

`packages/shared` owns the Phase 1 Milestone 3 logging foundation.

Pino is the approved structured logging implementation for this milestone. The implementation must build on the existing shared logging contracts, context contracts, error contracts, and redaction utilities instead of defining duplicate logging abstractions elsewhere.

Milestone 3 may add a Pino-backed logger inside `packages/shared` only. It must not introduce:

- application code
- APIs or API routes
- connectors
- AI workflows
- database implementation
- frontend implementation
- business logic

The dependency direction remains compatible with Phase 1 Milestone 2:

1. `packages/types` and `packages/utils` stay at the base.
2. `packages/errors` may depend on `packages/types`.
3. `packages/shared` may depend on `packages/config`, `packages/types`, `packages/errors`, and `packages/utils`.

The logging implementation must not create reverse dependencies from base packages into `packages/shared`, apps, APIs, connectors, AI workflows, database packages, frontend packages, or business packages.

## Logger Usage

The package owns the Pino-backed structured logger foundation. The logger is structured, machine-readable, and based on the approved stack in `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.

Use the logger through `@opportunity-os/shared`:

- `createLoggerConfig()` creates explicit reusable logger configuration
- `createPinoLogger()` creates a logger instance without using a singleton
- `createInMemoryLoggerDestination()` supports deterministic tests
- `createFixedLoggerClock()` supports deterministic timestamps
- `logger.child()` creates immutable child loggers that inherit parent context
- `debug`, `info`, `warn`, and `error` emit structured severity-specific entries

Every future log entry should include:

- `timestamp`
- `service`
- `environment`
- `severity`
- `correlationId`
- `requestId` when request context exists
- `eventName`
- `message`

`correlationId` is required and may be provided directly or through a child logger. `requestId` is optional and should be provided only when request context exists. Future connectors, workflows, API requests, background jobs, and applications should propagate correlation IDs once those systems exist.

Logger configuration must be explicit. The shared logger does not read `process.env`; future integration packages should pass validated values from `@opportunity-os/config`.

## Sensitive Data Policy

Logs must never include:

- secrets
- tokens
- raw auth headers
- provider keys
- credentials
- API keys
- access tokens
- refresh tokens
- passwords
- raw authentication headers
- private credentials
- unredacted secret values

Log stable identifiers and operational metadata instead of sensitive payloads.

Secret-safe logging expectations:

- use `correlationId`, `requestId`, `eventName`, and stable resource identifiers for traceability
- redact secret-like values before including dynamic text in log messages or structured context
- never log raw environment values, request authorization headers, provider payloads containing credentials, or connection strings with credentials
- treat local development logs as potentially shared artifacts

Use generic redaction helpers from `@opportunity-os/utils` for infrastructure-safe text handling. Redaction helpers are not provider-specific security boundaries; they are a defense-in-depth utility for reducing accidental secret exposure in errors, logs, and diagnostics.

Error logging expectations:

- `OpportunityError` values should serialize to safe code, category, message, correlation ID, and request ID fields
- unknown `Error` values should serialize to safe name and message fields
- stack traces and raw causes must not appear in safe logger output
- error messages must be redacted before logging

## Milestone 3 Exit Gate

Phase 1 Milestone 3 is complete when:

- logging contracts and Pino-backed runtime behavior live in `packages/shared`
- logger configuration, level mapping, injectable clocks, injectable destinations, child loggers, severity methods, and error normalization are tested
- secret redaction, schema stability, workspace exports, and repository verification are tested or enforced
- `pino` remains scoped to `packages/shared`
- repository verification continues blocking apps, APIs, connectors, AI workflows, frontend, database, domain, intelligence, and business implementation
- `node scripts/verify-repository.mjs --phase review`, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`, and `docker compose config` pass

Do not add business behavior, app behavior, connectors, APIs, AI workflows, database code, frontend code, middleware, or Phase 1 Milestone 4 work to this package until an approved scoped task allows it.
