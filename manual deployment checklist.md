# Manual Deployment Checklist

This is the beginner-first deployment guide for Opportunity OS.

> Hosted pilot note: complete Phase 4 Milestones 40-44 before inviting users. Use `render.yaml` for the API and `apps/web/vercel.json` for the dashboard. Merging these files does not deploy production automatically because `autoDeploy` is intentionally disabled.

Use it as a sequential checklist. Do not skip ahead. Each step tells you:

1. Do this.
2. Verify this.
3. Continue only when the verification passes.

Never paste secrets into GitHub issues, pull requests, screenshots, public chats, or committed files. Put real secret values only in your local `.env` file or the protected environment-variable settings of your hosting provider.

## 0. What You Are Deploying

Opportunity OS has two running applications:

- API: `apps/api`
- Dashboard: `apps/web`

It also needs external services:

- PostgreSQL database, recommended: Supabase
- Redis, recommended: Upstash
- Reddit API credentials
- One LLM provider key, currently OpenAI or Gemini
- Hosting for API
- Hosting for web dashboard

## 1. Prepare Your Local Machine

### 1.1 Open Terminal

Do this:

```sh
cd "/Users/adam/Documents/Adams Project"
```

Verify this:

```sh
pwd
```

Expected result:

```text
/Users/adam/Documents/Adams Project
```

Continue only when you are inside the repository folder.

### 1.2 Install Dependencies

Do this:

```sh
pnpm install --frozen-lockfile
```

Verify this:

- the command exits without errors
- no lockfile changes are required

Continue only when install passes.

### 1.3 Confirm Repository Health

Do this:

```sh
node scripts/verify-repository.mjs --phase review
pnpm lint
pnpm build
pnpm test
docker compose config
```

Verify this:

- every command exits successfully
- no command prints secrets

Continue only when all commands pass.

## 2. Create A Safe Local Environment File

### 2.1 Create `.env`

Do this only if `.env` does not already exist:

```sh
cp .env.example .env
```

Verify this:

```sh
git status --short --ignored .env
```

Expected result:

```text
!! .env
```

Continue only when `.env` is ignored by Git.

### 2.2 Add Local Runtime Values

Do this:

Open `.env` in your editor and fill in only your private local values.

Required local values:

```text
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
OPENAI_API_KEY=
GEMINI_API_KEY=
LLM_PROVIDER=
LLM_MODEL=
LLM_LIVE_ANALYSIS_ENABLED=
REDDIT_PRODUCTION_CLIENT_ID=
REDDIT_PRODUCTION_CLIENT_SECRET=
REDDIT_PRODUCTION_REFRESH_TOKEN=
REDDIT_PRODUCTION_USER_AGENT=
```

Use either OpenAI or Gemini for live LLM testing:

OpenAI:

```text
LLM_PROVIDER=openai
LLM_MODEL=gpt-4.1-mini
OPENAI_API_KEY=your-openai-key
```

Gemini:

```text
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your-gemini-key
```

Verify this:

```sh
node --env-file=.env -e 'console.log(JSON.stringify({ databaseUrl: Boolean(process.env.DATABASE_URL), redisUrl: Boolean(process.env.REDIS_URL), llmProvider: process.env.LLM_PROVIDER, llmModel: process.env.LLM_MODEL, openaiConfigured: Boolean(process.env.OPENAI_API_KEY), geminiConfigured: Boolean(process.env.GEMINI_API_KEY), redditConfigured: Boolean(process.env.REDDIT_PRODUCTION_CLIENT_ID) }, null, 2))'
```

Expected result:

- booleans are `true` for the services you configured
- `llmProvider` is `openai` or `gemini`
- no secret values are printed

Continue only when the output confirms your intended provider setup.

## 3. Set Up Hosted Database

Recommended beginner path: Supabase PostgreSQL.

### 3.1 Create Supabase Project

Do this:

1. Go to Supabase.
2. Create a new project.
3. Choose a region close to your users.
4. Save the database password in a password manager.

Verify this:

- Supabase project dashboard opens successfully
- project status is active

Continue only when the project is active.

### 3.2 Copy Database Connection String

Do this:

1. In Supabase, open Project Settings.
2. Open Database.
3. Copy the Session Pooler connection string if direct database access fails from your network.
4. Replace the password placeholder with your real password.
5. If your password contains special characters, percent-encode them.

Expected format:

```text
postgresql://postgres.PROJECT_REF:PASSWORD@HOST:5432/postgres
```

Verify this locally:

```sh
DATABASE_URL="your-supabase-connection-string" pnpm --filter @opportunity-os/database migrate:status
```

Expected result:

