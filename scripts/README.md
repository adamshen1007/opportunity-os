# Scripts

Repository automation and validation scripts live here.

Current scripts are limited to repository and package-boundary checks. Do not add product behavior, connectors, APIs, AI workflows, or business logic to this directory.

`verify-repository.mjs` enforces repository policy gates:

- package manager pinning: `pnpm@11.7.0`
- Node engine policy: `>=24 <25`
- pnpm engine policy: `11.7.0`
- local Node version files: `.node-version` and `.nvmrc` must both be `24`
- placeholder boundaries: `apps/` and `packages/` may contain only `README.md` files until approved implementation work begins
- shared foundation package dependency boundaries and reverse dependency rules
- logging foundation file, export, and dependency stability checks during Phase 1 Milestone 3
- event foundation file, export, and dependency stability checks during Phase 1 Milestone 4
- database foundation file, Prisma schema, dependency, and package-boundary checks during Phase 1 Milestone 5
- container foundation package and dependency-boundary checks during Phase 1 Milestone 8
- infrastructure composition package and dependency-boundary checks during Phase 1 Milestone 9
- connector SDK package and dependency-boundary checks during Phase 2 Milestone 10
- connector runtime package and dependency-boundary checks during Phase 2 Milestone 11
- connector host package and dependency-boundary checks during Phase 2 Milestone 12
- Reddit connector package and dependency-boundary checks during Phase 2 Milestone 13
- deterministic Reddit runtime checks during Phase 2 Milestone 14
- Reddit provider transport boundary checks during Phase 2 Milestone 15
- Raw Content Pipeline boundary checks during Phase 2 Milestone 16
- Normalization Pipeline boundary checks during Phase 2 Milestone 17
- Embedding Foundation boundary checks during Phase 2 Milestone 18
- LLM Analysis Foundation boundary checks during Phase 2 Milestone 19
- Structured Analysis Foundation boundary checks during Phase 2 Milestone 20
- Opportunity Engine Foundation boundary checks during Phase 2 Milestone 21
- Opportunity Pipeline Foundation boundary checks during Phase 2 Milestone 22
- Candidate Opportunity Engine boundary checks during Phase 2 Milestone 23
- Opportunity Generation Workflow boundary checks during Phase 2 Milestone 24
- Opportunity Ranking Engine boundary checks during Phase 3 Milestone 25
- REST API foundation checks during Phase 3 Milestone 26
- Dashboard MVP foundation checks during Phase 3 Milestone 27
- Product Validation Loop foundation checks during Phase 3 Milestone 28
- Private Beta deployment and operations readiness checks during Phase 3 Milestone 29
- Beta Operations boundary checks during Phase 3 Milestone 30
- Local Product Runtime checks during Phase 4 Milestone 31
- Product Data Schema checks during Phase 4 Milestone 32
- Reddit Live Provider Transport checks during Phase 4 Milestone 33
- environment contract consistency between `.env.example`, `packages/config/src/schema.ts`, and the Engineering Kit variable set

Engineering Kit v3.0 treats the active `review` phase as the Phase 3 Milestone 30 boundary. Phase 3 Milestone 26 still has an explicit `phase-3-milestone-26` gate for REST API foundation work, Phase 3 Milestone 27 has an explicit `phase-3-milestone-27` gate for Dashboard MVP foundation work, Phase 3 Milestone 28 has an explicit `phase-3-milestone-28` gate for Product Validation Loop foundation work, Phase 3 Milestone 29 has an explicit `phase-3-milestone-29` gate for Private Beta deployment readiness, operations readiness, invite-only authentication, and persistence work, and Phase 3 Milestone 30 has an explicit `phase-3-milestone-30` gate for Beta Operations policy.

The Phase 3 Milestone 29 gate requires deployment workflow configuration, placeholder-only production config, operations documentation, config binding documentation, rollback guidance, monitoring guidance, operational runbook, beta checklist, invite contracts, invite validation, session management, `PrivateBetaInvite`, `PrivateBetaSession`, `PrivateBetaFeedback`, and `PrivateBetaBugReport` persistence schema, protected dashboard/onboarding/save-dismiss/bug-reporting/invite workflow files, and secret-safe tests while continuing to block billing, multi-tenancy, production identity providers, enterprise auth, and unrelated product systems.

The Phase 3 Milestone 30 gate requires Beta Operations boundary documentation in the README, CONTRIBUTING guide, PR template, documentation index, roadmap, implementation order, implementation README, scripts README, and the `04-008` through `04-016` Beta Operations documents. It is operations-only and continues blocking new backend features, AI features, payments, CRM integrations, notifications, analytics platforms, mobile apps, schedulers, workers, new APIs, new dashboard features, new persistence features, and new authentication features.

