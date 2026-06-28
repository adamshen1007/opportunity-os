# Scripts

Repository automation and validation scripts live here.

Current scripts are limited to repository foundation checks. Do not add product behavior, connectors, APIs, or business logic to this directory.

`verify-repository.mjs` enforces Phase 0 policy gates:

- package manager pinning: `pnpm@11.7.0`
- Node engine policy: `>=22 <23`
- pnpm engine policy: `11.7.0`
- local Node version files: `.node-version` and `.nvmrc` must both be `22`
- placeholder boundaries: `apps/` and `packages/` may contain only `README.md` files until approved implementation work begins