- if migrations are pending, Prisma lists pending migrations
- if migrations are already applied, Prisma says the database is in sync

Continue only when Prisma can reach the database.

### 3.3 Apply Database Migrations

Do this:

```sh
DATABASE_URL="your-supabase-connection-string" pnpm --filter @opportunity-os/database migrate:deploy
```

Verify this:

```sh
DATABASE_URL="your-supabase-connection-string" pnpm --filter @opportunity-os/database migrate:status
```

Expected result:

```text
Database schema is up to date!
```

Continue only when migrations are applied.

## 4. Set Up Hosted Redis

Recommended beginner path: Upstash Redis.

### 4.1 Create Upstash Redis Database

Do this:

1. Go to Upstash.
2. Create a Redis database.
3. Choose a region close to the API host.
4. Copy the TLS Redis URL.

Expected format:

```text
rediss://default:PASSWORD@HOST:6379
```

Verify this:

Add it to your local `.env`:

```text
REDIS_URL=rediss://...
```

Then run:

```sh
node --env-file=.env -e 'const value = process.env.REDIS_URL || ""; const url = new URL(value); console.log(JSON.stringify({ protocol: url.protocol, host: url.host, configured: Boolean(value) }, null, 2))'
```

Expected result:

```json
{
  "protocol": "rediss:",
  "configured": true
}
```

Continue only when Redis is configured and the command does not print the password.

## 5. Set Up Reddit API Credentials

### 5.1 Create Reddit App

Do this:

1. Log in to Reddit.
2. Open Reddit app preferences.
3. Create an app.
4. Choose app type `script` for local MVP testing.
5. Use a clear name, for example `Opportunity OS External MVP`.
6. Use a safe user agent, for example `OpportunityOS/0.0.0 external-mvp by YOUR_REDDIT_USERNAME`.

Verify this:

- you can see a Reddit client ID
- you can see a Reddit client secret if Reddit provides one for your app type

Continue only when the Reddit app exists.

### 5.2 Add Reddit Values Locally

Do this:

Add these values to `.env`:

```text
REDDIT_PRODUCTION_CLIENT_ID=your-client-id
REDDIT_PRODUCTION_CLIENT_SECRET=your-client-secret-if-used
REDDIT_PRODUCTION_REFRESH_TOKEN=your-refresh-token-if-used
REDDIT_PRODUCTION_USER_AGENT=OpportunityOS/0.0.0 external-mvp by YOUR_REDDIT_USERNAME
REDDIT_LIVE_TEST_ENABLED=true
REDDIT_LIVE_SUBREDDIT=entrepreneur
REDDIT_LIVE_LIMIT=5
```

Verify this without printing secrets:

```sh
node --env-file=.env -e 'console.log(JSON.stringify({ redditClientId: Boolean(process.env.REDDIT_PRODUCTION_CLIENT_ID), redditUserAgent: process.env.REDDIT_PRODUCTION_USER_AGENT, liveEnabled: process.env.REDDIT_LIVE_TEST_ENABLED, subreddit: process.env.REDDIT_LIVE_SUBREDDIT, limit: process.env.REDDIT_LIVE_LIMIT }, null, 2))'
```

Continue only when Reddit values are present.

### 5.3 Run Reddit Live Smoke Test

Do this:

```sh
pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live
```

Verify this:

- command fetches public Reddit data
- command prints safe public post information only
- command does not print access tokens, client secrets, auth headers, or raw provider payloads

Continue only when the Reddit smoke test passes.

## 6. Set Up Live LLM Provider

Use one provider: OpenAI or Gemini.

### 6.1 Gemini Setup

Do this:

Add these values to `.env`:

```text
LLM_LIVE_ANALYSIS_ENABLED=true
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
```

Verify this:

```sh
pnpm --filter @opportunity-os/llm-analysis build
node --env-file=.env packages/llm-analysis/dist/provider/live-smoke.js
```

Expected result:

```text
Live LLM analysis completed with gemini/gemini-2.5-flash.
Output fields: ...
```

Continue only when the Gemini smoke test passes.

### 6.2 OpenAI Setup

Do this only if using OpenAI instead of Gemini:

```text
LLM_LIVE_ANALYSIS_ENABLED=true
LLM_PROVIDER=openai
LLM_MODEL=gpt-4.1-mini
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4.1-mini
```

Verify this:

```sh
pnpm --filter @opportunity-os/llm-analysis build
node --env-file=.env packages/llm-analysis/dist/provider/live-smoke.js
```

Expected result:

```text
Live LLM analysis completed with openai/gpt-4.1-mini.
Output fields: ...
```

Continue only when the OpenAI smoke test passes.

## 7. Run The App Locally Before Hosting

