import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const fixtureRoot = path.join(repositoryRoot, "research/fixtures/opportunity-quality/v1");

const readJson = (fileName: string): unknown => JSON.parse(fs.readFileSync(path.join(fixtureRoot, fileName), "utf8"));

const runValidation = () =>
  JSON.parse(
    execFileSync(process.execPath, ["scripts/opportunity-quality-benchmark.mjs", "validate"], {
      cwd: repositoryRoot,
      encoding: "utf8"
    })
  ) as {
    valid: boolean;
    benchmarkVersion: string;
    sourceRecordCount: number;
    expectedClusterCount: number;
    rankingComparisonCount: number;
    reviewRequiredCount: number;
    freezeEligible: boolean;
    frozen: boolean;
  };

describe("Phase 4.5 opportunity quality benchmark fixtures", () => {
  it("validates the versioned draft corpus and judgment counts", () => {
    const validation = runValidation();

    expect(validation).toMatchObject({
      valid: true,
      benchmarkVersion: "1.0.0",
      sourceRecordCount: 32,
      expectedClusterCount: 8,
      rankingComparisonCount: 16,
      reviewRequiredCount: 0,
      freezeEligible: true,
      frozen: true
    });
  });

  it("contains only safe synthetic records and approved judgments", () => {
    const artifacts = [
      readJson("source-records.json"),
      readJson("expected-clusters.json"),
      readJson("ranking-comparisons.json")
    ];
    const serialized = JSON.stringify(artifacts);

    expect(serialized).toContain("synthetic-public-forum");
    expect(serialized).toContain("APPROVED");
    expect(serialized).not.toContain("REVIEW_REQUIRED");
    expect(serialized).not.toMatch(/sk-[a-z0-9_-]+/iu);
    expect(serialized).not.toMatch(/bearer\s+[a-z0-9._-]+/iu);
    expect(serialized).not.toMatch(/postgres(?:ql)?:\/\//iu);
    expect(serialized).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/iu);
    expect(serialized).not.toMatch(/https?:\/\//iu);
  });

  it("records Adam's approval before freezing the benchmark", () => {
    const manifest = readJson("manifest.json") as { status: string; frozen: boolean };
    const baseline = readJson("baseline.json") as { reviewStatus: string; frozen: boolean };
    const approval = readJson("approval.json") as {
      status: string;
      approvedBy: string;
      approvalScope: string[];
    };

    expect(manifest).toEqual(expect.objectContaining({ status: "APPROVED", frozen: true }));
    expect(baseline).toEqual(expect.objectContaining({ reviewStatus: "APPROVED", frozen: true }));
    expect(approval).toEqual(
      expect.objectContaining({ status: "APPROVED", approvedBy: "Adam", approvalScope: expect.arrayContaining(["eight-cluster-labels"]) })
    );
  });
});
