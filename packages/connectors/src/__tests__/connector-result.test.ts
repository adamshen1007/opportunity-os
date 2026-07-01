import { describe, expect, it } from "vitest";
import {
  connectorFailure,
  connectorSuccess,
  type ConnectorResult
} from "../index.js";

describe("connector result contracts", () => {
  it("supports generic success payloads", () => {
    const result: ConnectorResult<{ readonly count: number }, string> =
      connectorSuccess(
        { count: 2 },
        {
          connectorId: "generic-source",
          operationName: "list",
          correlationId: "correlation-1"
        }
      );

    expect(result).toEqual({
      ok: true,
      value: { count: 2 },
      metadata: {
        connectorId: "generic-source",
        operationName: "list",
        correlationId: "correlation-1"
      }
    });
  });

  it("supports generic failure payloads", () => {
    const result: ConnectorResult<string, { readonly reason: string }> =
      connectorFailure({
        reason: "validation"
      });

    expect(result).toEqual({
      ok: false,
      error: {
        reason: "validation"
      }
    });
  });
});