### 7.1 Start Local Services

Do this:

```sh
docker compose up postgres redis
```

Verify this:

- Postgres reports healthy
- Redis reports ready
- keep this terminal window running

Continue only when both services are running.

### 7.2 Start API

Open a second terminal.

Do this:

```sh
cd "/Users/adam/Documents/Adams Project"
pnpm dev:api
```

Verify this:

Open:

```text
http://127.0.0.1:4000/health
```

Expected result:

- JSON health response
- no stack traces
- no secrets

Keep this terminal running.

### 7.3 Start Dashboard

Open a third terminal.

Do this:

```sh
cd "/Users/adam/Documents/Adams Project"
pnpm dev:web
```

Verify this:

Open:

```text
http://127.0.0.1:3000
```

Expected result:

- dashboard loads
- scan form is visible
- no developer-only errors are visible

Keep this terminal running.

### 7.4 Complete Local Product Trial

Do this:

1. Open the dashboard.
2. Enter a subreddit such as `entrepreneur`.
3. Start a scan.
4. Wait for results.
5. Open a ranked opportunity.
6. Review evidence and provenance.
7. Save or dismiss the opportunity.
8. Add feedback ratings.

Verify this:

- ranked opportunities appear
- evidence is visible
- provenance is visible
- feedback works
- no raw provider payloads or secrets are visible

Continue only when the local product journey works.

## 8. Deploy The API

Use your selected API hosting provider.

### 8.1 Configure API Build Settings

Do this in the hosting provider:

- root directory: repository root
- install command: `pnpm install --frozen-lockfile`
- build command: `pnpm --filter @opportunity-os/api build`
- start command: `pnpm --filter @opportunity-os/api start`

Verify this:

- hosting provider can install dependencies
- API build succeeds

Continue only when the API build passes.

### 8.2 Configure API Environment Variables

Do this in the API hosting provider environment settings:

Add:

```text
APP_NAME
NODE_ENV
PORT
DATABASE_URL
REDIS_URL
JWT_SECRET
JWT_EXPIRES_IN
LOG_LEVEL
OTEL_EXPORTER_ENDPOINT
OPPORTUNITY_OS_API_URL
OPPORTUNITY_OS_WEB_URL
LLM_PROVIDER
LLM_MODEL
LLM_LIVE_ANALYSIS_ENABLED
LLM_PROVIDER_TIMEOUT_MS
GEMINI_API_KEY
GEMINI_MODEL
OPENAI_API_KEY
OPENAI_MODEL
REDDIT_PRODUCTION_CLIENT_ID
REDDIT_PRODUCTION_CLIENT_SECRET
REDDIT_PRODUCTION_REFRESH_TOKEN
REDDIT_PRODUCTION_USER_AGENT
```

Important:

- put `DATABASE_URL` only in API environment variables
- put `REDIS_URL` only in API environment variables
- put provider keys only in API environment variables
- do not put secrets in dashboard public variables

Verify this:

- each required variable exists in the hosting dashboard
- secret values are hidden or masked by the provider

Continue only when API env vars are configured.

### 8.3 Deploy API

Do this:

Trigger the API deployment from your hosting provider.

Verify this:

Open:

```text
https://your-api-host/health
```

Expected result:

- safe JSON health response
- no secrets
- no stack traces

Continue only when API health passes.

## 9. Deploy The Dashboard

### 9.1 Configure Web Build Settings

Do this in the web hosting provider:

- root directory: repository root
- install command: `pnpm install --frozen-lockfile`
- build command: `pnpm --filter @opportunity-os/web build`
- output/application: Next.js app in `apps/web`

Verify this:

- hosting provider detects or builds the Next.js app
- web build succeeds

Continue only when the web build passes.

### 9.2 Configure Web Environment Variables

Do this in the web hosting provider environment settings:

Add:

```text
NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL=https://your-api-host
OPPORTUNITY_OS_WEB_URL=https://your-web-host
```

Do not add:

```text
DATABASE_URL
REDIS_URL
OPENAI_API_KEY
GEMINI_API_KEY
REDDIT_PRODUCTION_CLIENT_SECRET
JWT_SECRET
```

Verify this:

- public API base URL points to the hosted API
- no secret variables are configured in the web frontend

Continue only when the web env vars are safe.

### 9.3 Deploy Web

Do this:

Trigger the dashboard deployment from your hosting provider.

Verify this:

Open:

```text
https://your-web-host
```

Expected result:

- dashboard loads
- no build error page
- no stack traces
- no secrets

Continue only when the dashboard loads.

## 10. Run External MVP Smoke Test

### 10.1 API Smoke Test

Do this:

