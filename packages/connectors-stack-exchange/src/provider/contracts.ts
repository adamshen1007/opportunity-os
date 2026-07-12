export const STACK_EXCHANGE_CONNECTOR_ID = "stack-exchange" as const;
export const STACK_EXCHANGE_DEFAULT_API_BASE_URL = "https://api.stackexchange.com/2.3" as const;
export const STACK_EXCHANGE_DEFAULT_SITE = "stackoverflow" as const;

export type StackExchangeScanMode = "fixture" | "live";

export interface StackExchangeProviderConfig {
  readonly enabled: boolean;
  readonly apiBaseUrl: string;
  readonly apiKey?: string;
  readonly defaultSite: string;
  readonly timeoutMs: number;
}

export interface StackExchangeSearchRequest {
  readonly query: string;
  readonly site?: string;
  readonly tags?: readonly string[];
  readonly page?: number;
  readonly pageSize?: number;
  readonly minimumScore?: number;
}

export interface StackExchangeAuthor {
  readonly id?: string;
  readonly displayName: string;
  readonly profileUrl?: string;
}

export interface StackExchangeQuestion {
  readonly id: string;
  readonly title: string;
  readonly bodyText?: string;
  readonly permalink: string;
  readonly score: number;
  readonly answerCount: number;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt?: string;
  readonly author: StackExchangeAuthor;
  readonly site: string;
}

export interface StackExchangeQuotaMetadata {
  readonly remaining?: number;
  readonly maximum?: number;
  readonly backoffSeconds?: number;
  readonly hasMore: boolean;
}

export interface StackExchangeSearchResult {
  readonly mode: StackExchangeScanMode;
  readonly items: readonly StackExchangeQuestion[];
  readonly quota: StackExchangeQuotaMetadata;
  readonly attribution: {
    readonly sourceName: "Stack Exchange";
    readonly required: true;
  };
}

export interface StackExchangeSafeError {
  readonly code: "configuration-invalid" | "request-failed" | "response-invalid" | "rate-limited";
  readonly message: string;
  readonly retryAfterSeconds?: number;
}

export type StackExchangeProviderResult =
  | { readonly ok: true; readonly result: StackExchangeSearchResult }
  | { readonly ok: false; readonly error: StackExchangeSafeError };
