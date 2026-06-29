import { describe, expect, expectTypeOf, it } from "vitest";

import {
  EVENT_ERROR_CODES,
  createEventError,
  eventFailure,
  eventSuccess,
  type EventError,
  type EventResult
} from "../index.js";

describe("event results and errors", () => {
  it("creates generic success and failure results", () => {
    expect(eventSuccess({ accepted: true })).toEqual({
      success: true,
      value: {
        accepted: true
      }
    });

    expect(
      eventFailure(
        createEventError({
          code: EVENT_ERROR_CODES.invalidEventEnvelope,
          message: "Envelope is invalid"
        })
      )
    ).toEqual({
      success: false,
      error: {
        code: "INVALID_EVENT_ENVELOPE",
        message: "Envelope is invalid"
      }
    });
  });

  it("redacts secret-like values from event errors", () => {
    const error = createEventError({
      code: EVENT_ERROR_CODES.serializationFailed,
      message:
        "password=raw-password token=raw-token dsn=postgres://user:pass@example.test/db",
      details: {
        authorization: "Bearer raw-auth",
        providerKey: "provider_key=raw-provider-key"
      }
    });

    expect(error).toEqual({
      code: "SERIALIZATION_FAILED",
      message:
        "password=[REDACTED] token=[REDACTED] dsn=[REDACTED]",
      details: {
        authorization: "Bearer [REDACTED]",
        providerKey: "provider_key=[REDACTED]"
      }
    });
    expect(JSON.stringify(error)).not.toContain("raw-password");
    expect(JSON.stringify(error)).not.toContain("raw-token");
    expect(JSON.stringify(error)).not.toContain("user:pass");
    expect(JSON.stringify(error)).not.toContain("raw-auth");
    expect(JSON.stringify(error)).not.toContain("raw-provider-key");
  });

  it("keeps event result contracts generic", () => {
    expectTypeOf<EventResult<string, EventError>>().toEqualTypeOf<
      | { readonly success: true; readonly value: string }
      | { readonly success: false; readonly error: EventError }
    >();
  });
});
