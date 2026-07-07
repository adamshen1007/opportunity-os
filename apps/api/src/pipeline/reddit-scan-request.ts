export type ApiRedditScanRequestBody = {
  readonly subreddit?: unknown;
  readonly query?: unknown;
  readonly limit?: unknown;
  readonly mode?: unknown;
};

export type ApiRedditScanRequest = {
  readonly subreddit: string;
  readonly query?: string;
  readonly limit: number;
  readonly mode: "fixture" | "live";
};

export type ApiRedditScanValidationResult =
  | {
      readonly valid: true;
      readonly value: ApiRedditScanRequest;
    }
  | {
      readonly valid: false;
      readonly issues: readonly string[];
    };

const subredditPattern = /^[a-zA-Z0-9_]{2,32}$/u;

function cleanOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseLimit(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return 10;
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 25) return undefined;
  return numeric;
}

export function validateRedditScanRequestBody(
  body: ApiRedditScanRequestBody | undefined
): ApiRedditScanValidationResult {
  const issues: string[] = [];
  const subreddit = cleanOptionalString(body?.subreddit) ?? "opportunity";
  const query = cleanOptionalString(body?.query);
  const limit = parseLimit(body?.limit);
  const mode = body?.mode === "live" ? "live" : "fixture";

  if (!subredditPattern.test(subreddit)) {
    issues.push("subreddit:invalid");
  }

  if (query && query.length > 120) {
    issues.push("query:too-long");
  }

  if (limit === undefined) {
    issues.push("limit:invalid");
  }

  if (issues.length > 0) {
    return {
      valid: false,
      issues
    };
  }

  return {
    valid: true,
    value: {
      subreddit,
      query,
      limit: limit ?? 10,
      mode
    }
  };
}