The Phase 4 Milestone 33 gate requires controlled live Reddit provider transport files, public exports, fake-transport unit tests, optional live integration test coverage, security redaction tests, `.env.example` live Reddit variables, and documentation. It permits live Reddit provider access only inside `packages/connectors-reddit` and continues blocking Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend changes, schedulers, workers, database persistence, and business logic.

## Phase 1 Shared Infrastructure Boundaries

Phase 1 Milestone 1 starts shared infrastructure work in `packages/config`.

Run the Milestone 1 boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-1
```

In Milestone 1 mode, implementation files are permitted only inside `packages/config/`. The verifier still blocks implementation files in `apps/` and every unrelated package.

Phase 1 Milestone 2 starts shared foundation work. During TASK-P1-M2-02, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`

Run the active review boundary check with:

```sh
node scripts/verify-repository.mjs --phase review
```

Phase 1 Milestone 3 adds the logging foundation inside `packages/shared/`. It uses the same shared infrastructure implementation roots and keeps all application, API, connector, AI workflow, frontend, database, domain, intelligence, and business implementation blocked.

Run the active review boundary check with:

```sh
node scripts/verify-repository.mjs --phase review
```

The `review` phase now uses the active Phase 3 Milestone 30 boundary. Phase 1 Milestone 3 additionally verifies:

- required logging implementation files exist under `packages/shared/src/logging/`
- logging contracts are exported through `packages/shared/src/logging/index.ts`
- workspace root shared exports expose the approved logging contracts
- `pino` is declared only by `packages/shared`

Phase 1 Milestone 4 adds the Event Foundation in `packages/events/`. It keeps all application, API, connector, AI workflow, frontend, database, domain, intelligence, and business implementation blocked.

Run the explicit Event Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-4
```

In Milestone 4 mode, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`
- `packages/events/`

The verifier checks that foundational event category, metadata, versioning, envelope, context, schema, publisher, consumer, idempotency, replay, serialization, result, error, test-only in-memory bus, contract stability, security, and public export files exist during the Event Foundation slice. It also verifies prohibited reverse dependencies so apps, APIs, connectors, AI workflows, frontend, database, domain, intelligence, acquisition, application, and business packages cannot depend into or be depended on by the shared foundation packages before their approved milestones.

Phase 1 Milestone 5 adds the Database Foundation in `packages/database/`. It keeps all application, API, connector, AI workflow, frontend, domain, intelligence, acquisition, application, and business implementation blocked.

Run the explicit Database Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-5
```

In Milestone 5 mode, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`
- `packages/events/`
- `packages/database/`

The verifier checks that the database package, strict TypeScript config, Prisma schema, PostgreSQL datasource, Prisma client generator, baseline migration, explicit database configuration contract, database client factory contract, lifecycle contracts, generic repository contracts, transaction contracts, safe error contracts, health contract, seed placeholder, schema policy tests, database security tests, export stability tests, package boundary tests, optional local verification script, and public exports exist during the active Database Foundation slice. It also rejects Prisma dependencies outside `packages/database`, non-approved ORM dependencies, unapproved `packages/database` dependencies, automatic client connection, process-level client singleton patterns, direct `process.env` reads in runtime database config/client files, and prohibited schema models such as Raw Content workflow, connector, event store, AI workflow, API, frontend, or business models. The optional local verification script must remain outside the default test pipeline so CI does not require a running database.

Phase 1 Milestone 6 adds the Domain Foundation in `packages/domain/`. Slice A keeps connector execution, Raw Content workflows, AI workflows, APIs, frontend, application services, business scoring logic, database repository implementations, and production event store transport blocked.

Run the explicit Domain Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-6
```

In Milestone 6 mode, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`
- `packages/events/`
- `packages/database/`
- `packages/domain/`

The verifier checks that the domain package, strict TypeScript config, package test config, public export boundary, generic primitive contracts, value object contracts, entity contracts, aggregate root contracts, metadata contracts, domain event contracts, domain error contracts, repository interface contracts, validation contracts, result contracts, export stability tests, package-boundary tests, contract stability tests, and deterministic domain contract tests exist during the active Domain Foundation slice. It also rejects unapproved `packages/domain` dependencies and scans runtime domain package source files for prohibited connector, Raw Content, AI workflow, API, frontend, application service, business scoring, database repository, and production event store transport implementation references.

