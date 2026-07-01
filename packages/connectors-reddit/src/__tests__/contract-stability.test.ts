import { describe, expect, it } from "vitest";
import {
  REDDIT_CONFIG_FIELD_KEYS,
  REDDIT_CONNECTOR_CAPABILITIES,
  REDDIT_CONNECTOR_ERROR_CODES,
  REDDIT_CONNECTOR_METADATA,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_RATE_LIMIT,
  REDDIT_LIFECYCLE_READINESS_STATES,
  REDDIT_OPERATION_NAMES,
  REDDIT_READ_CONTRACT_AREAS,
  REDDIT_SENSITIVE_CONFIG_FIELD_KEYS,
  REDDIT_VALIDATION_ISSUE_CODES,
  createRedditConnectorError
} from "../index.js";
import type {
  RedditConnectorFactoryInput,
  RedditDataEnvelope,
  RedditPaginationMetadata,
  RedditRateLimitMetadata
} from "../index.js";

describe("reddit connector contract stability", () => {
  it("locks metadata, capability, config, operation, lifecycle, validation, and error constants", () => {
    expect(REDDIT_CONNECTOR_METADATA).toEqual({
      id: "reddit",
      name: "Reddit",
      version: "0.0.0",
      description: "Reddit connector contract package for future read-only data acquisition.",
      provider: "reddit",
      category: "source",
      tags: ["reddit", "social", "community", "read-contract"],
      stability: "experimental"
    });
    expect(REDDIT_READ_CONTRACT_AREAS).toEqual([
      "posts",
      "comments",
      "subreddits",
      "authors",
      "pagination-metadata",
      "rate-limit-metadata"
    ]);
    expect(REDDIT_CONNECTOR_CAPABILITIES.map((capability) => capability.area)).toEqual(
      REDDIT_READ_CONTRACT_AREAS
    );
    expect(REDDIT_CONFIG_FIELD_KEYS).toEqual([
      "clientId",
      "clientSecret",
      "refreshToken",
      "accessToken",
      "userAgent",
      "readOnlyMode"
    ]);
    expect(REDDIT_SENSITIVE_CONFIG_FIELD_KEYS).toEqual([
      "clientId",
      "clientSecret",
      "refreshToken",
      "accessToken"
    ]);
    expect(REDDIT_OPERATION_NAMES).toEqual([
      "reddit.read.posts",
      "reddit.read.comments",
      "reddit.read.subreddits",
      "reddit.read.authors"
    ]);
    expect(REDDIT_LIFECYCLE_READINESS_STATES).toEqual([
      "metadata-ready",
      "config-ready",
      "host-context-ready",
      "operation-contracts-ready",
      "not-ready"
    ]);
    expect(REDDIT_VALIDATION_ISSUE_CODES).toEqual([
      "reddit-metadata-invalid",
      "reddit-capability-invalid",
      "reddit-config-invalid",
      "reddit-lifecycle-not-ready",
      "reddit-dependency-not-ready",
      "reddit-data-shape-incompatible"
    ]);
    expect(REDDIT_CONNECTOR_ERROR_CODES).toEqual([
      "REDDIT_CONNECTOR_CONTRACT_INVALID",
      "REDDIT_CONNECTOR_HOST_CONTEXT_INVALID",
      "REDDIT_CONNECTOR_OPERATION_INVALID"
    ]);
  });

  it("locks envelope, pagination, rate-limit, factory input, and safe error shapes", () => {
    const envelope: RedditDataEnvelope = {
      kind: "posts",
      items: [],
      metadata: {
        pagination: REDDIT_FAKE_PAGINATION,
        rateLimit: REDDIT_FAKE_RATE_LIMIT
      }
    };
    const pagination: RedditPaginationMetadata = REDDIT_FAKE_PAGINATION;
    const rateLimit: RedditRateLimitMetadata = REDDIT_FAKE_RATE_LIMIT;
    const factoryInputKeys: readonly (keyof RedditConnectorFactoryInput)[] = [
      "metadata",
      "config",
      "context",
      "hostContext"
    ];
    const error = createRedditConnectorError({
      message: "Stable safe shape.",
      correlationId: "corr_stability"
    });

    expect(Object.keys(envelope)).toEqual(["kind", "items", "metadata"]);
    expect(Object.keys(pagination)).toEqual(["cursor", "direction", "limit", "page"]);
    expect(Object.keys(rateLimit)).toEqual([
      "limit",
      "remaining",
      "resetAt",
      "window",
      "safeSourceMetadata"
    ]);
    expect(factoryInputKeys).toEqual([
      "metadata",
      "config",
      "context",
      "hostContext"
    ]);
    expect(Object.keys(error.toJSON())).toEqual([
      "code",
      "category",
      "message",
      "correlationId",
      "requestId"
    ]);
  });
});
