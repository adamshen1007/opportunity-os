import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const comparisonsPath = path.join(
  repositoryRoot,
  "research/fixtures/opportunity-quality/v1/ranking-comparisons.json"
);

const evaluate = () =>
  JSON.parse(
    execFileSync(process.execPath, ["scripts/opportunity-quality-benchmark.mjs", "evaluate"], {
      cwd: repositoryRoot,
      encoding: "utf8"
    })
  ) as {
    status: string;
    frozen: boolean;
    reviewRequiredCount: number;
    freezeEligible: boolean;
    measurements: { rankingComparisonCount: number; rankingAgreement: number; repeatability: number };
  };

describe("Phase 4.5 opportunity quality ranking baseline", () => {
  it("records at least 15 explicit draft pairwise judgments", () => {
    const artifact = JSON.parse(fs.readFileSync(comparisonsPath, "utf8")) as {
      benchmarkVersion: string;
      comparisons: Array<{
        leftOpportunityId: string;
        rightOpportunityId: string;
        preferredOpportunityId: string;
        reviewStatus: string;
      }>;
    };

    expect(artifact.benchmarkVersion).toBe("1.0.0");
    expect(artifact.comparisons).toHaveLength(16);
    expect(artifact.comparisons.every((comparison) => comparison.reviewStatus === "APPROVED")).toBe(true);
    expect(
      artifact.comparisons.every((comparison) =>
        [comparison.leftOpportunityId, comparison.rightOpportunityId].includes(comparison.preferredOpportunityId)
      )
    ).toBe(true);
  });

  it("measures fixed-order ranking agreement against Adam's approved judgments", () => {
    const result = evaluate();

    expect(result.measurements).toMatchObject({
      rankingComparisonCount: 16,
      rankingAgreement: 0.5,
      repeatability: 1
    });
    expect(result).toMatchObject({
      status: "APPROVAL_COMPLETE",
      frozen: true,
      reviewRequiredCount: 0,
      freezeEligible: true
    });
  });
});