Phase 1 Milestone 7 adds the Application Foundation in `packages/application/`. Slice A keeps REST API routes, controllers, authentication implementation, authorization implementation, connector execution, AI workflows, database repository implementations, frontend, business scoring logic, and actual product use cases blocked.

Run the explicit Application Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-7
```

In Milestone 7 mode, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`
- `packages/events/`
- `packages/database/`
- `packages/domain/`
- `packages/application/`

The verifier checks that the application package, strict TypeScript config, package test config, public export boundary, command/query contracts, use-case contracts, application result contracts, validation outcome contracts, handler context contracts, application service contracts, DI contracts, request context contracts, application error contracts, event publishing contracts, repository port contracts, transaction boundary contracts, export stability tests, package boundary tests, security tests, and deterministic contract tests exist during the active Application Foundation slice. It rejects unapproved `packages/application` dependencies and scans runtime application package source files for prohibited REST API routes, controllers, auth implementation, connector execution, AI workflows, database repository implementations, frontend implementation, business scoring logic, and actual product use cases.

Phase 1 Milestone 8 adds the Container Foundation in `packages/container/`. It keeps REST APIs, controllers, authentication implementation, authorization implementation, connector execution, AI workflows, database repository implementations, frontend, application services, product workflows, business logic, runtime service locators, reflection, app startup, API boot, and product workflow composition blocked.

Run the explicit Container Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-8
```

In Milestone 8 mode, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`
- `packages/events/`
- `packages/database/`
- `packages/domain/`
- `packages/application/`
- `packages/container/`

The verifier checks that the container package, strict TypeScript config, package test config, public export boundary, README boundary documentation, dependency token contracts, registration contracts, lifetime contracts, resolver contracts, scope contracts, module contracts, composition root contracts, config binding contracts, logger binding contracts, validation contracts, container errors, export stability tests, package boundary tests, and contract stability tests exist during Milestone 8. It rejects unapproved `packages/container` dependencies and scans runtime container package source files for prohibited REST APIs, controllers, auth implementation, connector execution, AI workflows, database repository implementations, frontend implementation, application services, product workflows, and business logic.

Phase 1 Milestone 9 adds the Infrastructure Composition Foundation in `packages/infrastructure/`. Slice A keeps REST APIs, controllers, authentication implementation, authorization implementation, connector execution, AI workflows, database repository implementations, frontend, product workflows, and business logic blocked.

Run the explicit Infrastructure Composition Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-9
```

In Milestone 9 mode, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`
- `packages/events/`
- `packages/database/`
- `packages/domain/`
- `packages/application/`
- `packages/container/`
- `packages/infrastructure/`

The verifier checks that the infrastructure package, strict TypeScript config, package test config, public export boundary, README boundary documentation, and approved dependency set exist during Slice A. It rejects unapproved `packages/infrastructure` dependencies and scans runtime infrastructure package source files for prohibited REST APIs, controllers, auth implementation, connector execution, AI workflows, database repository implementations, frontend implementation, product workflows, and business logic.

Phase 2 Milestone 10 adds the Connector SDK Foundation in `packages/connectors/`. It keeps apps, APIs, auth implementation, AI workflows, frontend, business logic, concrete connector implementations, OAuth, HTTP clients, Reddit connector, YouTube connector, and connector execution blocked.

Run the explicit Connector SDK Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-10
```

In Milestone 10 mode, implementation files are permitted in:

- `packages/config/`
- `packages/types/`
- `packages/errors/`
- `packages/utils/`
- `packages/shared/`
- `packages/events/`
- `packages/database/`
- `packages/domain/`
- `packages/application/`
- `packages/container/`
- `packages/infrastructure/`
- `packages/connectors/`

The verifier checks that the connector SDK package, strict TypeScript config, package test config, public export boundary, README boundary documentation, approved dependency set, contract tests, export stability tests, dependency boundary tests, security tests, and stability tests exist. It rejects unapproved `packages/connectors` dependencies and scans runtime connector SDK package source files for prohibited concrete connector implementations, Reddit connector, YouTube connector, OAuth, HTTP clients, REST APIs, controllers, auth implementation, AI workflows, frontend implementation, business logic, and connector execution.

Phase 2 Milestone 11 adds the Connector Runtime Foundation in `packages/connector-runtime/`. It keeps Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, auth implementation, AI workflows, frontend, business logic, and actual connector execution blocked.

Run the explicit Connector Runtime Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-11
```

In Milestone 11 mode, implementation files are also permitted in:

- `packages/connector-runtime/`

