# Normalization

Phase 2 Milestone 17 establishes the Normalization Pipeline Foundation in `packages/normalization`.

`packages/normalization` owns normalization contracts and future deterministic normalization utilities. Phase 2 Milestone 17 defines the full contract surface for canonical normalized text, deterministic cleaning boundaries, language and chunking metadata, preservation contracts, validation, results, events, fixtures, and package stability tests.

The milestone began with a normalization package boundary only slice, then completed the contract surface through scoped slices for canonical text, cleaning, language, chunking, preservation, validation, results, events, fixtures, stability, security, dependency boundaries, pipeline integration, documentation, and governance.

Dependency direction:

- `@opportunity-os/raw-content` supplies canonical Raw Content contracts
- `@opportunity-os/shared` supplies shared context and logging vocabulary
- `@opportunity-os/events` supplies event contract vocabulary
- `@opportunity-os/domain` supplies generic domain contract vocabulary

Public exports route through `packages/normalization/src/index.ts`.

The Normalization Pipeline must not introduce embeddings, LLMs, AI analysis, semantic interpretation, opportunity generation, REST APIs, frontend behavior, scheduler behavior, persistence implementation, Prisma repositories, event buses, workers, or business scoring.

## Contract Surface

Milestone 17 provides:

- canonical text and text segment contracts
- normalization input, output, operation, and stage vocabulary contracts
- markdown, HTML, Unicode, whitespace, and URL cleaning contracts
- language detection contracts
- text chunking contracts
- metadata preservation contracts
- provenance preservation contracts
- normalization validation contracts
- normalization result contracts
- normalization event contracts
- deterministic fixtures
- export stability, security, dependency-boundary, and pipeline integration tests

These contracts are declarative. They do not execute normalization algorithms, parse DOM, launch a browser, call a network, integrate parser libraries, run AI, publish events, persist data, or score business opportunities.

## Readiness Gate

Milestone 17 is complete when:

- `@opportunity-os/normalization` builds independently
- repository verification supports `phase-2-milestone-17`
- implementation files are permitted only in approved foundation packages and `packages/normalization`
- public exports route through `packages/normalization/src/index.ts`
- deterministic fixtures contain no secrets or raw provider payloads
- security, dependency-boundary, export stability, fixture, and pipeline integration tests pass
- prohibited embeddings, LLMs, AI analysis, event buses, opportunity generation, REST APIs, frontend, scheduler, persistence, Prisma repository, worker, and business scoring implementation remains blocked

Required verification:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-2-milestone-17
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
docker compose config
```

Future AI Analysis Pipeline work must consume `@opportunity-os/normalization` instead of redefining canonical normalized text or preservation contracts.
