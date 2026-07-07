import type {
  RedditHttpTransport,
  RedditTransportHeader,
  RedditTransportRequest,
  RedditTransportResponseMetadata,
  RedditTransportResult
} from "./transport.js";

export type RedditFetchLike = (
  input: string,
  init: {
    readonly method: string;
    readonly headers: Record<string, string>;
    readonly body?: BodyInit;
    readonly signal?: AbortSignal;
  }
) => Promise<Response>;

export type RedditLiveHttpTransportInput = {
  readonly fetch?: RedditFetchLike;
  readonly now?: () => string;
};

export type RedditLiveHttpTransport = RedditHttpTransport & {
  readonly kind: "reddit-live-http-transport";
};

function headersToRecord(headers: readonly RedditTransportHeader[] | undefined): Record<string, string> {
  const output: Record<string, string> = {};

  for (const header of headers ?? []) {
    output[header.name] = header.value;
  }

  return output;
}

function responseHeaders(response: Response): readonly RedditTransportHeader[] {
  return Array.from(response.headers.entries()).map(([name, value]) => ({
    name,
    value
  }));
}

function metadata(
  response: Response,
  receivedAt: string,
  durationMs: number
): RedditTransportResponseMetadata {
  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders(response),
    receivedAt,
    durationMs,
    safeSource: "reddit-live-provider"
  };
}

async function parseBody<TBody>(response: Response): Promise<TBody> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as TBody;
  }

  return (await response.text()) as TBody;
}

export function createRedditLiveHttpTransport(
  input: RedditLiveHttpTransportInput = {}
): RedditLiveHttpTransport {
  const fetchImplementation = input.fetch ?? fetch;
  const now = input.now ?? (() => new Date().toISOString());

  return {
    kind: "reddit-live-http-transport",
    send: async <TBody = unknown>(
      request: RedditTransportRequest
    ): Promise<RedditTransportResult<TBody>> => {
      const startedAt = Date.now();
      const abortController = request.timeoutMs ? new AbortController() : undefined;
      const timeout = request.timeoutMs
        ? setTimeout(() => abortController?.abort(), request.timeoutMs)
        : undefined;

      if (request.cancellationSignal?.cancelled) {
        return {
          ok: false,
          safeMessage: "Reddit provider request was cancelled before execution.",
          metadata: {
            status: 0,
            receivedAt: now(),
            durationMs: 0,
            safeSource: "reddit-live-provider"
          }
        };
      }

      try {
        const response = await fetchImplementation(request.url, {
          method: request.method,
          headers: headersToRecord(request.headers),
          body: typeof request.body === "string" ? request.body : undefined,
          signal: abortController?.signal
        });
        const receivedAt = now();
        const responseMetadata = metadata(response, receivedAt, Date.now() - startedAt);

        if (!response.ok) {
          return {
            ok: false,
            safeMessage: `Reddit provider request failed with HTTP status ${response.status}.`,
            metadata: responseMetadata
          };
        }

        return {
          ok: true,
          response: {
            body: await parseBody<TBody>(response),
            metadata: responseMetadata
          }
        };
      } catch (error) {
        return {
          ok: false,
          safeMessage:
            error instanceof DOMException && error.name === "AbortError"
              ? "Reddit provider request timed out before a safe response was received."
              : "Reddit provider request failed before a safe response was received.",
          metadata: {
            status: 0,
            receivedAt: now(),
            durationMs: Date.now() - startedAt,
            safeSource: "reddit-live-provider"
          }
        };
      } finally {
        if (timeout) clearTimeout(timeout);
      }
    }
  };
}
