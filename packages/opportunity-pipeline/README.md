# Opportunity Pipeline

Phase 2 Milestone 22 establishes the Opportunity Pipeline Foundation in `packages/opportunity-pipeline`.

`packages/opportunity-pipeline` owns opportunity pipeline contracts only. Milestone 22 defines pipeline primitives, stages, metadata, provenance, evidence aggregation, hypothesis assembly, candidate opportunity contracts, validation pipeline, results, errors, events, deterministic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, and upstream integration tests.

Dependency direction:

- `@opportunity-os/opportunity-engine` supplies provider-independent opportunity contracts.
- `@opportunity-os/analysis` supplies structured analysis contracts.
- `@opportunity-os/llm-analysis` supplies provider-independent LLM analysis contracts.
- `@opportunity-os/embeddings` supplies provider-independent embedding contracts.
- `@opportunity-os/normalization` supplies normalized content contracts.
- `@opportunity-os/raw-content` supplies source and provenance vocabulary.
- `@opportunity-os/events` supplies event contract vocabulary.

Public exports route through `packages/opportunity-pipeline/src/index.ts`.

The Opportunity Pipeline Foundation must not introduce business scoring algorithms, ranking algorithms, recommendation engines, REST APIs, frontend behavior, persistence implementation, schedulers, workers, provider SDKs, or business workflows.

## Readiness Gate

Milestone 22 is complete when:

- `@opportunity-os/opportunity-pipeline` builds independently
- repository verification supports `phase-2-milestone-22`
- implementation files are permitted only in approved foundation packages and `packages/opportunity-pipeline`
- public exports route through `packages/opportunity-pipeline/src/index.ts`
- deterministic fixtures contain no secrets, raw provider payloads, real prompts, or production business examples
- security, dependency-boundary, export stability, contract stability, fixture, and upstream integration tests pass
- prohibited business scoring, ranking, recommendation, REST API, frontend, persistence, scheduler, worker, provider SDK, and business workflow implementation remains blocked

Required verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-22
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Future Opportunity Pipeline work must consume `@opportunity-os/opportunity-pipeline` instead of redefining pipeline, aggregation, assembly, candidate, validation, stage, metadata, provenance, result, error, event, or fixture contracts.
