import { randomUUID, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";
import {
  createSyntheticApiBugReportStore,
  createSyntheticApiFeedbackStore,
  createSyntheticApiInviteStore,
  syntheticApiOpportunityPort,
  syntheticApiRankingPort
} from "./testing/index.js";
import { handleApiHealthRequest } from "./routes/health/index.js";
import {
  handleGetOpportunityRequest,
  handleListOpportunitiesRequest
} from "./routes/opportunities/index.js";
import {
  handleGetRankingRequest,
  handleRankOpportunitiesRequest
} from "./routes/rankings/index.js";
import { handleCreateRedditScanRequest, handleCreateScanRequest, handleGetScanRequest } from "./routes/scans/index.js";
import {
  handleCreateBugReportRequest,
  handleCreateFeedbackRequest,
  handleGetFeedbackRequest,
  handleListFeedbackRequest
} from "./routes/feedback/index.js";
import {
  handleAcceptInviteRequest,
  handleCreateInviteRequest,
  handleGetSessionRequest
} from "./routes/auth/index.js";
import { createInMemoryScanPersistenceStore, type ApiScanPersistenceStore } from "./persistence/index.js";
import type { ApiFeedbackStore } from "./feedback/index.js";
import { createApiProductionRuntime } from "./runtime/index.js";
import { createFixedWindowRateLimiter, type FixedWindowRateLimiter } from "./security/index.js";
import type { ApiRequest, ApiResponse } from "./http/index.js";
import { API_ERROR_CODES, createApiError } from "./errors/index.js";

export interface LocalApiServerOptions {
  readonly serviceName?: string;
  readonly version?: string;
  readonly environment?: string;
  readonly clock?: () => string;
  readonly scanPersistence?: ApiScanPersistenceStore;
  readonly feedbackStore?: ApiFeedbackStore;
  readonly databaseIsReady?: () => Promise<boolean>;
  readonly allowedOrigin?: string;
  readonly liveScanAccessToken?: string;
  readonly scanRateLimiter?: FixedWindowRateLimiter;
}

export interface LocalApiDispatchInput {
  readonly method: string;
  readonly path: string;
  readonly query?: Readonly<Record<string, string>>;
  readonly body?: unknown;
  readonly headers?: Readonly<Record<string, string | undefined>>;
}

interface LocalRouteMatch {
  readonly params: Readonly<Record<string, string>>;
}

type LocalApiResponse = ApiResponse<unknown, ReturnType<typeof createApiError>>;
type LocalApiHandler = (request: ApiRequest<unknown, Record<string, string>, Record<string, string>>) => Promise<unknown> | unknown;

const DEFAULT_SERVICE_NAME = "opportunity-os-api";
const DEFAULT_VERSION = "local";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4000;

export function createLocalApiDispatcher(options: LocalApiServerOptions = {}) {
  const serviceName = options.serviceName ?? DEFAULT_SERVICE_NAME;
  const version = options.version ?? DEFAULT_VERSION;
  const environment = options.environment ?? "local";
  const clock = options.clock ?? (() => new Date().toISOString());
  const feedbackStore = options.feedbackStore ?? createSyntheticApiFeedbackStore();
  const bugReportStore = createSyntheticApiBugReportStore();
  const inviteStore = createSyntheticApiInviteStore();
  const scanPersistence = options.scanPersistence ?? createInMemoryScanPersistenceStore();
  const scanRateLimiter = options.scanRateLimiter ?? createFixedWindowRateLimiter({ limit: 10, windowMs: 60_000 });

  const routeTable: readonly {
    readonly method: string;
    readonly path: string;
    readonly handler: LocalApiHandler;
  }[] = [
    {
      method: "GET",
      path: "/health",
      handler: async (request) => {
        const databaseReady = options.databaseIsReady ? await options.databaseIsReady() : undefined;
        return handleApiHealthRequest(request, {
          serviceName,
          version,
          environment,
          clock,
          dependencies: databaseReady === undefined
            ? []
            : [{ name: "database", status: databaseReady ? "ok" : "degraded", checkedAt: clock(), safeMessage: databaseReady ? "Database is ready." : "Database is unavailable." }]
        });
      }
    },
    {
      method: "GET",
      path: "/opportunities",
      handler: (request) => handleListOpportunitiesRequest(asHandlerRequest(request), syntheticApiOpportunityPort)
    },
    {
      method: "GET",
      path: "/opportunities/:opportunityId",
      handler: (request) => handleGetOpportunityRequest(asHandlerRequest(request), syntheticApiOpportunityPort)
    },
    {
      method: "POST",
      path: "/scans",
      handler: (request) => handleCreateScanRequest(asHandlerRequest(request), scanPersistence)
    },
    {
      method: "GET",
      path: "/scans/:scanId",
      handler: (request) => handleGetScanRequest(asHandlerRequest(request), scanPersistence)
    },
    {
      method: "POST",
      path: "/rankings",
      handler: (request) => handleRankOpportunitiesRequest(asHandlerRequest(request), syntheticApiRankingPort)
    },
    {
      method: "POST",
      path: "/scans/reddit",
      handler: (request) => handleCreateRedditScanRequest(asHandlerRequest(request), scanPersistence)
    },
    {
      method: "GET",
      path: "/rankings/:rankingId",
      handler: (request) => handleGetRankingRequest(asHandlerRequest(request), syntheticApiRankingPort)
    },
    {
      method: "POST",
      path: "/feedback",
      handler: (request) =>
        handleCreateFeedbackRequest(asHandlerRequest(request), feedbackStore, {
          resolveOpportunityRecordId: (opportunityId) => scanPersistence.resolveOpportunityRecordId(opportunityId)
        })
    },
    {
      method: "GET",
      path: "/feedback",
      handler: (request) => handleListFeedbackRequest(asHandlerRequest(request), feedbackStore)
    },
    {
      method: "POST",
      path: "/feedback/bug-reports",
      handler: (request) => handleCreateBugReportRequest(asHandlerRequest(request), bugReportStore)
    },
    {
      method: "GET",
      path: "/feedback/:feedbackId",
      handler: (request) => handleGetFeedbackRequest(asHandlerRequest(request), feedbackStore)
    },
    {
      method: "POST",
      path: "/auth/invites",
      handler: (request) => handleCreateInviteRequest(asHandlerRequest(request), inviteStore)
    },
    {
      method: "POST",
      path: "/auth/invites/accept",
      handler: (request) => handleAcceptInviteRequest(asHandlerRequest(request), inviteStore)
    },
    {
      method: "GET",
      path: "/auth/sessions/:sessionId",
      handler: (request) => handleGetSessionRequest(asHandlerRequest(request), inviteStore)
    }
  ];

  return async function dispatchLocalApiRequest(input: LocalApiDispatchInput): Promise<LocalApiResponse> {
    const requestUrl = new URL(input.path, "http://local.opportunity-os");
    for (const [key, value] of Object.entries(input.query ?? {})) {
      requestUrl.searchParams.set(key, value);
    }

    const route = routeTable
      .map((candidate) => ({ candidate, match: matchRoute(candidate.path, requestUrl.pathname) }))
      .find((candidate) => candidate.candidate.method === input.method && candidate.match !== undefined);

    if (!route?.match) {
      return createFailureResponseFromInput(input, requestUrl.pathname, "Route was not found.", 404);
    }

    if (input.method === "POST" && requestUrl.pathname.startsWith("/scans")) {
      const rate = scanRateLimiter.consume(input.headers?.["x-forwarded-for"] ?? input.headers?.["x-request-id"] ?? "anonymous");
      if (!rate.allowed) {
        return createFailureResponseFromInput(input, requestUrl.pathname, "Scan rate limit exceeded. Try again shortly.", 429);
      }
      const requestedMode = input.body && typeof input.body === "object" && "mode" in input.body
        ? (input.body as { mode?: unknown }).mode
        : undefined;
      if (requestedMode === "live" && options.liveScanAccessToken && !safeTokenEquals(
        input.headers?.["x-opportunity-os-access-token"],
        options.liveScanAccessToken
      )) {
        return createFailureResponseFromInput(input, requestUrl.pathname, "Live scan access is not authorized.", 401);
      }
    }

    const request: ApiRequest<unknown, Record<string, string>, Record<string, string>> = {
      context: {
        correlationId: input.headers?.["x-correlation-id"] ?? randomUUID(),
        requestId: input.headers?.["x-request-id"],
        method: input.method,
        path: requestUrl.pathname
      },
      body: input.body,
      query: Object.fromEntries(requestUrl.searchParams.entries()),
      params: route.match.params
    };

    try {
      return (await route.candidate.handler(request)) as LocalApiResponse;
    } catch {
      return createFailureResponseFromInput(input, requestUrl.pathname, "Local API request failed.", 500);
    }
  };
}

export function createLocalApiServer(options: LocalApiServerOptions = {}): Server {
  const dispatchLocalApiRequest = createLocalApiDispatcher(options);

  return createServer(async (incoming, outgoing) => {
    const startedAt = Date.now();
    applyCorsHeaders(outgoing, incoming.headers.origin, options.allowedOrigin);

    if (incoming.method === "OPTIONS") {
      outgoing.writeHead(204);
      outgoing.end();
      return;
    }

    const requestUrl = createRequestUrl(incoming);
    let body: unknown;

    try {
      body = await readRequestBody(incoming);
    } catch {
      const response = createFailureResponseFromInput(
        {
          method: incoming.method ?? "GET",
          path: requestUrl.pathname,
          headers: {
            "x-correlation-id": getHeaderValue(incoming, "x-correlation-id"),
            "x-request-id": getHeaderValue(incoming, "x-request-id"),
            "x-forwarded-for": getHeaderValue(incoming, "x-forwarded-for"),
            "x-opportunity-os-access-token": getHeaderValue(incoming, "x-opportunity-os-access-token")
          }
        },
        requestUrl.pathname,
        "Request body must be valid JSON.",
        400
      );
      writeJson(outgoing, getResponseStatus(response), response);
      return;
    }

    const response = await dispatchLocalApiRequest({
      method: incoming.method ?? "GET",
      path: requestUrl.pathname,
      query: Object.fromEntries(requestUrl.searchParams.entries()),
      body,
      headers: {
        "x-correlation-id": getHeaderValue(incoming, "x-correlation-id"),
        "x-request-id": getHeaderValue(incoming, "x-request-id"),
        "x-forwarded-for": getHeaderValue(incoming, "x-forwarded-for"),
        "x-opportunity-os-access-token": getHeaderValue(incoming, "x-opportunity-os-access-token")
      }
    });
    writeOperationalLog({
      method: incoming.method ?? "GET",
      path: requestUrl.pathname,
      statusCode: getResponseStatus(response),
      durationMs: Date.now() - startedAt,
      correlationId: response.meta.correlationId
    });
    writeJson(outgoing, getResponseStatus(response), response);
  });
}

export function startLocalApiServer(options: LocalApiServerOptions & { readonly port?: number; readonly host?: string } = {}) {
  const host = options.host ?? process.env.HOST ?? DEFAULT_HOST;
  const port = options.port ?? parsePort(process.env.PORT) ?? DEFAULT_PORT;
  const server = createLocalApiServer(options);

  server.listen(port, host, () => {
    process.stdout.write(`Opportunity OS API listening at http://${host}:${port}\n`);
  });

  return server;
}

function createRequestUrl(request: IncomingMessage): URL {
  return new URL(request.url ?? "/", "http://local.opportunity-os");
}

function getHeaderValue(request: IncomingMessage, headerName: string): string | undefined {
  const value = request.headers[headerName];
  return Array.isArray(value) ? value[0] : value;
}

function asHandlerRequest(request: ApiRequest<unknown, Record<string, string>, Record<string, string>>): never {
  return request as never;
}

async function readRequestBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 256 * 1024) {
      throw new Error("Request body is too large.");
    }
    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (rawBody.length === 0) {
    return undefined;
  }

  return JSON.parse(rawBody) as unknown;
}

