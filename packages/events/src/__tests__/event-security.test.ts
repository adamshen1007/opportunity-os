import { describe, expect, it } from "vitest";

import {
  EVENT_ERROR_CODES,
  createEventError,
  deserializeEventEnvelope,
  eventFailure
} from "../index.js";

describe("event security", () => {
  it("does not leak secret-like values from event errors", () => {
    const error = createEventError({
      code: EVENT_ERROR_CODES.serializationFailed,
      message:
        "apiKey=raw-api-key token=raw-token password=raw-password authorization=raw-auth providerKey=raw-provider dsn=postgres://user:pass@example.test/db credential=raw-credential",
      details: {
        authHeader: "Bearer raw-bearer",
        rawPayload: "password=payload-password token=payload-token"
      }
    });

    const serialized = JSON.stringify(error);

    expect(serialized).not.toContain("raw-api-key");
    expect(serialized).not.toContain("raw-token");
    expect(serialized).not.toContain("raw-password");
    expect(serialized).not.toContain("raw-auth");
    expect(serialized).not.toContain("raw-provider");
    expect(serialized).not.toContain("user:pass");
    expect(serialized).not.toContain("raw-credential");
    expect(serialized).not.toContain("raw-bearer");
    expect(serialized).not.toContain("payload-password");
    expect(serialized).not.toContain("payload-token");
  });

  it("does not include raw serialized payloads in deserialization failures", () => {
    const result = deserializeEventEnvelope(
      '{"metadata":{"eventName":"infrastructure.event.recorded"},"payload":{"apiKey":"raw-api-key","password":"raw-password"}}'
    );

    const serialized = JSON.stringify(result);

    expect(result.success).toBe(false);
    expect(serialized).not.toContain("raw-api-key");
    expect(serialized).not.toContain("raw-password");
  });

  it("does not expose raw payloads through event failure contracts", () => {
    const result = eventFailure(
      createEventError({
        code: EVENT_ERROR_CODES.invalidEventEnvelope,
        message: "Invalid envelope token=raw-token",
        details: {
          payload: "apiKey=raw-api-key"
        }
      })
    );

    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("raw-token");
    expect(serialized).not.toContain("raw-api-key");
  });
});
