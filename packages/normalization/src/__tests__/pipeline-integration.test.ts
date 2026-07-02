import { describe, expect, it } from "vitest";
import {
  normalizationFixtureInput,
  normalizationFixtureOutput,
  normalizationFixtureResult,
  type NormalizationOperationContract
} from "../index.js";

describe("normalization pipeline integration contracts", () => {
  it("models a deterministic operation contract without executing a pipeline", () => {
    const operation: NormalizationOperationContract = {
      name: "normalization-contract",
      input: normalizationFixtureInput,
      output: normalizationFixtureOutput
    };

    expect(operation.input.envelope.kind).toBe("post");
    expect(operation.output.stages.map((stage) => stage.stage)).toEqual([
      "canonical-text-model",
      "validation"
    ]);
  });

  it("connects fixture output to result contracts", () => {
    expect(normalizationFixtureResult.ok).toBe(true);

    if (normalizationFixtureResult.ok) {
      expect(normalizationFixtureResult.output.canonicalText.id).toBe(
        normalizationFixtureOutput.canonicalText.id
      );
    }
  });
});
