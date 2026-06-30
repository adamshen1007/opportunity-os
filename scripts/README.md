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
- environment contract consistency between `.env.example`, `packages/config/src/schema.ts`, and the Engineering Kit variable set

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

The `review` phase now uses the active Phase 1 Milestone 5 boundary. Phase 1 Milestone 3 additionally verifies:

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

If `packages/config/package.json` exists, the verifier also rejects dependencies from `packages/config` to apps, APIs, connectors, AI workflows, database, domain, intelligence, or business packages.

For Phase 1 Milestone 2, the verifier also checks shared foundation package dependencies:

- `packages/config`, `packages/types`, and `packages/utils` must not depend on other workspace packages.
- `packages/errors` may depend only on `@opportunity-os/types`.
- `packages/shared` may depend only on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.
- `packages/events` currently must not depend on other workspace packages.
- `packages/database` may depend only on approved shared infrastructure packages and Prisma-related dependencies explicitly allowed by the Database Foundation policy.
- Shared foundation and database foundation packages must not depend on apps, APIs, connectors, AI workflows, frontend, domain, intelligence, acquisition, application, or business packages.

## Environment Contract Verification

The verifier compares variable names only. It does not print or inspect secret values.

It fails when:

- `.env.example` is missing a variable required by the Engineering Kit
- `.env.example` contains an undocumented variable
- `packages/config/src/schema.ts` required variables drift from the Engineering Kit
- `packages/config/src/schema.ts` optional variables drift from the Engineering Kit
- `.env.example` and the config schema contain different variable names
- any environment variable name is duplicated