function matchRoute(pattern: string, pathname: string): LocalRouteMatch | undefined {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) {
    return undefined;
  }

  const params: Record<string, string> = {};
  for (const [index, patternPart] of patternParts.entries()) {
    const pathPart = pathParts[index];
    if (pathPart === undefined) {
      return undefined;
    }

    if (patternPart.startsWith(":")) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) {
      return undefined;
    }
  }

  return { params };
}

function getResponseStatus(response: LocalApiResponse): number {
  if (response.ok) {
    return 200;
  }

  return response.error.statusCode;
}

function createFailureResponseFromInput(
  input: LocalApiDispatchInput,
  path: string,
  message: string,
  statusCode: number
): LocalApiResponse {
  const correlationId = input.headers?.["x-correlation-id"] ?? randomUUID();
  const requestId = input.headers?.["x-request-id"];

  return {
    ok: false,
    error: createApiError({
      code:
        statusCode === 404
          ? API_ERROR_CODES.notFound
          : statusCode === 401
            ? API_ERROR_CODES.unauthorized
            : statusCode === 429
              ? API_ERROR_CODES.forbidden
          : statusCode === 400
            ? API_ERROR_CODES.badRequest
            : API_ERROR_CODES.internal,
      statusCode,
      message,
      correlationId,
      requestId,
      details: [`path:${path}`]
    }),
    meta: {
      correlationId,
      requestId
    }
  };
}

function writeJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(body));
}

function applyCorsHeaders(response: ServerResponse, requestOrigin: string | undefined, allowedOrigin?: string): void {
  if (!allowedOrigin || requestOrigin === allowedOrigin) {
    response.setHeader("access-control-allow-origin", allowedOrigin ?? "*");
  }
  response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  response.setHeader("access-control-allow-headers", "content-type,x-correlation-id,x-request-id,x-opportunity-os-access-token");
}

function safeTokenEquals(provided: string | undefined, expected: string): boolean {
  if (!provided) return false;
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function writeOperationalLog(input: {
  readonly method: string;
  readonly path: string;
  readonly statusCode: number;
  readonly durationMs: number;
  readonly correlationId: string;
}): void {
  process.stdout.write(`${JSON.stringify({
    timestamp: new Date().toISOString(),
    service: "opportunity-os-api",
    severity: input.statusCode >= 500 ? "error" : input.statusCode >= 400 ? "warn" : "info",
    eventName: "api.request.completed",
    ...input
  })}\n`);
}

function parsePort(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function isDirectExecution(moduleUrl: string): boolean {
  return process.argv[1] === fileURLToPath(moduleUrl);
}

if (isDirectExecution(import.meta.url)) {
  void startConfiguredApiServer();
}

async function startConfiguredApiServer(): Promise<void> {
  const useDatabase = process.env.API_PERSISTENCE_MODE === "database";
  const runtime = useDatabase ? await createApiProductionRuntime() : undefined;
  const server = startLocalApiServer({
    environment: process.env.NODE_ENV,
    scanPersistence: runtime?.scanPersistence,
    feedbackStore: runtime?.feedbackStore,
    databaseIsReady: runtime?.databaseIsReady,
    allowedOrigin: process.env.OPPORTUNITY_OS_WEB_URL,
    liveScanAccessToken: process.env.API_LIVE_SCAN_ACCESS_TOKEN
  });

  const shutdown = async () => {
    server.close(async () => {
      await runtime?.close();
      process.exitCode = 0;
    });
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}
