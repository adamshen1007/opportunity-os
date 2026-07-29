# Stack Exchange Connector

`@opportunity-os/connectors-stack-exchange` owns the read-only Stack Exchange datasource used by the multi-source MVP scan workflow.

The connector uses the official Stack Exchange API, preserves source attribution, honors pagination, quota, and backoff metadata, and returns secret-safe errors. Fixture mode is the default for tests and CI. Live access requires `STACK_EXCHANGE_LIVE_SCAN_ENABLED=true`.

Live failures are fail-closed. Rate limits, timeouts, malformed responses, and provider downtime return safe errors and never become fixture results labeled as live. Stack Exchange validation proves the source-neutral live pipeline only; it does not establish Reddit readiness.

```bash
STACK_EXCHANGE_LIVE_SCAN_ENABLED=true \
STACK_EXCHANGE_QUERY="manual deployment" \
pnpm --filter @opportunity-os/connectors-stack-exchange dev:stack-exchange:live
```

No write operations, user impersonation, scraping, scheduler, worker, or hidden background collection are implemented.
