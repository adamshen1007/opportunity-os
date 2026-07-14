import { createTransportDashboardApiError, mapDashboardApiError, type DashboardApiError } from "./errors";
import type { DashboardApiErrorResponseBody, DashboardApiResponse } from "./types";

export interface DashboardApiClientOptions {
  readonly baseUrl: string;
  readonly fetch: typeof fetch;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly accessToken?: string;
}

export interface DashboardApiRequestOptions<TBody = unknown> {
  readonly method: "DELETE" | "GET" | "POST";
  readonly path: string;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly body?: TBody;
}

export type DashboardApiResult<TData> =
  | {
      readonly ok: true;
      readonly data: TData;
    }
  | {
      readonly ok: false;
      readonly error: DashboardApiError;
    };

function createDashboardApiUrl(baseUrl: string, path: string, query: DashboardApiRequestOptions["query"]): string {
  const url = new URL(path, baseUrl);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export function createDashboardApiClient(options: DashboardApiClientOptions) {
  async function request<TData, TBody = unknown>(
    requestOptions: DashboardApiRequestOptions<TBody>
  ): Promise<DashboardApiResult<TData>> {
    const response = await options.fetch(createDashboardApiUrl(options.baseUrl, requestOptions.path, requestOptions.query), {
      method: requestOptions.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "x-correlation-id": options.correlationId,
        ...(options.requestId ? { "x-request-id": options.requestId } : {}),
        ...(options.accessToken ? { "x-opportunity-os-access-token": options.accessToken } : {})
      },
      body: requestOptions.body === undefined ? undefined : JSON.stringify(requestOptions.body)
    });

    if (!response.ok) {
      return {
        ok: false,
        error: createTransportDashboardApiError(response.status)
      };
    }

    const envelope = (await response.json()) as DashboardApiResponse<TData, DashboardApiErrorResponseBody>;

    if (!envelope.ok) {
      return {
        ok: false,
        error: mapDashboardApiError(envelope)
      };
    }

    return {
      ok: true,
      data: envelope.data
    };
  }

  return {
    request
  } as const;
}
