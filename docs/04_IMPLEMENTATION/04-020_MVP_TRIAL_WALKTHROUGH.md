# 04-020_MVP_TRIAL_WALKTHROUGH.md

**Document ID:** 04-020
**Version:** 1.0.0
**Status:** Approved (Implementation)
**Layer:** 3 - Implementation
**Owner:** Engineering Team

# MVP Trial Walkthrough

## Purpose

This walkthrough lets Adam run Opportunity OS as a local product-level MVP and manually confirm that a normal user can complete the core journey without developer assistance.

The trial uses deterministic local API and dashboard behavior by default. Live Reddit provider access is optional and must be run only with configured development credentials.

## Terminal Setup

Use a fresh clone or a clean synced working tree.

```sh
git clone https://github.com/adamshen1007/opportunity-os.git
cd opportunity-os
pnpm install --frozen-lockfile
pnpm build
```

Validate support services:

```sh
docker compose config
```

Optional local services:

```sh
docker compose up postgres redis
```

If Docker reports that it cannot connect to the Docker daemon, open Docker Desktop first and wait until it says the engine is running.

## Start The Product

Open two terminal windows.

Terminal 1:

```sh
cd opportunity-os
pnpm dev:api
```

Expected result:

```text
Opportunity OS API listening at http://127.0.0.1:4000
```

Terminal 2:

```sh
cd opportunity-os
pnpm dev:web
```

Expected result:

```text
http://127.0.0.1:3000
```

Keep both terminal windows running while testing.

Combined mode is also available:

```sh
pnpm dev
```

For a normal-user walkthrough, the two-terminal mode is easier to inspect because API and dashboard logs stay separate.

## Browser Walkthrough

Open `http://127.0.0.1:3000`.

Expected first-screen checkpoints:

- the page title says `Opportunity dashboard`
- the sidebar shows Overview, Opportunities, Detail, Rankings, and Evidence
- the `MVP Trial Guide` panel explains the three-step workflow
- the `Private Beta Access` panel shows invite-only demo access
- the `Validation Session` panel shows opportunities, saved, rated, and pending counts
- the page states that recommendations are explainable signals, not market guarantees

Open `http://127.0.0.1:4000/health`.

Expected result:

- JSON response with successful API health status
- no stack trace, token, credential, or raw provider data

## Core User Journey

1. On the dashboard, read `MVP Trial Guide`.
2. Use the toolbar search and filters, then select Apply.
3. Open `Opportunities` from the sidebar.
4. Click `Prioritize repeated manual review workflows`.
5. Confirm the detail page shows:
   - rank
   - score
   - confidence
   - generated timestamp in readable format
   - ranking explanation
   - trust note
   - validation feedback panel
   - evidence panel
6. Click Save.
7. Confirm the message says feedback was captured.
8. Click Dismiss.
9. Set usefulness, evidence quality, and ranking quality ratings.
10. Select one or more feedback reason categories.
11. Click Submit feedback.
12. Return to Overview and send the deterministic bug report.

## Expected Trust Boundaries

During the walkthrough, the UI and API should not display:

- secrets
- tokens
- auth headers
- credentials
- raw provider payloads
- raw prompts
- stack traces
- internal dependency details

The UI should clearly communicate:

- local/demo data is deterministic
- live Reddit access is optional and development-gated
- rankings are explainable prioritization aids
- Opportunity OS does not guarantee market outcomes

## Verification Commands

Run before asking another person to test:

```sh
node scripts/verify-repository.mjs --phase review
node scripts/verify-repository.mjs --phase phase-3-milestone-30
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm --filter @opportunity-os/web test:e2e
docker compose config
```

## Common Failure Cases

Docker daemon not running:

- open Docker Desktop
- wait for Docker Engine to report running
- rerun `docker compose config`

Port already in use:

- stop the process using `4000` or `3000`
- rerun `pnpm dev:api` or `pnpm dev:web`

Dashboard loads but API is down:

- the dashboard should remain inspectable with deterministic fixtures
- start `pnpm dev:api` to test the API-backed path

Dependency install cannot reach npm registry:

- check network access
- rerun `pnpm install --frozen-lockfile`
- do not edit `pnpm-lock.yaml` unless intentionally changing dependencies

Live Reddit command fails:

- confirm `REDDIT_LIVE_TEST_ENABLED=true`
- confirm Reddit credentials are set only in a local `.env`
- keep default tests fake-network only

## Pass / Fail Checklist

Pass when:

- API starts locally
- dashboard starts locally
- health endpoint responds
- dashboard first screen explains purpose and next action
- opportunity list is visible
- opportunity detail is understandable
- ranking explanation, evidence, provenance, and confidence are visible
- feedback can be saved, dismissed, rated, and submitted
- safe error, empty, and loading states are visible or test-covered
- verification commands pass or environment-specific failures are documented

Fail when:

- a normal user cannot identify what to do next
- the app requires production credentials for the default walkthrough
- default tests require live Reddit, AI providers, database services, schedulers, or workers
- secrets, raw provider payloads, prompts, stacks, or unsafe internals appear in UI or API output