Open:

```text
https://your-api-host/health
```

Verify this:

- health response is visible
- no secrets are visible

Continue only when API health passes.

### 10.2 Dashboard Smoke Test

Do this:

Open:

```text
https://your-web-host
```

Verify this:

- dashboard loads
- scan form is visible
- layout works on desktop and mobile width

Continue only when dashboard smoke passes.

### 10.3 Live Scan Smoke Test

Do this:

1. In the hosted dashboard, enter a subreddit such as `entrepreneur`.
2. Start scan.
3. Wait for scan status to complete.
4. Open a generated opportunity.

Verify this:

- Reddit data is fetched
- normalized evidence appears
- LLM analysis is used when live LLM is enabled
- opportunities are generated
- opportunities are ranked
- evidence and provenance are visible
- feedback can be submitted
- no secrets or raw provider payloads are visible

Continue only when the scan journey works end to end.

## 11. Final Go / No-Go

### Go

Mark deployment as Go only when all are true:

- repository verification passes
- local product trial passes
- database migrations are applied
- Redis is configured
- Reddit live smoke passes
- LLM live smoke passes
- hosted API health passes
- hosted dashboard loads
- hosted dashboard scan flow produces ranked evidence-backed opportunities
- feedback works
- no secrets are visible in logs, UI, or command output

### No-Go

Mark deployment as No-Go if any are true:

- database cannot connect
- migrations fail
- API health fails
- dashboard cannot reach API
- Reddit smoke fails
- LLM smoke fails
- scan does not produce results
- feedback fails
- any secret appears in logs, UI, screenshots, or command output

## 12. Common Problems

### Database Cannot Connect

Try:

- use Supabase Session Pooler instead of direct host
- confirm password is correct
- percent-encode special characters in password
- confirm `DATABASE_URL` is configured in API hosting, not web hosting

Verify again:

```sh
DATABASE_URL="your-database-url" pnpm --filter @opportunity-os/database migrate:status
```

### OpenAI Returns Insufficient Quota

Try:

- add billing or credits in OpenAI
- confirm API key belongs to the billed project
- switch to Gemini if Gemini is configured

Verify again:

```sh
node --env-file=.env packages/llm-analysis/dist/provider/live-smoke.js
```

### Gemini Smoke Test Fails

Try:

- confirm `LLM_PROVIDER=gemini`
- confirm `GEMINI_API_KEY` exists
- confirm `LLM_MODEL=gemini-2.5-flash`
- confirm the key has permission for Gemini API

Verify again:

```sh
node --env-file=.env packages/llm-analysis/dist/provider/live-smoke.js
```

### Reddit App Cannot Be Created

Try:

- verify Reddit email address
- use a browser where Reddit login works
- disable ad blockers temporarily
- try a network where Reddit is reachable
- use app type `script` for local MVP testing

Verify again:

```sh
pnpm --filter @opportunity-os/connectors-reddit dev:reddit:live
```

### Dashboard Cannot Reach API

Try:

- confirm `NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL` points to the hosted API URL
- confirm the API `/health` route works
- redeploy the dashboard after changing environment variables

Verify again:

Open the dashboard and run a scan.

## 13. After Deployment

Do this:

1. Rotate any secrets that were pasted into chat, screenshots, or support tools.
2. Store all secrets in the hosting provider secret manager.
3. Keep `.env` local and ignored.
4. Record deployment date, commit SHA, API URL, web URL, and smoke-test results.

Verify this:

```sh
git status --short --ignored .env
```

Expected result:

```text
!! .env
```

Deployment is complete only when the hosted product can run a real scan and show ranked evidence-backed opportunity candidates without developer assistance.
## Optional Stack Exchange Live Datasource

Do this after the fixture workflow passes and while Reddit access is pending.

1. Add the following to the ignored local `.env` or your hosting provider's encrypted environment variables:

   ```text
   STACK_EXCHANGE_LIVE_SCAN_ENABLED=true
   STACK_EXCHANGE_API_BASE_URL=https://api.stackexchange.com/2.3
   STACK_EXCHANGE_DEFAULT_SITE=stackoverflow
   STACK_EXCHANGE_TIMEOUT_MS=10000
   ```

2. Optionally register a Stack Apps application and configure `STACK_EXCHANGE_API_KEY` for quota isolation. Never commit the key.
3. Run `pnpm --filter @opportunity-os/connectors-stack-exchange dev:stack-exchange:live`.
4. Verify that the command reports a safe item count and does not print request payloads or credentials.
5. Start the API and dashboard, choose Stack Exchange in **Run Opportunity Scan**, select live mode, and confirm evidence links open the original Stack Exchange questions.
