import { describe, expect, expectTypeOf, it } from "vitest";
import {
  COMPOSITION_RESULT_STATUSES,
  type CompositionFailure,
  type CompositionIssue,
  type CompositionResult,
  type CompositionRoot,
  type CompositionRootInput,
  type CompositionSuccess
} from "../index.js";

describe("composition root contracts", () => {
  it("defines stable composition result statuses", () => {
    expect(COMPOSITION_RESULT_STATUSES).toEqual([
      "success",
      "failure"
    ]);
  });

  it("defines composition success and failure results", () => {
    const success: CompositionSuccess = {
      status: "success",
      container: {
        registrations: [],
        has: () => false,
        resolve: <TValue>() => {
          throw new Error("test contract does not implement resolution");
        },
        resolveOptional: <TValue>() => undefined
      }
    };
    const issue: CompositionIssue = {
      code: "missing-registration",
      message: "A generic registration is missing.",
      path: ["modules", "0"]
    };
    const failure: CompositionFailure = {
      status: "failure",
      issues: [issue]
    };

    expect(success.status).toBe("success");
    expect(failure.issues).toEqual([issue]);
    expectTypeOf(success).toMatchTypeOf<CompositionResult>();
    expectTypeOf(failure).toMatchTypeOf<CompositionResult>();
  });

  it("defines composition root contracts without app startup", () => {
    const root: CompositionRoot = {
      compose: (input) =>
        input.modules.length === 0
          ? {
              status: "failure",
              issues: [
                {
                  code: "empty-modules",
                  message: "At least one generic module is required."
                }
              ]
            }
          : {
              status: "success",
              container: {
                registrations: input.modules.flatMap(
                  (module) => module.registrations
                ),
                has: () => false,
                resolve: <TValue>() => {
                  throw new Error("test contract does not implement resolution");
                },
                resolveOptional: <TValue>() => undefined
              }
            }
    };
    const input: CompositionRootInput = {
      modules: []
    };

    expect(root.compose(input)).toEqual({
      status: "failure",
      issues: [
        {
          code: "empty-modules",
          message: "At least one generic module is required."
        }
      ]
    });
    expectTypeOf(root).toMatchTypeOf<CompositionRoot>();
  });
});
