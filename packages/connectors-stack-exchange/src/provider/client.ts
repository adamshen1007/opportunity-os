import type {
  StackExchangeProviderConfig,
  StackExchangeProviderResult,
  StackExchangeQuestion,
  StackExchangeSearchRequest
} from "./contracts.js";
import { STACK_EXCHANGE_FIXTURE_RESULT } from "./fixtures.js";

type FetchLike = typeof fetch;

interface ProviderQuestion {
  readonly question_id?: number;
  readonly title?: string;
  readonly body_markdown?: string;
  readonly link?: string;
  readonly score?: number;
  readonly answer_count?: number;
  readonly tags?: readonly string[];
  readonly creation_date?: number;
  readonly last_activity_date?: number;
  readonly owner?: {
    readonly user_id?: number;
    readonly display_name?: string;
    readonly link?: string;
  };
}

interface ProviderResponse {
  readonly items?: readonly ProviderQuestion[];
  readonly has_more?: boolean;
  readonly quota_remaining?: number;
  readonly quota_max?: number;
  readonly backoff?: number;
}

const unsafePattern = /api[_-]?key|access[_-]?token|authorization|bearer|password|secret|stack trace|raw cause/iu;

export function buildStackExchangeSearchUrl(
  config: StackExchangeProviderConfig,
  request: StackExchangeSearchRequest
): URL {
  const url = new URL(`${config.apiBaseUrl.replace(/\/$/u, "")}/search/advanced`);
  url.searchParams.set("site", request.site ?? config.defaultSite);
  url.searchParams.set("q", request.query.trim());
  url.searchParams.set("page", String(request.page ?? 1));
  url.searchParams.set("pagesize", String(Math.min(Math.max(request.pageSize ?? 10, 1), 25)));
  url.searchParams.set("sort", "relevance");
  url.searchParams.set("filter", "withbody");
  if (request.tags?.length) url.searchParams.set("tagged", request.tags.slice(0, 5).join(";"));
  if (request.minimumScore !== undefined) url.searchParams.set("min", String(request.minimumScore));
  return url;
}

export async function searchStackExchange(input: {
  readonly config: StackExchangeProviderConfig;
  readonly request: StackExchangeSearchRequest;
  readonly fetch?: FetchLike;
}): Promise<StackExchangeProviderResult> {
  if (!input.config.enabled) {
    return { ok: true, result: STACK_EXCHANGE_FIXTURE_RESULT };
  }
  if (!input.request.query.trim()) {
    return { ok: false, error: { code: "configuration-invalid", message: "A search query is required." } };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.config.timeoutMs);
  try {
    const response = await (input.fetch ?? fetch)(buildStackExchangeSearchUrl(input.config, input.request), {
      headers: {
        Accept: "application/json",
        "User-Agent": "OpportunityOS/1.0",
        ...(input.config.apiKey ? { Authorization: `Bearer ${input.config.apiKey}` } : {})
      },
      signal: controller.signal
    });
    if (!response.ok) {
      return {
        ok: false,
        error: {
          code: response.status === 429 ? "rate-limited" : "request-failed",
          message: "Stack Exchange request was not successful."
        }
      };
    }
    const payload = (await response.json()) as ProviderResponse;
    if (!Array.isArray(payload.items)) {
      return { ok: false, error: { code: "response-invalid", message: "Stack Exchange returned an invalid response." } };
    }
    const items = payload.items.map((item) => mapQuestion(item, input.request.site ?? input.config.defaultSite));
    const result = {
      mode: "live" as const,
      items,
      quota: {
        remaining: payload.quota_remaining,
        maximum: payload.quota_max,
        backoffSeconds: payload.backoff,
        hasMore: payload.has_more === true
      },
      attribution: { sourceName: "Stack Exchange" as const, required: true as const }
    };
    if (unsafePattern.test(JSON.stringify(result))) {
      return { ok: false, error: { code: "response-invalid", message: "Provider output could not be safely normalized." } };
    }
    return { ok: true, result };
  } catch {
    return { ok: false, error: { code: "request-failed", message: "Stack Exchange request failed safely." } };
  } finally {
    clearTimeout(timeout);
  }
}

function mapQuestion(item: ProviderQuestion, site: string): StackExchangeQuestion {
  if (!Number.isInteger(item.question_id) || !item.title || !item.link || !item.creation_date) {
    throw new Error("Invalid Stack Exchange question shape.");
  }
  return {
    id: String(item.question_id),
    title: decodeEntities(item.title),
    bodyText: item.body_markdown,
    permalink: item.link,
    score: item.score ?? 0,
    answerCount: item.answer_count ?? 0,
    tags: item.tags ?? [],
    createdAt: new Date(item.creation_date * 1000).toISOString(),
    updatedAt: item.last_activity_date ? new Date(item.last_activity_date * 1000).toISOString() : undefined,
    author: {
      id: item.owner?.user_id ? String(item.owner.user_id) : undefined,
      displayName: decodeEntities(item.owner?.display_name ?? "Unknown contributor"),
      profileUrl: item.owner?.link
    },
    site
  };
}

function decodeEntities(value: string): string {
  return value.replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&amp;/gu, "&").replace(/&lt;/gu, "<").replace(/&gt;/gu, ">");
}
