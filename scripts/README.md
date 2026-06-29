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

The `review` phase now uses the active Phase 1 Milestone 2 boundary.

If `packages/config/package.json` exists, the verifier also rejects dependencies from `packages/config` to apps, APIs, connectors, AI workflows, database, domain, intelligence, or business packages.

For Phase 1 Milestone 2, the verifier also checks shared foundation package dependencies:

- `packages/config`, `packages/types`, and `packages/utils` must not depend on other workspace packages.
- `packages/errors` may depend only on `@opportunity-os/types`.
- `packages/shared` may depend only on `@opportunity-os/config`, `@opportunity-os/types`, `@opportunity-os/errors`, and `@opportunity-os/utils`.
- Shared foundation packages must not depend on apps, APIs, connectors, AI workflows, database, frontend, domain, intelligence, or business packages.

## Environment Contract Verification

The verifier compares variable names only. It does not print or inspect secret values.

It fails when:

- `.env.example` is missing a variable required by the Engineering Kit
- `.env.example` contains an undocumented variable
- `packages/config/src/schema.ts` required variables drift from the Engineering Kit
- `packages/config/src/schema.ts` optional variables drift from the Engineering Kit
- `.env.example` and the config schema contain different variable names
- any environment variable name is duplicated
