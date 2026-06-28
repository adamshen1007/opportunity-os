# Scripts

Repository automation and validation scripts live here.

Current scripts are limited to repository and package-boundary checks. Do not add product behavior, connectors, APIs, AI workflows, or business logic to this directory.

`verify-repository.mjs` enforces repository policy gates:

- package manager pinning: `pnpm@11.7.0`
- Node engine policy: `>=24 <25`
- pnpm engine policy: `11.7.0`
- local Node version files: `.node-version` and `.nvmrc` must both be `24`
- placeholder boundaries: `apps/` and `packages/` may contain only `README.md` files until approved implementation work begins
- environment contract consistency between `.env.example`, `packages/config/src/schema.ts`, and the Engineering Kit variable set

## Phase 1 Configuration Boundary

Phase 1 Milestone 1 starts shared infrastructure work in `packages/config`.

Run the Phase 1 boundary check with:

```sh
node scripts/verify-repository.mjs --phase phase-1-milestone-1
```

In Phase 1 mode, implementation files are permitted only inside `packages/config/`. The verifier still blocks implementation files in `apps/` and every unrelated package.

The `review` phase now uses the active Phase 1 boundary, so this command also permits only `packages/config/` implementation files:

```sh
node scripts/verify-repository.mjs --phase review
```

If `packages/config/package.json` exists, the verifier also rejects dependencies from `packages/config` to apps, APIs, connectors, AI workflows, database, domain, intelligence, or business packages.

## Environment Contract Verification

The verifier compares variable names only. It does not print or inspect secret values.

It fails when:

- `.env.example` is missing a variable required by the Engineering Kit
- `.env.example` contains an undocumented variable
- `packages/config/src/schema.ts` required variables drift from the Engineering Kit
- `packages/config/src/schema.ts` optional variables drift from the Engineering Kit
- `.env.example` and the config schema contain different variable names
- any environment variable name is duplicated
