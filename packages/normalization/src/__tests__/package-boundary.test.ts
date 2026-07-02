import { describe, expect, it } from "vitest";
import {
  NORMALIZATION_FOUNDATION_PHASE,
  NORMALIZATION_PACKAGE_NAME,
  type NormalizationPackageBoundary
} from "../index.js";

describe("normalization package boundary", () => {
  it("exports the Phase 2 Milestone 17 package boundary", () => {
    const boundary: NormalizationPackageBoundary = {
      packageName: NORMALIZATION_PACKAGE_NAME,
      phase: NORMALIZATION_FOUNDATION_PHASE,
      ownership: "normalization-pipeline-foundation"
    };

    expect(boundary).toEqual({
      packageName: "@opportunity-os/normalization",
      phase: "phase-2-milestone-17",
      ownership: "normalization-pipeline-foundation"
    });
  });
});
