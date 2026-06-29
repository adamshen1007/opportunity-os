import { describe, expect, expectTypeOf, it } from "vitest";

import {
  createEventVersion,
  type EventSchema,
  type EventSchemaValidationResult
} from "../index.js";

describe("event schema contracts", () => {
  it("supports event name, version, and validation function shape", () => {
    type Payload = {
      readonly value: string;
    };

    const schema: EventSchema<Payload> = {
      eventName: "infrastructure.event.recorded",
      version: createEventVersion(1),
      validate: (payload: unknown) =>
        typeof payload === "object" &&
        payload !== null &&
        "value" in payload &&
        typeof payload.value === "string"
          ? {
              success: true,
              payload: {
                value: payload.value
              }
            }
          : {
              success: false,
              issues: [
                {
                  path: ["value"],
                  message: "Value is required",
                  code: "missing_value"
                }
              ]
            }
    };

    expect(schema.eventName).toBe("infrastructure.event.recorded");
    expect(schema.version).toBe("v1");
    expect(schema.validate({ value: "ok" })).toEqual({
      success: true,
      payload: {
        value: "ok"
      }
    });
    expect(schema.validate({})).toEqual({
      success: false,
      issues: [
        {
          path: ["value"],
          message: "Value is required",
          code: "missing_value"
        }
      ]
    });
  });

  it("keeps validation results schema-library agnostic", () => {
    type Payload = {
      readonly value: string;
    };

    expectTypeOf<EventSchema<Payload>["validate"]>().returns.toEqualTypeOf<
      EventSchemaValidationResult<Payload>
    >();
  });
});
