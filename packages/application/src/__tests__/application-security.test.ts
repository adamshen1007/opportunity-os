import { describe, expect, it } from "vitest";
import {
  APPLICATION_ERROR_CODES,
  applicationFailure,
  applicationValidationFailure,
  createApplicationError
} from "../index.js";

const sensitiveValues = [
  "sk-secret",
  "token=raw-token",
  "authorization=Bearer-token",
  "provider_key=raw-provider-key",
  "credential=raw-credential",
  "dsn=https://user:pass@example.test/project",
  "payload={secret:true}"
] as const;

describe("application security contracts", () => {
  it("keeps application errors secret-safe and stack-safe by default", () => {
    const error = createApplicationError({
      code: APPLICATION_ERROR_CODES.internalFailure,
      message: sensitiveValues.join(" "),
      cause: new Error("stack should not be serialized")
    });

    const serialized = JSON.stringify(error);

    for (const sensitiveValue of sensitiveValues) {
      expect(serialized).not.toContain(sensitiveValue);
    }
    expect(serialized).not.toContain("stack should not be serialized");
    expect(serialized).not.toContain("stack");
    expect(serialized).not.toContain("cause");
  });

  it("keeps validation failures and string failures secret-safe", () => {
    const validation = applicationValidationFailure([
      {
        path: ["payload"],
        code: "invalid",
        message: sensitiveValues.join(" ")
      }
    ]);
    const failure = applicationFailure(sensitiveValues.join(" "));

    const serialized = JSON.stringify({ validation, failure });

    for (const sensitiveValue of sensitiveValues) {
      expect(serialized).not.toContain(sensitiveValue);
    }
  });
});
