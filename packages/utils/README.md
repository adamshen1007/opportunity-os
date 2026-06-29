# Utils Package

Owns generic deterministic utilities for Phase 1 Milestone 2.

This package now defines generic deterministic object, string, redaction, and time helpers. It does not define domain-specific transformations.

## Package Boundary

`packages/utils` is a base shared foundation package.

Owned responsibilities:

- generic object helpers
- generic string helpers
- generic time helpers with deterministic test support
- reusable redaction helpers for infrastructure-safe output

`packages/utils` must not own:

- business logic
- connectors
- APIs or API routes
- AI workflows
- database implementation
- frontend implementation
- app code
- domain-specific transformations
- scheduling, retries, or workflow orchestration

## Dependency Direction

`packages/utils` sits at the base of the shared foundation dependency graph.

Allowed dependencies:

- none, unless an approved future task adds a small infrastructure dependency

Packages may depend on `packages/utils`, but `packages/utils` must not depend on `packages/config`, `packages/types`, `packages/errors`, `packages/shared`, apps, APIs, connectors, AI workflows, database packages, frontend packages, or business packages.

## Consumption Guidance

Future packages should import generic deterministic helpers from `@opportunity-os/utils` instead of reimplementing object helpers, string redaction, or injectable clock utilities locally.

Do not add connector helpers, API helpers, workflow helpers, database helpers, frontend helpers, scheduling, retry orchestration, or business-specific transformations to this package.

## Redaction Helpers

Redaction helpers in this package are generic infrastructure utilities for reducing accidental exposure of secret-like values in diagnostics, safe errors, and future structured logging.

They are intended for common secret-like text such as:

- secrets
- tokens
- raw auth headers
- provider keys
- credentials
- API keys
- passwords
- DSNs and credential-bearing URLs

Redaction helpers must remain deterministic, generic, and provider-agnostic. Do not add provider-specific key parsing, business-specific transformations, connector behavior, or validation rules here.

Redaction is defense in depth, not permission to log sensitive data. Callers should avoid collecting or passing secrets into logs and errors in the first place.
