# Embeddings

Phase 2 Milestone 18 establishes the Embedding Foundation in `packages/embeddings`.

`packages/embeddings` owns embedding primitives, provider abstraction contracts, request and response contracts, chunk embedding contracts, embedding metadata and provenance contracts, validation contracts, cache contracts, result contracts, safe error contracts, event contracts, deterministic fixtures, and package stability tests.

Milestone 18 is complete. The package boundary remains package boundary only for Embedding Foundation contracts. The package defines provider-independent contracts only; it does not add provider API calls, provider SDKs, model execution, vector databases, cache persistence, or product behavior.

Dependency direction:

- `@opportunity-os/normalization` supplies canonical text and chunk contracts
- `@opportunity-os/raw-content` supplies source and provenance vocabulary
- `@opportunity-os/shared` supplies shared context and logging vocabulary
- `@opportunity-os/events` supplies event contract vocabulary

Public exports route through `packages/embeddings/src/index.ts`.

The Embedding Foundation must not introduce OpenAI API calls, Gemini API calls, Voyage API calls, vector databases, AI reasoning, prompt execution, opportunity generation, REST APIs, frontend behavior, persistence implementation, scheduler behavior, workers, or business logic.

## Contract Surface

Consumers should import approved contracts from `@opportunity-os/embeddings` instead of using internal file imports.

The public surface includes:

- embedding vector and model identity primitives
- provider abstraction contracts
- embedding request and response contracts
- normalized chunk embedding contracts
- metadata and provenance contracts
- validation contracts
- cache port contracts
- result contracts
- safe error contracts
- embedding event contracts
- deterministic synthetic fixtures

Provider integrations, AI analysis workflows, retrieval systems, vector stores, REST APIs, and product packages must consume these contracts rather than redefining embedding shapes locally.

## Security

Embedding outputs must remain secret-safe and provider-payload-safe:

- fixtures use synthetic vectors only
- fixtures must not contain real embeddings, provider payloads, API keys, tokens, auth headers, credentials, DSNs, database URLs, or provider secrets
- errors and validation failures must not expose raw provider payloads, stack traces, raw causes, secret values, or credential-bearing metadata
- cache contracts are ports only and must not persist data in this milestone
- events are contract shapes only and must not introduce an event bus or production transport

## Readiness Gate

Milestone 18 is complete when:

- `@opportunity-os/embeddings` builds independently
- repository verification supports `phase-2-milestone-18`
- implementation files are permitted only in approved foundation packages and `packages/embeddings`
- public exports route through `packages/embeddings/src/index.ts`
- deterministic fixtures contain no secrets, real embeddings, or raw provider payloads
- security, dependency-boundary, export stability, contract stability, fixture, and pipeline integration tests pass
- prohibited provider API, vector database, AI reasoning, prompt execution, opportunity generation, REST API, frontend, persistence, scheduler, worker, and business logic implementation remains blocked

Required verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-18
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Future AI Analysis Pipeline work must consume `@opportunity-os/embeddings` instead of redefining embedding, chunk embedding, or provider abstraction contracts.
