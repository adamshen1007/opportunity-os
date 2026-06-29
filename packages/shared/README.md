# Shared Package

Owns shared foundation contracts and aggregation helpers for Phase 1 Milestone 2.

This package now defines shared logging, context, and validation contracts. It does not implement runtime logging, middleware, propagation, validation engines, application behavior, or business logic.

## Package Boundary

`packages/shared` is the top-level shared foundation package. It may define and re-export shared infrastructure contracts after approved implementation tasks begin.

Owned responsibilities:

- shared logging contracts
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

## Future Logger Implementation

The package owns logging contracts, but it does not implement a logger yet.

The future logger should be structured, machine-readable, and based on the approved stack in `docs/05_BOOTSTRAP/05-001_TECH_STACK.md`.

Expected responsibilities:

- provide a shared logger factory for future packages and apps
- emit structured logs suitable for local development and production observability
- attach correlation identifiers consistently across workflows
- respect environment-driven log levels
- avoid logging secrets, credentials, raw tokens, or sensitive payloads

Every future log entry should include:

- `timestamp`
- `service`
- `environment`
- `severity`
- `correlationId`
- `requestId`
- `eventName`
- `message`

`requestId` may be empty or omitted only when no request context exists. `correlationId` should be propagated across connectors, workflows, API requests, and background jobs once those systems exist.

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

Do not add logger implementation files, business behavior, app behavior, connectors, APIs, AI workflows, database code, or frontend code to this package until an approved scoped task allows it.
