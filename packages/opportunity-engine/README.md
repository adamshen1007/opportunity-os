# Opportunity Engine

Phase 2 Milestone 21 establishes the Opportunity Engine Foundation in `packages/opportunity-engine`.

`packages/opportunity-engine` owns opportunity primitive contracts, source and evidence contracts, hypothesis contracts, score contracts, confidence contracts, ranking contracts, validation contracts, result contracts, secret-safe error contracts, event contracts, deterministic fixtures, and package-level verification.

Milestone 21 completes the Opportunity Engine Foundation contract surface without adding REST APIs, frontend behavior, persistence implementation, scheduler behavior, workers, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, or business workflows.

Slice A was package boundary only; subsequent scoped Milestone 21 slices completed the contract surface, deterministic fixtures, and verification coverage while preserving the same non-goals.

Dependency direction:

- `@opportunity-os/analysis` supplies structured analysis contracts
- `@opportunity-os/llm-analysis` supplies provider-independent LLM analysis contracts
- `@opportunity-os/embeddings` supplies provider-independent embedding contracts
- `@opportunity-os/normalization` supplies normalized content contracts
- `@opportunity-os/raw-content` supplies source and provenance vocabulary
- `@opportunity-os/events` supplies event contract vocabulary
- `@opportunity-os/shared` supplies shared context and logging vocabulary

Public exports route through `packages/opportunity-engine/src/index.ts`.

The Opportunity Engine Foundation must not introduce REST APIs, frontend behavior, persistence implementation, scheduler behavior, workers, live AI calls, prompt runtime behavior, billing, user accounts, production ranking algorithms, scoring implementations, extraction workflows, opportunity generation logic, or business workflows.

## Readiness Gate

Milestone 21 is complete when:

- `@opportunity-os/opportunity-engine` builds independently
- repository verification supports `phase-2-milestone-21`
- implementation files are permitted only in approved foundation packages and `packages/opportunity-engine`
- public exports route through `packages/opportunity-engine/src/index.ts`
- deterministic fixtures contain no secrets, raw provider payloads, real prompts, or real business examples
- security, dependency-boundary, export stability, contract stability, fixture, and upstream integration tests pass
- prohibited REST API, frontend, persistence, scheduler, worker, live AI, prompt runtime, billing, user account, production ranking, scoring implementation, extraction workflow, opportunity generation, and business workflow implementation remains blocked

Required verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-21
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Future Opportunity Engine work must consume `@opportunity-os/opportunity-engine` instead of redefining opportunity primitives, source/evidence, hypothesis, score, confidence, ranking, validation, result, error, event, or fixture contracts.
