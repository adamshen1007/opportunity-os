# Structured Analysis

Phase 2 Milestone 20 establishes the Structured Analysis Foundation in `packages/analysis`.

`packages/analysis` owns structured analysis contracts, parser contracts, schema validation contracts, structured output normalization boundaries, evidence contracts, confidence contracts, analysis provenance, analysis validation, analysis result contracts, analysis error contracts, deterministic fixtures, and package-level verification.

Slice A creates the package boundary only. Later Milestone 20 slices may add the contract surface without adding provider SDKs, prompt execution, AI reasoning, opportunity generation, REST APIs, frontend behavior, persistence implementation, scheduler behavior, workers, or business logic.

Dependency direction:

- `@opportunity-os/llm-analysis` supplies provider-independent analysis source contracts
- `@opportunity-os/embeddings` supplies provider-independent embedding contracts
- `@opportunity-os/normalization` supplies normalized content contracts
- `@opportunity-os/raw-content` supplies source and provenance vocabulary
- `@opportunity-os/events` supplies event contract vocabulary

Public exports route through `packages/analysis/src/index.ts`.

The Structured Analysis Foundation must not introduce provider SDKs, OpenAI API calls, Anthropic API calls, Gemini API calls, prompt execution, AI reasoning, pain point extraction, opportunity generation, REST APIs, frontend behavior, persistence implementation, scheduler behavior, workers, business logic, real prompts, real embeddings, provider payloads, API keys, or network behavior.

## Readiness Gate

Milestone 20 is complete when:

- `@opportunity-os/analysis` builds independently
- repository verification supports `phase-2-milestone-20`
- implementation files are permitted only in approved foundation packages and `packages/analysis`
- public exports route through `packages/analysis/src/index.ts`
- deterministic fixtures contain no secrets, raw provider payloads, real prompts, or real embeddings
- security, dependency-boundary, export stability, contract stability, fixture, and pipeline integration tests pass
- prohibited provider SDK, prompt execution, AI reasoning, opportunity generation, REST API, frontend, persistence, scheduler, worker, and business logic implementation remains blocked

Required verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-20
pnpm lint
pnpm build
```

Future Structured Analysis Pipeline work must consume `@opportunity-os/analysis` instead of redefining structured analysis, parser, schema validation, normalization, evidence, confidence, provenance, validation, result, error, event, or fixture contracts.
