import { describe, expect, expectTypeOf, it } from "vitest";
import {
  useCaseFailure,
  useCaseSuccess,
  type UseCase,
  type UseCaseInput,
  type UseCaseResult
} from "../index.js";

describe("application use-case contracts", () => {
  it("define generic use-case input and result shapes", () => {
    const input: UseCaseInput<{ readonly value: string }> = {
      input: { value: "example" },
      context: {
        correlationId: "correlation-id",
        requestId: "request-id"
      }
    };

    expect(input).toEqual({
      input: { value: "example" },
      context: {
        correlationId: "correlation-id",
        requestId: "request-id"
      }
    });

    expect(useCaseSuccess({ accepted: true })).toEqual({
      success: true,
      value: { accepted: true }
    });
    expect(useCaseFailure({ code: "failure" })).toEqual({
      success: false,
      error: { code: "failure" }
    });
  });

  it("defines use-case execution contracts without product behavior", async () => {
    const useCase: UseCase<
      { readonly value: string },
      { readonly value: string },
      { readonly code: string }
    > = {
      execute: async (input) => useCaseSuccess(input.input)
    };

    const result = await useCase.execute({
      input: { value: "handled" },
      context: { correlationId: "correlation-id" }
    });

    expect(result).toEqual({
      success: true,
      value: { value: "handled" }
    });
    expectTypeOf(result).toEqualTypeOf<
      UseCaseResult<{ readonly value: string }, { readonly code: string }>
    >();
  });
});
