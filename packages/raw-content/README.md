# Raw Content

Phase 2 Milestone 16 establishes the Raw Content Pipeline Foundation in `packages/raw-content`.

`packages/raw-content` owns Raw Content contracts only. It will define contracts for posts, comments, authors, communities, source metadata, ingestion metadata, provenance, normalization boundaries, deduplication, fingerprinting, validation, storage ports, raw content events, and mapping from Reddit provider outputs to Raw Content contracts.

Dependency direction:

- `@opportunity-os/connectors-reddit` supplies Reddit provider output contracts
- `@opportunity-os/events` supplies event contracts
- `@opportunity-os/domain` supplies domain contract vocabulary
- `@opportunity-os/application` supplies application boundary vocabulary
- `@opportunity-os/database` supplies storage port boundary vocabulary only
- `@opportunity-os/shared` supplies shared context and logging vocabulary

No persistence implementation exists in this package. The Raw Content foundation must not implement Prisma repositories, database writes, AI workflows, opportunity generation, REST APIs, frontend behavior, scheduler behavior, worker behavior, or business scoring.

Public exports route through `packages/raw-content/src/index.ts`.

## Phase 2 Milestone 16 Slice A

Slice A creates the strict TypeScript package boundary and repository verification policy. It does not add Raw Content domain models, storage implementations, pipeline execution, provider execution, or product behavior.

Readiness for this slice requires:

- `@opportunity-os/raw-content` builds independently
- repository verification supports `phase-2-milestone-16`
- implementation files are permitted only in approved foundation packages and `packages/raw-content`
- prohibited persistence, API, workflow, frontend, scheduler, worker, and scoring implementation remains blocked

## Phase 2 Milestone 16 Slice B

Slice B defines the canonical Raw Content model:

- source metadata
- authors
- communities
- posts
- comments
- ingestion metadata
- provenance
- raw content envelopes

Contracts use safe metadata placeholders and replay-safe references. They do not store raw provider payloads, implement persistence, run AI processing, or add business scoring.

## Phase 2 Milestone 16 Slice C

Slice C defines the contracts immediately after provider transport:

- normalization boundary contracts
- fingerprint contracts
- deduplication contracts
- validation contracts
- storage port interfaces
- raw-content event contracts
- Reddit-to-RawContent mapping contracts

These contracts define boundary shapes only. They do not implement normalization algorithms, hashing engines, storage behavior, Prisma repositories, event buses, AI processing, or business logic.
