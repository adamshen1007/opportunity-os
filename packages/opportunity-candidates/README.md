# Opportunity Candidates

Phase 2 Milestone 23 establishes the Candidate Opportunity Engine foundation in `packages/opportunity-candidates`.

`packages/opportunity-candidates` owns candidate opportunity contracts only. Phase 2 Milestone 23 establishes the package boundary, strict TypeScript workspace package, public export boundary, documentation baseline, repository verification support for `phase-2-milestone-23`, provider-independent primitives, candidate contracts, lifecycle contracts, metadata contracts, provenance contracts, evidence completeness contracts, confidence aggregation contracts, validation contracts, result contracts, safe error contracts, event contracts, deterministic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, upstream integration tests, and workspace pipeline integration.

The package is expected to integrate with:

- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-engine`
- `@opportunity-os/analysis`
- `@opportunity-os/llm-analysis`
- `@opportunity-os/embeddings`

## Boundary

The Candidate Opportunity Engine foundation must not introduce production ranking algorithms, recommendation engines, business scoring, REST APIs, frontend behavior, persistence implementation, schedulers, workers, provider SDKs, or business workflows.

Future scoped packages must consume `@opportunity-os/opportunity-candidates` rather than redefining candidate opportunity contracts.

## Public Exports

All public exports must route through `packages/opportunity-candidates/src/index.ts`.

Consumers should import from `@opportunity-os/opportunity-candidates` rather than internal files.

## Readiness

Milestone 23 is complete when:

- `@opportunity-os/opportunity-candidates` builds and tests as a strict TypeScript package
- public exports route through `packages/opportunity-candidates/src/index.ts`
- candidate primitives, candidate contracts, lifecycle contracts, metadata contracts, provenance contracts, evidence completeness contracts, confidence aggregation contracts, validation contracts, result contracts, safe error contracts, event contracts, and deterministic fixtures are exported from the package root
- export stability, contract stability, dependency-boundary, security, fixture, and upstream integration tests pass
- root `pnpm lint`, `pnpm build`, and `pnpm test` include `@opportunity-os/opportunity-candidates`
- repository verification supports `phase-2-milestone-23`
- prohibited ranking, recommendation, scoring, API, frontend, persistence, scheduler, worker, provider SDK, and business workflow implementation remains blocked
