# 04-017_LOCAL_PRODUCT_RUNTIME.md

**Document ID:** 04-017
**Version:** 1.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# Local Product Runtime

## Purpose

Phase 4 Milestone 31 makes Opportunity OS runnable locally as a product surface. It connects the existing API route handlers to a local HTTP server and lets the dashboard read from that local API.

This milestone is a runtime bridge only. It does not add live Reddit ingestion, AI provider calls, production persistence expansion, schedulers, workers, billing, analytics platforms, notifications, CRM integrations, recommendation engines, or mobile apps.

## Commands

Install dependencies:

```sh
pnpm install
```

Build the workspace:

```sh
pnpm build
```

Start the API:

```sh
pnpm dev:api
```

Start the dashboard:

```sh
pnpm dev:web
```

Start both API and dashboard:

```sh
pnpm dev
```

## Local URLs

- API health: `http://127.0.0.1:4000/health`
- API opportunities: `http://127.0.0.1:4000/opportunities`
- Dashboard: `http://127.0.0.1:3000`

Keep the API terminal and dashboard terminal running while walking through the local product.

For a normal-user MVP trial, follow `docs/04_IMPLEMENTATION/04-020_MVP_TRIAL_WALKTHROUGH.md`. It includes expected browser checkpoints, feedback workflow steps, and common failure cases.

## Runtime Behavior

The API local runtime wraps existing route handlers and uses deterministic local stores:

- synthetic opportunity and ranking ports
- in-memory feedback store
- in-memory bug-report store
- in-memory invite/session store

The dashboard reads `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL` when set and otherwise uses `http://127.0.0.1:4000`. If the API is unavailable, the dashboard falls back to deterministic fixtures.

## Verification

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-4-milestone-31
pnpm lint
pnpm build
pnpm test
```
