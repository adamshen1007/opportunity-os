# Errors Package

Owns generic shared error contracts for Phase 1 Milestone 2.

This package now defines generic error categories, stable error codes, a base error class, and secret-safe serialization helpers. It does not define domain-specific business errors.

## Package Boundary

`packages/errors` is a shared foundation package for reusable error categories, codes, base error contracts, and safe error serialization.

Owned responsibilities:

- generic error categories
- stable shared error code conventions
- base infrastructure error contracts
- secret-safe error serialization contracts

`packages/errors` must not own:

- business rule errors tied to specific domain behavior
- connectors
- APIs or API routes
- AI workflows
- database implementation
- frontend implementation
- app code
- retry orchestration or service behavior

## Dependency Direction

Allowed dependencies for this package:

- `@opportunity-os/types`

`packages/errors` may depend on `packages/types` only. It must not depend on `packages/config`, `packages/utils`, `packages/shared`, apps, APIs, connectors, AI workflows, database packages, frontend packages, or business packages.

## Consumption Guidance

Future packages should import generic error contracts from `@opportunity-os/errors` when they need shared infrastructure error categories, stable codes, base error behavior, or safe serialization.

Do not add connector-specific, API-specific, workflow-specific, database-specific, domain-specific, or business-rule errors here unless a future Engineering Kit task explicitly changes this package boundary.

## Secret-Safe Error Expectations

Errors should be useful for local development and CI without exposing sensitive data.

Safe error output may include:

- stable error code
- error category
- safe message
- `correlationId`
- `requestId`

Safe error output must not include:

- secrets
- tokens
- raw auth headers
- provider keys
- credentials
- API keys
- passwords
- raw cause details
- stack traces by default
- connection strings containing credentials

Use `OpportunityError.toSafeDetails()`, JSON serialization, and safe error helpers when exposing errors outside the immediate throwing boundary. Raw causes and stack traces are implementation details and must not be sent to clients, logs, issue templates, or shared diagnostics unless a future approved debugging policy explicitly allows it with redaction.
