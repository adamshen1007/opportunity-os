import { describe, expect, it } from "vitest";
import {
  infrastructureFailure,
  infrastructureSuccess,
  type InfrastructureResult
} from "../index.js";

describe("infrastructure result contracts", () => {
  it("represents generic success results", () => {
    const result: InfrastructureResult<{ readonly id: string }, never> =
      infrastructureSuccess({
        id: "composition"
      });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe("composition");
    }
  });

  it("represents generic failure results", () => {
    const result: InfrastructureResult<never, { readonly code: string }> =
      infrastructureFailure({
        code: "composition-failed"
      });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("composition-failed");
    }
  });
});
