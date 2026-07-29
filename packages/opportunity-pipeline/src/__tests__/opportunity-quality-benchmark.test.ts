import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");

type BenchmarkResult = {
  benchmarkVersion: string;
  behaviorVersion: string;
  status: string;
  frozen: boolean;
  measurements: {
    sourceRecordCount: number;
    generatedOpportunityCount: number;
    expectedOpportunityCount: number;
    duplicateOpportunityRate: number;
    citationCoverage: number;
    predictedClusterCount: number;
    clusteringPrecision: number;
    clusteringRecall: number;
    rankingComparisonCount: number;
    rankingAgreement: number;
    repeatability: number;
  };
  resultFingerprint: string;
};

const evaluate = (): BenchmarkResult =>
  JSON.parse(
    execFileSync(process.execPath, ["scripts/opportunity-quality-benchmark.mjs", "evaluate"], {
      cwd: repositoryRoot,
      encoding: "utf8"
    })
  ) as BenchmarkResult;

describe("Phase 4.5 opportunity quality pipeline baseline", () => {
  it("measures current one-record-one-opportunity behavior without changing it", () => {
    const result = evaluate();

    expect(result.behaviorVersion).toBe("one-source-record-one-opportunity-v1");
    expect(result.measurements).toMatchObject({
      sourceRecordCount: 32,
      generatedOpportunityCount: 32,
      expectedOpportunityCount: 8,
      duplicateOpportunityRate: 0.75,
      citationCoverage: 1,
      predictedClusterCount: 32,
      clusteringPrecision: 0,
      clusteringRecall: 0
    });
  });

  it("produces the same measured output and fingerprint on repeat execution", () => {
    const first = evaluate();
    const second = evaluate();

    expect(second).toEqual(first);
    expect(first.measurements.repeatability).toBe(1);
    expect(first.resultFingerprint).toMatch(/^[a-f0-9]{64}$/u);
  });
});

