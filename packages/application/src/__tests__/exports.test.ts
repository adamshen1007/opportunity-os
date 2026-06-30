import { describe, expect, it } from "vitest";
import * as application from "../index.js";

const expectedRuntimeExports = [
  "APPLICATION_ERROR_CODES",
  "ApplicationError",
  "applicationFailure",
  "applicationSuccess",
  "applicationValidationFailure",
  "applicationValidationSuccess",
  "createApplicationContext",
  "createApplicationError",
  "createInjectionToken",
  "createRequestContext",
  "useCaseFailure",
  "useCaseSuccess"
] as const;

describe("application public exports", () => {
  it("routes runtime exports through the package public boundary", () => {
    expect(Object.keys(application).sort()).toEqual(
      [...expectedRuntimeExports].sort()
    );
  });
});
