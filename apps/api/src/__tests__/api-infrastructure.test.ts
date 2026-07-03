import { describe, expect, it } from "vitest";
import {
  API_ERROR_CODES,
  API_HTTP_METHODS,
  API_PAGINATION_DIRECTIONS,
  API_RESPONSE_ENVELOPE_KEYS,
  API_VALIDATION_ISSUE_CODES,
  API_VERSIONS,
  createApiApplication,
  createApiError,
  createApiFailureResponse,
  createApiOpenApiDocument,
  createApiRouteDefinition,
  createApiSuccessResponse,
  createVersionedPath,
  mapUnknownErrorToApiError,
  normalizeApiVersion,
  normalizeRoutePath,
  parseApiFilterQuery,
  parseApiPaginationQuery,
  validateApiFilterFields,
  validateRequiredFields
} from "../index.js";

describe("API infrastructure", () => {
  it("creates deterministic route definitions and router state", () => {
    const route = createApiRouteDefinition({
      method: API_HTTP_METHODS.get,
      path: "opportunities",
      operationId: "listOpportunities",
      summary: "List opportunities",
      tags: ["opportunities"],
      requiresAuthentication: true
    });

    const app = createApiApplication({
      serviceName: "opportunity-api",
      version: "0.0.0",
      routes: [route]
    });

    expect(normalizeRoutePath("//opportunities")).toBe("/opportunities");
    expect(app.status).toBe("configured");
    expect(app.router.routes).toHaveLength(1);
    expect(app.router.duplicateRouteKeys).toEqual([]);
  });

  it("normalizes API versioned paths", () => {
    expect(API_VERSIONS.v1).toBe("v1");
    expect(normalizeApiVersion("/v1")).toBe("v1");
    expect(normalizeApiVersion("v9")).toBeUndefined();
    expect(createVersionedPath("/health")).toBe("/v1/health");
  });

  it("creates OpenAPI path contracts from route definitions", () => {
    const route = createApiRouteDefinition({
      method: API_HTTP_METHODS.post,
      path: "/rankings",
      operationId: "rankOpportunities",
      summary: "Rank opportunities",
      tags: ["rankings"],
      requiresAuthentication: true
    });

    const document = createApiOpenApiDocument({
      title: "Opportunity OS API",
      version: "0.0.0",
      routes: [route]
    });

    expect(document.openapi).toBe("3.1.0");
    expect(document.paths["/v1/rankings"]?.["post"]?.operationId).toBe("rankOpportunities");
  });

  it("creates stable response envelopes", () => {
    const meta = { correlationId: "correlation-1", requestId: "request-1" };

    expect(API_RESPONSE_ENVELOPE_KEYS).toContain("meta");
    expect(createApiSuccessResponse({ ok: true }, meta)).toEqual({
      ok: true,
      data: { ok: true },
      meta
    });

    const error = createApiError({
      code: API_ERROR_CODES.badRequest,
      statusCode: 400,
      message: "Bad request.",
      correlationId: meta.correlationId,
      requestId: meta.requestId
    });

    expect(createApiFailureResponse(error, meta).error.code).toBe(API_ERROR_CODES.badRequest);
  });

  it("maps unknown errors to safe internal API errors", () => {
    const mapped = mapUnknownErrorToApiError({
      error: new Error("database-url=postgres://secret"),
      correlationId: "correlation-1"
    });

    expect(mapped.code).toBe(API_ERROR_CODES.internal);
    expect(mapped.message).toBe("An internal API error occurred.");
    expect(JSON.stringify(mapped)).not.toContain("postgres://secret");
  });

  it("validates required request fields", () => {
    const result = validateRequiredFields({ opportunityId: "" }, [{ field: "opportunityId" }]);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.issues[0]?.code).toBe(API_VALIDATION_ISSUE_CODES.missingRequiredField);
    }
  });

  it("parses pagination deterministically", () => {
    const parsed = parseApiPaginationQuery(
      { limit: "25", cursor: "opaque-cursor", direction: API_PAGINATION_DIRECTIONS.forward },
      { defaultLimit: 10, maxLimit: 100 }
    );

    expect(parsed.valid).toBe(true);
    if (parsed.valid) {
      expect(parsed.value.limit).toBe(25);
      expect(parsed.value.cursor).toBe("opaque-cursor");
    }
  });

  it("validates and parses allowed filters", () => {
    const query = { status: "ranked", unknown: "ignored" };

    expect(validateApiFilterFields(query, ["status"]).valid).toBe(false);
    expect(parseApiFilterQuery(query, ["status"]).filters).toEqual({ status: "ranked" });
  });
});