The verifier checks that the connector runtime package, strict TypeScript config, package test config, public export boundary, README boundary documentation, package-boundary tests, export stability tests, contract stability tests, security tests, dependency boundary tests, and approved dependency set exist. It rejects unapproved `packages/connector-runtime` dependencies and scans runtime package source files for prohibited Reddit connector, YouTube connector, OAuth, HTTP clients, scheduler, queue, worker process, REST APIs, controllers, auth implementation, AI workflows, frontend implementation, business logic, and actual connector execution.

Phase 2 Milestone 12 adds the Connector Host Foundation in `packages/connector-host/`. It keeps Reddit connector, YouTube connector, OAuth implementation, HTTP clients, scheduler, queue, worker process, APIs, auth implementation, AI workflows, frontend, business logic, provider integration, and actual connector execution blocked.

Run the explicit Connector Host Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-12
```

In Milestone 12 mode, implementation files are also permitted in:

- `packages/connector-host/`

The verifier checks that the connector host package, strict TypeScript config, package test config, public export boundary, README boundary documentation, contract files, package-boundary tests, export stability tests, contract stability tests, security tests, dependency boundary tests, and approved dependency set exist. It rejects unapproved `packages/connector-host` dependencies and scans host package source files for prohibited Reddit connector, YouTube connector, OAuth, HTTP clients, scheduler, queue, worker process, APIs, auth implementation, AI workflows, frontend implementation, business logic, provider integration, and actual connector execution.

Phase 2 Milestone 13 adds the Reddit Connector Foundation in `packages/connectors-reddit/`. It keeps OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend, business logic, and actual connector execution blocked.

Run the explicit Reddit Connector Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-13
```

In Milestone 13 mode, implementation files are also permitted in:

- `packages/connectors-reddit/`

Phase 2 Milestone 14 adds the deterministic Reddit Runtime in `packages/connectors-reddit/`. It keeps OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend, business logic, provider integration, event publishing, host startup, runner loops, and external connector execution blocked.

Run the explicit Reddit Runtime boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-14
```

The verifier checks deterministic fake-provider runtime construction, explicit config validation, lifecycle readiness, fixture-backed read operations, result mapping, safe runtime errors, deterministic harness, public exports, security tests, stability tests, dependency boundary tests, and documentation.

Phase 2 Milestone 15 adds the Reddit Provider Transport boundary in `packages/connectors-reddit/`.

Run the explicit Reddit Provider Transport boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-15
```

In Milestone 15 mode, implementation files remain limited to approved foundation packages and `packages/connectors-reddit/`. Provider transport exports must route through `packages/connectors-reddit/src/provider/index.ts` and be re-exported from the package root. The verifier requires provider authentication, HTTP transport abstraction, API client, request builder, response parser, pagination transport, rate-limit parser, runtime compatibility, auth lifecycle, provider error, telemetry, container binding, deterministic fixtures, fake transport, integration tests, security tests, contract stability tests, dependency boundary tests, and provider boundary exports while continuing to block Raw Content persistence, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, database persistence, and business logic.

The verifier checks that the Reddit connector package, strict TypeScript config, package test config, public export boundary, README boundary documentation, metadata contracts, capability contracts, configuration contracts, validation contracts, data shape contracts, operation contracts, lifecycle contracts, factory contracts, host integration contracts, safe error contracts, deterministic fixture contracts, package-boundary test, export stability test, contract stability test, security test, dependency boundary test, and approved dependency set exist. It rejects unapproved `packages/connectors-reddit` dependencies and scans Reddit connector package source files for prohibited OAuth implementation, live Reddit API calls, HTTP clients, scraping, scheduler, queue, worker process, database persistence, AI workflows, APIs, frontend implementation, business logic, and actual connector execution.

Phase 2 Milestone 16 adds the Raw Content Pipeline Foundation boundary in `packages/raw-content/`.

Run the explicit Raw Content Pipeline Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-16
```

In Milestone 16 mode, implementation files are also permitted in `packages/raw-content/`. The verifier requires the raw-content package, strict TypeScript config, package test config, README boundary documentation, and public export boundary while continuing to block persistence implementation, Prisma repositories, AI workflows, opportunity generation, REST APIs, frontend, scheduler, worker, and business scoring.

Phase 2 Milestone 17 adds the Normalization Pipeline Foundation boundary in `packages/normalization/`.

Run the explicit Normalization Pipeline Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-17
```

In Milestone 17 mode, implementation files are also permitted in `packages/normalization/`. The verifier requires the normalization package, strict TypeScript config, package test config, README boundary documentation, public export boundary, and package-boundary test while continuing to block embeddings, AI analysis, opportunity generation, REST APIs, frontend, scheduler, persistence implementation, Prisma repositories, workers, and business scoring.

