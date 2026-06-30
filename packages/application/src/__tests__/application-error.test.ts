import { describe, expect, it } from "vitest";
import {
  APPLICATION_ERROR_CODES,
  ApplicationError,
  createApplicationError
} from "../index.js";

describe("application error contracts", () => {
  it("serializes application errors safely", () => {
    const error = createApplicationError({
      code: APPLICATION_ERROR_CODES.validationFailed,
      message: "token=secret-value failed validation",
      correlationId: "correlation-id",
      requestId: "request-id",
      cause: new Error("password=raw-secret")
    });

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.toJSON()).toEqual({
      code: APPLICATION_ERROR_CODES.validationFailed,
      category: "validation",
      message: "[REDACTED] failed validation",
      correlationId: "correlation-id",
      requestId: "request-id"
    });
    expect(JSON.stringify(error)).not.toContain("raw-secret");
    expect(JSON.stringify(error)).not.toContain("stack");
  });

  it("does not expose raw API keys, provider keys, auth headers, or payloads", () => {
    const error = createApplicationError({
      code: APPLICATION_ERROR_CODES.internalFailure,
      message:
        "api_key=sk-secret provider_key=value authorization=Bearer-token payload={hidden:true}"
    });

    const serialized = JSON.stringify(error);

    expect(serialized).not.toContain("sk-secret");
    expect(serialized).not.toContain("provider_key=value");
    expect(serialized).not.toContain("authorization=Bearer-token");
    expect(serialized).not.toContain("payload={hidden:true}");
  });
});
