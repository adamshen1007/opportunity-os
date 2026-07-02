# LLM Analysis

Phase 2 Milestone 19 establishes the LLM Analysis Foundation in `packages/llm-analysis`.

`packages/llm-analysis` owns LLM provider abstraction contracts, prompt contract types, prompt template contracts, prompt input and output contracts, structured output contracts, analysis request and response contracts, validation contracts, safe error contracts, event contracts, deterministic fixtures, and safety/redaction contracts.

Slice A creates the package boundary only. Milestone 19 completes that package boundary and contract surface without adding provider SDKs, live LLM calls, prompt execution runtime, extraction workflows, opportunity generation, or product behavior.

Implemented contract areas:

- LLM provider abstractions
- prompt contracts
- prompt template contracts
- prompt input and output contracts
- structured output contracts
- analysis request and response contracts
- validation contracts
- safety and redaction contracts
- result contracts
- secret-safe analysis error contracts
- analysis event contracts
- deterministic synthetic fixtures
- export stability, contract stability, security, dependency-boundary, fixture, and pipeline integration tests

Dependency direction:

- `@opportunity-os/normalization` supplies canonical text contracts
- `@opportunity-os/embeddings` supplies provider-independent embedding contracts
- `@opportunity-os/raw-content` supplies source and provenance vocabulary
- `@opportunity-os/shared` supplies shared context and logging vocabulary
- `@opportunity-os/events` supplies event contract vocabulary

Public exports route through `packages/llm-analysis/src/index.ts`.

The LLM Analysis Foundation must not introduce provider SDKs, OpenAI API calls, Anthropic API calls, Gemini API calls, live LLM calls, prompt runtime, extraction workflows, pain point extraction, opportunity generation, REST APIs, frontend behavior, persistence implementation, scheduler behavior, workers, business scoring, real prompts, real embeddings, provider payloads, API keys, or network behavior.

## Readiness Gate

Milestone 19 is complete when:

- `@opportunity-os/llm-analysis` builds independently
- repository verification supports `phase-2-milestone-19`
- implementation files are permitted only in approved foundation packages and `packages/llm-analysis`
- public exports route through `packages/llm-analysis/src/index.ts`
- deterministic fixtures contain no secrets, raw provider payloads, or real prompts
- deterministic fixtures contain no real embeddings, API keys, provider payloads, or network references
- security, dependency-boundary, export stability, contract stability, fixture, and pipeline integration tests pass
- prohibited provider SDK, live LLM call, prompt runtime, extraction workflow, opportunity generation, REST API, frontend, persistence, scheduler, worker, and business scoring implementation remains blocked

Required verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-19
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Future LLM Analysis Pipeline work must consume `@opportunity-os/llm-analysis` instead of redefining provider abstraction, prompt, structured output, analysis request/response, validation, error, event, fixture, safety, or redaction contracts.
