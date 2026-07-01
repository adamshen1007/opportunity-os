export const REDDIT_HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
] as const;

export type RedditHttpMethod = (typeof REDDIT_HTTP_METHODS)[number];

export type RedditTransportHeader = {
  readonly name: string;
  readonly value: string;
  readonly sensitive?: boolean;
};

export type RedditTransportCancellationSignal = {
  readonly cancelled: boolean;
  readonly reason?: string;
};

export type RedditTransportRequest = {
  readonly method: RedditHttpMethod;
  readonly url: string;
  readonly headers?: readonly RedditTransportHeader[];
  readonly body?: unknown;
  readonly timeoutMs?: number;
  readonly cancellationSignal?: RedditTransportCancellationSignal;
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
};

export type RedditTransportResponseMetadata = {
  readonly status: number;
  readonly statusText?: string;
  readonly headers?: readonly RedditTransportHeader[];
  readonly receivedAt?: string;
  readonly durationMs?: number;
  readonly safeSource?: string;
};

export type RedditTransportResponse<TBody = unknown> = {
  readonly body: TBody;
  readonly metadata: RedditTransportResponseMetadata;
};

export type RedditTransportFailure = {
  readonly ok: false;
  readonly safeMessage: string;
  readonly metadata?: RedditTransportResponseMetadata;
};

export type RedditTransportResult<TBody = unknown> =
  | {
      readonly ok: true;
      readonly response: RedditTransportResponse<TBody>;
    }
  | RedditTransportFailure;

export type RedditHttpTransport = {
  readonly send: <TBody = unknown>(
    request: RedditTransportRequest
  ) => Promise<RedditTransportResult<TBody>> | RedditTransportResult<TBody>;
};
