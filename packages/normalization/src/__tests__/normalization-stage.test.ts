import { describe, expect, it } from "vitest";
import {
  NORMALIZATION_STAGES,
  type NormalizationStageRecord
} from "../index.js";

describe("normalization stage vocabulary", () => {
  it("locks the Phase 2 Milestone 17 stage vocabulary", () => {
    expect(NORMALIZATION_STAGES).toEqual([
      "raw-content-input",
      "canonical-text-model",
      "markdown-cleaning",
      "html-cleaning",
      "unicode-normalization",
      "whitespace-normalization",
      "url-normalization",
      "language-detection",
      "text-chunking",
      "metadata-preservation",
      "provenance-preservation",
      "validation",
      "finalization"
    ]);
  });

  it("models stage records without executing a pipeline", () => {
    const record: NormalizationStageRecord = {
      stage: "unicode-normalization",
      status: "pending",
      safeMessage: "Stage contract registered."
    };

    expect(record.stage).toBe("unicode-normalization");
    expect(record.status).toBe("pending");
  });
});
