const apiUrl = process.env.OPPORTUNITY_OS_API_URL?.replace(/\/$/u, "");
const webUrl = process.env.OPPORTUNITY_OS_WEB_URL?.replace(/\/$/u, "");
const accessToken = process.env.API_LIVE_SCAN_ACCESS_TOKEN;

if (!apiUrl || !webUrl) {
  console.error("Set OPPORTUNITY_OS_API_URL and OPPORTUNITY_OS_WEB_URL before running the external smoke test.");
  process.exit(1);
}

const health = await safeFetch(`${apiUrl}/health`);
assertOk(health, "API health check");

const web = await safeFetch(webUrl);
assertOk(web, "dashboard check");

const scan = await safeFetch(`${apiUrl}/scans`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    ...(accessToken ? { "x-opportunity-os-access-token": accessToken } : {})
  },
  body: JSON.stringify({
    source: "stack-exchange",
    site: "stackoverflow",
    query: process.env.EXTERNAL_SMOKE_QUERY ?? "manual deployment process",
    limit: 3,
    mode: process.env.EXTERNAL_SMOKE_LIVE === "true" ? "live" : "fixture"
  })
});
assertOk(scan, "scan check");
const payload = await scan.json();
if (!payload?.ok || !Array.isArray(payload?.data?.opportunities) || payload.data.opportunities.length === 0) {
  throw new Error("External scan did not return safe opportunity results.");
}

console.log(JSON.stringify({
  status: "passed",
  health: health.status,
  dashboard: web.status,
  scanMode: payload.data.mode,
  opportunities: payload.data.opportunities.length
}, null, 2));

async function safeFetch(url, init) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(30_000) });
  } catch {
    throw new Error("External service could not be reached safely.");
  }
}

function assertOk(response, label) {
  if (!response.ok) throw new Error(`${label} failed with HTTP ${response.status}.`);
}
