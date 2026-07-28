import { fileURLToPath } from "node:url";

const RELEASE_META_NAME = "opportunity-os-release-sha";
const API_META_NAME = "opportunity-os-api-origin";

export async function verifyHostedRelease(input = {}) {
  const env = input.env ?? process.env;
  const fetchImpl = input.fetch ?? fetch;
  const apiUrl = requireHttpsUrl(env.OPPORTUNITY_OS_API_URL, "OPPORTUNITY_OS_API_URL");
  const webUrl = requireHttpsUrl(env.OPPORTUNITY_OS_WEB_URL, "OPPORTUNITY_OS_WEB_URL");
  const expectedReleaseSha = requireReleaseSha(env.OPPORTUNITY_OS_RELEASE_SHA);

  const healthResponse = await safeFetch(fetchImpl, new URL("/health", apiUrl), {
    headers: { origin: webUrl.origin }
  });
  assertSuccessfulCanonicalResponse(healthResponse, apiUrl, "API health check");
  assertHeader(healthResponse, "access-control-allow-origin", webUrl.origin, "API CORS policy");
  const health = readHealthPayload(await healthResponse.json());

  if (health.status !== "ok") {
    throw new Error("API health check did not report an operational release.");
  }
  if (health.releaseSha !== expectedReleaseSha) {
    throw new Error("API release commit does not match OPPORTUNITY_OS_RELEASE_SHA.");
  }
  const database = health.dependencies.find((dependency) => dependency.name === "database");
  if (!database || database.status !== "ok") {
    throw new Error("API health check did not confirm database readiness.");
  }

  const webResponse = await safeFetch(fetchImpl, webUrl);
  assertSuccessfulCanonicalResponse(webResponse, webUrl, "Dashboard check");
  const html = await webResponse.text();
  const webReleaseSha = readMetaContent(html, RELEASE_META_NAME);
  const boundApiOrigin = readMetaContent(html, API_META_NAME);

  if (webReleaseSha !== expectedReleaseSha) {
    throw new Error("Dashboard release commit does not match OPPORTUNITY_OS_RELEASE_SHA.");
  }
  if (normalizeOrigin(boundApiOrigin) !== apiUrl.origin) {
    throw new Error("Dashboard API binding does not match OPPORTUNITY_OS_API_URL.");
  }

  return {
    status: "passed",
    releaseSha: expectedReleaseSha,
    apiHealth: health.status,
    database: database.status,
    cors: "passed",
    redirects: "passed",
    webApiBinding: "passed"
  };
}

export function readHealthPayload(payload) {
  const health = payload?.ok === true ? payload.data : payload;
  if (
    !health ||
    typeof health !== "object" ||
    typeof health.status !== "string" ||
    typeof health.releaseSha !== "string" ||
    !Array.isArray(health.dependencies)
  ) {
    throw new Error("API health response did not match the hosted release contract.");
  }
  return health;
}

export function readMetaContent(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/giu) ?? []) {
    const attributes = Object.fromEntries(
      [...tag.matchAll(/([\w-]+)=["']([^"']*)["']/gu)].map((match) => [match[1]?.toLowerCase(), match[2]])
    );
    if (attributes.name === name && attributes.content) return attributes.content;
  }
  throw new Error(`Dashboard is missing required release metadata: ${name}.`);
}

export function requireReleaseSha(value) {
  const releaseSha = value?.trim().toLowerCase();
  if (!releaseSha || !/^[a-f0-9]{40}$/u.test(releaseSha)) {
    throw new Error("Set OPPORTUNITY_OS_RELEASE_SHA to the full 40-character Git commit SHA.");
  }
  return releaseSha;
}

function requireHttpsUrl(value, name) {
  if (!value?.trim()) throw new Error(`Set ${name} before running hosted release verification.`);
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${name} must use HTTPS.`);
  url.pathname = url.pathname.replace(/\/$/u, "") || "/";
  url.search = "";
  url.hash = "";
  return url;
}

function normalizeOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

async function safeFetch(fetchImpl, url, init = {}) {
  try {
    return await fetchImpl(url, {
      ...init,
      redirect: "follow",
      signal: AbortSignal.timeout(30_000)
    });
  } catch {
    throw new Error("Hosted release endpoint could not be reached safely.");
  }
}

function assertSuccessfulCanonicalResponse(response, expectedUrl, label) {
  if (!response.ok) throw new Error(`${label} failed with HTTP ${response.status}.`);
  const finalUrl = new URL(response.url);
  if (finalUrl.protocol !== "https:" || finalUrl.origin !== expectedUrl.origin) {
    throw new Error(`${label} redirected outside its canonical HTTPS origin.`);
  }
}

function assertHeader(response, name, expected, label) {
  if (response.headers.get(name) !== expected) throw new Error(`${label} did not allow the canonical dashboard origin.`);
}

async function main() {
  try {
    const report = await verifyHostedRelease();
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`Hosted release verification failed: ${error instanceof Error ? error.message : "Unknown safe failure."}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
