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

## Phase 4 Milestone 34 Live LLM Integration

Phase 4 Milestone 34 Slice C adds the first env-gated live provider adapter for external MVP runtime validation. The default path remains deterministic: tests and CI use fixtures and injected fake `fetch` functions, and live provider calls run only when explicitly enabled.

Live provider ownership:

- provider config is read from explicit environment input by `createLiveLlmProviderConfigFromEnv`
- supported providers are `openai` and `gemini`
- the adapter uses Node 24 `fetch` with no provider SDK dependency
- prompt construction is routed through `createLiveLlmPromptBoundary`
- prompt previews redact secret-like input keys
- provider errors serialize only safe code, category, message, correlation ID, optional request ID, and safe metadata

Required environment variables for the live command:

- `LLM_LIVE_ANALYSIS_ENABLED=true`
- `LLM_PROVIDER=openai` or `LLM_PROVIDER=gemini`
- `LLM_MODEL`
- `OPENAI_API_KEY` for OpenAI, or `GEMINI_API_KEY` for Gemini

Optional:

- `LLM_PROVIDER_TIMEOUT_MS`
- `OPENAI_MODEL`
- `GEMINI_MODEL`

Run the OpenAI smoke command only from a protected environment:

```sh
LLM_LIVE_ANALYSIS_ENABLED=true \
LLM_PROVIDER=openai \
LLM_MODEL=gpt-4.1-mini \
OPENAI_API_KEY=... \
pnpm --filter @opportunity-os/llm-analysis dev:llm:live
```

Run the Gemini smoke command only from a protected environment:

```sh
LLM_LIVE_ANALYSIS_ENABLED=true \
LLM_PROVIDER=gemini \
LLM_MODEL=gemini-2.5-flash \
GEMINI_API_KEY=... \
pnpm --filter @opportunity-os/llm-analysis dev:llm:live
```

The command prints only the provider/model and returned output field names. It must not print API keys, authorization headers, raw provider payloads, prompts, stack traces, or raw causes.

## Phase 4.5 Pilot Validation

The selected pilot configuration is Gemini with `gemini-2.5-flash`. OpenAI support remains available at the package boundary, but the pilot API live path fails closed unless `LLM_PROVIDER=gemini` and `GEMINI_MODEL=gemini-2.5-flash` are configured explicitly.

Live output is validated by `citation-validator-v1` against `opportunity-analysis-schema-v2`. Required fields and kinds must match exactly, factual claims must cite evidence IDs supplied with the request, fabricated or missing citations are rejected, and unsupported statements must be marked as assumptions. Provider timeout, refusal, quota, malformed output, and unsafe output remain failures; none may become a successful fixture result. Fixture mode remains the default for tests and CI.

Slice C does not add provider SDKs, dashboard behavior, persistence, schedulers, workers, billing, recommendation logic, or new product workflows.
