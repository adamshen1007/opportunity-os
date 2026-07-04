import { describe, expect, it } from "vitest";
import {
  API_AUTH_FAILURE_REASONS,
  API_AUTH_STATES,
  API_AUTHORIZATION_DECISIONS,
  API_ERROR_CODES,
  API_CREATE_FEEDBACK_ROUTE,
  API_FEEDBACK_RATING_TARGETS,
  API_FEEDBACK_RATING_VALUES,
  API_FEEDBACK_REASON_CATEGORIES,
  API_FEEDBACK_STATUSES,
  API_GET_FEEDBACK_ROUTE,
  API_GET_OPPORTUNITY_ROUTE,
  API_GET_RANKING_ROUTE,
  API_HEALTH_ROUTE,
  API_HTTP_METHODS,
  API_LIST_OPPORTUNITIES_ROUTE,
  API_LIST_FEEDBACK_ROUTE,
  API_OPPORTUNITY_FILTER_FIELDS,
  API_OPPORTUNITY_STATUSES,
  API_RANK_OPPORTUNITIES_ROUTE,
  API_RESPONSE_ENVELOPE_KEYS,
  API_VALIDATION_ISSUE_CODES,
  API_VERSIONS,
  syntheticApiOpportunity,
  syntheticApiFeedback,
  syntheticApiRanking
} from "../index.js";

describe("API contract stability", () => {
  it("locks public route operations", () => {
    expect([
      API_HEALTH_ROUTE.operationId,
      API_LIST_OPPORTUNITIES_ROUTE.operationId,
      API_GET_OPPORTUNITY_ROUTE.operationId,
      API_RANK_OPPORTUNITIES_ROUTE.operationId,
      API_GET_RANKING_ROUTE.operationId,
      API_CREATE_FEEDBACK_ROUTE.operationId,
      API_LIST_FEEDBACK_ROUTE.operationId,
      API_GET_FEEDBACK_ROUTE.operationId
    ]).toEqual([
      "getHealth",
      "listOpportunities",
      "getOpportunity",
      "rankOpportunities",
      "getRanking",
      "createFeedback",
      "listFeedback",
      "getFeedback"
    ]);
  });

  it("locks stable vocabulary values", () => {
    expect(Object.values(API_HTTP_METHODS)).toEqual(["DELETE", "GET", "PATCH", "POST", "PUT"]);
    expect(Object.values(API_VERSIONS)).toEqual(["v1"]);
    expect(Object.values(API_AUTH_STATES)).toEqual(["anonymous", "authenticated", "invalid"]);
    expect(Object.values(API_AUTHORIZATION_DECISIONS)).toEqual(["allowed", "denied"]);
    expect(Object.values(API_AUTH_FAILURE_REASONS)).toEqual([
      "invalid_credentials",
      "missing_credentials",
      "unsupported_credentials"
    ]);
    expect(Object.values(API_OPPORTUNITY_STATUSES)).toEqual(["candidate", "generated", "ranked", "validated"]);
    expect(Object.values(API_FEEDBACK_STATUSES)).toEqual(["saved", "dismissed", "rated", "reason-provided"]);
    expect(Object.values(API_FEEDBACK_REASON_CATEGORIES)).toEqual([
      "irrelevant",
      "duplicate",
      "low-confidence",
      "weak-evidence",
      "poor-ranking",
      "already-solved",
      "not-actionable",
      "other"
    ]);
    expect(Object.values(API_FEEDBACK_RATING_TARGETS)).toEqual([
      "usefulness",
      "evidence-quality",
      "ranking-quality"
    ]);
    expect(API_FEEDBACK_RATING_VALUES).toEqual([1, 2, 3, 4, 5]);
  });

  it("locks envelope, error, validation, and fixture shapes", () => {
    expect(API_RESPONSE_ENVELOPE_KEYS).toEqual(["ok", "data", "error", "meta"]);
    expect(Object.values(API_ERROR_CODES)).toEqual([
      "api.bad_request",
      "api.conflict",
      "api.forbidden",
      "api.internal",
      "api.not_found",
      "api.unauthorized",
      "api.validation_failed"
    ]);
    expect(Object.values(API_VALIDATION_ISSUE_CODES)).toEqual([
      "invalid-type",
      "missing-required-field",
      "unsupported-value"
    ]);
    expect(API_OPPORTUNITY_FILTER_FIELDS).toEqual(["status", "sourceType"]);
    expect(Object.keys(syntheticApiOpportunity).sort()).toEqual([
      "confidence",
      "evidence",
      "opportunityId",
      "rank",
      "safeMetadata",
      "source",
      "status",
      "summary",
      "title"
    ]);
    expect(Object.keys(syntheticApiRanking).sort()).toEqual([
      "generatedAt",
      "rankedOpportunities",
      "rankingId",
      "status"
    ]);
    expect(Object.keys(syntheticApiFeedback).sort()).toEqual([
      "createdAt",
      "feedbackId",
      "opportunityId",
      "ratings",
      "reasonCategories",
      "safeMetadata",
      "status"
    ]);
  });
});
