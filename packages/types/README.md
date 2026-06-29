# Types Package

Owns generic shared TypeScript types for Phase 1 Milestone 2.

This package now defines generic shared type contracts. It does not define domain or business types.

## Package Boundary

`packages/types` is a base shared foundation package.

Owned responsibilities:

- generic utility types
- branded primitive type helpers
- result and metadata type contracts
- type-only exports used by other shared foundation packages

`packages/types` must not own:

- business logic
- domain-specific business types
- connectors
- APIs or API routes
- AI workflows
- database implementation
- frontend implementation
- app code
- runtime service behavior

## Dependency Direction

`packages/types` sits at the base of the shared foundation dependency graph.

Allowed dependencies:

- none, unless an approved future task adds a type-only development dependency

Packages may depend on `packages/types`, but `packages/types` must not depend on `packages/config`, `packages/errors`, `packages/utils`, `packages/shared`, apps, APIs, connectors, AI workflows, database packages, frontend packages, or business packages.

## Consumption Guidance

Future packages should import generic type helpers from `@opportunity-os/types` instead of redefining branded primitives, result contracts, or metadata contracts locally.

Do not add application, domain, connector, API, AI workflow, database, frontend, or business-specific types here. Add those only in the package that owns the corresponding scoped implementation.
