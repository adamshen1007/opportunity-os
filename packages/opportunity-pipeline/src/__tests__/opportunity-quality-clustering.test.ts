import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");

describe("Phase 4.5 frozen benchmark clustering quality", () => {
  it("meets the approved clustering and duplicate thresholds using measured output", () => {
    const result = JSON.parse(execFileSync(process.execPath, ["scripts/opportunity-quality-benchmark.mjs", "evaluate-clustered"], {
      cwd: repositoryRoot,
      encoding: "utf8"
    })) as {
      measurements: { duplicateOpportunityRate: number; clusteringPrecision: number; clusteringRecall: number; citationCoverage: number; repeatability: number };
      thresholdResults: Record<string, boolean>;
      allSliceThresholdsPassed: boolean;
    };
    expect(result.measurements.duplicateOpportunityRate).toBeLessThanOrEqual(0.1);
    expect(result.measurements.clusteringPrecision).toBeGreaterThanOrEqual(0.85);
    expect(result.measurements.clusteringRecall).toBeGreaterThanOrEqual(0.75);
    expect(result.measurements.citationCoverage).toBe(1);
    expect(result.measurements.repeatability).toBe(1);
    expect(result.thresholdResults).toMatchObject({
      duplicateOpportunityRate: true,
      citationCoverage: true,
      clusteringPrecision: true,
      clusteringRecall: true,
      repeatability: true
    });
    expect(result.allSliceThresholdsPassed).toBe(true);
  });
});
