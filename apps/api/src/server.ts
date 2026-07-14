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
import {
  handleCancelScanJobRequest,
  handleCreateRedditScanRequest,
  handleCreateScanJobRequest,
  handleCreateScanRequest,
  handleDeleteScanRequest,
  handleGetScanJobRequest,
  handleGetScanRequest,
  handleListScansRequest,
  handleRetryScanJobRequest
} from "./routes/scans/index.js";
import {
  handleCreateBugReportRequest,
  handleCreateFeedbackRequest,
  handleDeleteFeedbackRequest,
  handleGetFeedbackRequest,
  handleListFeedbackRequest
} from "./routes/feedback/index.js";
import {
  handleAcceptInviteRequest,
  handleCreateInviteRequest,
  handleGetCurrentSessionRequest,
  handleLogoutRequest,
  handleGetSessionRequest
} from "./routes/auth/index.js";
import { createInMemoryScanPersistenceStore, type ApiScanPersistenceStore } from "./persistence/index.js";
import type { ApiFeedbackStore } from "./feedback/index.js";
import type { ApiInviteStore } from "./auth/index.js";
import { createApiProductionRuntime } from "./runtime/index.js";
import { createApiScanJobService } from "./runtime/index.js";
import { createFixedWindowRateLimiter, type FixedWindowRateLimiter } from "./security/index.js";
import type { ApiRequest, ApiResponse } from "./http/index.js";
import { API_ERROR_CODES, createApiError } from "./errors/index.js";
import type { ApiHealthDependencyDto } from "./routes/health/index.js";
import { createApiMetricsRegistry, type ApiMetricsRegistry } from "./operations/index.js";
import { handleGetOperationsRequest } from "./routes/operations/index.js";

export interface LocalApiServerOptions {
  readonly serviceName?: string;
  readonly version?: string;
  readonly environment?: string;
  readonly clock?: () => string;
  readonly scanPersistence?: ApiScanPersistenceStore;
  readonly feedbackStore?: ApiFeedbackStore;
  readonly inviteStore?: ApiInviteStore;
  readonly databaseIsReady?: () => Promise<boolean>;
  readonly allowedOrigin?: string;
  readonly allowedOrigins?: readonly string[];
  readonly healthDependencies?: () => Promise<readonly ApiHealthDependencyDto[]>;
  readonly liveScanAccessToken?: string;
  readonly scanRateLimiter?: FixedWindowRateLimiter;
  readonly requireAuthentication?: boolean;
  readonly adminAccessToken?: string;
  readonly metricsRegistry?: ApiMetricsRegistry;
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
  const inviteStore = options.inviteStore ?? createSyntheticApiInviteStore();
  const scanPersistence = options.scanPersistence ?? createInMemoryScanPersistenceStore();
  const scanRateLimiter = options.scanRateLimiter ?? createFixedWindowRateLimiter({ limit: 10, windowMs: 60_000 });
  const metrics = options.metricsRegistry ?? createApiMetricsRegistry(clock);
  const scanJobService = createApiScanJobService({ persistence: scanPersistence, clock, onTransition: metrics.recordScanTransition });
  void scanJobService.recover();

