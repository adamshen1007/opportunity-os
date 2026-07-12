import { API_SCAN_SOURCES, type ApiScanSource } from "./scan-pipeline-dto.js";

export type ApiScanRequestBody = {
  readonly source?: unknown;
  readonly subreddit?: unknown;
  readonly site?: unknown;
  readonly query?: unknown;
  readonly tags?: unknown;
  readonly limit?: unknown;
  readonly mode?: unknown;
};

export type ApiScanRequest = {
  readonly source: ApiScanSource;
  readonly subreddit?: string;
  readonly site?: string;
  readonly query: string;
  readonly tags: readonly string[];
  readonly limit: number;
  readonly mode: "fixture" | "live";
};

export type ApiScanValidationResult =
  | { readonly valid: true; readonly value: ApiScanRequest }
  | { readonly valid: false; readonly issues: readonly string[] };

const communityPattern = /^[a-zA-Z0-9_.-]{2,64}$/u;

export function validateScanRequestBody(body: ApiScanRequestBody | undefined): ApiScanValidationResult {
  const issues: string[] = [];
  const source = body?.source === API_SCAN_SOURCES.stackExchange
    ? API_SCAN_SOURCES.stackExchange
    : body?.source === undefined || body?.source === API_SCAN_SOURCES.reddit
      ? API_SCAN_SOURCES.reddit
      : undefined;
  const subreddit = cleanString(body?.subreddit) ?? (source === API_SCAN_SOURCES.reddit ? "opportunity" : undefined);
  const site = cleanString(body?.site) ?? (source === API_SCAN_SOURCES.stackExchange ? "stackoverflow" : undefined);
  const query = cleanString(body?.query) ?? "manual review";
  const tags = parseTags(body?.tags);
  const limit = parseLimit(body?.limit);

  if (!source) issues.push("source:invalid");
  if (source === API_SCAN_SOURCES.reddit && (!subreddit || !communityPattern.test(subreddit))) issues.push("subreddit:invalid");
  if (source === API_SCAN_SOURCES.stackExchange && (!site || !communityPattern.test(site))) issues.push("site:invalid");
  if (query.length > 160) issues.push("query:too-long");
  if (tags === undefined) issues.push("tags:invalid");
  if (limit === undefined) issues.push("limit:invalid");

  if (issues.length) return { valid: false, issues };
  return {
    valid: true,
    value: {
      source: source ?? API_SCAN_SOURCES.reddit,
      subreddit,
      site,
      query,
      tags: tags ?? [],
      limit: limit ?? 10,
      mode: body?.mode === "live" ? "live" : "fixture"
    }
  };
}

function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function parseTags(value: unknown): readonly string[] | undefined {
  if (value === undefined || value === null || value === "") return [];
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : undefined;
  if (!values || values.some((item) => typeof item !== "string")) return undefined;
  const tags = values.map((item) => item.trim()).filter(Boolean);
  if (tags.length > 5 || tags.some((tag) => tag.length > 35)) return undefined;
  return tags;
}

function parseLimit(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return 10;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 25 ? number : undefined;
}
