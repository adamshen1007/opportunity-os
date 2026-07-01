import { describe, expect, it } from "vitest";
import {
  REDDIT_CONNECTOR_ERROR_CODES,
  createRedditConnectorError,
  sanitizeRedditConnectorErrorMessage
} from "../index.js";

describe("reddit connector error contracts", () => {
  it("declares stable safe error codes", () => {
    expect(REDDIT_CONNECTOR_ERROR_CODES).toEqual([
      "REDDIT_CONNECTOR_CONTRACT_INVALID",
      "REDDIT_CONNECTOR_HOST_CONTEXT_INVALID",
      "REDDIT_CONNECTOR_OPERATION_INVALID"
    ]);
  });

  it("serializes safe error details without unsafe internals", () => {
    const error = createRedditConnectorError({
      code: "REDDIT_CONNECTOR_OPERATION_INVALID",
      message: "Operation invalid: access_token=abc123 raw_payload={secret}",
      correlationId: "corr_error",
      requestId: "req_error",
      cause: new Error("hidden")
    });

    expect(error.toJSON()).toEqual({
      code: "EXTERNAL_DEPENDENCY_FAILED",
      category: "external_dependency",
      message: "Operation invalid: [REDACTED] [REDACTED]",
      correlationId: "corr_error",
      requestId: "req_error"
    });
    expect(JSON.stringify(error.toJSON())).not.toMatch(/abc123|hidden|stack|cause/iu);
  });

  it("redacts secret-like values from messages", () => {
    expect(
      sanitizeRedditConnectorErrorMessage("client_secret=value bearer abc")
    ).not.toMatch(/value|bearer abc/iu);
  });
});