  const routeTable: readonly {
    readonly method: string;
    readonly path: string;
    readonly handler: LocalApiHandler;
  }[] = [
    {
      method: "GET",
      path: "/auth/session",
      handler: (request) => handleGetCurrentSessionRequest(asHandlerRequest(request), inviteStore)
    },
    {
      method: "POST",
      path: "/auth/logout",
      handler: (request) => handleLogoutRequest(asHandlerRequest(request), inviteStore)
    },
    {
      method: "GET",
      path: "/health",
      handler: async (request) => {
        const databaseReady = options.databaseIsReady ? await options.databaseIsReady() : undefined;
        const configuredDependencies = options.healthDependencies ? await options.healthDependencies() : [];
        return handleApiHealthRequest(request, {
          serviceName,
          version,
          environment,
          clock,
          dependencies: [
            ...(databaseReady === undefined
              ? []
              : [{ name: "database", status: databaseReady ? "ok" as const : "degraded" as const, checkedAt: clock(), safeMessage: databaseReady ? "Database is ready." : "Database is unavailable." }]),
            ...configuredDependencies
          ]
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
      path: "/operations",
      handler: (request) => handleGetOperationsRequest(request, metrics)
    },
    {
      method: "GET",
      path: "/opportunities/:opportunityId",
      handler: (request) => handleGetOpportunityRequest(asHandlerRequest(request), syntheticApiOpportunityPort)
    },
    {
      method: "GET",
      path: "/scans",
      handler: (request) => handleListScansRequest(asHandlerRequest(request), scanPersistence)
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
      method: "DELETE",
      path: "/scans/:scanId",
      handler: (request) => handleDeleteScanRequest(asHandlerRequest(request), scanPersistence)
    },
    {
      method: "POST",
      path: "/scan-jobs",
      handler: (request) => handleCreateScanJobRequest(asHandlerRequest(request), scanJobService)
    },
    {
      method: "GET",
      path: "/scan-jobs/:jobId",
      handler: (request) => handleGetScanJobRequest(asHandlerRequest(request), scanJobService)
    },
    {
      method: "POST",
      path: "/scan-jobs/:jobId/cancel",
      handler: (request) => handleCancelScanJobRequest(asHandlerRequest(request), scanJobService)
    },
    {
      method: "POST",
      path: "/scan-jobs/:jobId/retry",
      handler: (request) => handleRetryScanJobRequest(asHandlerRequest(request), scanJobService)
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
      method: "DELETE",
      path: "/feedback/:feedbackId",
      handler: (request) => handleDeleteFeedbackRequest(asHandlerRequest(request), feedbackStore)
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

    if (options.requireAuthentication && input.method === "POST" && requestUrl.pathname === "/auth/invites") {
      if (!options.adminAccessToken || !safeTokenEquals(input.headers?.["x-opportunity-os-admin-token"], options.adminAccessToken)) {
        return createFailureResponseFromInput(input, requestUrl.pathname, "Administrative access is not authorized.", 401);
      }
    } else if (options.requireAuthentication && requiresSession(input.method, requestUrl.pathname)) {
      const sessionId = input.headers?.["x-opportunity-os-session-id"];
      const session = sessionId ? await inviteStore.getSession(sessionId) : undefined;
      if (!session) {
        return createFailureResponseFromInput(input, requestUrl.pathname, "An active beta session is required.", 401);
      }
    }

    if (input.method === "POST" && (requestUrl.pathname.startsWith("/scans") || requestUrl.pathname.startsWith("/scan-jobs"))) {
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
        sessionId: input.headers?.["x-opportunity-os-session-id"],
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
  const metrics = options.metricsRegistry ?? createApiMetricsRegistry(options.clock);
  const dispatchLocalApiRequest = createLocalApiDispatcher({ ...options, metricsRegistry: metrics });

  return createServer(async (incoming, outgoing) => {
    const startedAt = Date.now();
    applySecurityHeaders(outgoing);
    const originAllowed = applyCorsHeaders(
      outgoing,
      incoming.headers.origin,
      options.allowedOrigins ?? parseAllowedOrigins(options.allowedOrigin)
    );

    if (incoming.method === "OPTIONS") {
      outgoing.writeHead(originAllowed ? 204 : 403);
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
        "x-opportunity-os-access-token": getHeaderValue(incoming, "x-opportunity-os-access-token"),
        "x-opportunity-os-admin-token": getHeaderValue(incoming, "x-opportunity-os-admin-token"),
        "x-opportunity-os-session-id": getHeaderValue(incoming, "x-opportunity-os-session-id") ?? readCookie(incoming, "opportunity_os_session")
      }
    });
    if (requestUrl.pathname === "/auth/invites/accept" && response.ok) {
      const sessionId = (response.data as { session?: { sessionId?: unknown } }).session?.sessionId;
      if (typeof sessionId === "string") {
        outgoing.setHeader("set-cookie", createSessionCookie(sessionId, options.environment === "production"));
      }
    }
    if (requestUrl.pathname === "/auth/logout" && response.ok) {
      outgoing.setHeader("set-cookie", createExpiredSessionCookie(options.environment === "production"));
    }
    writeOperationalLog({
      method: incoming.method ?? "GET",
      path: requestUrl.pathname,
      statusCode: getResponseStatus(response),
      durationMs: Date.now() - startedAt,
      correlationId: response.meta.correlationId
    });
    metrics.recordRequest(getResponseStatus(response), Date.now() - startedAt);
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

export function applySecurityHeaders(response: ServerResponse): void {
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("x-frame-options", "DENY");
  response.setHeader("referrer-policy", "no-referrer");
  response.setHeader("permissions-policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader("content-security-policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  response.setHeader("cache-control", "no-store");
}

export function applyCorsHeaders(response: ServerResponse, requestOrigin: string | undefined, allowedOrigins: readonly string[]): boolean {
  response.setHeader("vary", "Origin");
  const originAllowed = allowedOrigins.length === 0 || requestOrigin === undefined || allowedOrigins.includes(requestOrigin);
  if (originAllowed) {
    response.setHeader("access-control-allow-origin", requestOrigin ?? allowedOrigins[0] ?? "*");
  }
  response.setHeader("access-control-allow-credentials", "true");
  response.setHeader("access-control-allow-methods", "DELETE,GET,POST,OPTIONS");
  response.setHeader("access-control-allow-headers", "content-type,x-correlation-id,x-request-id,x-opportunity-os-access-token,x-opportunity-os-session-id,x-opportunity-os-admin-token");
  return originAllowed;
}

function parseAllowedOrigins(value: string | undefined): readonly string[] {
  return value?.split(",").map((origin) => origin.trim().replace(/\/$/u, "")).filter(Boolean) ?? [];
}

function requiresSession(method: string, pathname: string): boolean {
  if (pathname === "/health" || pathname === "/auth/invites/accept") return false;
  if (method === "POST" && pathname === "/auth/invites") return false;
  return true;
}

function readCookie(request: IncomingMessage, name: string): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return undefined;
}

function createSessionCookie(sessionId: string, secure: boolean): string {
  return [`opportunity_os_session=${encodeURIComponent(sessionId)}`, "HttpOnly", "Path=/", "SameSite=None", "Max-Age=28800", ...(secure ? ["Secure"] : [])].join("; ");
}

function createExpiredSessionCookie(secure: boolean): string {
  return ["opportunity_os_session=", "HttpOnly", "Path=/", "SameSite=None", "Max-Age=0", ...(secure ? ["Secure"] : [])].join("; ");
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
    inviteStore: runtime?.inviteStore,
    databaseIsReady: runtime?.databaseIsReady,
    allowedOrigins: parseAllowedOrigins(process.env.OPPORTUNITY_OS_WEB_ORIGINS ?? process.env.OPPORTUNITY_OS_WEB_URL),
    healthDependencies: async () => createConfiguredHealthDependencies(process.env),
    liveScanAccessToken: process.env.API_LIVE_SCAN_ACCESS_TOKEN,
    requireAuthentication: process.env.API_AUTH_REQUIRED === "true",
    adminAccessToken: process.env.API_ADMIN_ACCESS_TOKEN
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

function createConfiguredHealthDependencies(env: NodeJS.ProcessEnv): readonly ApiHealthDependencyDto[] {
  const checkedAt = new Date().toISOString();
  return [
    {
      name: "redis",
      status: env.REDIS_URL?.trim() ? "ok" : "degraded",
      checkedAt,
      safeMessage: env.REDIS_URL?.trim() ? "Redis configuration is present." : "Redis configuration is unavailable."
    },
    {
      name: "stack-exchange",
      status: env.STACK_EXCHANGE_LIVE_SCAN_ENABLED === "true" ? "ok" : "degraded",
      checkedAt,
      safeMessage: env.STACK_EXCHANGE_LIVE_SCAN_ENABLED === "true" ? "Stack Exchange live scans are enabled." : "Stack Exchange live scans are disabled."
    },
    {
      name: "llm",
      status: env.LLM_LIVE_ANALYSIS_ENABLED === "true" ? "ok" : "degraded",
      checkedAt,
      safeMessage: env.LLM_LIVE_ANALYSIS_ENABLED === "true" ? "Live LLM analysis is enabled." : "Live LLM analysis is disabled."
    }
  ];
}
