import { describe, expect, it } from "vitest";
import {
  APPLICATION_ERROR_CODES,
  applicationFailure,
  applicationSuccess,
  applicationValidationFailure,
  applicationValidationSuccess,
  createApplicationContext,
  createInjectionToken
} from "../index.js";

describe("application contract stability", () => {
  it("keeps result and validation keys stable", () => {
    expect(Object.keys(applicationSuccess("ok")).sort()).toEqual([
      "success",
      "value"
    ]);
    expect(Object.keys(applicationFailure("error")).sort()).toEqual([
      "error",
      "success"
    ]);
    expect(Object.keys(applicationValidationSuccess("ok")).sort()).toEqual([
      "valid",
      "value"
    ]);
    expect(Object.keys(applicationValidationFailure([])).sort()).toEqual([
      "issues",
      "valid"
    ]);
  });

  it("keeps context, DI token, and error code keys stable", () => {
    expect(Object.keys(createApplicationContext({
      correlationId: "correlation-id"
    }))).toEqual(["correlationId"]);
    expect(Object.keys(createInjectionToken("token"))).toEqual(["id"]);
    expect(Object.keys(APPLICATION_ERROR_CODES).sort()).toEqual([
      "dependencyUnavailable",
      "internalFailure",
      "operationRejected",
      "validationFailed"
    ]);
  });
});
