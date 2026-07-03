# Opportunity Generation

Phase 2 Milestone 24 establishes the Opportunity Generation Workflow foundation in `packages/opportunity-generation`.

`packages/opportunity-generation` owns candidate-to-opportunity generation workflow contracts only. It establishes the package boundary, strict TypeScript workspace package, public export boundary, documentation baseline, repository verification support for `phase-2-milestone-24`, deterministic generation contracts, fixtures, and tests.

The package is expected to integrate with:

- `@opportunity-os/opportunity-candidates`
- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-engine`
- `@opportunity-os/analysis`
- `@opportunity-os/events`
- `@opportunity-os/shared`

## Boundary

The Opportunity Generation Workflow foundation must not introduce production ranking algorithms, recommendation engine implementation, REST APIs, frontend behavior, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, live AI providers, prompt execution, provider payloads, or business workflows.

Implemented contracts include generation primitives, generation input/output contracts, deterministic generation service contracts, evidence-to-hypothesis assembly contracts, candidate validation behavior contracts, confidence aggregation behavior contracts, generated opportunity result contracts, generation errors, generation events, and deterministic fixtures.

Implemented tests cover fixtures, public exports, contract stability, dependency boundaries, security, upstream integration, and deterministic service contract behavior.

## Public Exports

All public exports must route through `packages/opportunity-generation/src/index.ts`.

Consumers should import from `@opportunity-os/opportunity-generation` rather than internal files.

## Readiness

Milestone 24 is complete when:

- `@opportunity-os/opportunity-generation` builds as a strict TypeScript package
- public exports route through `packages/opportunity-generation/src/index.ts`
- repository verification supports `phase-2-milestone-24`
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-generation`
- deterministic fixture, export-stability, contract-stability, dependency-boundary, security, upstream integration, and deterministic service tests cover the package surface
- prohibited ranking, recommendation, API, frontend, persistence, scheduler, worker, billing, account, provider SDK, live AI, prompt execution, and business workflow implementation remains blocked