Phase 2 Milestone 22 adds the Opportunity Pipeline Foundation in `packages/opportunity-pipeline/`.

Run the explicit Opportunity Pipeline Foundation boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-22
```

In Milestone 22 mode, implementation files are also permitted in `packages/opportunity-pipeline/`. The verifier requires the opportunity-pipeline package, strict TypeScript config, package test config, README documentation, public export boundary, pipeline primitives, stage contracts, metadata contracts, provenance contracts, evidence aggregation contracts, hypothesis assembly contracts, candidate opportunity contracts, validation contracts, result contracts, error contracts, event contracts, deterministic fixtures, export stability tests, contract stability tests, dependency-boundary tests, security tests, upstream integration tests, and root pipeline integration while continuing to block business scoring algorithms, ranking algorithms, recommendation engines, REST APIs, frontend, persistence implementation, schedulers, workers, provider SDKs, workflow engines, aggregation algorithms, generation logic, execution behavior, and business workflows.

Phase 2 Milestone 23 adds the Candidate Opportunity Engine foundation in `packages/opportunity-candidates/`.

Run the explicit Candidate Opportunity Engine boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-23
```

In Milestone 23 mode, implementation files are also permitted in `packages/opportunity-candidates/`. Slice A requires the opportunity-candidates package, strict TypeScript config, package test config, README documentation, and public export boundary while continuing to block production ranking algorithms, recommendation engines, business scoring, REST APIs, frontend, persistence implementation, schedulers, workers, provider SDKs, and business workflows.

Phase 2 Milestone 24 adds the Opportunity Generation Workflow foundation in `packages/opportunity-generation/`.

Run the explicit Opportunity Generation Workflow boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-2-milestone-24
```

In Milestone 24 mode, implementation files are also permitted in `packages/opportunity-generation/`. Slice A requires the opportunity-generation package, strict TypeScript config, package test config, README documentation, and public export boundary while continuing to block production ranking, recommendation engines, REST APIs, frontend, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, live AI providers, and business workflows.

Phase 3 Milestone 25 adds the Opportunity Ranking Engine in `packages/opportunity-ranking/`.

Run the explicit Opportunity Ranking Engine boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-3-milestone-25
```

In Milestone 25 mode, implementation files are also permitted in `packages/opportunity-ranking/`. Slice A requires the opportunity-ranking package, strict TypeScript config, package test config, README documentation, and public export boundary while continuing to block recommendation engines, REST APIs, frontend, persistence implementation, schedulers, workers, billing, user accounts, provider SDKs, ML behavior, and LLM calls.

If `packages/config/package.json` exists, the verifier also rejects dependencies from `packages/config` to apps, APIs, connectors, AI workflows, database, domain, intelligence, or business packages.

For Phase 1 Milestone 2, the verifier also checks shared foundation package dependencies:

- `packages/config`, `packages/types`, and `packages/utils` must not depend on other workspace packages.
- `packages/errors` may depend only on `@opportunity-os/types`.
- `packages/shared` may depend only on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.
- `packages/events` currently must not depend on other workspace packages.
- `packages/database` may depend only on approved shared infrastructure packages and Prisma-related dependencies explicitly allowed by the Database Foundation policy.
- `packages/domain` may depend only on `@opportunity-os/types`, `@opportunity-os/errors`, `@opportunity-os/events`, and optionally `@opportunity-os/utils`.
- `packages/application` may depend only on approved foundation packages when a scoped milestone requires them.
- `packages/container` may depend only on approved foundation packages and deterministic test/build tooling when a scoped milestone requires them.
- `packages/infrastructure` may depend only on approved foundation packages and deterministic test/build tooling when a scoped milestone requires them.
- `packages/connectors` may depend only on approved foundation packages and deterministic test/build tooling when a scoped milestone requires them.
- `packages/connectors-reddit` may depend only on approved connector foundation packages and deterministic test/build tooling when a scoped milestone requires them.
- Shared foundation, database foundation, domain foundation, application foundation, container foundation, and infrastructure composition foundation packages must not depend on apps, APIs, connectors, AI workflows, frontend, intelligence, acquisition, or business packages.

## Environment Contract Verification

The verifier compares variable names only. It does not print or inspect secret values.

It fails when:

- `.env.example` is missing a variable required by the Engineering Kit
- `.env.example` contains an undocumented variable
- `packages/config/src/schema.ts` required variables drift from the Engineering Kit
- `packages/config/src/schema.ts` optional variables drift from the Engineering Kit
- `.env.example` and the config schema contain different variable names
- any environment variable name is duplicated
