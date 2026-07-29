# Opportunity Ranking

Phase 3 Milestone 25 establishes the Opportunity Ranking Engine in `packages/opportunity-ranking`.

`packages/opportunity-ranking` owns deterministic ranking product behavior for validated opportunity candidates and generated opportunities. Slice A establishes the package boundary, strict TypeScript workspace package, public export boundary, documentation baseline, and repository verification support for `phase-3-milestone-25`. Slice B defines the deterministic ranking model: primitives, explicit ranking inputs, explainable ranking outputs, signals, factors, and weights. Slice C implements deterministic ranking behavior with score calculation, validation, tie breaking, safe results, safe errors, and ranking events. Slice D stabilizes the package with synthetic fixtures, export stability tests, contract stability tests, ranking quality tests, security tests, dependency boundary tests, and upstream integration tests.

The package is expected to integrate with:

- `@opportunity-os/opportunity-generation`
- `@opportunity-os/opportunity-candidates`
- `@opportunity-os/opportunity-pipeline`
- `@opportunity-os/opportunity-engine`
- `@opportunity-os/analysis`
- `@opportunity-os/shared`
- `@opportunity-os/events`

## Boundary

This milestone begins the Product Behavior phase. It may implement deterministic ranking behavior in later scoped slices, but ranking decisions must remain deterministic, testable, and explainable.

The Opportunity Ranking Engine must continue blocking recommendation engine implementation, REST APIs, frontend behavior, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, ML behavior, and LLM calls.

Slice C implements the first deterministic ranking behavior. It does not add recommendation behavior, persistence, APIs, frontend code, external providers, or opaque scoring. Every ranking result must be explainable from explicit input signals, factors, and weights.

## Ranking Model

The ranking model is explicit by design:

- ranking inputs reference upstream generated opportunities, generation outputs, and candidates through safe structural references
- signals identify provider-independent evidence used by ranking
- factors group signals into explainable ranking dimensions
- weights describe deterministic factor weighting and include human-readable explanations
- ranked outputs preserve the signals, factors, weights, rank, score, and explanation summary used for every ranked opportunity

The model does not hide ranking decisions behind opaque heuristics. Every future ranking result must be reconstructable from explicit inputs, signals, factors, and weights.

## Ranking Behavior

The Slice C ranking pipeline:

- validates that generated opportunities, signals, factors, and weights are explicit
- calculates scores as a weighted sum of factor values
- ranks tied opportunities by stable upstream references
- returns safe validation failures instead of ranking invalid inputs
- emits safe ranking result and event shapes
- serializes ranking errors without stack traces or raw runtime details

Tie breaking is deterministic and documented in result metadata. It is not personalized and does not infer user preference.

Phase 4.5 adds `evidence-ranking-formula-v1` for scan runtime rankings. It derives opportunity-specific recurrence, source diversity, pain severity, urgency, workaround, engagement, recency, action-intent, and contradiction signals from traceable evidence. Demand strength is the versioned weighted signal total; confidence is calculated separately from evidence recurrence, diversity, and available-signal coverage. Final scores reconcile to 80 percent demand strength plus 20 percent confidence, less the explicit contradiction penalty. Missing data receives no inferred signal credit and lowers confidence.

On the frozen Phase 4.5 benchmark, the formula improves approved pairwise agreement from 50 percent to 75 percent while remaining deterministic. The weights are recorded as `evidence-ranking-weights-v1`; changing signals, formulas, or weights requires a new version and benchmark comparison.

## Stability And Security

Slice D adds synthetic fixtures for repeatable test coverage. Fixtures must remain synthetic and must not contain provider payloads, prompts, secrets, credentials, tokens, or production examples.

The package test suite covers:

- public export stability
- vocabulary and contract stability
- deterministic ranking quality
- secret-safe result and error serialization
- dependency boundaries
- upstream structural reference integration

## Public Exports

All public exports must route through `packages/opportunity-ranking/src/index.ts`.

Consumers should import from `@opportunity-os/opportunity-ranking` rather than internal files.

## Readiness

Slice D is complete when:

- `@opportunity-os/opportunity-ranking` builds as a strict TypeScript package
- public exports route through `packages/opportunity-ranking/src/index.ts`
- repository verification supports `phase-3-milestone-25`
- ranking primitives, inputs, outputs, signals, factors, and weights are exported from the package root
- ranking behavior tests cover deterministic scoring, tie breaking, explanations, validation, results, errors, and events
- synthetic fixtures are exported and covered by security tests
- export, contract, dependency, ranking quality, and upstream integration tests pass
- prohibited recommendation, API, frontend, persistence, scheduler, worker, billing, account, provider SDK, ML, and LLM implementation remains blocked
